import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, ChevronsDown } from "lucide-react";
import { coaches, disciplines, faqs, studioLocation } from "@/content/site";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { company } from "@/content/company";
import { DisciplineVisual } from "@/components/discipline-visual";
import { HeroVideo } from "@/components/home/hero-video";
import { RequestWizard } from "@/components/home/request-wizard";
import { Planner } from "@/components/home/planner";
import { CoachGrid, type CoachCard } from "@/components/home/coach-grid";
import { MobileRequestBar } from "@/components/home/mobile-request-bar";
import { jsonLdScript, studioJsonLd } from "@/lib/structured-data";
import { SectionSnap } from "@/components/home/section-snap";
import { FindUs } from "@/components/home/find-us";

export const metadata: Metadata = {
  title: { absolute: "Tekirdağ Pilates, Reformer ve Kickboks | Zenn Studio" },
  description:
    "Tekirdağ Süleymanpaşa'da pilates ve spor stüdyosu: Mat Pilates ve Spinning grup dersleri; Mat ve Reformer Pilates, Kickboks ve Fonksiyonel antrenmanda 1-6 kişilik dersler. Ders talebini bırak, seni arayalım.",
  alternates: { canonical: "/" },
};


const disciplineName = Object.fromEntries(disciplines.map((d) => [d.slug, d.name]));

const coachCards: CoachCard[] = coaches.flatMap((c) =>
  c.portrait && c.action
    ? [{ name: c.name, surname: c.surname, areas: c.areas ?? c.disciplines.map((s) => disciplineName[s]), portrait: c.portrait, action: c.action }]
    : [],
);
// On a wide screen every section is one screen tall and the page settles on
// each one as you scroll (globals.css), so each reads like a page of its own.
const screen = "lg:flex lg:min-h-svh lg:snap-start lg:scroll-mt-0 lg:flex-col lg:justify-center lg:pt-24 lg:pb-12";

/**
 * "/": the studio on one page, down the middle. One big photograph with the
 * name over it, the five lessons, the two ways to train, the coaches, a short
 * request form (with the days and hours that suit) that goes straight to the
 * CRM, and the questions people ask.
 */
export default function StudioHome() {
  return (
    <>
      {/* Hero: a looping pilates video, the slogan large and centred near the bottom, the way down (owner, 2026-10-25). */}
      <section id="top" className="on-ink relative isolate -mt-[68px] flex min-h-[100svh] snap-start items-end overflow-hidden bg-ink text-paper sm:-mt-[76px]">
        <div className="hero-drift absolute inset-0">
          <HeroVideo />
        </div>
        <div aria-hidden className="absolute inset-0 bg-black/30" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <Container className="hero-out relative z-10 pt-32 pb-8 text-center sm:pb-10">
          <div className="settle mx-auto max-w-6xl">
            <h1 className="text-[clamp(2.1rem,8vw,3rem)] leading-[0.95] font-extrabold tracking-[-0.035em] text-balance text-lime uppercase sm:text-[clamp(2rem,4.9vw,4.5rem)] sm:whitespace-nowrap">
              Her gün, daha güçlü bir sen.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-paper/90 sm:text-xl">
              Tekirdağ Süleymanpaşa&apos;da pilates, spinning, kickboks ve fonksiyonel antrenman. Seviyen ne olursa olsun seni tanıyor,
              kendi temponda ve adım adım ilerletiyoruz.
            </p>
            {/* Phones have no request button in the header; the hero carries it. */}
            <ButtonLink href="#talep" className="mt-7 min-h-13 px-8 text-base sm:hidden">
              Ders talebi
            </ButtonLink>
            <a href="#hizmetler" aria-label="Hizmetlerimize in" className="mx-auto mt-6 grid size-12 place-items-center text-lime sm:mt-8">
              <ChevronsDown className="size-8 motion-safe:animate-bounce" strokeWidth={2.25} aria-hidden />
            </a>
          </div>
        </Container>
      </section>

      {/* Hizmetlerimiz: five big photo cards, centred (3 + 2 on a wide screen); on a phone a row to swipe through. */}
      <section id="hizmetler" className={`scroll-mt-24 py-24 sm:py-32 ${screen}`}>
        <Container className="fit leave lg:max-w-7xl">
          <SectionHeading title="Hizmetlerimiz" lead="Beş branşta ders veriyoruz. Birine dokun, nasıl çalıştığımızı gör." />
          <ul className="rise -mx-4 mt-12 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-14 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-10 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
            {disciplines.map((d, i) => (
              <li key={d.slug} className={`w-[80%] shrink-0 snap-start sm:w-auto ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <Link
                  href={`/branslar/${d.slug}`}
                  className={`group on-ink @container relative block overflow-hidden bg-ink text-paper ${i === 4 ? "aspect-[4/5] sm:aspect-[16/9]" : "aspect-[4/5]"} rounded-[22px] sm:rounded-[28px] lg:aspect-auto lg:h-[clamp(320px,56svh,580px)]`}
                >
                  <DisciplineVisual
                    d={d}
                    morph
                    sizes="(min-width: 1024px) 250px, (min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/0" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-center lg:p-5">
                    {/* Only a lesson that runs solely as a group class says so (Spinning). */}
                    {d.formats.every((f) => f === "group") && (
                      <p className="mx-auto mb-3 w-fit rounded-full bg-paper/15 px-3 py-1 text-[13px] font-semibold backdrop-blur">Grup dersi</p>
                    )}
                    <h3 className="text-[2rem] leading-[1.02] font-semibold tracking-[-0.035em]">{d.name}</h3>
                    <p className="mt-1.5 text-[15px] text-paper/80">{d.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lime">
                      İncele
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* The request in three steps: days, lesson, name, then WhatsApp. */}
      <section id="talep" className={`scroll-mt-24 bg-card/60 py-24 sm:py-32 ${screen}`}>
        <Container className="fit leave">
          <SectionHeading title="Nasıl çalışırsın" lead={`Üç adımda: günü seç, dersi seç, adını yaz. ${company.whatsapp ? "Gerisini WhatsApp'ta konuşalım." : "Antrenörümüz seni arasın."}`} />
          <div className="rise mt-12 lg:mt-8">
            <RequestWizard />
          </div>
        </Container>
      </section>

      {/* Coaches: big portraits, three to a row; hover or tap for a second one. */}
      <section id="antrenorler" className={`scroll-mt-24 py-24 sm:py-32 ${screen}`}>
        <Container className="fit leave lg:max-w-[1400px]">
          <SectionHeading title="Eğitmen Kadromuz" lead="Derslerimizi bu ekip veriyor. Fotoğrafın üzerine gel ya da dokun." />
          <div className="mt-14 lg:mt-10">
            <CoachGrid coaches={coachCards} />
          </div>
        </Container>
      </section>

      {/* The intake: short questions to get to know the visitor, their answers said back, then the request on their say-so. */}
      <section id="plan" className={`on-ink scroll-mt-24 bg-ink py-24 text-paper sm:py-32 ${screen}`}>
        <Container className="fit leave">
          <SectionHeading
            tone="paper"
            title="Sana uygun dersi birlikte seçelim."
            lead="Birkaç kısa soruyla seni tanıyalım. Cevaplarını antrenörlerimiz okuyor; ilk dersini seninle birlikte planlıyoruz."
          />
          <div className="rise mt-12 lg:mt-8">
            <Planner />
          </div>
        </Container>
      </section>

      {/* Where we are: the map, toned to the site, with the address and directions. */}
      <section id="konum" className={`scroll-mt-24 py-24 sm:py-32 ${screen}`}>
        <Container className="fit leave">
          <SectionHeading
            title="Bizi nerede bulabilirsin?"
            lead={`${studioLocation.district}'da, Şehit Mesut Bakan Caddesi'ndeyiz. Yol tarifini haritadan alabilir, gelmeden önce WhatsApp'tan bize yazabilirsin.`}
          />
          <div className="rise mt-12 lg:mt-8">
            <FindUs />
          </div>
        </Container>
      </section>

      {/* Questions, one centred column. */}
      <section id="sss" className={`scroll-mt-24 py-24 sm:py-32 ${screen}`}>
        <Container className="fit leave">
          <SectionHeading title="Sık sorulanlar" />
          <div className="mx-auto mt-12 max-w-3xl space-y-3 lg:mt-8">
            {faqs.map((f) => (
              <details key={f.q} className="rise group rounded-[24px] bg-card px-6 py-5 open:pb-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-paper text-xl transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(studioJsonLd()) }} />
      <MobileRequestBar />
      <SectionSnap />
    </>
  );
}
