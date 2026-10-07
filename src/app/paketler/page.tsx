import type { Metadata } from "next";
import { formats, plans } from "@/content/site";
import { paymentMethods } from "@/domain/registration";
import { Container, SoonTag } from "@/components/ui";
import { PlanCard } from "@/components/plan-card";

export const metadata: Metadata = {
  title: "Paketler",
  description: "Stüdyo grup ve birebir paketleri, canlı online dersler ve aylık online personal training.",
};

export default function PlansPage() {
  return (
    <>
      <section className="pt-12 pb-10 sm:pt-20">
        <Container>
          <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] font-extrabold tracking-[-0.05em]">
            Paketler
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-soft">
            Grup paketleri 4 hafta geçerlidir ve seçtiğin sabah ya da akşam grubunda devam eder. Grup derslerinde
            telafi yoktur; stüdyonun iptal ettiği ders paketinin sonuna eklenir.
          </p>
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

      <section className="pb-24">
        <Container>
          <div className="rounded-3xl bg-stone p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold tracking-tight">Ödeme seçenekleri</h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-3">
              {paymentMethods.map((m) => (
                <li key={m.id}>
                  <p className="flex items-center gap-2 font-semibold">
                    {m.name} {!m.available && <SoonTag />}
                  </p>
                  <p className="mt-1 text-[15px] text-ink-soft">{m.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
