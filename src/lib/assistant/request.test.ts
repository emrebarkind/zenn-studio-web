import { describe, expect, it } from "vitest";
import { assistantLimits } from "./config";
import { createRateLimiter } from "./rate-limit";
import { assistantRequestSchema, withoutBlockedTurns } from "./request";

const ok = (messages: { role: "user" | "assistant"; content: string }[]) =>
  assistantRequestSchema.safeParse({ messages }).success;

describe("assistantRequestSchema", () => {
  it("accepts an alternating conversation ending with the user", () => {
    expect(ok([{ role: "user", content: "Merhaba" }])).toBe(true);
    expect(
      ok([
        { role: "user", content: "a" },
        { role: "assistant", content: "b" },
        { role: "user", content: "c" },
      ]),
    ).toBe(true);
  });

  it("rejects over-long messages and broken turn order", () => {
    expect(ok([{ role: "user", content: "x".repeat(assistantLimits.maxMessageChars + 1) }])).toBe(false);
    expect(ok([{ role: "assistant", content: "hi" }, { role: "user", content: "a" }])).toBe(false);
    expect(ok([{ role: "user", content: "a" }, { role: "user", content: "b" }])).toBe(false);
  });

  it("enforces the per-conversation message limit", () => {
    const long = Array.from({ length: assistantLimits.maxUserMessages * 2 + 1 }, (_, i) => ({
      role: (i % 2 ? "assistant" : "user") as "user" | "assistant",
      content: "x",
    }));
    expect(ok(long)).toBe(false);
  });
});

describe("withoutBlockedTurns", () => {
  it("keeps health and payment turns away from the model", () => {
    const kept = withoutBlockedTurns([
      { role: "user", content: "Bel fıtığım var" },
      { role: "assistant", content: "Bunu antrenörümüzle konuşman en doğrusu." },
      { role: "user", content: "Kartım 4111 1111 1111 1111" },
      { role: "assistant", content: "Lütfen paylaşma." },
      { role: "user", content: "Paketler neler?" },
    ]);
    expect(kept).toEqual([{ role: "user", content: "Paketler neler?" }]);
  });
});

describe("rate limiter", () => {
  it("allows N requests per window per key", () => {
    const hit = createRateLimiter(2, 1000);
    expect(hit("ip", 0).ok).toBe(true);
    expect(hit("ip", 1).ok).toBe(true);
    expect(hit("ip", 2)).toEqual({ ok: false, retryAfterS: 1 });
    expect(hit("other", 2).ok).toBe(true);
    expect(hit("ip", 1001).ok).toBe(true);
  });
});
