"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, PencilLine } from "lucide-react";
import { buttonClass } from "@/components/ui";
import { WEEKDAYS } from "@/domain/registration";
import {
  assessIntake,
  intakeCrmNote,
  intakeNotes,
  intakeSteps,
  WINDOWS,
  type IntakeAnswers,
  type IntakeStep,
} from "@/domain/intake";
import { RequestFinish } from "./request-finish";

type Draft = Partial<IntakeAnswers> & Pick<IntakeAnswers, "goals" | "tried" | "interests" | "days" | "windows">;
const EMPTY: Draft = { goals: [], tried: [], interests: [], days: [], windows: [] };

const tile = (on: boolean) =>
  `relative min-h-[4.5rem] rounded-[20px] px-4 py-3.5 text-center transition-[background-color,color,transform] duration-200 active:scale-[0.98] ${
    on ? "bg-lime text-ink" : "bg-paper/10 text-paper hover:bg-paper/20"
  }`;

/**
 * "Sana uygun dersi birlikte seçelim": eleven short questions (ranges and
 * choices, never "group or private?"), then the visitor's own answers said
 * back, and the request goes to our coaches only when they send it. We do
 * not tell them which sport suits them; the coaches see our first take in
 * the CRM note. Rules and words live in src/domain/intake.ts.
 */
export function Planner() {
  const [index, setIndex] = useState(0);
  const [a, setA] = useState<Draft>(EMPTY);
  const box = useRef<HTMLDivElement>(null);
  const total = intakeSteps.length;

  // On a phone the next question (or the summary) can start above the screen; bring it back.
  useEffect(() => {
    const el = box.current;
    if (index > 0 && el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ block: "start" });
  }, [index]);

  if (index >= total)
    return (
      <div ref={box} className="scroll-mt-24">
        <Summary answers={a as IntakeAnswers} onEdit={() => setIndex(0)} />
      </div>
    );

  const step = intakeSteps[index];
  const advance = () => setIndex((i) => i + 1);
  const pick = (key: string, value: string) => {
    setA((cur) => ({ ...cur, [key]: value }));
    window.setTimeout(advance, 180);
  };

  return (
    <div ref={box} className="mx-auto max-w-3xl scroll-mt-24">
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

      <div key={index} className="step-in mt-9 text-center">
        <h3 className="text-[clamp(1.6rem,4vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-balance">{step.title}</h3>
        {step.hint && <p className="mt-2 text-paper/65">{step.hint}</p>}
        <div className="mt-7">
          <StepBody step={step} a={a} setA={setA} pick={pick} advance={advance} />
        </div>
      </div>
    </div>
  );
}

function StepBody({
  step,
  a,
  setA,
  pick,
  advance,
}: {
  step: IntakeStep;
  a: Draft;
  setA: React.Dispatch<React.SetStateAction<Draft>>;
  pick: (key: string, value: string) => void;
  advance: () => void;
}) {
  if (step.kind === "single") {
    const cols = step.options.length === 3 ? "sm:grid-cols-3" : step.options.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3";
    return (
      <div className={`grid grid-cols-2 gap-3 ${cols}`}>
        {step.options.map((o) => {
          const on = a[step.key] === o.value;
          return (
            <button key={o.value} type="button" aria-pressed={on} onClick={() => pick(step.key, o.value)} className={tile(on)}>
              <span className="block text-[17px] leading-snug font-semibold">{o.label}</span>
              {o.hint && <span className={`mt-0.5 block text-[13px] ${on ? "text-ink/70" : "text-paper/60"}`}>{o.hint}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  if (step.kind === "multi") {
    const chosen = a[step.key] as string[];
    const toggle = (v: string) =>
      setA((cur) => {
        const list = cur[step.key] as string[];
        if (list.includes(v)) return { ...cur, [step.key]: list.filter((x) => x !== v) };
        if (v === step.exclusive) return { ...cur, [step.key]: [v] };
        const rest = list.filter((x) => x !== step.exclusive);
        // Over the limit, the oldest pick makes room for the new one.
        const next = step.max && rest.length >= step.max ? [...rest.slice(1), v] : [...rest, v];
        return { ...cur, [step.key]: next };
      });
    return (
      <>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {step.options.map((o) => {
            const on = chosen.includes(o.value);
            return (
              <button key={o.value} type="button" aria-pressed={on} onClick={() => toggle(o.value)} className={tile(on)}>
                {on && (
                  <span className="absolute top-2.5 right-2.5 grid size-5 place-items-center rounded-full bg-ink text-lime">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                )}
                <span className="block text-[17px] leading-snug font-semibold">{o.label}</span>
                {o.hint && <span className={`mt-0.5 block text-[13px] ${on ? "text-ink/70" : "text-paper/60"}`}>{o.hint}</span>}
              </button>
            );
          })}
        </div>
        <Next disabled={chosen.length === 0} onClick={advance} />
      </>
    );
  }

  if (step.kind === "scale") {
    return (
      <div className="mx-auto max-w-xl">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {(["1", "2", "3", "4", "5"] as const).map((v) => {
            const on = a.pace === v;
            return (
              <button
                key={v}
                type="button"
                aria-pressed={on}
                aria-label={`${v} / 5`}
                onClick={() => pick("pace", v)}
                className={`grid aspect-square place-items-center rounded-full text-xl font-semibold transition-[background-color,color,transform] duration-200 active:scale-95 ${
                  on ? "bg-lime text-ink" : "bg-paper/10 hover:bg-paper/20"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex justify-between text-sm text-paper/65">
          <span>{step.low}</span>
          <span>{step.high}</span>
        </div>
      </div>
    );
  }

  // Days and time windows on one screen.
  const toggleIn = (key: "days" | "windows", v: string) =>
    setA((cur) => {
      const list = cur[key] as string[];
      return { ...cur, [key]: list.includes(v) ? list.filter((x) => x !== v) : [...list, v] };
    });
  return (
    <>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {WEEKDAYS.map((w) => {
          const on = a.days.includes(w.id);
          return (
            <button
              key={w.id}
              type="button"
              aria-pressed={on}
              aria-label={w.long}
              onClick={() => toggleIn("days", w.id)}
              className={`grid min-h-14 place-items-center rounded-2xl font-semibold transition-colors duration-200 ${on ? "bg-lime text-ink" : "bg-paper/10 hover:bg-paper/20"}`}
            >
              {w.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {WINDOWS.map((w) => {
          const on = a.windows.includes(w.id);
          return (
            <button key={w.id} type="button" aria-pressed={on} onClick={() => toggleIn("windows", w.id)} className={tile(on)}>
              <span className="block font-semibold">{w.label}</span>
              <span className={`block text-[13px] tabular-nums ${on ? "text-ink/70" : "text-paper/60"}`}>
                {w.from}-{w.to}
              </span>
            </button>
          );
        })}
      </div>
      <Next disabled={a.days.length === 0 || a.windows.length === 0} onClick={advance} />
    </>
  );
}

function Next({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={buttonClass("primary", "mt-7 min-h-13 px-8 disabled:opacity-40")}>
      Devam
      <ArrowRight className="size-5" aria-hidden />
    </button>
  );
}

/** The answers said back, and the request, which reaches us only if the visitor sends it. */
function Summary({ answers, onEdit }: { answers: IntakeAnswers; onEdit: () => void }) {
  const x = assessIntake(answers);
  const notes = intakeNotes(answers);
  return (
    <div className="step-in mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-paper text-ink shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
      <div className="grid md:grid-cols-2">
        <div className="bg-card p-6 sm:p-9 lg:p-8">
          <h3 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em]">Senin için not aldıklarımız</h3>
          <ul className="mt-5 space-y-2.5 lg:mt-4 lg:space-y-1.5">
            {notes.map((n) => (
              <li key={n} className="flex gap-3 text-[15px] leading-relaxed lg:leading-snug">
                <Check className="mt-1 size-4 shrink-0 text-moss" strokeWidth={2.5} aria-hidden />
                {n}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-ink-soft lg:mt-4">
            Bir sağlık durumun ya da sakatlığın varsa görüşmede antrenörümüze anlatabilirsin; dersi buna göre hazırlarız.
          </p>
          <button type="button" onClick={onEdit} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-ink">
            <PencilLine className="size-4" aria-hidden />
            Cevaplarımı düzenle
          </button>
        </div>
        <div className="p-6 sm:p-9 lg:p-8">
          <h3 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em]">Talebini bize gönder</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            Onaylarsan bu notlar eğitmenlerimize ulaşır. Seni arayıp sana uygun dersi ve saati birlikte belirleriz; ortalama 1 saat içinde dönüyoruz.
          </p>
          <div className="mt-6">
            <RequestFinish
              form="planner"
              choice={{
                discipline: x.discipline,
                format: x.format,
                plan: x.plan,
                slot: x.slot,
                days: answers.days,
                timeFrom: x.timeFrom,
                timeTo: x.timeTo,
                note: intakeCrmNote(answers, x),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
