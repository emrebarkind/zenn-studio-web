import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { coaches, coachingFlow, comingSoon, disciplines, faqs, formats, photos, type FormatId } from "@/content/site";
import { company, contactChannels } from "@/content/company";
import { ButtonLink, Container } from "@/components/ui";
import { HeroSlideshow, type HeroSlide } from "@/components/home/hero-slideshow";
import { FormatTabs } from "@/components/home/format-tabs";
import { PackagesPicker } from "@/components/home/packages-picker";
import { Quiz } from "@/app/ders-bul/quiz";
import reformerWide from "@/assets/photos/reformer-wide.jpg";
import reformerStraps from "@/assets/photos/hero.jpg";
import kickboksWide from "@/assets/photos/kickboks-wide.jpg";
import kickboksPortre from "@/assets/photos/kickboks-portre.jpg";
import birebirWide from "@/assets/photos/birebir-wide.jpg";
import matPilates from "@/assets/photos/mat-pilates.jpg";
import fonksiyonel from "@/assets/photos/fonksiyonel.jpg";

export const metadata: Metadata = {
  title: { absolute: "Zenn Studio — Reformer, Mat Pilates, Kickboks ve online antrenman | İstanbul" },
  alternates: { canonical: "/" },
};

const formatName = Object.fromEntries(formats.map((f) => [f.id, f.name])) as Record<FormatId, string>;
const SHORT: Record<FormatId, string> = { studio: "Stüdyoda", live: "Canlı online", coaching: "Program" };
const disciplineName = Object.fromEntries(disciplines.map((d) => [d.slug, d.name]));

const sectionTitle = "text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance";

// The hero's photographs, one per discipline; each opens its page.
const slides: HeroSlide[] = [
  {
    key: "reformer",
    label: "Reformer Pilates",
    href: "/branslar/reformer-pilates",
    wide: { src: reformerWide, alt: photos.hero.alt, position: "60% 40%" },
    tall: { src: reformerStraps, alt: photos.straps.alt, position: "50% 30%" },
  },
  {
    key: "kickboks",
    label: "Kickboks",
    href: "/branslar/kickboks",
    wide: { src: kickboksWide, alt: photos.kickboks.alt, position: "55% 35%" },
    tall: { src: kickboksPortre, alt: "Eldivenleriyle gard alan kickboksçu", position: "50% 30%" },
  },
  {
    key: "mat",
    label: "Mat Pilates ve birebir",
    href: "/branslar/mat-pilates",
    wide: { src: birebirWide, alt: photos.coaching.alt, position: "50% 45%" },
    tall: { src: matPilates, alt: "Mat üzerinde esneme yapan üyenin duruşunu düzelten antrenör", position: "50% 40%" },
  },
  {
    key: "fonksiyonel",
    label: "Fonksiyonel antrenman",
    href: "/branslar/fonksiyonel-antrenman",
    wide: { src: fonksiyonel, alt: "Antrenörüyle birlikte matta egzersiz yapan üye", position: "50% 45%" },
    tall: { src: fonksiyonel, alt: "Antrenörüyle birlikte matta egzersiz yapan üye", position: "45% 50%" },
  },
];

const reasons = [
  {
    title: "Seni tanıyan antrenör",
    text: "Gruplarımız küçük. Antrenörün adını, seviyeni ve hedefini bilir; hareketini yerinde düzeltir.",
  },
  {
    title: "Ekipmanla ya da ekipmansız",
    text: "Reformer stüdyoda. Mat pilates, kickboks ve fonksiyonel antrenmanı evde de sürdürebilirsin.",
  },
  {
    title: "Takipte kalırsın",
    text: "Derslerinden önce SMS hatırlatma, online programda haftalık değerlendirme.",
  },
];

/** "/" — the studio's own site on one page: what we teach, how, with whom, and how to start. */
export default function StudioHome() {
  const whatsapp = contactChannels(company).find((c) => c.kind === "whatsapp");

  return (
    <>
      {/* Hero: the studio's photographs change on their own; pulled up under the floating header. */}
      <section
        id="top"
        className="on-ink relative -mt-[68px] flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-paper sm:-mt-[76px] lg:max-h-[960px]"
      >
        <HeroSlideshow slides={slides} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/5 to-black/75" aria-hidden />

        <Container className="relative z-10 pt-40 pb-8 sm:pb-12">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="settle">
              <p aria-hidden className="text-[clamp(5.5rem,22vw,17rem)] leading-[0.78] font-bold tracking-[-0.07em] select-none">
                zenn
              </p>
              <h1 className="mt-5 text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance">
                <span className="sr-only">Zenn Studio: reformer pilates, mat pilates, kickboks ve online antrenman. </span>
                Stüdyoda. Evinde. Programında.
              </h1>
            </div>
            <FormatTabs />
          </div>
        </Container>
      </section>

      {/* Branşlar */}
      <section id="branslar" className="scroll-mt-24 py-20 sm:py-28">
        <Container>
          <h2 className={sectionTitle}>Branşlar</h2>
          <p className="mt-3 max-w-xl text-lg text-ink-soft">Her birinde aynı ilke: doğru teknik, küçük grup, sana göre tempo.</p>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {disciplines.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/branslar/${d.slug}`}
                  className="group on-ink relative block aspect-[3/4] overflow-hidden rounded-[24px] bg-ink text-paper"
                >
                  <Image
                    src={d.photo.src}
                    alt={d.photo.alt}
                    placeholder="blur"
                    fill
                    sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/0" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xs font-semibold text-paper/70">{d.formats.map((f) => SHORT[f]).join(", ")}</p>
                    <h3 className="mt-1 text-3xl font-semibold tracking-[-0.035em]">{d.name}</h3>
                    <p className="mt-1 text-[15px] text-paper/75">{d.tagline}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* One membership, three ways: which discipline runs in which format, and with whom. */}
      <section className="on-ink bg-ink py-20 text-paper sm:py-28">
        <Container>
          <h2 className={sectionTitle}>Tek üyelik, üç yol</h2>
          <p className="mt-3 max-w-xl text-lg text-paper/70">
            Stüdyoya gel, evinden canlı katıl ya da sana yazılmış programla çalış. Hayatın değiştikçe formatını değiştir;
            antrenörün aynı kalır.
          </p>
          <div className="mt-10 overflow-x-auto rounded-[24px] bg-paper/[0.06] ring-1 ring-paper/10">
            <table className="w-full min-w-[34rem] text-left">
              <caption className="sr-only">Branşların stüdyoda, canlı online ve online programda yapılabilmesi</caption>
              <thead>
                <tr className="text-sm text-paper/55">
                  <th scope="col" className="px-5 py-4 font-medium">
                    Branş
                  </th>
                  {formats.map((f) => (
                    <th key={f.id} scope="col" className="px-3 py-4 text-center font-medium">
                      {SHORT[f.id]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disciplines.map((d) => (
                  <tr key={d.slug} className="border-t border-paper/10">
                    <th scope="row" className="px-5 py-4 font-normal">
                      <Link href={`/branslar/${d.slug}`} className="text-lg font-semibold tracking-tight hover:underline">
                        {d.name}
                      </Link>
                      {d.coaches.length ? <span className="block text-sm text-paper/55">{d.coaches.join(", ")}</span> : null}
                    </th>
                    {formats.map((f) => {
                      const yes = d.formats.includes(f.id);
                      return (
                        <td key={f.id} className="px-3 py-4 text-center">
                          <span
                            className={`inline-grid size-8 place-items-center rounded-full ${yes ? "bg-lime text-ink" : "text-paper/35"}`}
                          >
                            {yes ? <Check className="size-4" strokeWidth={3} aria-hidden /> : <Minus className="size-4" aria-hidden />}
                            <span className="sr-only">{yes ? "Var" : "Yok"}</span>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-12 grid gap-8 sm:grid-cols-3">
            {reasons.map((r) => (
              <li key={r.title} className="border-t border-paper/15 pt-5">
                <h3 className="text-xl font-semibold tracking-tight">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/65">{r.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* The 3-question finder, in place. */}
      <section id="ders-bul" className="scroll-mt-24 bg-card py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
          <div>
            <p className="w-fit rounded-full bg-paper px-3 py-1 text-sm font-semibold text-ink-soft">3 soru</p>
            <h2 className={`mt-4 ${sectionTitle}`}>Sana uygun ders</h2>
            <p className="mt-3 max-w-md text-lg text-ink-soft">
              Hedefini ve programını söyle; branşını ve formatını önerelim. Öneriyle ön kayıt formu dolu açılır.
            </p>
          </div>
          <div className="rounded-[28px] bg-paper p-5 sm:p-8">
            <Quiz />
          </div>
        </Container>
      </section>

      {/* The coaches, as type. */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2 className={sectionTitle}>Antrenörlerin</h2>
            <p className="mt-3 max-w-md text-lg text-ink-soft">
              Her branşın kendi antrenörü var. Stüdyoda da online&apos;da da aynı kişiyle çalışırsın.
            </p>
          </div>
          <ul>
            {coaches.map((c) => (
              <li key={c.name} className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-4 first:border-t">
                <span className="text-[clamp(2.25rem,6vw,4rem)] leading-none font-semibold tracking-[-0.045em]">{c.name}</span>
                <span className="text-right text-sm font-medium text-ink-soft">
                  {c.disciplines.map((s) => disciplineName[s]).join(", ")}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Packages, chosen in place, with the week they make. */}
      <section id="paketler" className="scroll-mt-24 pb-20 sm:pb-28">
        <Container>
          <h2 className={sectionTitle}>Paketler</h2>
          <p className="mt-3 max-w-xl text-lg text-ink-soft">
            Paketini seç, haftanın nasıl geçeceğini gör; ön kayıt formu o paketle açılsın.
          </p>
          <PackagesPicker />
        </Container>
      </section>

      {/* Zenn Online */}
      <section id="online" className="on-ink scroll-mt-24 bg-ink text-paper">
        <div className="relative h-[52vh] min-h-[360px] overflow-hidden">
          <Image
            src={photos.coaching.src}
            alt={photos.coaching.alt}
            placeholder="blur"
            fill
            sizes="100vw"
            className="object-cover object-[50%_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" aria-hidden />
          <Container className="relative flex h-full flex-col justify-end pb-10">
            <p className="text-sm font-semibold text-lime">Zenn Online</p>
            <h2 className="mt-2 max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance">
              Antrenörün, ekranın öbür ucunda.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-paper/70">
              Online derslerimiz video izlemek değil: antrenörün seni görür, düzeltir ve ilerlemeni takip eder.
            </p>
          </Container>
        </div>
        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">Online personal training nasıl işliyor</h3>
            <ol className="mt-6 space-y-6">
              {coachingFlow.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-t border-paper/10 pt-5">
                  <span className="text-2xl font-semibold text-lime tabular-nums">{i + 1}</span>
                  <span>
                    <span className="block text-lg font-semibold">{step.title}</span>
                    <span className="mt-1 block text-[15px] text-paper/65">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">Platformda neler var</h3>
            <ul className="mt-6 space-y-3">
              {formats
                .filter((f) => f.id !== "studio")
                .map((f) => (
                  <li key={f.id} className="rounded-[20px] bg-paper/[0.06] p-5 ring-1 ring-paper/10">
                    <p className="flex items-center justify-between gap-3 font-semibold">
                      {formatName[f.id]}
                      <span className="flex items-center gap-1.5 rounded-full bg-lime px-2.5 py-0.5 text-xs font-semibold text-ink">
                        <span className="live-dot size-1.5 rounded-full bg-ink" aria-hidden />
                        Yayında
                      </span>
                    </p>
                    <p className="mt-1 text-[15px] text-paper/65">{f.summary}</p>
                  </li>
                ))}
            </ul>
            <p className="mt-8 text-sm font-semibold text-paper/55">Yakında</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {comingSoon.map((c) => (
                <li key={c.name} className="rounded-full px-3 py-1.5 text-sm text-paper/75 ring-1 ring-paper/20">
                  {c.name}
                </li>
              ))}
            </ul>
            <ButtonLink href="/online" variant="light" className="mt-8">
              Zenn Online&apos;ı incele
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* FAQ: heading beside the questions. */}
      <section id="sss" className="scroll-mt-24 py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2 className={sectionTitle}>Sık sorulanlar</h2>
            <p className="mt-3 max-w-md text-lg text-ink-soft">
              Burada yoksa ön kayıtta not bırak{whatsapp ? " ya da WhatsApp'tan yaz" : ""}; antrenörümüz döner.
            </p>
          </div>
          <div>
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-ink/10 py-5 first:border-t">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform group-open:rotate-45"
                    aria-hidden
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

      {/* Closing call. */}
      <section className="on-ink bg-ink py-20 text-paper sm:py-28">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h2 className="max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance">
              İlk dersini birlikte planlayalım.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-paper/70">
              Ön kayıt iki dakika sürer. Ödeme şimdi alınmaz; antrenörümüz seni arayıp ilk dersini birlikte planlar.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/kayit">Ön kayıt yap</ButtonLink>
            {whatsapp ? (
              <a
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-paper ring-1 ring-paper/30 transition-colors hover:ring-paper/60"
              >
                WhatsApp&apos;tan yaz
              </a>
            ) : null}
          </div>
        </Container>
      </section>
    </>
  );
}
