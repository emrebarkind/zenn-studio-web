"use client";

import { useState } from "react";
import { formats, planRules, plans, PRIVATE_GROUP_MAX, type FormatId, type PlanId } from "@/content/site";
import { ButtonLink } from "@/components/ui";

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const DAY_NAMES = ["pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi", "pazar"];
type Slot = "sabah" | "akşam";

function joinTr(words: string[]): string {
  return words.length <= 1 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} ve ${words.at(-1)}`;
}

/**
 * Lessons and packages, chosen in place: how (group / 1–6 people / online),
 * then for a group class the package and the week it makes — the days light
 * up for the morning or evening group — and for individual training how many
 * people. The request link carries the choice. Prices are shared when we call
 * back (never on the site).
 */
export function PackagesPicker() {
  const [format, setFormat] = useState<FormatId>("group");
  const list = plans.filter((p) => p.format === format);
  const [planId, setPlanId] = useState<PlanId>(list[0].id);
  const [slot, setSlot] = useState<Slot>("akşam");
  const [people, setPeople] = useState(1);
  const plan = list.find((p) => p.id === planId) ?? list[0];

  function chooseFormat(next: FormatId) {
    setFormat(next);
    setPlanId(plans.find((p) => p.format === next)!.id);
  }

  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        <div role="tablist" aria-label="Format" className="flex w-fit gap-1 rounded-full bg-card p-1">
          {formats.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={f.id === format}
              onClick={() => chooseFormat(f.id)}
              className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
                f.id === format ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              {f.short}
            </button>
          ))}
        </div>
        <div role="radiogroup" aria-label="Paket" className="space-y-3">
          {list.map((p) => {
            const on = p.id === plan.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPlanId(p.id)}
                className={`flex w-full items-start justify-between gap-4 rounded-[24px] p-5 text-left transition-colors sm:p-6 ${
                  on ? "bg-ink text-paper" : "bg-card text-ink hover:bg-ink/[0.07]"
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-2xl font-semibold tracking-[-0.03em]">{p.name}</span>
                  <span className={`mt-1 block ${on ? "text-paper/70" : "text-ink-soft"}`}>{p.detail}</span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {p.includes.map((i) => (
                      <span key={i} className={`rounded-full px-2.5 py-1 text-[13px] ${on ? "bg-paper/10 text-paper/85" : "bg-paper text-ink-soft"}`}>
                        {i}
                      </span>
                    ))}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`mt-1 grid size-6 shrink-0 place-items-center rounded-full ring-2 ${on ? "bg-lime ring-lime" : "ring-ink/25"}`}
                >
                  {on ? <span className="size-2.5 rounded-full bg-ink" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col rounded-[28px] bg-card p-5 sm:p-7">
        {plan.groupDays ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-semibold tracking-tight">Haftan stüdyoda</h3>
              <div role="radiogroup" aria-label="Grup" className="flex gap-1 rounded-full bg-paper p-1">
                {(["sabah", "akşam"] as Slot[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={s === slot}
                    onClick={() => setSlot(s)}
                    className={`min-h-9 rounded-full px-3.5 text-sm font-semibold transition-colors ${
                      s === slot ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {s === "sabah" ? "Sabah" : "Akşam"} grubu
                  </button>
                ))}
              </div>
            </div>
            <ol className="mt-6 grid grid-cols-7 gap-1.5" aria-label="Haftanın günleri">
              {DAYS.map((d, i) => {
                const on = plan.groupDays!.includes(i + 1);
                return (
                  <li
                    key={d}
                    className={`flex aspect-[3/4] flex-col items-center justify-between rounded-2xl py-2.5 text-sm font-semibold transition-colors ${
                      on ? "bg-ink text-paper" : "bg-paper text-ink-soft"
                    }`}
                  >
                    <span>{d}</span>
                    <span aria-hidden className={`size-2 rounded-full ${on ? "bg-lime" : "bg-transparent"}`} />
                    <span className="sr-only">{on ? `${slot} grubu dersi var` : "ders yok"}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-5 text-ink-soft">
              4 hafta boyunca {joinTr(plan.groupDays.map((n) => DAY_NAMES[n - 1]))} {slot} grubundasın:{" "}
              <strong className="text-ink">{plan.name}</strong>. Saatini ön kayıttan sonra antrenörün iletir.
            </p>
            <details className="group mt-5 border-t border-ink/10 pt-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">
                Grup paketi kuralları
                <span aria-hidden className="text-xl text-ink-soft transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <ul className="mt-3 space-y-1.5 text-[15px] text-ink-soft">
                {planRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </details>
          </>
        ) : plan.format === "private" ? (
          <>
            <h3 className="text-xl font-semibold tracking-tight">Kaç kişi olacaksınız?</h3>
            <div role="radiogroup" aria-label="Kişi sayısı" className="mt-5 grid grid-cols-6 gap-1.5">
              {Array.from({ length: PRIVATE_GROUP_MAX }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={n === people}
                  aria-label={n === 1 ? "Yalnız ben" : `${n} kişi`}
                  onClick={() => setPeople(n)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-2xl text-lg font-semibold tabular-nums transition-colors ${
                    n <= people ? "bg-ink text-paper" : "bg-paper text-ink-soft hover:text-ink"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-5 text-ink-soft">
              {people === 1 ? "Antrenörünle birebir." : `${people} kişilik küçük grup; arkadaşlarınla grubu sen kurarsın.`} {plan.weekNote}
            </p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold tracking-tight">Online ders</h3>
            <p className="mt-3 text-lg text-ink-soft">{plan.weekNote}</p>
          </>
        )}
        <div className="mt-auto pt-6">
          <ButtonLink
            href={plan.format === "private" ? `/kayit?format=private&kisi=${people}` : `/kayit?format=${plan.format}${plan.format === "group" ? `&paket=${plan.id}` : ""}`}
            variant="ink"
            className="w-full"
          >
            {plan.format === "group" ? `${plan.name} için talep bırak` : "Talep bırak"}
          </ButtonLink>
          <p className="mt-3 text-center text-sm text-ink-soft">Fiyatı seni aradığımızda paylaşırız; ödeme alınmaz.</p>
        </div>
      </div>
    </div>
  );
}
