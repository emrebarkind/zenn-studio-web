import { z } from "zod";
import { coaches, disciplines } from "@/content/site";

/**
 * Blog posts (2026-10-25): Markdown files in content/blog, written to answer
 * what people in Tekirdağ search for (pilates, reformer, kickboks, spor
 * salonu ...). Every post is checked by `postProblems` in a test, so a post
 * that breaks the house rules cannot be merged. Posts go live without a human
 * review for now (owner, 2026-10-25), which makes those rules the only gate;
 * `draft: true` holds one back. Google treats mass, low-value pages as spam,
 * so the pace stays at two careful posts a week.
 */

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD biçiminde olmalı");

export const frontmatterSchema = z.object({
  title: z.string().min(20).max(70),
  description: z.string().min(70).max(165),
  date,
  updated: date.optional(),
  /** The searches this post answers, most important first. */
  keywords: z.array(z.string().min(3)).min(1).max(6),
  /** The lesson the post is about, for the related-lesson card and links. */
  discipline: z.enum(disciplines.map((d) => d.slug) as [string, ...string[]]).optional(),
  /** A coach who read the post, shown under the title when set. */
  reviewedBy: z.enum(coaches.map((c) => c.name) as [string, ...string[]]).optional(),
  /** "true" keeps the post off the live site. */
  draft: z.enum(["true", "false"]).optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
export type Post = Omit<Frontmatter, "draft"> & { slug: string; body: string; draft: boolean; readingMinutes: number };

/** Splits "---\nkey: value\n---\nbody". Values are plain text, or [a, b] lists. */
export function parsePost(slug: string, source: string): Post {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(source.replace(/\r\n/g, "\n"));
  if (!m) throw new Error(`${slug}: frontmatter (--- ... ---) bulunamadı`);
  const raw: Record<string, unknown> = {};
  for (const line of m[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const i = line.indexOf(":");
    if (i < 0) throw new Error(`${slug}: anlaşılmayan satır: ${line}`);
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      raw[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => unquote(v.trim()))
        .filter(Boolean);
      continue;
    }
    value = unquote(value);
    if (value) raw[key] = value;
  }
  const parsed = frontmatterSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`${slug}: ${parsed.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")}`);
  }
  const body = m[2].trim();
  return { ...parsed.data, slug, body, draft: parsed.data.draft === "true", readingMinutes: Math.max(1, Math.round(wordCount(body) / 200)) };
}

function unquote(v: string): string {
  return v.replace(/^["'](.*)["']$/, "$1");
}

export function wordCount(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .split(/\s+/)
    .filter((w) => /\p{L}/u.test(w)).length;
}

// Claims a studio must not make, and prices, which we only give on the phone.
const FORBIDDEN: [RegExp, string][] = [
  [/\d[\d.,]*\s*(TL|₺)|₺\s*\d/i, "fiyat yazma; fiyatı telefonda paylaşıyoruz"],
  [/garanti/i, "sonuç garantisi verme"],
  [/%\s?100|yüzde yüz/i, "kesinlik iddiası kullanma"],
  [/tedavi eder|iyileştirir|şifa/i, "sağlık/tedavi iddiası kullanma; gerekiyorsa doktora yönlendir"],
  [/kilo ver(dir)?ir|\d+\s*kilo/i, "kilo vaadi verme"],
  [/Tekirdağ'?ın en iyi|bir numara|1 numara/i, "kanıtlanamaz üstünlük iddiası kullanma"],
];

/** House rules for a post; an empty list means it may be merged. */
export function postProblems(post: Post): string[] {
  const problems: string[] = [];
  const words = wordCount(post.body);
  if (words < 700) problems.push(`en az 700 kelime olmalı (şu an ${words})`);
  if (words > 2200) problems.push(`en fazla 2200 kelime olmalı (şu an ${words})`);
  if (/^#\s/m.test(post.body)) problems.push("metinde tek # başlık olmamalı; başlık sayfada zaten h1");
  const h2 = post.body.match(/^##\s/gm)?.length ?? 0;
  if (h2 < 3) problems.push("en az 3 ara başlık (##) olmalı");
  if (!/\]\(\/(#talep|kayit)/.test(post.body)) problems.push("ders talebine bir bağlantı olmalı: [..](/#talep)");
  if (!/\]\(\/branslar\//.test(post.body)) problems.push("en az bir branş sayfasına bağlantı olmalı: [..](/branslar/...)");
  if (!post.keywords.some((k) => /tekirda|süleymanpaşa/i.test(k))) problems.push("anahtar kelimelerden biri Tekirdağ/Süleymanpaşa içermeli");
  if (!/tekirda/i.test(post.title + post.description)) problems.push("başlık ya da açıklama Tekirdağ'ı anmalı");
  for (const [re, why] of FORBIDDEN) if (re.test(post.body) || re.test(post.title)) problems.push(why);
  // Posts go live without review: markdown only, and links only to safe places.
  if (/<\/?[a-z][^>]*>/i.test(post.body)) problems.push("HTML etiketi yazma; sadece markdown kullan");
  for (const [, href] of post.body.matchAll(/\]\(\s*([^)\s]+)/g)) {
    if (!/^(https?:\/\/|\/(?!\/)|#|mailto:|tel:)/i.test(href)) problems.push(`güvensiz bağlantı: ${href}`);
  }
  return problems;
}
