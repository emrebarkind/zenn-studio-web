import { formats, type DisciplineSlug, type Plan } from "@/content/site";
import { ButtonLink } from "@/components/ui";

const formatName = Object.fromEntries(formats.map((f) => [f.id, f.name]));
const tl = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

export function PlanCard({ plan, discipline }: { plan: Plan; discipline?: DisciplineSlug }) {
  const query = new URLSearchParams({ paket: plan.id, ...(discipline ? { brans: discipline } : {}) });
  return (
    <article className="flex flex-col rounded-3xl bg-card p-6 sm:p-7">
      <p className="text-sm font-semibold text-moss">{formatName[plan.format]}</p>
      <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">{plan.name}</h3>
      <p className="mt-1 text-ink-soft">{plan.detail}</p>
      <p className="mt-6 font-display text-3xl font-bold tracking-tight tabular-nums">
        {plan.price === null ? (
          <span className="text-xl font-semibold text-ink-soft">Fiyatı seni aradığımızda paylaşırız</span>
        ) : (
          tl.format(plan.price)
        )}
      </p>
      <ul className="mt-6 flex-1 space-y-2 border-t border-ink/10 pt-6 text-[15px]">
        {plan.includes.map((i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-moss" aria-hidden />
            {i}
          </li>
        ))}
      </ul>
      <ButtonLink href={`/kayit?${query}`} variant="ink" className="mt-7">
        Bu paketle talep bırak
      </ButtonLink>
    </article>
  );
}
