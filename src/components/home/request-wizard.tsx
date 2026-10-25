"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { disciplines, formats } from "@/content/site";
import { company } from "@/content/company";
import { DisciplineVisual } from "@/components/discipline-visual";
import { HOURS, WEEKDAYS, type WeekdayId } from "@/domain/registration";
import { buttonClass } from "@/components/ui";
import { RequestFinish } from "./request-finish";

const STEPS = ["Gün", "Ders", "Bilgilerin"] as const;
const SHORT = Object.fromEntries(formats.map((f) => [f.id, f.short]));

function TimeSelect({ label, value, onChange, hours }: { label: string; value: string; onChange: (v: string) => void; hours: string[] }) {
  return (
    <label className="block text-left">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="relative mt-1.5 block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block min-h-13 w-full appearance-none rounded-2xl bg-paper px-4 pr-10 text-[16px] ring-1 ring-ink/15 outline-none focus:ring-2 focus:ring-ink"
        >
          <option value="">Fark etmez</option>
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-soft" />
      </span>
    </label>
  );
}

/**
 * The home page's request in three steps: which days (and hours), which
 * lesson, who. The last step sends the visitor to WhatsApp with all of it
 * written out (and records it in the CRM).
 */
export function RequestWizard() {
  const [step, setStep] = useState(0);
  const [days, setDays] = useState<WeekdayId[]>([]);
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [discipline, setDiscipline] = useState<string | null>(null);
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const card = useRef<HTMLDivElement>(null);

  // A shorter step can leave the card's top under the sticky header; bring it back.
  useEffect(() => {
    const el = card.current;
    if (step > 0 && el && el.getBoundingClientRect().top < 96) el.scrollIntoView({ block: "start" });
  }, [step]);

  const d = disciplines.find((x) => x.slug === discipline);
  const format = d?.formats.includes("group") ? "group" : "private";
  const timeError = timeFrom && timeTo && timeTo <= timeFrom ? "Bitiş saati başlangıçtan sonra olmalı." : null;
  const canNext = step === 0 ? days.length > 0 && !timeError : step === 1 ? !!discipline : true;

  function next() {
    setTried(true);
    if (!canNext) return;
    setTried(false);
    setStep((s) => s + 1);
  }

  return (
    <div ref={card} className="mx-auto max-w-3xl scroll-mt-24 rounded-[32px] bg-card p-5 lg:max-w-4xl lg:p-8 shadow-[0_30px_80px_-40px_rgba(21,25,21,0.45)] sm:p-10">
      {/* Progress: three numbered steps and a bar. */}
      <ol className="grid grid-cols-3 gap-2" aria-label="Adımlar">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full transition-colors duration-500 ${i <= step ? "bg-ink" : "bg-ink/10"}`} />
            <span className={`mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold ${i <= step ? "text-ink" : "text-ink-soft"}`}>
              <span className={`grid size-5 place-items-center rounded-full text-[11px] ${i < step || sent ? "bg-lime text-ink" : i === step ? "bg-ink text-paper" : "bg-ink/10"}`}>
                {i < step || sent ? <Check className="size-3" strokeWidth={3} aria-hidden /> : i + 1}
              </span>
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div key={step} className="step-in mt-9 text-center">
        {step === 0 && (
          <>
            <h3 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] sm:text-[2.25rem]">Hangi günler gelebilirsin?</h3>
            <p className="mt-2 text-ink-soft">Birden fazla gün seçebilirsin.</p>
            <div className="mt-7 grid grid-cols-4 gap-2 sm:grid-cols-7">
              {WEEKDAYS.map((w) => {
                const on = days.includes(w.id);
                return (
                  <button
                    key={w.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setDays((cur) => (on ? cur.filter((x) => x !== w.id) : [...cur, w.id]))}
                    className={`grid min-h-16 place-items-center rounded-2xl text-base font-semibold transition-[background-color,color,transform] duration-200 active:scale-95 ${
                      on ? "bg-ink text-paper" : "bg-paper text-ink ring-1 ring-ink/10 hover:ring-ink/40"
                    }`}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>
            {tried && days.length === 0 && <p className="mt-3 text-sm font-medium text-danger">En az bir gün seç.</p>}
            <div className="mx-auto mt-7 grid max-w-md grid-cols-2 gap-3">
              <TimeSelect label="En erken saat" value={timeFrom} onChange={setTimeFrom} hours={HOURS.slice(0, -1)} />
              <TimeSelect label="En geç saat" value={timeTo} onChange={setTimeTo} hours={HOURS.slice(1)} />
            </div>
            {timeError && <p className="mt-3 text-sm font-medium text-danger">{timeError}</p>}
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] sm:text-[2.25rem]">Hangi dersi istiyorsun?</h3>
            <p className="mt-2 text-ink-soft">Grup dersi belli günlerde; özel derste 6 kişiye kadar gelebilirsin.</p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {disciplines.map((x, i) => {
                const on = discipline === x.slug;
                return (
                  <button
                    key={x.slug}
                    type="button"
                    aria-pressed={on}
                    aria-label={x.name}
                    onClick={() => setDiscipline(x.slug)}
                    className={`group on-ink @container relative aspect-[4/5] overflow-hidden rounded-[22px] bg-ink text-left text-paper transition-[box-shadow,transform] duration-200 active:scale-[0.98] ${
                      on ? "ring-4 ring-lime" : "ring-0"
                    } ${i === 4 ? "col-span-2 aspect-[16/9] sm:col-span-1 sm:aspect-[4/5]" : ""} lg:aspect-[3/4]`}
                  >
                    <DisciplineVisual d={x} sizes="(min-width: 640px) 240px, 50vw" className="transition-transform duration-500 group-hover:scale-[1.04]" />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/0" />
                    {on && (
                      <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-lime text-ink">
                        <Check className="size-4" strokeWidth={3} aria-hidden />
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 p-4">
                      <span className="block text-[12px] font-semibold text-paper/75">
                        {x.formats.filter((f) => f !== "online").map((f) => SHORT[f]).join(", ")}
                      </span>
                      <span className="mt-0.5 block text-lg leading-tight font-semibold tracking-tight sm:text-xl">{x.name}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {tried && !discipline && <p className="mt-3 text-sm font-medium text-danger">Bir ders seç.</p>}
          </>
        )}

        {step === 2 && d && (
          <>
            {!sent && (
              <>
                <h3 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] sm:text-[2.25rem]">Son adım: adın ne?</h3>
                <p className="mx-auto mt-2 max-w-md text-ink-soft">
                  {d.name}, {WEEKDAYS.filter((w) => days.includes(w.id)).map((w) => w.label).join(", ")}
                  {timeFrom || timeTo ? `, ${timeFrom || "…"}-${timeTo || "…"}` : ""}. {company.whatsapp ? "Hepsi WhatsApp mesajına yazılır." : "Antrenörümüz seni arar."}
                </p>
              </>
            )}
            <div className={sent ? "" : "mt-7"}>
              <RequestFinish
                form="wizard"
                onBack={() => setStep(1)}
                onDone={() => setSent(true)}
                choice={{ discipline: d.slug, format, days, timeFrom, timeTo }}
              />
            </div>
          </>
        )}
      </div>

      {step < 2 && (
        <div className="mt-9 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-center">
          {step > 0 && (
            <button type="button" onClick={() => setStep((s) => s - 1)} className={buttonClass("ghost", "w-full sm:w-auto")}>
              Geri
            </button>
          )}
          <button type="button" onClick={next} className={buttonClass("ink", "min-h-14 w-full px-8 text-base sm:w-auto")}>
            Devam
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
