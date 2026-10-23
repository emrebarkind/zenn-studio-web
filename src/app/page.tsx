import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { disciplines, faqs, formats, photos } from "@/content/site";
import { ButtonLink, Container } from "@/components/ui";
import reformerPhoto from "@/assets/photos/reformer.jpg";

const formatName = Object.fromEntries(formats.map((f) => [f.id, f.name]));

const reasons = [
  {
    title: "Tek üyelik, üç yol",
    text: "Stüdyoya gel, evinden canlı katıl ya da sana yazılmış programla çalış. Hayatın değiştikçe formatını değiştir.",
  },
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

const sectionTitle = "text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em]";

/** Full-width rounded photo card with copy laid over a bottom gradient. */
function PhotoCard({
  photo,
  href,
  label,
  title,
  text,
  linkText,
  tall,
}: {
  photo: { src: StaticImageData; alt: string };
  href: string;
  label: string;
  title: string;
  text: string;
  linkText: string;
  tall?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group on-ink relative block overflow-hidden rounded-[28px] bg-ink text-paper ${
        tall ? "h-[520px] sm:h-[560px]" : "h-[340px] sm:h-[280px]"
      }`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        placeholder="blur"
        fill
        sizes="(min-width: 1152px) 1104px, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/0" aria-hidden />
      <div className={`absolute inset-x-0 bottom-0 p-6 sm:p-9 ${tall ? "" : "sm:flex sm:items-center sm:gap-6"}`}>
        <span className="inline-block shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-paper/40">
          {label}
        </span>
        <h3
          className={`font-semibold tracking-[-0.035em] ${
            tall ? "mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[1.02]" : "mt-3 text-3xl sm:mt-0 sm:shrink-0"
          }`}
        >
          {title}
        </h3>
        <p className={`text-paper/75 ${tall ? "mt-3 max-w-md text-lg" : "mt-2 max-w-sm sm:mt-0"}`}>{text}</p>
        <span
          className={`inline-block font-semibold underline decoration-2 underline-offset-4 ${
            tall ? "mt-5" : "mt-4 sm:mt-0 sm:ml-auto sm:shrink-0"
          }`}
        >
          {linkText}
        </span>
      </div>
    </Link>
  );
}

export const metadata: Metadata = {
  title: { absolute: "Zenn Studio — Reformer, Mat Pilates, Kickboks ve online antrenman | İstanbul" },
  alternates: { canonical: "/" },
  description: "Zenn Studio, İstanbul: reformer pilates, mat pilates, kickboks ve fonksiyonel antrenman; stüdyoda, canlı online ya da online personal training.",
};

/** "/" — the studio's own site: what we teach, how, and how to start. */
export default function StudioHome() {
  return (
    <>
      {/* Full-bleed hero, pulled up under the floating header. */}
      <section className="relative -mt-[68px] h-[100svh] max-h-[920px] min-h-[560px] overflow-hidden bg-ink sm:-mt-[76px]">
        {/* Art direction: the wide reformer shot crops to legs on a phone, so
            phones get a portrait frame instead. */}
        <Image
          src={photos.straps.src}
          alt={photos.straps.alt}
          placeholder="blur"
          priority
          fill
          sizes="(min-width: 640px) 1px, 100vw"
          className="object-cover object-[50%_30%] sm:hidden"
        />
        <Image
          src={photos.hero.src}
          alt={photos.hero.alt}
          placeholder="blur"
          priority
          fill
          sizes="(min-width: 640px) 100vw, 1px"
          className="hidden object-cover object-[60%_40%] sm:block"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/0 to-black/45" aria-hidden />
        <h1 className="sr-only">Zenn Studio: reformer pilates, mat pilates, kickboks ve online antrenman</h1>
        <p
          aria-hidden
          className="settle absolute inset-x-0 -bottom-[0.2em] text-center text-[38vw] leading-[0.8] font-bold tracking-[-0.07em] text-paper select-none"
        >
          <span className="inline-block">zenn</span>
        </p>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="text-center">
          <h2 className="text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Stüdyoda. Evinde. Programında.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Reformer pilates, mat pilates, kickboks ve fonksiyonel antrenman; stüdyoda, canlı online ya da sana yazılmış
            programla. Aynı antrenörler, aynı standart; antrenmanını antrenörün takip eder.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/kayit" variant="ink">
              Ön kayıt yap
            </ButtonLink>
            <ButtonLink href="/ders-bul" variant="ghost">
              Sana uygun dersi bul
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container className="space-y-4">
          <PhotoCard
            tall
            photo={photos.coaching}
            href="/online"
            label="Online"
            title="Antrenörün evinde de yanında."
            text="Canlı online derslerde seni ekranda görür; kişisel programda haftalık planını yazar ve formunu videodan düzeltir."
            linkText="Online antrenman nasıl işliyor"
          />
          <PhotoCard
            photo={{ src: reformerPhoto, alt: "Reformer üzerinde egzersiz yapan sporcu" }}
            href="/ders-bul"
            label="3 soru"
            title="Sana uygun ders"
            text="Hedefini ve programını söyle, branşını ve formatını önerelim."
            linkText="Testi çöz"
          />
          <PhotoCard
            photo={photos.kickboks}
            href="/branslar/kickboks"
            label="Kickboks"
            title="Kafanı boşalt"
            text="Teknik önce gelir; tempo seviyene göre artar."
            linkText="Kickboksu keşfet"
          />
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <h2 className={`text-center ${sectionTitle}`}>Neden Zenn?</h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <li key={r.title} className="rounded-[24px] bg-card p-6">
                <span className="grid size-9 place-items-center rounded-full bg-ink text-paper" aria-hidden>
                  <Check className="size-4" strokeWidth={3} />
                </span>
                <h3 className="mt-8 text-xl font-semibold tracking-tight">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{r.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/kayit" variant="ink">
              Ön kayıt yap
            </ButtonLink>
            <ButtonLink href="/paketler" variant="ghost">
              Paketleri gör
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section id="branslar" className="scroll-mt-24 bg-card py-20 sm:py-28">
        <Container>
          <h2 className={sectionTitle}>Branşlar</h2>
          <p className="mt-3 max-w-xl text-lg text-ink-soft">
            Her birinde aynı ilke: doğru teknik, küçük grup, sana göre tempo.
          </p>
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
                    <p className="text-xs font-semibold text-paper/70">
                      {d.formats.map((f) => formatName[f]).join(", ")}
                    </p>
                    <h3 className="mt-1 text-3xl font-semibold tracking-[-0.035em]">{d.name}</h3>
                    <p className="mt-1 text-[15px] text-paper/75">{d.tagline}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <h2 className={`text-center ${sectionTitle}`}>Ritmini seç</h2>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {formats.map((f) => (
              <li key={f.id}>
                <Link
                  href="/paketler"
                  className="flex h-full min-h-56 flex-col rounded-[24px] bg-card p-6 transition-colors hover:bg-ink/[0.07] sm:p-7"
                >
                  <h3 className="text-3xl font-semibold tracking-[-0.035em]">{f.name}</h3>
                  <p className="mt-2 text-ink-soft">{f.summary}</p>
                  <span className="mt-auto pt-8 font-semibold underline decoration-2 underline-offset-4">
                    Paketleri gör
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-ink-soft">
            Hangisi sana uygun bilmiyor musun?{" "}
            <Link href="/ders-bul" className="font-semibold text-ink underline underline-offset-4">
              Üç soruluk testi çöz
            </Link>
            .
          </p>
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container className="max-w-3xl">
          <h2 className={`text-center ${sectionTitle}`}>Sık sorulanlar</h2>
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-[20px] bg-card px-6 py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="mt-0.5 shrink-0 text-xl text-ink-soft transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
