import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { Planner } from "@/components/home/planner";

export const metadata: Metadata = {
  title: "Sana uygun dersi birlikte seçelim",
  description:
    "Birkaç kısa soruyla seni tanıyalım: hedefin, temponu, programın, gelebileceğin gün ve saatler. Cevaplarını antrenörlerimiz okuyor; ilk dersini seninle birlikte planlıyoruz.",
  alternates: { canonical: "/ders-bul" },
};

/** "/ders-bul": the same intake as the home page, on its own page (linked from lessons, packages and posts). */
export default function FindClassPage() {
  return (
    <section className="on-ink bg-ink pt-12 pb-24 text-paper sm:pt-20 sm:pb-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance">
            Sana uygun dersi birlikte seçelim.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-paper/75">
            Birkaç kısa soruyla seni tanıyalım. Cevaplarını antrenörlerimiz okuyor; ilk dersini seninle birlikte planlıyoruz.
          </p>
        </div>
        <div className="mt-12">
          <Planner />
        </div>
      </Container>
    </section>
  );
}
