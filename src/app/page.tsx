import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { coaches, disciplines, faqs, formats, photos, PRIVATE_GROUP_MAX, studioFormats } from "@/content/site";
import { company, contactChannels } from "@/content/company";
import { ButtonLink, Container } from "@/components/ui";
import { HeroSlideshow, type HeroSlide } from "@/components/home/hero-slideshow";
import { FormatTabs } from "@/components/home/format-tabs";
import { PackagesPicker } from "@/components/home/packages-picker";
import { Quiz } from "@/app/ders-bul/quiz";
import { DisciplineVisual } from "@/components/discipline-visual";
import reformerWide from "@/assets/photos/reformer-wide.jpg";
import reformerKollar from "@/assets/photos/reformer-kollar.jpg";
import kickboksWide from "@/assets/photos/kickboks-wide.jpg";
import kickboksPortre from "@/assets/photos/kickboks-portre.jpg";
import birebirWide from "@/assets/photos/birebir-wide.jpg";
import matPilates from "@/assets/photos/mat-pilates.jpg";
import fonksiyonel from "@/assets/photos/fonksiyonel.jpg";

export const metadata: Metadata = {
  title: { absolute: "Zenn Studio — Reformer, Mat Pilates, Kickboks ve Fonksiyonel antrenman | İstanbul" },
  alternates: { canonical: "/" },
};

const SHORT = Object.fromEntries(formats.map((f) => [f.id, f.short])) as Record<(typeof formats)[number]["id"], string>;
const disciplineName = Object.fromEntries(disciplines.map((d) => [d.slug, d.name]));

const sectionTitle = "text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance";

// The hero's photographs, one per discipline; each opens its page.
const slides: HeroSlide[] = [
  {
    key: "reformer",
    label: "Reformer Pilates",
    href: "/branslar/reformer-pilates",
    wide: { src: reformerWide, alt: photos.hero.alt, position: "60% 40%" },
    tall: { src: reformerKollar, alt: "Reformer üzerinde kollarını kayışlarla yukarı uzatan sporcu", position: "50% 30%" },
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
    label: "Mat Pilates",
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
    title: "Arkadaşlarınla gel",
    text: `Reformer, kickboks ve fonksiyonel antrenmanda ${PRIVATE_GROUP_MAX} kişiye kadar kendi grubunu kur; gün ve saati birlikte belirleyin.`,
  },
  {
    title: "Takipte kalırsın",
    text: "Derslerinden önce SMS ile hatırlatma gelir; hangi gün, hangi saat, kiminle.",
  },
];

/** "/" — the studio's own site on one page: what we teach, how (group / 1–6 people / online on request), with whom, and how to ask for a lesson. */
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
                <span className="sr-only">Zenn Studio: mat pilates ve spinning grup dersleri, reformer pilates, kickboks ve fonksiyonel antrenman. </span>
                Grup dersi de, birebir de.
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
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {disciplines.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/branslar/${d.slug}`}
                  className="group on-ink relative block aspect-[3/4] overflow-hidden rounded-[24px] bg-ink text-paper"
                >
                  <DisciplineVisual
                    d={d}
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/0" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xs font-semibold text-paper/70">{d.formats.filter((f) => f !== "online").map((f) => SHORT[f]).join(", ")}</p>
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
          <h2 className={sectionTitle}>Grupla ya da kendi grubunla</h2>
          <p className="mt-3 max-w-xl text-lg text-paper/70">
            Mat Pilates ve Spinning belli günlerde grup dersi. Reformer Pilates, Kickboks ve Fonksiyonel antrenman tek başına
            ya da {PRIVATE_GROUP_MAX} kişiye kadar küçük grupla.
          </p>
          <div className="mt-10 overflow-x-auto rounded-[24px] bg-paper/[0.06] ring-1 ring-paper/10">
            <table className="w-full min-w-[26rem] text-left">
              <caption className="sr-only">Branşların grup dersi ya da bireysel ve küçük grup olarak yapılabilmesi</caption>
              <thead>
                <tr className="text-sm text-paper/55">
                  <th scope="col" className="px-5 py-4 font-medium">
                    Branş
                  </th>
                  {studioFormats.map((f) => (
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
                    {studioFormats.map((f) => {
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
            <p className="w-fit rounded-full bg-paper px-3 py-1 text-sm font-semibold text-ink-soft">2 soru</p>
            <h2 className={`mt-4 ${sectionTitle}`}>Sana uygun ders</h2>
            <p className="mt-3 max-w-md text-lg text-ink-soft">
              Hedefini ve nasıl çalışmak istediğini söyle; branşını önerelim. Öneriyle talep formu dolu açılır.
            </p>
          </div>
          <div className="rounded-[28px] bg-paper p-5 sm:p-8">
            <Quiz />
          </div>
        </Container>
      </section>

      {/* The coaches: portraits where we have them, their initial until then. */}
      <section id="antrenorler" className="scroll-mt-24 py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <div>
            <h2 className={sectionTitle}>Antrenörlerin</h2>
            <p className="mt-3 max-w-md text-lg text-ink-soft">
              Talebini bıraktığında branşının antrenörü seni arar; ilk dersi birlikte planlarsınız.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {coaches.map((c) => (
              <li key={c.name} className="on-ink relative aspect-[4/5] overflow-hidden rounded-[24px] bg-ink text-paper">
                {c.photo ? (
                  <Image
                    src={c.photo}
                    alt={`Antrenör ${c.name}`}
                    placeholder="blur"
                    fill
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
                    className="object-cover object-[50%_20%]"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute -top-4 -right-2 text-[clamp(8rem,22vw,12rem)] leading-none font-bold tracking-[-0.06em] text-lime/90 select-none"
                  >
                    {c.name.charAt(0)}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/0" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h3 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">{c.name}</h3>
                  <p className="mt-1 text-[13px] leading-snug text-paper/75 sm:text-sm">
                    {c.disciplines.map((s) => disciplineName[s]).join(", ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Packages, chosen in place, with the week they make. */}
      <section id="paketler" className="scroll-mt-24 pb-20 sm:pb-28">
        <Container>
          <h2 className={sectionTitle}>Dersler ve paketler</h2>
          <p className="mt-3 max-w-xl text-lg text-ink-soft">
            Nasıl çalışmak istediğini seç, haftanın nasıl geçeceğini gör; talep formu o seçimle açılsın.
          </p>
          <PackagesPicker />
        </Container>
      </section>

      {/* FAQ: heading beside the questions. */}
      <section id="sss" className="scroll-mt-24 py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2 className={sectionTitle}>Sık sorulanlar</h2>
            <p className="mt-3 max-w-md text-lg text-ink-soft">
              Burada yoksa talep formuna not bırak{whatsapp ? " ya da WhatsApp'tan yaz" : ""}; antrenörümüz döner.
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
              Talep bırakmak iki dakika sürer. Ödeme alınmaz; antrenörümüz seni arayıp gün ve saati birlikte planlar.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/kayit">Ders talebi bırak</ButtonLink>
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
