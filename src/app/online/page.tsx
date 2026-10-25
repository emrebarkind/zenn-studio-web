import type { Metadata } from "next";
import Image from "next/image";
import { coachingFlow, formats, photos } from "@/content/site";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Online Mat Pilates",
  description: "Zenn Studio online Mat Pilates: evden canlı ders, talep üzerine.",
};

const online = formats.find((f) => f.id === "online")!;

/** "/online" — online Mat Pilates, on request (2026-10-25: the studio's focus is in-studio; online is offered, not promoted). */
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
            <div className="relative flex min-h-[480px] flex-col justify-end p-6 sm:min-h-[560px] sm:p-10">
              <span className="w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-paper/40">Talep üzerine</span>
              <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
                Online Mat Pilates
              </h1>
              <p className="mt-4 max-w-xl text-lg text-paper/80">{online.summary}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/kayit?format=online&brans=mat-pilates">Online ders talebi</ButtonLink>
                <ButtonLink href="/" variant="light">
                  Stüdyoya dön
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em]">Nasıl işliyor</h2>
            <ul className="mt-6 space-y-2 text-lg text-ink-soft">
              {online.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-moss" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <ol className="space-y-5">
            {coachingFlow.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-ink/10 pt-5">
                <span className="text-2xl leading-none font-semibold text-moss tabular-nums">{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-0.5 text-[15px] text-ink-soft">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
