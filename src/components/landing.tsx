import Image from "next/image";
import { DisciplineVisual } from "@/components/discipline-visual";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { company, contactChannels } from "@/content/company";
import { landing, type Lang } from "@/content/landing";
import { disciplines, photos } from "@/content/site";
import { ButtonLink, Container } from "@/components/ui";
import { DemoChat } from "@/components/assistant/demo-chat";

const sectionTitle = "text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em]";

/** The B2B landing page: Zenn as AI sales & customer service for studios. */
export function Landing({ lang }: { lang: Lang }) {
  const t = landing[lang];
  const id = t.ids;
  const base = lang === "en" ? "/en" : "/isletmeler";
  const channels = contactChannels(company);

  return (
    <div lang={lang}>
      {/* Full-bleed hero, pulled up under the floating header. */}
      <section className="relative -mt-[68px] h-[100svh] max-h-[920px] min-h-[560px] overflow-hidden bg-ink sm:-mt-[76px]">
        <Image
          src={photos.straps.src}
          alt={t.heroAlt}
          placeholder="blur"
          priority
          fill
          sizes="(min-width: 640px) 1px, 100vw"
          className="object-cover object-[50%_30%] sm:hidden"
        />
        <Image
          src={photos.hero.src}
          alt={t.heroAlt}
          placeholder="blur"
          priority
          fill
          sizes="(min-width: 640px) 100vw, 1px"
          className="hidden object-cover object-[60%_40%] sm:block"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/0 to-black/45" aria-hidden />
        <p
          aria-hidden
          className="settle absolute inset-x-0 -bottom-[0.2em] text-center text-[38vw] leading-[0.8] font-bold tracking-[-0.07em] text-paper select-none"
        >
          <span className="inline-block">zenn</span>
        </p>
      </section>

      <section id={id.product} className="scroll-mt-24 py-20 sm:py-28">
        <Container className="text-center">
          <h1 className="mx-auto max-w-4xl text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.045em]">
            {t.intro.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{t.intro.text}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={`${base}#${id.demo}`} variant="ink">
              {t.intro.primary}
            </ButtonLink>
            <ButtonLink href={`${base}#${id.contact}`} variant="ghost">
              {t.intro.secondary}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <h2 className={`text-center ${sectionTitle}`}>{t.pillars.title}</h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.pillars.items.map((p) => (
              <li key={p.title} className="rounded-[24px] bg-card p-6">
                <span className="grid size-9 place-items-center rounded-full bg-ink text-paper" aria-hidden>
                  <Check className="size-4" strokeWidth={3} />
                </span>
                <h3 className="mt-8 text-xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id={id.demo} className="on-ink scroll-mt-20 bg-ink py-20 text-paper sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-paper/30">
              <Sparkles className="size-3.5 text-lime" aria-hidden />
              Demo
            </span>
            <h2 className={`mt-4 ${sectionTitle}`}>{t.demo.title}</h2>
            <p className="mt-4 max-w-md text-lg text-paper/70">{t.demo.lead}</p>
            <ol className="mt-10 space-y-6">
              {t.how.steps.map((s, i) => (
                <li key={s.title} id={i === 0 ? id.how : undefined} className="grid scroll-mt-24 grid-cols-[2.25rem_1fr] gap-3">
                  <span className="text-2xl leading-none font-semibold text-lime tabular-nums">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 text-[15px] text-paper/65">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <DemoChat lang={lang} copy={t.demo} />
        </Container>
      </section>

      <section id={id.trust} className="scroll-mt-24 py-20 sm:py-28">
        <Container>
          <h2 className={sectionTitle}>{t.trust.title}</h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">{t.trust.lead}</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {t.trust.items.map((item) => (
              <li key={item.title} className="rounded-[24px] bg-card p-6 sm:p-7">
                <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-soft">
            <Link href="/kvkk" className="font-semibold text-ink underline underline-offset-4">
              {lang === "tr" ? "KVKK aydınlatma metni" : "Privacy notice (KVKK, in Turkish)"}
            </Link>
          </p>
        </Container>
      </section>

      <section id={id.customer} className="scroll-mt-24 bg-card py-20 sm:py-28">
        <Container>
          <h2 className={sectionTitle}>{t.customer.title}</h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">{t.customer.lead}</p>
          <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {t.customer.facts.map((f) => (
              <div key={f.label} className="rounded-[24px] bg-paper p-6">
                <dt className="text-sm text-ink-soft">{f.label}</dt>
                <dd className="mt-1 text-4xl font-semibold tracking-[-0.04em]">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <div className="rounded-[24px] bg-paper p-7">
              <h3 className="text-xl font-semibold tracking-tight">{t.customer.softwareTitle}</h3>
              <ul className="mt-5 space-y-3">
                {t.customer.software.map((s) => (
                  <li key={s} className="flex gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-moss" aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
              <Link href="/" className="mt-7 inline-block font-semibold underline decoration-2 underline-offset-4">
                {t.customer.link}
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-4">
              {disciplines.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/branslar/${d.slug}`}
                    className="group on-ink relative block aspect-[5/4] overflow-hidden rounded-[24px] bg-ink text-paper"
                  >
                    <DisciplineVisual
                      d={d}
                      sizes="(min-width: 1024px) 300px, 50vw"
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/0" aria-hidden />
                    <p className="absolute inset-x-0 bottom-0 p-4 text-lg font-semibold tracking-tight sm:text-2xl">{d.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="on-ink rounded-[28px] bg-ink p-7 text-paper sm:p-12">
            <Sparkles className="size-7 text-lime" aria-hidden />
            <h2 className={`mt-4 ${sectionTitle}`}>{t.claude.title}</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {t.claude.items.map((item) => (
                <div key={item.title}>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-paper/75">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id={id.contact} className="scroll-mt-24 pb-24 sm:pb-32">
        <Container className="text-center">
          <h2 className={sectionTitle}>{t.contact.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">{t.contact.text}</p>
          {channels.length > 0 ? (
            <ul className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              {channels.map((c, i) => (
                <li key={c.kind}>
                  <a
                    href={c.href}
                    target={c.kind === "phone" || c.kind === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-[15px] font-semibold sm:w-auto ${
                      i === 0 ? "bg-ink text-paper hover:bg-moss" : "ring-1 ring-ink/20 hover:ring-ink/50"
                    }`}
                  >
                    {c.kind === "whatsapp" ? "WhatsApp" : c.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-ink-soft">{t.contact.empty}</p>
          )}
          <p className="mt-8">
            <Link href="/" className="font-semibold underline underline-offset-4">
              {t.contact.studioLink}
            </Link>
          </p>
        </Container>
      </section>
    </div>
  );
}
