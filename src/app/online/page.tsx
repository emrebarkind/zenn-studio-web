import type { Metadata } from "next";
import Image from "next/image";
import { coachingFlow, comingSoon, formats, photos } from "@/content/site";
import { ButtonLink, Container, SoonTag } from "@/components/ui";

export const metadata: Metadata = {
  title: "Zenn Online",
  description:
    "Zenn Online: canlı online dersler, online personal training ve video ile form geri bildirimi.",
};

const live = formats.find((f) => f.id === "live")!;
const coaching = formats.find((f) => f.id === "coaching")!;

// Only what actually runs today is listed as live; everything else is "Yakında".
const liveNow = [
  { name: "Canlı online dersler", detail: "Kamera açık küçük gruplar; antrenörün seni görür ve anında düzeltir." },
  { name: "Online personal training", detail: "Hedefine ve evdeki ekipmanına göre yazılan haftalık program." },
  { name: "Video geri bildirim", detail: "Hareketini çekip gönder; antrenörün formunu videodan düzeltsin." },
];
const soon = [...comingSoon, { name: "Kartla online ödeme", detail: "iyzico ile taksit seçenekli güvenli ödeme." }];


function LiveTag() {
  return <span className="rounded-full bg-moss-soft px-2.5 py-0.5 text-xs font-semibold text-moss">Yayında</span>;
}

export default function OnlinePage() {
  return (
    <>
      <section className="pt-6 pb-16 sm:pt-10">
        <Container>
          <div className="on-ink relative overflow-hidden rounded-[28px] bg-ink text-paper">
            <Image
              src={photos.coaching.src}
              alt={photos.coaching.alt}
              placeholder="blur"
              priority
              fill
              sizes="(min-width: 1152px) 1104px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" aria-hidden />
            <div className="relative flex min-h-[560px] flex-col justify-end p-6 sm:min-h-[620px] sm:p-10">
              <span className="w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-paper/40">Zenn Online</span>
              <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] font-semibold tracking-[-0.045em]">
                Antrenörün, ekranın öbür ucunda.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-paper/80">
                Online derslerimiz video izlemek değil: antrenörün seni görür, düzeltir ve ilerlemeni takip eder.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/kayit?format=live">Ön kayıt yap</ButtonLink>
                <ButtonLink href="/ders-bul" variant="light">
                  Sana uygun dersi bul
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <h2 className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em]">
            Platformda neler var
          </h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <ul className="space-y-3">
              {liveNow.map((item) => (
                <li key={item.name} className="rounded-[24px] bg-card p-6">
                  <LiveTag />
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">{item.name}</h3>
                  <p className="mt-1 text-ink-soft">{item.detail}</p>
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {soon.map((item) => (
                <li key={item.name} className="rounded-[24px] p-6 ring-1 ring-ink/10">
                  <SoonTag />
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">{item.name}</h3>
                  <p className="mt-1 text-ink-soft">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-4 lg:grid-cols-2">
          <article className="on-ink rounded-[28px] bg-ink p-7 text-paper sm:p-9">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-2.5 py-0.5 text-sm font-semibold text-ink">
              <span className="live-dot size-1.5 rounded-full bg-ink" aria-hidden />
              Canlı
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{live.name}</h2>
            <p className="mt-2 text-lg text-paper/70">{live.summary}</p>
            <ul className="mt-7 space-y-3">
              {live.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lime" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <ButtonLink href="/kayit?format=live" variant="light" className="mt-8">
              Canlı derse ön kayıt
            </ButtonLink>
          </article>

          <article className="rounded-[28px] bg-card p-7 sm:p-9">
            <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{coaching.name}</h2>
            <p className="mt-2 text-lg text-ink-soft">{coaching.summary}</p>
            <ol className="mt-7 space-y-5">
              {coachingFlow.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="text-2xl leading-none font-semibold text-moss tabular-nums">{i + 1}</span>
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

    </>
  );
}
