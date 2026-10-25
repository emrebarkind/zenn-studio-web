import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui";
import { allPosts } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog-format";

export const metadata: Metadata = {
  title: "Blog: Tekirdağ'da pilates, kickboks ve antrenman üzerine",
  description:
    "Tekirdağ Süleymanpaşa'daki stüdyomuzdan yazılar: hangi dersle başlanır, reformer ile mat pilatesin farkı, kickboksa ilk adım ve daha fazlası.",
  alternates: { canonical: "/blog" },
};

/** "/blog": our posts, newest first. Drafts appear only in development. */
export default function BlogIndex() {
  const posts = allPosts();
  return (
    <>
      <section className="pt-10 pb-12 sm:pt-16">
        <Container>
          <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance">Blog</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Stüdyomuzda en çok duyduğumuz soruları yazıya döküyoruz: hangi dersle başlanır, hangisi kime iyi gelir, ilk derste ne olur.
          </p>
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container>
          {posts.length === 0 ? (
            <p className="rounded-[28px] bg-card p-8 text-lg text-ink-soft">İlk yazımız yakında burada.</p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-[28px] bg-card p-7 transition-colors hover:bg-ink/[0.06] sm:p-8">
                    <p className="text-sm text-ink-soft">
                      {formatPostDate(p.date)} · {p.readingMinutes} dk okuma
                      {p.draft && <span className="ml-2 rounded-full bg-danger/15 px-2 py-0.5 font-semibold text-danger">Taslak</span>}
                    </p>
                    <h2 className="mt-3 text-2xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-[1.75rem]">{p.title}</h2>
                    <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{p.description}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 font-semibold">
                      Oku
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
