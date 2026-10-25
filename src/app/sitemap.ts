import type { MetadataRoute } from "next";
import { disciplines, studio } from "@/content/site";
import { allPosts } from "@/lib/blog";

/** Every public page, and every published blog post (drafts never). */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: `${studio.url}${path}`, priority });
  return [
    page("/", 1),
    ...disciplines.map((d) => page(`/branslar/${d.slug}`, 0.9)),
    page("/blog", 0.7),
    ...allPosts({ includeDrafts: false }).map((p) => ({ ...page(`/blog/${p.slug}`, 0.6), lastModified: p.updated ?? p.date })),
    page("/paketler", 0.6),
    page("/online", 0.5),
    page("/ders-bul", 0.5),
    page("/kayit", 0.5),
    page("/kvkk", 0.2),
  ];
}
