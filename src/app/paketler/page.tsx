import type { Metadata } from "next";
import { formats, planRules, plans } from "@/content/site";
import { Container } from "@/components/ui";
import { PlanCard } from "@/components/plan-card";

export const metadata: Metadata = {
  title: "Dersler ve paketler",
  description: "Mat Pilates ve Spinning grup paketleri; Reformer, Kickboks ve Fonksiyonel antrenmanda 1–6 kişilik dersler; talep üzerine online ders.",
};

export default function PlansPage() {
  return (
    <>
      <section className="pt-12 pb-10 sm:pt-20">
        <Container>
          <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] font-extrabold tracking-[-0.05em]">
            Dersler ve paketler
          </h1>
          <ul className="mt-6 max-w-xl space-y-1.5 text-lg text-ink-soft">
            {planRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </Container>
      </section>

      {formats.map((f) => {
        const list = plans.filter((p) => p.format === f.id);
        return (
          <section key={f.id} className="pb-14">
            <Container>
              <h2 className="font-display text-3xl font-bold tracking-tight">{f.name}</h2>
              <p className="mt-1 text-ink-soft">{f.summary}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <PlanCard key={p.id} plan={p} />
                ))}
              </div>
            </Container>
          </section>
        );
      })}

    </>
  );
}
