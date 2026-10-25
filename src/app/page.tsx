import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { coaches, disciplines, faqs, formats } from "@/content/site";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { ZennWordmark } from "@/components/brand";
import { company } from "@/content/company";
import { DisciplineVisual } from "@/components/discipline-visual";
import { HeroPhotos, type HeroSlide } from "@/components/home/hero-photos";
import { RequestWizard } from "@/components/home/request-wizard";
import { Planner } from "@/components/home/planner";
import { CoachGrid, type CoachCard } from "@/components/home/coach-grid";
import { MobileRequestBar } from "@/components/home/mobile-request-bar";
import { SectionSnap } from "@/components/home/section-snap";
import reformerWide from "@/assets/photos/reformer-wide.jpg";
import reformerTeaser from "@/assets/photos/reformer-teaser.jpg";
import kickboksWide from "@/assets/photos/kickboks-wide.jpg";
import kickboksTorba from "@/assets/photos/kickboks-torba.jpg";
import birebirWide from "@/assets/photos/birebir-wide.jpg";
import matGrup from "@/assets/photos/mat-grup.jpg";
import fonksiyonel from "@/assets/photos/fonksiyonel.jpg";
import zeynepDers from "@/assets/photos/zeynep-ders.jpg";

export const metadata: Metadata = {
  title: { absolute: "Zenn Studio | Pilates, Kickboks ve Fonksiyonel antrenman, İstanbul" },
  alternates: { canonical: "/" },
};

// One big photograph at a time: landscape crops for wide screens, portrait for phones.
const slides: HeroSlide[] = [
  { wide: { src: reformerWide, alt: "", position: "60% 40%" }, tall: { src: reformerTeaser, alt: "", position: "50% 55%" } },
  { wide: { src: kickboksWide, alt: "", position: "55% 35%" }, tall: { src: kickboksTorba, alt: "", position: "45% 30%" } },
  { wide: { src: birebirWide, alt: "", position: "50% 45%" }, tall: { src: matGrup, alt: "", position: "50% 55%" } },
  { wide: { src: fonksiyonel, alt: "", position: "50% 45%" }, tall: { src: zeynepDers, alt: "", position: "50% 40%" } },
];

const SHORT = Object.fromEntries(formats.map((f) => [f.id, f.short])) as Record<(typeof formats)[number]["id"], string>;
const disciplineName = Object.fromEntries(disciplines.map((d) => [d.slug, d.name]));

const coachCards: CoachCard[] = coaches.flatMap((c) =>
  c.portrait && c.action
    ? [{ name: c.name, branches: c.disciplines.map((s) => disciplineName[s]).join(", "), portrait: c.portrait, action: c.action }]
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
      {/* Hero: one big photograph, changing on its own, the name and the request over it. */}
      <section id="top" className="on-ink relative isolate -mt-[68px] flex min-h-[100svh] snap-start items-end overflow-hidden bg-ink text-paper sm:-mt-[76px]">
        <div className="hero-drift absolute inset-0">
          <HeroPhotos slides={slides} />
        </div>
        <div aria-hidden className="absolute inset-0 bg-black/25" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/30 to-transparent" />
        <Container className="hero-out relative z-10 pt-32 pb-16 sm:pb-20">
          <div className="settle max-w-2xl">
            <h1>
              <ZennWordmark className="text-[clamp(2.75rem,7vw,5.5rem)]" />
              <span className="sr-only">: İstanbul&apos;da Mat Pilates, Spinning, Reformer Pilates, Kickboks ve Fonksiyonel antrenman</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/85 sm:text-xl">
              Pilates, kickboks ve fonksiyonel antrenman. Grup dersiyle ya da 6 kişiye kadar özel dersle.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#talep" className="min-h-14 px-8 text-base">
                Ders talebi
              </ButtonLink>
              <ButtonLink href="#hizmetler" variant="outline" className="min-h-14 px-8 text-base">
                Hizmetlerimiz
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Hizmetlerimiz: five big photo cards, centred (3 + 2 on a wide screen); on a phone a row to swipe through. */}
      <section id="hizmetler" className={`scroll-mt-24 py-24 sm:py-32 ${screen}`}>
        <Container className="fit leave lg:max-w-7xl">
          <SectionHeading title="Hizmetlerimiz" lead="Beş branş. Belli günlerde grup dersi ya da 1-6 kişilik özel ders." />
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
                    <p className="mx-auto w-fit rounded-full bg-paper/15 px-3 py-1 text-[13px] font-semibold backdrop-blur">
                      {d.formats.filter((f) => f !== "online").map((f) => SHORT[f]).join(", ")}
                    </p>
                    <h3 className="mt-3 text-[2rem] leading-[1.02] font-semibold tracking-[-0.035em]">{d.name}</h3>
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
          <SectionHeading title="Antrenörler" lead="Derslerin bu ekiple. Fotoğrafın üzerine gel ya da dokun." />
          <div className="mt-14 lg:mt-10">
            <CoachGrid coaches={coachCards} />
          </div>
        </Container>
      </section>

      {/* Six questions, one plan: the right lesson and way to train, then WhatsApp. */}
      <section id="plan" className={`on-ink scroll-mt-24 bg-ink py-24 text-paper sm:py-32 ${screen}`}>
        <Container className="fit leave">
          <SectionHeading
            tone="paper"
            title="İlk dersini birlikte planlayalım."
            lead="Altı kısa soru. Cevaplarına göre sana uygun dersi ve çalışma biçimini önerelim."
          />
          <div className="rise mt-12 lg:mt-8">
            <Planner />
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

      <MobileRequestBar />
      <SectionSnap />
    </>
  );
}
