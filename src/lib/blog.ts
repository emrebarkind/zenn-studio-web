import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { parsePost, type Post } from "@/domain/blog";

const DIR = path.join(process.cwd(), "content", "blog");

/**
 * Every post in content/blog, newest first. Drafts (no `reviewedBy` yet) are
 * shown in development only, so nothing unreviewed reaches the live site.
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

/** The post body as HTML. The files are ours and reviewed before merge. */
export function renderPost(post: Post): string {
  return marked.parse(post.body, { async: false, gfm: true });
}
