import fs from "node:fs";
import path from "node:path";
import { Marked, type Tokens } from "marked";
import { parsePost, type Post } from "@/domain/blog";

const DIR = path.join(process.cwd(), "content", "blog");

/**
 * Every post in content/blog, newest first. Drafts (`draft: true`) are shown
 * in development only.
 * Files starting with "_" (the keyword plan) are not posts.
 */
export function allPosts({ includeDrafts = process.env.NODE_ENV === "development" } = {}): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => parsePost(f.replace(/\.md$/, ""), fs.readFileSync(path.join(DIR, f), "utf8")))
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function findPost(slug: string): Post | undefined {
  return allPosts().find((p) => p.slug === slug);
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Only our own pages, the web and mail/phone: never `javascript:` or `data:`. */
export function safeHref(href: string): boolean {
  return /^(https?:\/\/|\/(?!\/)|#|mailto:|tel:)/i.test(href.trim());
}

// Posts are published by an unattended routine (no human review), so the
// markdown is treated as untrusted: raw HTML is shown as text, never run, and a
// link or image may only point somewhere safe.
const markdown = new Marked({
  gfm: true,
  async: false,
  renderer: {
    html: ({ text }: Tokens.HTML | Tokens.Tag) => escapeHtml(text),
  },
  walkTokens(token) {
    if ((token.type === "link" || token.type === "image") && !safeHref(token.href)) token.href = "#";
  },
});

/** The post body as HTML, safe to inject (see `markdown` above). */
export function renderPost(post: Post): string {
  return markdown.parse(post.body, { async: false });
}
