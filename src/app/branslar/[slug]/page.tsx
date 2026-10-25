import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { coaches, disciplines, faqs } from "@/content/site";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { DisciplineVisual } from "@/components/discipline-visual";
import { GroupPackageCard, PrivateLessonCard } from "@/components/home/ways-to-train";

export function generateStaticParams() {
  return disciplines.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/branslar/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = disciplines.find((x) => x.slug === slug);
  // "Tekirdağ Reformer Pilates": what people type, and true of the page.
  return d
    ? { title: `Tekirdağ ${d.name}`, description: `Tekirdağ Süleymanpaşa'da ${d.name}. ${d.tagline} ${d.description}`.slice(0, 300), alternates: { canonical: `/branslar/${d.slug}` } }
    : {};
}

export default function DisciplinePage({ params }: PageProps<"/branslar/[slug]">) {
  // Every slug is prerendered; the boundary keeps navigations instant.
  return (
    <Suspense>
      <DisciplineContent params={params} />
    </Suspense>
  );
}

async function DisciplineContent({ params }: Pick<PageProps<"/branslar/[slug]">, "params">) {
  const { slug } = await params;
  const d = disciplines.find((x) => x.slug === slug);
  if (!d) notFound();

  const team = d.coaches.map((name) => coaches.find((c) => c.name === name) ?? { name, portrait: null });
  const others = disciplines.filter((x) => x.slug !== d.slug);
  const group = d.formats.includes("group");
  // Two questions people ask about this way to train, beside the card when there is no online tile.
  const questions = faqs.filter((f) =>
    group ? /grup dersinin|Fiyat/.test(f.q) : /Arkadaşlarımla|Fiyat/.test(f.q),
  );
  const privateQuestions = faqs.filter((f) => /Arkadaşlarımla|bireysel/.test(f.q));

  return (
    <>
      {/* Photo and name: the photo leads on a phone, sits beside the text on a wide screen. */}
      <section className="pt-6 pb-20 sm:pt-10 sm:pb-28">
        <Container className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="on-ink relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-ink sm:aspect-[16/10] lg:order-2 lg:col-span-6 lg:aspect-[4/5]">
            <DisciplineVisual d={d} morph priority sizes="(min-width: 1024px) 560px, 100vw" />
          </div>
          <div className="lg:order-1 lg:col-span-6">
            <h1 className="text-[clamp(3rem,8.5vw,6.5rem)] leading-[0.92] font-bold tracking-[-0.05em] text-balance">{d.name}</h1>
            <p className="mt-5 text-2xl font-semibold tracking-tight text-moss">{d.tagline}</p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">{d.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/kayit?brans=${d.slug}`}>Ders talebi</ButtonLink>
              <ButtonLink href="/ders-bul" variant="ghost">
                Birlikte seçelim
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* What to know, in three tiles. */}
      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] bg-card p-7">
            <h2 className="text-sm font-semibold text-ink-soft">Kimler için iyi</h2>
            <ul className="mt-4 space-y-2 text-lg">
              {d.goodFor.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[28px] bg-card p-7">
            <h2 className="text-sm font-semibold text-ink-soft">Yanına al</h2>
            <p className="mt-4 text-lg">{d.bring}</p>
          </div>
          <div className="on-ink rounded-[28px] bg-ink p-7 text-paper">
            <h2 className="text-sm font-semibold text-paper/60">{team.length ? "Antrenörler" : "Gruplar"}</h2>
            {team.length ? (
              <ul className="mt-4 flex flex-wrap gap-3">
                {team.map((c) => (
                  <li key={c.name} className="flex items-center gap-3 rounded-full bg-paper/10 py-1.5 pr-4 pl-1.5">
                    {c.portrait ? (
                      <span className="relative size-10 overflow-hidden rounded-full">
                        <Image
                          src={c.portrait.src}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                          style={{ objectPosition: c.portrait.position }}
                        />
                      </span>
                    ) : (
                      <span aria-hidden className="grid size-10 place-items-center rounded-full bg-paper/15 font-semibold">
                        {c.name.charAt(0)}
                      </span>
                    )}
                    <span className="font-semibold">{c.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-lg text-paper/80">Sabah ya da akşam grubu. 8 derste pazartesi ve çarşamba, 12 derste cuma da eklenir.</p>
            )}
          </div>
        </Container>
      </section>

      {/* How this discipline is offered. */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <SectionHeading size="md" align="left" title="Nasıl çalışırsın" lead="Fiyatı seni aradığımızda paylaşırız. Ödeme alınmaz." />
          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            {group ? (
              <GroupPackageCard discipline={d.slug} subtitle={d.name} className="lg:col-span-8" />
            ) : (
              <PrivateLessonCard discipline={d.slug} subtitle={`${d.name}, tek başına ya da 6 kişiye kadar`} className="lg:col-span-8" />
            )}
            {!d.formats.includes("online") && (
              <div className="rounded-[28px] bg-card p-7 lg:col-span-4">
                {questions.map((q) => (
                  <div key={q.q} className="border-b border-ink/10 py-4 first:pt-0 last:border-0 last:pb-0">
                    <h3 className="font-semibold">{q.q}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{q.a}</p>
                  </div>
                ))}
              </div>
            )}
            {d.formats.includes("online") && (
              <div className="flex flex-col justify-between rounded-[28px] bg-card p-7 lg:col-span-4">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">Online da olur</h3>
                  <p className="mt-2 text-ink-soft">Evden, canlı ders. Talep formunda online kutusunu işaretle.</p>
                </div>
                <Link href="/online" className="mt-6 inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline">
                  Online Mat Pilates
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
            )}
            {/* A group lesson that is also taught one to one (Mat Pilates): both ways, each with its own card. */}
            {group && d.formats.includes("private") && (
              <>
                <PrivateLessonCard discipline={d.slug} subtitle={`${d.name}, tek başına ya da 6 kişiye kadar`} className="lg:col-span-8" />
                <div className="rounded-[28px] bg-card p-7 lg:col-span-4">
                  {privateQuestions.map((q) => (
                    <div key={q.q} className="border-b border-ink/10 py-4 first:pt-0 last:border-0 last:pb-0">
                      <h3 className="font-semibold">{q.q}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{q.a}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Container>
      </section>

      {/* The other disciplines. */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <h2 className="text-2xl font-semibold tracking-tight">Diğer dersler</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/branslar/${o.slug}`} className="group on-ink @container relative block aspect-[4/5] overflow-hidden rounded-[24px] bg-ink text-paper">
                  <DisciplineVisual d={o} sizes="(min-width: 768px) 25vw, 50vw" className="transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/0" />
                  <p className="absolute inset-x-0 bottom-0 p-4 text-lg leading-tight font-semibold tracking-tight">{o.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
