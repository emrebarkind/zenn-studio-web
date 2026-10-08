import { describe, expect, it } from "vitest";
import { disciplines, faqs, plans } from "@/content/site";
import { greeting } from "./greeting";
import { buildKnowledge } from "./knowledge";
import { buildSystemPrompt } from "./prompt";

describe("knowledge", () => {
  const k = buildKnowledge();

  it("covers every discipline, plan and FAQ on the site", () => {
    for (const d of disciplines) expect(k).toContain(d.slug);
    for (const p of plans) expect(k).toContain(p.id);
    for (const f of faqs) expect(k).toContain(f.q);
  });

  it("says when a price is not published instead of inventing one", () => {
    for (const p of plans.filter((x) => x.price === null)) {
      expect(k).toMatch(new RegExp(`${p.id}[^\\n]*fiyat sitede yazmıyor`));
    }
    expect(k).not.toMatch(/₺\s?\d|\d\s?TL/);
  });

  it("marks unreleased features as coming soon", () => {
    expect(k).toMatch(/Henüz yayında olmayanlar/);
    expect(k).toMatch(/Kartla online ödeme/);
  });

  it("is deterministic so the prompt can be cached", () => {
    expect(buildKnowledge()).toBe(k);
    expect(k).not.toMatch(/\d{4}-\d{2}-\d{2}T/);
  });
});

describe("system prompt", () => {
  const s = buildSystemPrompt();

  it.each([
    ["AI identity", /yapay zekâ asistanı/],
    ["no medical advice", /tıbbi tavsiye, teşhis, sakatlık, ağrı, hamilelik, ilaç/],
    ["medical hand-off line", /Bunu antrenörümüzle konuşman en doğrusu/],
    ["no invented facts", /fiyat, ders saati, kampanya, indirim, antrenör adı/],
    ["unknown → hand-off line", /Bu konuda bilgim yok, ekibe iletiyorum/],
    ["no payment / ID / health data", /ödeme bilgisi, TC kimlik numarası ya da sağlık verisi isteme/],
    ["Turkish and English only", /yalnızca Türkçe ve İngilizce/],
    ["enrol marker", /<<KAYIT brans=/],
    ["hand-off marker", /<<EKIP>>/],
  ])("states the %s rule", (_, pattern) => expect(s).toMatch(pattern));
});

describe("greeting", () => {
  it("says it is an AI and offers a human, in both languages", () => {
    expect(greeting.tr).toMatch(/yapay zekâ/i);
    expect(greeting.tr).toMatch(/ekibimize/);
    expect(greeting.en).toMatch(/AI assistant/);
    expect(greeting.en).toMatch(/our team/);
  });
});
