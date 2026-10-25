// Legal and contact details of the company behind Zenn Studio. This is the
// only place these facts live: the footer, the contact section, the KVKK
// notice and Zenn Asistan's human hand-off all read from here.
//
// Leave a value as "" until it is known; empty fields are simply not rendered.
// `npm run check:company` (run as `prebuild`) always fails on a bracketed
// placeholder such as "[DOLDUR]" or a malformed value — a placeholder must
// never go live. Empty REQUIRED fields only warn for now (the studio asked to
// publish before the legal details exist); set COMPANY_STRICT=1 to make them
// fail the build again once the details are in.

export type Company = {
  /** Ticari unvan, e.g. "Zenn Spor Hizmetleri Ltd. Şti." */
  legalName: string;
  /** Street address without the city. */
  address: string;
  city: string;
  taxOffice: string;
  taxNumber: string;
  /** MERSİS numarası (16 digits). */
  mersis: string;
  email: string;
  /** Human-readable phone, e.g. "0532 123 45 67". */
  phone: string;
  /** WhatsApp number in international format without "+", e.g. 905321234567. */
  whatsapp: string;
  /** Instagram handle without "@". */
  instagram: string;
  /** Google Maps link to the studio. */
  mapsUrl: string;
};

export const company: Company = {
  legalName: "",
  address: "Hürriyet Mahallesi, Şehit Mesut Bakan Cd. No:2, Süleymanpaşa",
  city: "Tekirdağ",
  taxOffice: "",
  taxNumber: "",
  mersis: "",
  email: "",
  phone: "",
  whatsapp: "905352793303",
  instagram: "",
  mapsUrl: "",
};

export const requiredCompanyFields = [
  "legalName",
  "address",
  "city",
  "taxOffice",
  "taxNumber",
  "mersis",
  "email",
  "phone",
] as const satisfies readonly (keyof Company)[];

const placeholder = /\[[^\]]*\]|DOLDUR/i;

/** Required fields that are still empty. */
export function missingCompanyFields(c: Company): string[] {
  return requiredCompanyFields.filter((key) => !c[key].trim()).map((key) => `${key} boş`);
}

/** Problems that always block a production build: placeholders and malformed values. */
export function companyProblems(c: Company): string[] {
  const problems: string[] = [];
  for (const [key, value] of Object.entries(c)) {
    if (placeholder.test(value)) problems.push(`${key} yer tutucu içeriyor: "${value}"`);
  }
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) problems.push("email geçersiz");
  if (c.whatsapp && !/^\d{10,15}$/.test(c.whatsapp)) problems.push("whatsapp 905xxxxxxxxx biçiminde olmalı");
  if (c.mersis && !/^\d{16}$/.test(c.mersis.replace(/\s/g, ""))) problems.push("mersis 16 haneli olmalı");
  return problems;
}

/** Ways a visitor can reach a person, in display order; only filled ones. */
export function contactChannels(c: Company = company) {
  const channels: { kind: "whatsapp" | "phone" | "email" | "instagram"; label: string; href: string }[] = [];
  if (c.whatsapp) channels.push({ kind: "whatsapp", label: "WhatsApp", href: `https://wa.me/${c.whatsapp}` });
  if (c.phone) channels.push({ kind: "phone", label: c.phone, href: `tel:${c.phone.replace(/[^\d+]/g, "")}` });
  if (c.email) channels.push({ kind: "email", label: c.email, href: `mailto:${c.email}` });
  if (c.instagram)
    channels.push({ kind: "instagram", label: `@${c.instagram}`, href: `https://instagram.com/${c.instagram}` });
  return channels;
}
