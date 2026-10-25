import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Check } from "lucide-react";
import { coaches, disciplines, faqs, formats } from "@/content/site";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { ZennWordmark } from "@/components/brand";
import { DisciplineVisual } from "@/components/discipline-visual";
import { HeroPhotos, type HeroSlide } from "@/components/home/hero-photos";
import { WaysToTrain } from "@/components/home/ways-to-train";
import { CoachGrid, type CoachCard } from "@/components/home/coach-grid";
import { QuickRequest } from "@/components/home/quick-request";
import { MobileRequestBar } from "@/components/home/mobile-request-bar";
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
// Coaches without photographs yet are named under the cards, not shown as empty frames.
const otherCoaches = coaches.filter((c) => !c.portrait || !c.action);
const otherBranches = [...new Set(otherCoaches.flatMap((c) => c.disciplines))].map((s) => disciplineName[s]);

function joinTr(words: string[]): string {
  return words.length <= 1 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} ve ${words.at(-1)}`;
}

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
      <section id="top" className="on-ink relative isolate -mt-[68px] flex min-h-[100svh] items-center overflow-hidden bg-ink text-paper sm:-mt-[76px]">
        <HeroPhotos slides={slides} />
        <div aria-hidden className="absolute inset-0 bg-black/45" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        <Container className="relative z-10 pt-32 pb-20 text-center">
          <div className="settle">
            <h1>
              <ZennWordmark className="text-[clamp(3.75rem,14vw,11.5rem)]" />
              <span className="sr-only">: İstanbul&apos;da Mat Pilates, Spinning, Reformer Pilates, Kickboks ve Fonksiyonel antrenman</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-paper/85 sm:text-2xl sm:leading-snug">
              Pilates, kickboks ve fonksiyonel antrenman. Grup dersiyle ya da 6 kişiye kadar özel dersle.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink href="#talep" className="min-h-14 px-8 text-base">
                Ders talebi
              </ButtonLink>
              <ButtonLink href="#dersler" variant="outline" className="min-h-14 px-8 text-base">
                Dersler
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Dersler: five big photo cards, centred (3 + 2 on a wide screen). */}
      <section id="dersler" className="scroll-mt-24 py-24 sm:py-32">
        <Container>
          <SectionHeading title="Dersler" lead="Beş branş. Belli günlerde grup dersi ya da 1-6 kişilik özel ders." />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {disciplines.map((d, i) => (
              <li key={d.slug} className={`lg:col-span-2 ${i === 3 ? "lg:col-start-2" : ""} ${i === 4 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
                <Link
                  href={`/branslar/${d.slug}`}
                  className={`group on-ink @container relative block overflow-hidden rounded-[28px] bg-ink text-paper ${i === 4 ? "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[4/5]" : "aspect-[4/5]"}`}
                >
                  <DisciplineVisual
                    d={d}
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/0" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-center">
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

      {/* Two ways to train, side by side. */}
      <section id="paketler" className="scroll-mt-24 bg-card/60 py-24 sm:py-32">
        <Container>
          <SectionHeading title="Nasıl çalışırsın" lead="Fiyatı seni aradığımızda paylaşırız. Ödeme alınmaz." />
          <div className="mt-14">
            <WaysToTrain />
          </div>
        </Container>
      </section>

      {/* Coaches: a clean row of portraits; hover or tap for a photo from a lesson. */}
      <section id="antrenorler" className="scroll-mt-24 py-24 sm:py-32">
        <Container>
          <SectionHeading title="Antrenörler" lead="Derslerin bu ekiple. Fotoğrafın üzerine gel ya da dokun; derste nasıl çalıştıklarını gör." />
          <div className="mt-14">
            <CoachGrid coaches={coachCards} />
          </div>
          {otherCoaches.length > 0 && (
            <p className="mx-auto mt-12 max-w-2xl text-center text-lg text-ink-soft">
              {joinTr(otherCoaches.map((c) => c.name))} de ekipte: {joinTr(otherBranches)}.
            </p>
          )}
        </Container>
      </section>

      {/* The request, centred: the form goes straight to the studio's CRM. */}
      <section id="talep" className="on-ink scroll-mt-24 bg-ink py-24 text-paper sm:py-32">
        <Container>
          <SectionHeading
            tone="paper"
            title="İlk dersini birlikte planlayalım."
            lead="Formu bırak, antrenörün seni arasın. Uygun gün ve saatini yazarsan sana göre bir ders önerelim."
          />
          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3 text-[16px] text-paper/85">
            {["Ödeme alınmaz", "Grup dersi ya da 1-6 kişilik özel ders", "Talebin doğrudan stüdyo ekibine gider"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-lime text-ink">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-12 max-w-2xl text-ink">
            <QuickRequest />
          </div>
        </Container>
      </section>

      {/* Questions, one centred column. */}
      <section id="sss" className="scroll-mt-24 py-24 sm:py-32">
        <Container>
          <SectionHeading title="Sık sorulanlar" />
          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-[24px] bg-card px-6 py-5 open:pb-6">
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
    </>
  );
}
