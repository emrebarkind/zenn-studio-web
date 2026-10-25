import type { Metadata } from "next";
import { Check } from "lucide-react";
import { coaches, disciplines, faqs, formats, ringPhotos } from "@/content/site";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { ZennWordmark } from "@/components/brand";
import { HeroRing } from "@/components/home/hero-ring";
import { DisciplineAccordion, type AccordionItem } from "@/components/home/discipline-accordion";
import { WaysToTrain } from "@/components/home/ways-to-train";
import { CoachCards, type CoachCard } from "@/components/home/coach-cards";
import { QuickRequest } from "@/components/home/quick-request";
import { MobileRequestBar } from "@/components/home/mobile-request-bar";

export const metadata: Metadata = {
  title: { absolute: "Zenn Studio | Pilates, Kickboks ve Fonksiyonel antrenman, İstanbul" },
  alternates: { canonical: "/" },
};

const SHORT = Object.fromEntries(formats.map((f) => [f.id, f.short])) as Record<(typeof formats)[number]["id"], string>;
const disciplineName = Object.fromEntries(disciplines.map((d) => [d.slug, d.name]));

const accordion: AccordionItem[] = disciplines.map((d) => ({
  ...d,
  formatLabel: d.formats.filter((f) => f !== "online").map((f) => SHORT[f]).join(", "),
  coachLine: d.coaches.length ? `Antrenörler: ${d.coaches.join(", ")}` : null,
}));

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
 * "/": the studio on one page. The photographs and the name first, then the
 * five disciplines, the two ways to train, the coaches, a three-field request
 * form that goes straight to the CRM, and the questions people ask.
 */
export default function StudioHome() {
  return (
    <>
      {/* Hero: the studio's photographs flow round a ring behind the name. Pulled up under the floating header. */}
      <section id="top" className="on-ink relative isolate -mt-[68px] min-h-[100svh] overflow-hidden bg-ink text-paper sm:-mt-[76px]">
        <HeroRing photos={ringPhotos} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ink via-ink/85 to-ink/0"
        />
        <Container className="relative z-10 flex min-h-[100svh] flex-col justify-end pt-40 pb-10 sm:pb-14">
          <div className="settle">
            <h1>
              <ZennWordmark className="text-[clamp(3.6rem,15vw,13rem)]" />
              <span className="sr-only">: İstanbul&apos;da Mat Pilates, Spinning, Reformer Pilates, Kickboks ve Fonksiyonel antrenman</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/75 sm:text-xl">
              Mat Pilates ve Spinning grup dersleri. Reformer, Kickboks ve Fonksiyonel antrenman, tek başına ya da 6 kişiye kadar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="#talep">Ders talebi</ButtonLink>
              <ButtonLink href="#dersler" variant="outline">
                Dersler
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Dersler: photo panels that open up. */}
      <section id="dersler" className="scroll-mt-24 py-24 sm:py-32">
        <Container>
          <SectionHeading title="Dersler" lead="Beş branş, iki şekilde: belli günlerde grup dersi ya da 1-6 kişilik özel ders." />
          <div className="mt-12">
            <DisciplineAccordion items={accordion} />
          </div>
        </Container>
      </section>

      {/* Two ways to train, side by side. */}
      <section id="paketler" className="scroll-mt-24 pb-24 sm:pb-32">
        <Container>
          <SectionHeading title="Nasıl çalışırsın" lead="Fiyatı seni aradığımızda paylaşırız. Ödeme alınmaz." />
          <div className="mt-12">
            <WaysToTrain />
          </div>
        </Container>
      </section>

      {/* Coaches: two photographs each. */}
      <section id="antrenorler" className="on-ink scroll-mt-24 overflow-hidden bg-ink py-24 text-paper sm:py-32">
        <Container>
          <SectionHeading
            tone="paper"
            title="Antrenörler"
            lead="Derslerin bu ekiple. Fotoğrafa dokun ya da üzerine gel; derste nasıl çalıştıklarını gör."
          />
          <div className="mt-12 lg:pb-12">
            <CoachCards coaches={coachCards} />
          </div>
          {otherCoaches.length > 0 && (
            <p className="mt-10 max-w-2xl text-lg text-paper/70">
              {joinTr(otherCoaches.map((c) => c.name))} de ekipte: {joinTr(otherBranches)}.
            </p>
          )}
        </Container>
      </section>

      {/* The request: three fields, straight to the studio's CRM. */}
      <section id="talep" className="scroll-mt-24 py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:sticky lg:top-28 lg:col-span-5">
            <SectionHeading
              size="md"
              title="İlk dersini birlikte planlayalım."
              lead="Formu bırak, antrenörün seni arasın. Günü, saati ve fiyatı telefonda konuşuruz."
            />
            <ul className="mt-8 space-y-3 text-[17px]">
              {["Ödeme alınmaz.", "Grup dersi ya da 1-6 kişilik özel ders.", "Talebin doğrudan stüdyonun ekibine gider."].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-lime">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <QuickRequest />
          </div>
        </Container>
      </section>

      {/* Questions, in two columns. */}
      <section id="sss" className="scroll-mt-24 pb-24 sm:pb-32">
        <Container>
          <SectionHeading title="Sık sorulanlar" />
          <div className="mt-12 grid gap-3 md:grid-cols-2">
            {faqs.map((f) => (
              <details key={f.q} className="group h-fit rounded-[24px] bg-card px-6 py-5 open:pb-6">
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
