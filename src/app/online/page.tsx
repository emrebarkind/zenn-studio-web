import type { Metadata } from "next";
import { comingSoon, formats } from "@/content/site";
import { ButtonLink, Container, SoonTag } from "@/components/ui";

export const metadata: Metadata = {
  title: "Online antrenman",
  description:
    "Canlı online mat pilates ve fonksiyonel dersler, sana özel online personal training programı ve haftalık antrenör takibi.",
};

const live = formats.find((f) => f.id === "live")!;
const coaching = formats.find((f) => f.id === "coaching")!;

const coachingFlow = [
  { title: "Tanışma görüşmesi", text: "Hedefini, sağlık geçmişini, programını ve evdeki ekipmanını konuşuyoruz." },
  { title: "Programın yazılır", text: "Antrenörün sana özel haftalık programı hazırlar; her hareketin anlatımı yanında." },
  { title: "Videonu gönder", text: "Zorlandığın hareketi çek, gönder. Antrenörün formunu düzeltip geri döner." },
  { title: "Haftalık değerlendirme", text: "Görüntülü görüşmede haftayı konuşur, programı bir sonraki haftaya göre güncellersiniz." },
];

export default function OnlinePage() {
  return (
    <>
      <section className="pt-12 pb-16 sm:pt-20">
        <Container>
          <h1 className="max-w-4xl font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] font-extrabold tracking-[-0.05em]">
            Stüdyo seninle eve gelsin.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Online derslerimiz video izlemek değil: antrenörün seni görüyor, düzeltiyor ve ilerlemeni takip ediyor.
            İki yolu var.
          </p>
        </Container>
      </section>

      <section className="pb-16">
        <Container className="grid gap-4 lg:grid-cols-2">
          <article className="on-ink rounded-[28px] bg-ink p-7 text-paper sm:p-9">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-2.5 py-0.5 text-sm font-semibold text-ink">
              <span className="live-dot size-1.5 rounded-full bg-ink" aria-hidden />
              Canlı
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">{live.name}</h2>
            <p className="mt-2 text-lg text-paper/70">{live.summary}</p>
            <ul className="mt-7 space-y-3">
              {live.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lime" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <ButtonLink href="/kayit?format=live" className="mt-8">
              Canlı derse ön kayıt
            </ButtonLink>
          </article>

          <article className="rounded-[28px] bg-card p-7 sm:p-9">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{coaching.name}</h2>
            <p className="mt-2 text-lg text-ink-soft">{coaching.summary}</p>
            <ol className="mt-7 space-y-5">
              {coachingFlow.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="font-display text-2xl leading-none font-extrabold text-moss tabular-nums">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-0.5 text-[15px] text-ink-soft">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <ButtonLink href="/kayit?format=coaching" variant="ink" className="mt-8">
              Online programa ön kayıt
            </ButtonLink>
          </article>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Platforma gelecekler</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {comingSoon.map((c) => (
              <li key={c.name} className="rounded-3xl bg-card p-6">
                <SoonTag />
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{c.name}</h3>
                <p className="mt-2 text-ink-soft">{c.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
