import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { disciplines, formats, plans } from "@/content/site";
import { ButtonLink, Container } from "@/components/ui";
import { PlanCard } from "@/components/plan-card";

export function generateStaticParams() {
  return disciplines.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/branslar/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = disciplines.find((x) => x.slug === slug);
  return d ? { title: d.name, description: `${d.tagline} ${d.description}` } : {};
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

  const offered = formats.filter((f) => d.formats.includes(f.id));
  const relevantPlans = plans.filter((p) => d.formats.includes(p.format));

  return (
    <>
      <section className="pt-12 pb-16 sm:pt-20">
        <Container>
          <h1 className="font-display text-[clamp(3rem,10vw,7.5rem)] leading-[0.9] font-extrabold tracking-[-0.05em]">
            {d.name}
          </h1>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight text-moss">{d.tagline}</p>
              <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-soft">{d.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/kayit?brans=${d.slug}`}>{d.name} için ön kayıt</ButtonLink>
                <ButtonLink href="/ders-bul" variant="ghost">
                  Emin değilim, test et
                </ButtonLink>
              </div>
              <dl className="mt-10 space-y-6 rounded-3xl bg-card p-6 sm:p-7">
                <div>
                  <dt className="text-sm font-semibold text-ink-soft">Kimler için iyi</dt>
                  <dd>
                    <ul className="mt-2 space-y-1.5">
                      {d.goodFor.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-ink-soft">Yanına al</dt>
                  <dd className="mt-2">{d.bring}</dd>
                </div>
                {d.coaches.length > 0 && (
                  <div>
                    <dt className="text-sm font-semibold text-ink-soft">Antrenör</dt>
                    <dd className="mt-2">{d.coaches.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </div>
            <Image
              src={d.photo.src}
              alt={d.photo.alt}
              placeholder="blur"
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className={`w-full rounded-[28px] object-cover ${
                d.photo.src.height > d.photo.src.width ? "aspect-[4/5]" : "aspect-[3/2]"
              }`}
            />
          </div>
        </Container>
      </section>

      <section className="bg-stone py-16 sm:py-24">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Nerede yapabilirsin</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {offered.map((f) => (
              <article key={f.id} className="rounded-3xl bg-card p-6">
                <h3 className="font-display text-xl font-bold tracking-tight">{f.name}</h3>
                <p className="mt-2 text-ink-soft">{f.summary}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Paketler</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relevantPlans.map((p) => (
              <PlanCard key={p.id} plan={p} discipline={d.slug} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
