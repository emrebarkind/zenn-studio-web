// Deterministic checks that run on the server BEFORE a message reaches the
// model. The system prompt states the same rules; these make the two most
// sensitive ones hold even if the model would not follow them, and keep that
// data from ever leaving our server.

export type Lang = "tr" | "en";

const turkishSignals = [
  /[çğıöşüÇĞİÖŞÜ]/g,
  /\b(merhaba|selam|ders|dersi|paket|fiyat|nasıl|ne|var|yok|mı|mi|mu|mü|ve|bir|için|istiyorum|evet|hayır|teşekkür\w*)\b/gi,
  /\w(yim|yım|yum|yüm|sin|sın|miyim|mıyım|abilir|ebilir|iyor|ıyor|uyor|üyor|lar|ler|mak|mek)\b/gi,
];
const englishSignals = [
  /\b(the|is|are|i|i'm|im|can|could|what|how|which|my|me|do|does|you|your|a|an|to|of|and|for|have|has|with|class|classes|price|hello|hi|thanks?)\b/gi,
];

const score = (text: string, patterns: RegExp[]) =>
  patterns.reduce((n, p) => n + (text.match(p)?.length ?? 0), 0);

/** Rough language guess for canned replies; the model answers in kind itself. Ties go to Turkish. */
export function guessLang(text: string): Lang {
  return score(text, englishSignals) > score(text, turkishSignals) ? "en" : "tr";
}

// Health topics the assistant must not comment on (rule 1). Stems, so they
// match Turkish suffixes: "ağrım", "fıtığım", "hamileyim", "ameliyattan".
const healthPatterns: RegExp[] = [
  /a[gğ]r[ıi](m|n|s|y|l|d|\b)/i,
  /\bsızı/i,
  /sakat/i,
  /yaralan/i,
  /incin/i,
  /f[ıi]t[ıi][kğg]/i,
  /hamile/i,
  /gebe(lik|yim|\b)/i,
  /doğum\s*sonra/i,
  /lohusa/i,
  /\bilaç/i,
  /ameliyat/i,
  /\bteşhis/i,
  /tansiyon/i,
  /diyabet|şeker\s*hastal/i,
  /\bkalp\b|kalp\s*(rahats|hastal|pil)/i,
  /\bmenisk/i,
  /skolyoz/i,
  /\bdoktor|hekim/i,
  /\bpain(ful)?\b/i,
  /\bhurts?\b/i,
  /\binjur/i,
  /\bpregnan/i,
  /\bpostpartum\b/i,
  /\bmedicat/i,
  /\bsurgery\b/i,
  /\bdiagnos/i,
  /\bhernia/i,
  /\bdisc\s*(bulge|herniation)/i,
  /\bblood\s*pressure\b/i,
  /\bdoctor\b/i,
];

export function mentionsHealth(text: string): boolean {
  return healthPatterns.some((p) => p.test(text));
}

/** Luhn check, to tell card numbers from phone numbers. */
function luhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** Turkish national ID checksum (11 digits, first non-zero). */
function isTcKimlik(d: string): boolean {
  if (!/^[1-9]\d{10}$/.test(d)) return false;
  const n = d.split("").map(Number);
  const odd = n[0] + n[2] + n[4] + n[6] + n[8];
  const even = n[1] + n[3] + n[5] + n[7];
  const d10 = (((odd * 7 - even) % 10) + 10) % 10;
  const d11 = n.slice(0, 10).reduce((a, b) => a + b, 0) % 10;
  return d10 === n[9] && d11 === n[10];
}

export type SensitiveData = "card" | "tckn" | "iban";

/** Payment or identity data the visitor pasted (rule 3). */
export function findSensitiveData(text: string): SensitiveData | null {
  if (/\bTR\s?\d{2}(\s?\d{4}){5}\s?\d{2}\b/i.test(text)) return "iban";
  const runs = text.match(/\d[\d\s-]{9,24}\d/g) ?? [];
  for (const run of runs) {
    const d = run.replace(/[\s-]/g, "");
    if (d.length === 11 && isTcKimlik(d)) return "tckn";
    if (d.length >= 13 && d.length <= 19 && luhn(d)) return "card";
  }
  return null;
}

export const cannedReplies = {
  health: {
    tr: "Sağlıkla ilgili konularda yorum yapamam. Bunu antrenörümüzle konuşman en doğrusu; seni ekibimize bağlayayım.",
    en: "I can't advise on that; it's best to talk it through with one of our coaches. Let me connect you with our team.",
  },
  sensitive: {
    tr: "Lütfen kart, IBAN ya da TC kimlik numarası gibi bilgileri buraya yazma; mesajını bu yüzden işlemedim. Ön kayıtta ödeme alınmıyor. Başka nasıl yardımcı olabilirim?",
    en: "Please don't share card, IBAN or ID numbers here; I didn't process that message. No payment is taken at pre-registration. How else can I help?",
  },
} as const;
