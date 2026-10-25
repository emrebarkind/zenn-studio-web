import { describe, expect, it } from "vitest";
import { crmPayload, inStudioFormat, registrationSchema, summarize, whatsappMessage } from "./registration";

const base = {
  discipline: "reformer-pilates",
  format: "private",
  plan: "",
  people: "3",
  slot: "farketmez",
  days: ["car", "pzt"],
  timeFrom: "18:00",
  timeTo: "21:00",
  firstName: "Deniz",
  lastName: "Aksoy",
  phone: "0532 123 45 67",
  email: "",
  note: "",
  consent: "on",
};
const meta = { requestId: "5f0c2b3e-8d1a-4c2b-9e7f-1a2b3c4d5e6f", reference: "ZS-000417", submittedAt: "2026-10-25T09:14:00.000Z" };

describe("lesson request", () => {
  it("lets a group request leave the package for the call", () => {
    const r = registrationSchema.parse({ ...base, discipline: "mat-pilates", format: "group" });
    expect(summarize(r, "ZS-000001")).toContain("Paket: görüşmede belirlenecek");
  });

  it("rejects a way the discipline is not offered", () => {
    expect(registrationSchema.safeParse({ ...base, discipline: "spinning", format: "private" }).success).toBe(false);
  });

  it("takes Mat Pilates both as a group class and one to one", () => {
    expect(registrationSchema.safeParse({ ...base, discipline: "mat-pilates", format: "group" }).success).toBe(true);
    expect(registrationSchema.safeParse({ ...base, discipline: "mat-pilates", format: "private" }).success).toBe(true);
  });

  it("maps the quick form's lesson to its way to train", () => {
    expect(inStudioFormat("mat-pilates")).toBe("group");
    expect(inStudioFormat("spinning")).toBe("group");
    expect(inStudioFormat("kickboks")).toBe("private");
  });

  it("sends the CRM ids and labels, and nothing the visitor was not asked", () => {
    const r = registrationSchema.parse(base);
    const detailed = crmPayload(r, { ...meta, form: "detailed" });
    expect(detailed).toMatchObject({
      version: 1,
      phone: "05321234567",
      discipline: { slug: "reformer-pilates", name: "Reformer Pilates" },
      format: { id: "private", name: "Bireysel ve küçük grup" },
      plan: null,
      people: 3,
      slot: null,
      days: ["Pzt", "Çar"],
      timeFrom: "18:00",
      timeTo: "21:00",
    });
    const quick = crmPayload(r, { ...meta, form: "quick" });
    expect(quick.people).toBeNull();
    expect(quick.slot).toBeNull();
  });

  it("puts the days and time range in the summary and refuses an end before the start", () => {
    const r = registrationSchema.parse(base);
    expect(summarize(r, "ZS-000001")).toContain("Uygun günler: Pzt, Çar");
    expect(summarize(r, "ZS-000001")).toContain("Saat aralığı: 18:00-21:00");
    expect(registrationSchema.safeParse({ ...base, timeFrom: "20:00", timeTo: "19:00" }).success).toBe(false);
  });

  it("names the group package when one was chosen", () => {
    const r = registrationSchema.parse({ ...base, discipline: "mat-pilates", format: "group", plan: "group-12" });
    expect(crmPayload(r, { ...meta, form: "detailed" }).plan).toEqual({ id: "group-12", name: "12 ders" });
  });
});

describe("whatsappMessage", () => {
  const who = { firstName: "Ayşe", lastName: "Kaya" };

  it("reads like a person wrote it: who, which lesson, which days and hours", () => {
    expect(
      whatsappMessage({ ...who, discipline: "spinning", format: "group", days: ["per", "pzt"], timeFrom: "18:00", timeTo: "21:00" }),
    ).toBe(
      "Merhaba Zenn Studio, ben Ayşe Kaya. Spinning grup dersine katılmak istiyorum. Pazartesi ve Perşembe günleri saat 18:00 ile 21:00 arası gelebilirim. Bilgi verebilir misiniz? Teşekkürler.",
    );
  });

  it("leaves out the time when none was chosen and adds the extra line", () => {
    expect(
      whatsappMessage({ ...who, discipline: "kickboks", format: "private", days: ["sal"], timeFrom: "", timeTo: "" }, "Arkadaşımla geleceğim."),
    ).toBe("Merhaba Zenn Studio, ben Ayşe Kaya. Kickboks özel dersi almak istiyorum. Salı günleri gelebilirim. Arkadaşımla geleceğim. Bilgi verebilir misiniz? Teşekkürler.");
  });

  it("starts the sentence with Saat when only an hour was chosen", () => {
    expect(whatsappMessage({ ...who, discipline: "kickboks", format: "private", days: [], timeFrom: "18:00", timeTo: "" })).toContain(
      "Saat 18:00 sonrası gelebilirim.",
    );
  });
});
