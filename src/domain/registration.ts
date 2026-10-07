import { z } from "zod";
import { disciplines, plans, type FormatId } from "@/content/site";

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
const planIds = plans.map((p) => p.id) as [string, ...string[]];

export const registrationSchema = z
  .object({
    discipline: z.enum(disciplineSlugs, { error: "Bir branş seç." }),
    format: z.enum(["studio", "live", "coaching"], { error: "Bir format seç." }),
    plan: z.enum(planIds, { error: "Bir paket seç." }),
    slot: z.enum(["sabah", "akşam", "farketmez"]).default("farketmez"),
    firstName: z.string().trim().min(2, "Adını yaz."),
    lastName: z.string().trim().min(2, "Soyadını yaz."),
    phone: z
      .string()
      .transform((v) => v.replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(/^(\+?90|0)?5\d{9}$/, "Cep telefonunu 05xx xxx xx xx biçiminde yaz.")),
    email: z.union([z.literal(""), z.email("Geçerli bir e-posta yaz.")]).default(""),
    note: z.string().trim().max(500, "Not en fazla 500 karakter olabilir.").default(""),
    payment: z.enum(["studio", "transfer"], { error: "Bir ödeme yöntemi seç." }),
    consent: z.literal("on", { error: "Devam etmek için aydınlatma metnini onayla." }),
  })
  .superRefine((v, ctx) => {
    const discipline = disciplines.find((d) => d.slug === v.discipline);
    if (discipline && !discipline.formats.includes(v.format as FormatId)) {
      ctx.addIssue({ code: "custom", path: ["format"], message: "Bu branş bu formatta verilmiyor." });
    }
    const plan = plans.find((p) => p.id === v.plan);
    if (plan && plan.format !== v.format) {
      ctx.addIssue({ code: "custom", path: ["plan"], message: "Bu paket seçtiğin formata ait değil." });
    }
  });

export type Registration = z.infer<typeof registrationSchema>;

/** Plain-text summary used for the WhatsApp hand-off and the webhook. */
export function summarize(r: Registration, reference: string): string {
  const discipline = disciplines.find((d) => d.slug === r.discipline)?.name ?? r.discipline;
  const plan = plans.find((p) => p.id === r.plan)?.name ?? r.plan;
  const payment = paymentMethods.find((m) => m.id === r.payment)?.name ?? r.payment;
  return [
    `Merhaba, Zenn Studio ön kaydım (${reference}):`,
    `Ad soyad: ${r.firstName} ${r.lastName}`,
    `Telefon: ${r.phone}`,
    r.email && `E-posta: ${r.email}`,
    `Branş: ${discipline}`,
    `Paket: ${plan}`,
    r.format === "studio" && `Saat tercihi: ${r.slot}`,
    `Ödeme: ${payment}`,
    r.note && `Not: ${r.note}`,
  ]
    .filter(Boolean)
    .join("\n");
}
