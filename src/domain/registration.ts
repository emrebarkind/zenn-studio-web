import { z } from "zod";
import { disciplines, formats, plans, PRIVATE_GROUP_MAX, type FormatId } from "@/content/site";

export type PaymentMethod = "card" | "studio" | "transfer";

export const paymentMethods: {
  id: PaymentMethod;
  name: string;
  detail: string;
  available: boolean;
}[] = [
  {
    id: "card",
    name: "Kartla öde (iyzico)",
    detail: "Taksit seçenekli güvenli ödeme. Yakında.",
    available: false,
  },
  { id: "studio", name: "Stüdyoda öde", detail: "İlk dersine gelirken nakit ya da kartla.", available: true },
  { id: "transfer", name: "Havale / EFT", detail: "Hesap bilgilerini ön kayıttan sonra gönderiyoruz.", available: true },
];

const disciplineSlugs = disciplines.map((d) => d.slug) as [string, ...string[]];

/** Days a visitor can say suit them, Monday first. */
export const WEEKDAYS = [
  { id: "pzt", label: "Pzt", long: "Pazartesi" },
  { id: "sal", label: "Sal", long: "Salı" },
  { id: "car", label: "Çar", long: "Çarşamba" },
  { id: "per", label: "Per", long: "Perşembe" },
  { id: "cum", label: "Cum", long: "Cuma" },
  { id: "cmt", label: "Cmt", long: "Cumartesi" },
  { id: "paz", label: "Paz", long: "Pazar" },
] as const;
export type WeekdayId = (typeof WEEKDAYS)[number]["id"];
const weekdayIds = WEEKDAYS.map((d) => d.id) as [WeekdayId, ...WeekdayId[]];

/** Whole hours the studio is open for a time range, 07:00 to 22:00. */
export const HOURS = Array.from({ length: 16 }, (_, i) => `${String(i + 7).padStart(2, "0")}:00`) as [string, ...string[]];

/** "18:00-21:00", "18:00 sonrası", "21:00 öncesi" or null. */
export function timeRangeLabel(from: string, to: string): string | null {
  if (from && to) return `${from}-${to}`;
  if (from) return `${from} sonrası`;
  if (to) return `${to} öncesi`;
  return null;
}

/** "Pzt, Çar, Cum" from the chosen day ids, in week order. */
export function daysLabel(days: readonly string[]): string | null {
  const labels = WEEKDAYS.filter((d) => days.includes(d.id)).map((d) => d.label);
  return labels.length ? labels.join(", ") : null;
}
const groupPlanIds = plans.filter((p) => p.format === "group").map((p) => p.id) as [string, ...string[]];

/**
 * A lesson request (2026-10-25): which discipline, how (group class,
 * individual / small group of 1-6, or online), and for a group class which
 * package and group; the package may be left for the call (the short form on
 * the home page never asks). No payment is taken; the studio calls back.
 */
export const registrationSchema = z
  .object({
    discipline: z.enum(disciplineSlugs, { error: "Bir branş seç." }),
    format: z.enum(["group", "private", "online"], { error: "Nasıl çalışmak istediğini seç." }),
    plan: z.union([z.literal(""), z.enum(groupPlanIds)]).default(""),
    people: z.coerce.number().int().min(1).max(PRIVATE_GROUP_MAX).default(1),
    slot: z.enum(["sabah", "öğle", "akşam", "farketmez"]).default("farketmez"),
    /** Days and a time range that suit the visitor (private and online lessons; optional). */
    days: z.array(z.enum(weekdayIds)).default([]),
    timeFrom: z.union([z.literal(""), z.enum(HOURS)]).default(""),
    timeTo: z.union([z.literal(""), z.enum(HOURS)]).default(""),
    firstName: z.string().trim().min(2, "Adını yaz."),
    lastName: z.string().trim().min(2, "Soyadını yaz."),
    phone: z
      .string()
      .default("")
      .transform((v) => v.replace(/[\s()-]/g, ""))
      .pipe(z.union([z.literal(""), z.string().regex(/^(\+?90|0)?5\d{9}$/, "Cep telefonunu 05xx xxx xx xx biçiminde yaz.")])),
    /** "whatsapp": the visitor continues on WhatsApp, so their number arrives with the message. */
    channel: z.enum(["form", "whatsapp"]).default("form"),
    email: z.union([z.literal(""), z.email("Geçerli bir e-posta yaz.")]).default(""),
    note: z.string().trim().max(500, "Not en fazla 500 karakter olabilir.").default(""),
    consent: z.literal("on", { error: "Devam etmek için aydınlatma metnini onayla." }),
  })
  .superRefine((v, ctx) => {
    const discipline = disciplines.find((d) => d.slug === v.discipline);
    if (discipline && !discipline.formats.includes(v.format as FormatId)) {
      ctx.addIssue({ code: "custom", path: ["format"], message: "Bu branş bu şekilde verilmiyor." });
    }
    if (v.channel === "form" && !v.phone) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Cep telefonunu 05xx xxx xx xx biçiminde yaz." });
    }
    if (v.timeFrom && v.timeTo && v.timeTo <= v.timeFrom) {
      ctx.addIssue({ code: "custom", path: ["timeTo"], message: "Bitiş saati başlangıçtan sonra olmalı." });
    }
  });

export type Registration = z.infer<typeof registrationSchema>;

/** Plain-text summary used for the WhatsApp hand-off and the webhook. */
export function summarize(r: Registration, reference: string): string {
  const discipline = disciplines.find((d) => d.slug === r.discipline)?.name ?? r.discipline;
  const way = formats.find((f) => f.id === r.format)?.name ?? r.format;
  const plan = r.plan ? (plans.find((p) => p.id === r.plan)?.name ?? r.plan) : null;
  return [
    `Merhaba, Zenn Studio ders talebim (${reference}):`,
    `Ad soyad: ${r.firstName} ${r.lastName}`,
    r.phone && `Telefon: ${r.phone}`,
    r.email && `E-posta: ${r.email}`,
    `Branş: ${discipline}`,
    `Şekil: ${way}`,
    r.format === "group" && `Paket: ${plan ?? "görüşmede belirlenecek"}`,
    r.format === "private" && `Kişi sayısı: ${r.people}`,
    r.format === "group" && `Grup: ${r.slot === "farketmez" ? "fark etmez" : r.slot}`,
    daysLabel(r.days) && `Uygun günler: ${daysLabel(r.days)}`,
    timeRangeLabel(r.timeFrom, r.timeTo) && `Saat aralığı: ${timeRangeLabel(r.timeFrom, r.timeTo)}`,
    r.note && `Not: ${r.note}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export type RequestForm = "quick" | "detailed" | "wizard" | "planner";

/** "a", "a ve b", "a, b ve c". */
export function joinTr(words: string[]): string {
  return words.length <= 1 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} ve ${words.at(-1)}`;
}

/** The quick form only asks the discipline: group disciplines go to a group, the rest to a private lesson. */
export function inStudioFormat(slug: string): FormatId {
  const d = disciplines.find((x) => x.slug === slug);
  return d?.formats.find((f) => f !== "online") ?? "private";
}

/**
 * The request as the CRM receives it (POST /api/webhooks/web-request, see the
 * CRM's src/lib/web-request-lead.ts): ids and labels, never the site's form
 * internals. `requestId` makes a retried delivery land on the same row.
 */
export function crmPayload(
  r: Registration,
  meta: { requestId: string; reference: string; submittedAt: string; form: RequestForm },
) {
  const discipline = disciplines.find((d) => d.slug === r.discipline);
  const format = formats.find((f) => f.id === r.format);
  const plan = r.format === "group" && r.plan ? plans.find((p) => p.id === r.plan) : undefined;
  return {
    version: 1 as const,
    requestId: meta.requestId,
    reference: meta.reference,
    submittedAt: meta.submittedAt,
    form: meta.form,
    channel: r.channel,
    firstName: r.firstName,
    lastName: r.lastName,
    phone: r.phone,
    email: r.email,
    discipline: { slug: r.discipline, name: discipline?.name ?? r.discipline },
    format: { id: r.format, name: format?.name ?? r.format },
    plan: plan ? { id: plan.id, name: plan.name } : null,
    people: r.format === "private" && meta.form === "detailed" ? r.people : null,
    // Morning / evening group only means something for a group class.
    slot: r.format === "group" && meta.form !== "quick" ? r.slot : null,
    days: WEEKDAYS.filter((d) => r.days.includes(d.id)).map((d) => d.label),
    timeFrom: r.timeFrom || null,
    timeTo: r.timeTo || null,
    note: r.note,
  };
}
