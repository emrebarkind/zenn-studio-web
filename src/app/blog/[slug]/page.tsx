import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { coachFullName, coaches, disciplines, studio } from "@/content/site";
import { ButtonLink, Container } from "@/components/ui";
import { allPosts, findPost, renderPost } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog-format";
import { jsonLdScript } from "@/lib/structured-data";

// Drafts are listed too, so the build always has a page to check, but on the
// live site findPost() skips them and the page is a 404.
export function generateStaticParams() {
  const slugs = allPosts({ includeDrafts: true }).map((p) => ({
    slug: p.slug,
  }));
  return slugs.length ? slugs : [{ slug: "yakinda" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.draft ? { index: false } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
    },
  };
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense>
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({
  params,
}: Pick<PageProps<"/blog/[slug]">, "params">) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const d = disciplines.find((x) => x.slug === post.discipline);
  const reviewerCoach = coaches.find((c) => c.name === post.reviewedBy);
  const reviewer = reviewerCoach ? coachFullName(reviewerCoach) : post.reviewedBy;
  const others = allPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);
  const url = `${studio.url}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "tr-TR",
    keywords: post.keywords.join(", "),
    mainEntityOfPage: url,
    url,
    author: { "@type": "Organization", name: studio.name, url: studio.url },
    publisher: { "@type": "Organization", name: studio.name, url: studio.url },
    ...(post.reviewedBy
      ? {
          contributor: {
            "@type": "Person",
            name: reviewer,
            jobTitle: "Antrenör",
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <article className="pt-8 pb-16 sm:pt-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Blog
            </Link>
            <h1 className="mt-4 text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.02] font-bold tracking-[-0.045em] text-balance">
              {post.title}
            </h1>
            <p className="mt-5 text-sm text-ink-soft">
              {formatPostDate(post.date)} · {post.readingMinutes} dk okuma
              {reviewer && <> · Antrenörümüz {reviewer} okudu</>}
              {post.draft && (
                <span className="ml-2 rounded-full bg-danger/15 px-2 py-0.5 font-semibold text-danger">
                  Taslak: canlı sitede görünmez
                </span>
              )}
            </p>
            <div
              className="prose-zenn mt-10"
              dangerouslySetInnerHTML={{ __html: renderPost(post) }}
            />

            {/* The next step, always: a lesson request (and the lesson's own page). */}
            <aside className="on-ink mt-14 rounded-[28px] bg-ink p-7 text-paper sm:p-9">
              <h2 className="text-2xl font-semibold tracking-tight">
                {d
                  ? `${d.name} dersini denemek ister misin?`
                  : "Bir dersle başlamak ister misin?"}
              </h2>
              <p className="mt-2 text-paper/75">
                Günlerini ve saatini seç, adını yaz; seni arayalım ya da
                WhatsApp&apos;tan yazışalım.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/#talep">Ders talebi</ButtonLink>
                {d && (
                  <ButtonLink href={`/branslar/${d.slug}`} variant="outline">
                    {d.name} hakkında
                  </ButtonLink>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </article>

      {others.length > 0 && (
        <section className="pb-24 sm:pb-32">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-sm font-semibold text-ink-soft">
                Diğer yazılar
              </h2>
              <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex items-center justify-between gap-6 py-5"
                    >
                      <span className="text-lg font-semibold tracking-tight">
                        {p.title}
                      </span>
                      <ArrowUpRight
                        className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
