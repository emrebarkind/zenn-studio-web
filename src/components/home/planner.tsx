"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { disciplines } from "@/content/site";
import { DisciplineVisual } from "@/components/discipline-visual";
import { makePlan, plannerQuestions, type PlannerAnswers } from "@/domain/planner";
import { RequestFinish } from "./request-finish";

const TIME_RANGE: Record<PlannerAnswers["time"], [string, string]> = {
  sabah: ["07:00", "12:00"],
  öğle: ["12:00", "16:00"],
  akşam: ["17:00", "22:00"],
};

/**
 * "İlk dersini birlikte planlayalım": six questions, one tap each, then the
 * plan (discipline, way, days, time) and the same last step as the request:
 * name, then WhatsApp with the plan written out.
 */
export function Planner() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<PlannerAnswers>>({});
  const total = plannerQuestions.length;
  const done = index >= total;
  const q = plannerQuestions[Math.min(index, total - 1)];

  function choose(value: string) {
    setAnswers((a) => ({ ...a, [q.key]: value }));
    setIndex((i) => i + 1);
  }

  if (done) {
    const a = answers as PlannerAnswers;
    const plan = makePlan(a);
    const d = disciplines.find((x) => x.slug === plan.discipline)!;
    const [from, to] = TIME_RANGE[a.time];
    const summary = `Önerilen plan: ${d.name}, ${plan.detail}, ${plan.rhythm.toLocaleLowerCase("tr")}.`;
    return (
      <div className="step-in mx-auto max-w-4xl overflow-hidden rounded-[32px] bg-paper text-ink shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
        <div className="grid md:grid-cols-2">
          <div className="on-ink @container relative min-h-[260px] bg-ink text-paper md:min-h-full">
            <DisciplineVisual d={d} sizes="(min-width: 768px) 450px, 100vw" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/0" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-center">
              <p className="text-sm font-semibold text-lime">Sana uygun ders</p>
              <p className="mt-1 text-[2.25rem] leading-none font-semibold tracking-[-0.04em]">{d.name}</p>
            </div>
          </div>
          <div className="p-6 text-center sm:p-9">
            <dl className="space-y-3 text-left">
              <div className="rounded-2xl bg-card px-4 py-3">
                <dt className="text-sm text-ink-soft">Nasıl</dt>
                <dd className="font-semibold">{plan.detail}</dd>
              </div>
              <div className="rounded-2xl bg-card px-4 py-3">
                <dt className="text-sm text-ink-soft">Ne zaman</dt>
                <dd className="font-semibold">{plan.rhythm}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{plan.why}</p>
            <div className="mt-6 border-t border-ink/10 pt-6">
              <RequestFinish
                form="planner"
                choice={{
                  discipline: d.slug,
                  format: plan.format,
                  plan: plan.format === "group" ? (a.frequency === "3" ? "group-12" : "group-8") : undefined,
                  slot: plan.format === "group" ? (a.time === "sabah" ? "sabah" : "akşam") : undefined,
                  days: plan.days,
                  timeFrom: from,
                  timeTo: to,
                  note: summary,
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setIndex(0);
              }}
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-ink"
            >
              <RotateCcw className="size-4" aria-hidden />
              Baştan başla
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4 text-sm font-semibold text-paper/70">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="inline-flex min-h-11 items-center gap-1.5 disabled:opacity-0"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Geri
        </button>
        <span className="tabular-nums">
          {index + 1} / {total}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper/15">
        <div className="h-full rounded-full bg-lime transition-[width] duration-500" style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <div key={index} className="step-in mt-10 text-center">
        <h3 className="text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance">{q.title}</h3>
        <div className={`mt-8 grid gap-3 ${q.options.length === 4 ? "sm:grid-cols-2" : q.options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {q.options.map((o) => {
            const on = answers[q.key] === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => choose(o.value)}
                className={`min-h-20 rounded-[22px] px-5 py-4 text-center transition-[background-color,color,transform] duration-200 active:scale-[0.98] ${
                  on ? "bg-lime text-ink" : "bg-paper/10 text-paper hover:bg-paper/20"
                }`}
              >
                <span className="block text-lg font-semibold">{o.label}</span>
                {o.hint && <span className={`mt-0.5 block text-sm ${on ? "text-ink/70" : "text-paper/65"}`}>{o.hint}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
