import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

let ip = 0;
function req(messages: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/assistant", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ip}`, ...headers },
    body: JSON.stringify({ messages }),
  });
}

describe("POST /api/assistant (no model call)", () => {
  let info: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    info = vi.spyOn(console, "info").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    info.mockRestore();
  });

  it("hands health questions to a human without calling the model", async () => {
    const res = await POST(req([{ role: "user", content: "Hamileyim, reformer yapabilir miyim?" }]));
    const text = await res.text();
    expect(res.status).toBe(200);
    expect(text).toContain("Bunu antrenörümüzle konuşman en doğrusu");
    expect(text).toContain("<<EKIP>>");
  });

  it("answers health questions in English when asked in English", async () => {
    const text = await (await POST(req([{ role: "user", content: "I have back pain, is pilates ok?" }]))).text();
    expect(text).toMatch(/talk it through with one of our coaches/);
  });

  it("refuses to process card numbers", async () => {
    const text = await (await POST(req([{ role: "user", content: "Kartım 4111 1111 1111 1111, ödeme alır mısınız?" }]))).text();
    expect(text).toMatch(/kart, IBAN ya da TC kimlik/);
  });

  it("rejects over-long messages", async () => {
    const res = await POST(req([{ role: "user", content: "x".repeat(501) }]));
    expect(res.status).toBe(400);
  });

  it("reports itself offline when no API key is configured", async () => {
    const res = await POST(req([{ role: "user", content: "Paketler neler?" }]));
    expect(res.status).toBe(503);
  });

  it("rate-limits a single IP", async () => {
    const same = { "x-forwarded-for": "10.9.9.9" };
    let last = 0;
    for (let i = 0; i < 21; i++) last = (await POST(req([{ role: "user", content: "a" }], same))).status;
    expect(last).toBe(429);
  });

  it("logs counts, never conversation content", async () => {
    await POST(req([{ role: "user", content: "Gizli içerik: bel fıtığım var" }]));
    const logged = info.mock.calls.map((c: unknown[]) => String(c[0])).join("\n");
    expect(logged).toMatch(/"outcome":"health"/);
    expect(logged).not.toMatch(/Gizli|fıtığ/);
  });
});
