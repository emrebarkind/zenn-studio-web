import type { Metadata } from "next";
import { planRules } from "@/content/site";
import { ButtonLink, Container } from "@/components/ui";
import { WaysToTrain } from "@/components/home/ways-to-train";

export const metadata: Metadata = {
  title: "Dersler ve paketler",
  description: "Mat Pilates ve Spinning grup paketleri; Mat ve Reformer Pilates, Kickboks ve Fonksiyonel antrenmanda 1-6 kişilik dersler; talep üzerine online Mat Pilates.",
};

/** "/paketler": the two ways to train (the same cards as the home page) and the group package rules. */
export default function PlansPage() {
  return (
    <>
      <section className="pt-10 pb-12 sm:pt-16">
        <Container>
          <h1 className="text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] font-bold tracking-[-0.05em] text-balance">Dersler ve paketler</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Grup dersinde haftanın günleri pakete göre bellidir; özel derste günü ve saati antrenörünle belirlersin. Fiyatı seni
            aradığımızda paylaşırız, ödeme alınmaz.
          </p>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <WaysToTrain />
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container className="grid gap-4 lg:grid-cols-12">
          <div className="rounded-[28px] bg-card p-7 sm:p-9 lg:col-span-8">
            <h2 className="text-2xl font-semibold tracking-tight">Grup paketi kuralları</h2>
            <ul className="mt-5 space-y-3 text-[17px] leading-relaxed text-ink-soft">
              {planRules.map((rule) => (
                <li key={rule} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-moss" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
          <div className="on-ink flex flex-col justify-between rounded-[28px] bg-ink p-7 text-paper sm:p-9 lg:col-span-4">
            <p className="text-2xl leading-snug font-semibold tracking-tight">Hangi dersin sana uyduğundan emin değil misin?</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/#talep">Ders talebi</ButtonLink>
              <ButtonLink href="/ders-bul" variant="outline">
                Birlikte seçelim
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
