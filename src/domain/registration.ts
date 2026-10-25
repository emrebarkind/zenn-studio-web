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
    firstName: z.string().trim().min(2, "Adını yaz."),
    lastName: z.string().trim().min(2, "Soyadını yaz."),
    phone: z
      .string()
      .transform((v) => v.replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(/^(\+?90|0)?5\d{9}$/, "Cep telefonunu 05xx xxx xx xx biçiminde yaz.")),
    email: z.union([z.literal(""), z.email("Geçerli bir e-posta yaz.")]).default(""),
    note: z.string().trim().max(500, "Not en fazla 500 karakter olabilir.").default(""),
    consent: z.literal("on", { error: "Devam etmek için aydınlatma metnini onayla." }),
  })
  .superRefine((v, ctx) => {
    const discipline = disciplines.find((d) => d.slug === v.discipline);
    if (discipline && !discipline.formats.includes(v.format as FormatId)) {
      ctx.addIssue({ code: "custom", path: ["format"], message: "Bu branş bu şekilde verilmiyor." });
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
    `Telefon: ${r.phone}`,
    r.email && `E-posta: ${r.email}`,
    `Branş: ${discipline}`,
    `Şekil: ${way}`,
    r.format === "group" && `Paket: ${plan ?? "görüşmede belirlenecek"}`,
    r.format === "private" && `Kişi sayısı: ${r.people}`,
    r.format !== "online" && `Saat tercihi: ${r.slot === "farketmez" ? "fark etmez" : r.slot}`,
    r.note && `Not: ${r.note}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export type RequestForm = "quick" | "detailed";

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
    firstName: r.firstName,
    lastName: r.lastName,
    phone: r.phone,
    email: r.email,
    discipline: { slug: r.discipline, name: discipline?.name ?? r.discipline },
    format: { id: r.format, name: format?.name ?? r.format },
    plan: plan ? { id: plan.id, name: plan.name } : null,
    // The quick form never asks how many or when; say nothing rather than "1 kişi, fark etmez".
    people: r.format === "private" && meta.form === "detailed" ? r.people : null,
    slot: r.format === "online" || meta.form === "quick" ? null : r.slot,
    note: r.note,
  };
}
