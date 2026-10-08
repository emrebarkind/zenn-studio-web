import { describe, expect, it } from "vitest";
import { plans } from "./site";
import { demoScenarios } from "./demo";
import { landing } from "./landing";
import { parseReply } from "@/lib/assistant/actions";
import { cannedReplies, findSensitiveData, mentionsHealth } from "@/lib/assistant/guard";

// The demo must show exactly what the real assistant would do.
describe.each(["tr", "en"] as const)("demo scenarios (%s)", (lang) => {
  const byId = Object.fromEntries(demoScenarios[lang].map((s) => [s.id, s]));

  it("sales ends with a valid enrol action for a real package", () => {
    const reply = parseReply(byId.sales.assistant);
    expect(reply.enroll?.href).toBe("/kayit?brans=mat-pilates&format=live&paket=live-8");
    const plan = plans.find((p) => p.id === "live-8")!;
    expect(plan.price).toBeNull(); // so the script must not quote a price
    expect(byId.sales.assistant).not.toMatch(/\d+\s*(TL|₺)/);
  });

  it("health is caught by the server guard and uses its exact reply", () => {
    expect(mentionsHealth(byId.health.user)).toBe(true);
    const reply = parseReply(byId.health.assistant);
    expect(reply.text).toBe(cannedReplies.health[lang]);
    expect(reply.handoff).toBe(true);
  });

  it("unknown facts hand off instead of guessing", () => {
    expect(parseReply(byId.unknown.assistant).handoff).toBe(true);
  });

  it("no scripted question would trip the sensitive-data guard", () => {
    for (const s of demoScenarios[lang]) expect(findSensitiveData(s.user)).toBeNull();
  });

  it("is labelled as scripted", () => {
    expect(landing[lang].demo.note).toMatch(lang === "tr" ? /önceden yazılmıştır/ : /pre-written/);
  });
});
