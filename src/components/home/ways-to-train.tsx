"use client";

import { useState } from "react";
import { plans, PRIVATE_GROUP_MAX, type PlanId } from "@/content/site";
import { ButtonLink } from "@/components/ui";

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const DAY_NAMES = ["pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi", "pazar"];
type Slot = "sabah" | "akşam";

function joinTr(words: string[]): string {
  return words.length <= 1 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} ve ${words.at(-1)}`;
}

/** Two or more pill options; the selected one fills. */
function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  tone,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  tone: "light" | "dark";
}) {
  return (
    <div role="radiogroup" aria-label={label} className={`flex w-fit gap-1 rounded-full p-1 ${tone === "light" ? "bg-paper" : "bg-paper/10"}`}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
              on ? (tone === "light" ? "bg-ink text-paper" : "bg-lime text-ink") : tone === "light" ? "text-ink-soft hover:text-ink" : "text-paper/70 hover:text-paper"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** `&brans=…` when the card sits on a discipline's page. */
function bransQuery(discipline?: string) {
  return discipline ? `&brans=${discipline}` : "";
}

/**
 * A group package shown as the week it makes (8 lessons = Mon + Wed,
 * 12 = Mon + Wed + Fri, morning or evening group). The request link carries
 * the package into the request form.
 */
export function GroupPackageCard({
  discipline,
  subtitle = "Mat Pilates ve Spinning",
  className = "",
}: {
  discipline?: string;
  subtitle?: string;
  className?: string;
}) {
  const groupPlans = plans.filter((p) => p.format === "group");
  const [planId, setPlanId] = useState<PlanId>(groupPlans[0].id);
  const [slot, setSlot] = useState<Slot>("akşam");
  const plan = groupPlans.find((p) => p.id === planId) ?? groupPlans[0];
  const days = plan.groupDays ?? [];

  return (
    <article className={`flex flex-col rounded-[28px] bg-card p-6 sm:p-9 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h3 className="text-[2rem] leading-none font-semibold tracking-[-0.035em]">Grup dersleri</h3>
          <p className="mt-2 text-ink-soft">{subtitle}</p>
        </div>
        <Segmented
          label="Paket"
          tone="light"
          value={planId}
          onChange={setPlanId}
          options={groupPlans.map((p) => ({ value: p.id, label: p.name }))}
        />
      </div>

      <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold">Haftan</p>
        <Segmented
          label="Grup"
          tone="light"
          value={slot}
          onChange={setSlot}
          options={[
            { value: "sabah", label: "Sabah grubu" },
            { value: "akşam", label: "Akşam grubu" },
          ]}
        />
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2" aria-label="Haftanın günleri">
        {DAYS.map((d, i) => {
          const on = days.includes(i + 1);
          return (
            <li
              key={d}
              className={`flex aspect-[3/4] flex-col items-center justify-between rounded-2xl py-3 text-sm font-semibold transition-colors duration-300 ${
                on ? "bg-ink text-paper" : "bg-paper text-ink-soft"
              }`}
            >
              <span>{d}</span>
              <span aria-hidden className={`size-2 rounded-full transition-colors ${on ? "bg-lime" : "bg-transparent"}`} />
              <span className="sr-only">{on ? `${slot} grubu dersi var` : "ders yok"}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-ink-soft">
        4 hafta boyunca {joinTr(days.map((n) => DAY_NAMES[n - 1]))} {slot} grubundasın. Telafi yok; bizim iptal ettiğimiz ders paketin sonuna eklenir.
      </p>
      <div className="mt-auto pt-8">
        <ButtonLink href={`/kayit?format=group&paket=${plan.id}${bransQuery(discipline)}`} variant="ink">
          Ders talebi
        </ButtonLink>
      </div>
    </article>
  );
}

/** A private lesson for 1-6 people; the request link carries the count. */
export function PrivateLessonCard({
  discipline,
  subtitle = "Reformer Pilates, Kickboks, Fonksiyonel antrenman",
  className = "",
}: {
  discipline?: string;
  subtitle?: string;
  className?: string;
}) {
  const [people, setPeople] = useState(1);
  return (
    <article className={`on-ink flex flex-col rounded-[28px] bg-ink p-6 text-paper sm:p-9 ${className}`}>
      <h3 className="text-[2rem] leading-none font-semibold tracking-[-0.035em]">Özel ders</h3>
      <p className="mt-2 text-paper/70">{subtitle}</p>

      <p className="mt-9 font-semibold">Kaç kişi olacaksınız?</p>
      <div role="radiogroup" aria-label="Kişi sayısı" className="mt-4 grid grid-cols-6 gap-2">
        {Array.from({ length: PRIVATE_GROUP_MAX }, (_, i) => i + 1).map((n) => {
          const filled = n <= people;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={n === people}
              aria-label={n === 1 ? "Yalnız ben" : `${n} kişi`}
              onClick={() => setPeople(n)}
              className={`grid aspect-square place-items-center rounded-full text-lg font-semibold tabular-nums transition-[background-color,color,transform] duration-200 active:scale-95 ${
                filled ? "bg-lime text-ink" : "bg-paper/10 text-paper/70 hover:bg-paper/20 hover:text-paper"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <p className="mt-5 text-paper/70">
        {people === 1 ? "Antrenörünle birebir." : `${people} kişilik küçük grup; grubu sen kurarsın.`} Günleri ve saati birlikte belirlersiniz.
      </p>
      <div className="mt-auto pt-8">
        <ButtonLink href={`/kayit?format=private&kisi=${people}${bransQuery(discipline)}`}>Ders talebi</ButtonLink>
      </div>
    </article>
  );
}

/**
 * The two ways to train, side by side. Prices are shared on the call, never
 * here.
 */
export function WaysToTrain() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <GroupPackageCard className="lg:col-span-7" />
      <PrivateLessonCard className="lg:col-span-5" />
    </div>
  );
}
