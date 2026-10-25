import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { Quiz } from "./quiz";

export const metadata: Metadata = {
  title: "Sana uygun dersi bul",
  description: "İki soruda hedefine ve çalışma şekline uyan branşı öğren.",
};

export default function FindClassPage() {
  return (
    <section className="pt-12 pb-24 sm:pt-20">
      <Container className="max-w-3xl">
        <h1 className="font-display text-[clamp(2.75rem,8vw,5rem)] leading-[0.92] font-extrabold tracking-[-0.05em]">
          Sana uygun dersi bul
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft">
          İki soru. Hedefine ve nasıl çalışmak istediğine göre sana bir branş öneriyoruz.
        </p>
        <div className="mt-12">
          <Quiz />
        </div>
      </Container>
    </section>
  );
}
