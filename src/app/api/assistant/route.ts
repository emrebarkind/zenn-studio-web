import Anthropic from "@anthropic-ai/sdk";
import { assistantLimits, assistantModel } from "@/lib/assistant/config";
import { cannedReplies, findSensitiveData, guessLang, mentionsHealth } from "@/lib/assistant/guard";
import { buildSystemPrompt } from "@/lib/assistant/prompt";
import { HANDOFF_MARKER } from "@/lib/assistant/prompt-markers";
import { createRateLimiter } from "@/lib/rate-limit";
import { assistantRequestSchema, withoutBlockedTurns } from "@/lib/assistant/request";

// Zenn Asistan backend. Streams plain text (UTF-8) back to the chat panel.
// Privacy: conversation content is never logged — only counts and timings.

const systemPrompt = buildSystemPrompt();
const rateLimit = createRateLimiter(assistantLimits.rateLimitRequests, assistantLimits.rateLimitWindowMs);

let client: Anthropic | null = null;
function anthropic(): Anthropic {
  // Reads ANTHROPIC_API_KEY from the server environment; never sent to the browser.
  client ??= new Anthropic({ maxRetries: 1, timeout: 30_000 });
  return client;
}

type Outcome = "ok" | "health" | "sensitive" | "rate_limited" | "invalid" | "unconfigured" | "api_error";

function logMetrics(fields: { outcome: Outcome; messages?: number; ms: number; input?: number; output?: number; cached?: number }) {
  console.info(JSON.stringify({ event: "assistant", ...fields }));
}

function json(status: number, body: Record<string, unknown>, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

function textStream(text: string) {
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}

function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const started = Date.now();

  const limited = rateLimit(clientIp(request));
  if (!limited.ok) {
    logMetrics({ outcome: "rate_limited", ms: Date.now() - started });
    return json(
      429,
      { error: "rate_limited", message: "Çok sık mesaj gönderildi. Biraz sonra yeniden dene ya da ekibimize yaz." },
      { "retry-after": String(limited.retryAfterS) },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = assistantRequestSchema.safeParse(body);
  if (!parsed.success) {
    logMetrics({ outcome: "invalid", ms: Date.now() - started });
    const message = parsed.error.issues.some((i) => i.message === "conversation limit reached")
      ? "Bu sohbette mesaj sınırına ulaşıldı. Devam etmek için ekibimize yazabilirsin."
      : `Mesaj en fazla ${assistantLimits.maxMessageChars} karakter olabilir.`;
    return json(400, { error: "invalid", message });
  }

  const lastContent = parsed.data.messages.at(-1)!.content;
  const lang = guessLang(lastContent);

  // Payment / ID data never leaves this server.
  if (findSensitiveData(lastContent)) {
    logMetrics({ outcome: "sensitive", messages: parsed.data.messages.length, ms: Date.now() - started });
    return textStream(cannedReplies.sensitive[lang]);
  }
  // Health topics are handed to a human without asking the model.
  if (mentionsHealth(lastContent)) {
    logMetrics({ outcome: "health", messages: parsed.data.messages.length, ms: Date.now() - started });
    return textStream(`${cannedReplies.health[lang]}\n${HANDOFF_MARKER}`);
  }
  // Earlier turns that were stopped above stay out of what we forward, too.
  const messages = withoutBlockedTurns(parsed.data.messages);

  if (!process.env.ANTHROPIC_API_KEY) {
    logMetrics({ outcome: "unconfigured", ms: Date.now() - started });
    return json(503, { error: "unconfigured", message: "Asistan şu an çevrim dışı. Ekibimize doğrudan ulaşabilirsin." });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const response = anthropic().messages.stream(
          {
            model: assistantModel(),
            max_tokens: assistantLimits.maxOutputTokens,
            system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
            messages,
          },
          { signal: request.signal },
        );
        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await response.finalMessage();
        if (final.stop_reason === "refusal" || final.stop_reason === "max_tokens") {
          controller.enqueue(encoder.encode(`\n${HANDOFF_MARKER}`));
        }
        logMetrics({
          outcome: "ok",
          messages: messages.length,
          ms: Date.now() - started,
          input: final.usage.input_tokens,
          output: final.usage.output_tokens,
          cached: final.usage.cache_read_input_tokens ?? 0,
        });
      } catch (error) {
        if (request.signal.aborted) return; // visitor closed the panel; nothing to tell them
        const status = error instanceof Anthropic.APIError ? error.status : undefined;
        console.error(JSON.stringify({ event: "assistant", outcome: "api_error", status, ms: Date.now() - started }));
        controller.enqueue(
          encoder.encode(
            lang === "tr"
              ? `\nŞu an yanıt veremiyorum. Seni ekibimize bağlayayım.\n${HANDOFF_MARKER}`
              : `\nI can't answer right now. Let me connect you with our team.\n${HANDOFF_MARKER}`,
          ),
        );
      } finally {
        try {
          controller.close();
        } catch {
          // already closed by a client disconnect
        }
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-accel-buffering": "no" },
  });
}
