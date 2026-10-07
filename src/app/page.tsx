import Link from "next/link";
import { coaches, comingSoon, disciplines, faqs, formats } from "@/content/site";
import { ButtonLink, Container, SectionTitle } from "@/components/ui";
import { DisciplineIndex } from "@/components/discipline-index";
import { SampleWeek } from "@/components/sample-week";

const disciplineName = Object.fromEntries(disciplines.map((d) => [d.slug, d.name]));

const steps = [
  { title: "Dersini seç", text: "Branşlara göz at ya da üç soruluk testle sana uygun dersi bul." },
  { title: "Ön kaydını yap", text: "Paketini ve ödeme yöntemini seç, iletişim bilgilerini bırak." },
  { title: "İlk dersini planlayalım", text: "Antrenörün seni arar; saatini ve seviyeni birlikte netleştirirsiniz." },
];

export default function Home() {
  return (
    <>
      <section className="pt-10 pb-16 sm:pt-16 sm:pb-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <h1 className="settle font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.92] font-extrabold tracking-[-0.05em]">
              <span className="block">Stüdyoda.</span>
              <span className="block">Evinde.</span>
              <span className="block">Programında.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              Reformer pilates, mat pilates, kickboks ve fonksiyonel antrenman. Aynı antrenörlerle ister
              stüdyoya gel, ister evinden canlı katıl, ister sana yazılmış programla kendi saatinde çalış.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/ders-bul">Sana uygun dersi bul</ButtonLink>
              <ButtonLink href="/paketler" variant="ghost">
                Paketleri gör
              </ButtonLink>
            </div>
          </div>
          <SampleWeek />
        </Container>
      </section>

      <section id="branslar" className="scroll-mt-20 pb-20 sm:pb-28">
        <Container>
          <SectionTitle lead="Birine dokun, ne yaptığımızı ve nerede yapabileceğini gör.">Branşlar</SectionTitle>
          <div className="mt-10">
            <DisciplineIndex />
          </div>
        </Container>
      </section>

      <section className="bg-stone py-20 sm:py-28">
        <Container>
          <SectionTitle lead="Hayatın değiştikçe formatını değiştir; antrenörün ve ilerlemen seninle gelsin.">
            Üç yol, aynı antrenörler
          </SectionTitle>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {formats.map((f) => (
              <article key={f.id} className="flex flex-col rounded-3xl bg-card p-6 sm:p-7">
                <h3 className="font-display text-2xl font-bold tracking-tight">{f.name}</h3>
                <p className="mt-2 text-ink-soft">{f.summary}</p>
                <ul className="mt-6 space-y-3 border-t border-ink/10 pt-6 text-[15px]">
                  {f.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-moss" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <Link href="/online" className="mt-8 inline-block font-semibold underline decoration-2 underline-offset-4 hover:text-moss">
            Online antrenman nasıl işliyor
          </Link>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionTitle>Başlamak üç adım</SectionTitle>
          <ol className="space-y-8">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4">
                <span className="font-display text-4xl leading-none font-extrabold text-moss tabular-nums">{i + 1}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-1 text-ink-soft">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <SectionTitle>Antrenörler</SectionTitle>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coaches.map((c) => (
              <li key={c.name} className="rounded-3xl bg-card p-6">
                <span className="grid size-14 place-items-center rounded-2xl bg-moss-soft font-display text-2xl font-bold text-moss" aria-hidden>
                  {c.name.charAt(0)}
                </span>
                <p className="mt-5 font-display text-2xl font-bold tracking-tight">{c.name}</p>
                <p className="text-ink-soft">{c.disciplines.map((d) => disciplineName[d]).join(", ")}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="on-ink bg-ink py-20 text-paper sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="max-w-md">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-bold tracking-[-0.03em]">
              Yolda olanlar
            </h2>
            <p className="mt-4 text-lg text-paper/70">
              Stüdyonun dışındaki antrenmanını da takip edebilmen için platformu adım adım büyütüyoruz.
            </p>
          </div>
          <ul className="divide-y divide-paper/10">
            {comingSoon.map((item) => (
              <li key={item.name} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                <span className="font-display text-xl font-semibold tracking-tight">{item.name}</span>
                <span className="text-paper/60 sm:max-w-xs sm:text-right">{item.detail}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionTitle>Sık sorulanlar</SectionTitle>
          <div className="divide-y divide-ink/15 border-y border-ink/15">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-semibold text-lg [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="mt-1 shrink-0 text-ink-soft transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-[28px] bg-moss p-8 text-paper sm:p-12 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">İlk dersin için yer ayıralım.</h2>
              <p className="mt-2 text-paper/75">Ön kayıt iki dakika sürer, ödeme şimdi alınmaz.</p>
            </div>
            <ButtonLink href="/kayit" className="shrink-0">
              Ön kayıt yap
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
