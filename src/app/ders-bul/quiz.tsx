"use client";

import { useState } from "react";
import { disciplines, formats } from "@/content/site";
import { questions, recommend, type Answers } from "@/domain/matcher";
import { ButtonLink, buttonClass } from "@/components/ui";

export function Quiz() {
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const step = questions.findIndex((q) => !(q.key in answers));
  const done = step === -1;

  if (done) {
    const rec = recommend(answers as Answers);
    const d = disciplines.find((x) => x.slug === rec.discipline)!;
    const f = formats.find((x) => x.id === rec.format)!;
    return (
      <div className="rounded-[28px] bg-ink p-7 text-paper on-ink sm:p-10" aria-live="polite">
        <p className="text-paper/60">Sana önerimiz</p>
        <h2 className="mt-2 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.045em]">
          {d.name}
        </h2>
        <p className="mt-3 text-xl font-semibold text-lime">{f.name}</p>
        <p className="mt-5 max-w-prose text-paper/75">{d.description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/kayit?brans=${d.slug}&format=${f.id}`}>Bu ders için talep bırak</ButtonLink>
          <button
            type="button"
            onClick={() => setAnswers({})}
            className={buttonClass("ghost", "text-paper ring-paper/30 hover:ring-paper/60")}
          >
            Testi yeniden çöz
          </button>
        </div>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div>
      <div className="flex gap-2" aria-hidden>
        {questions.map((x, i) => (
          <span key={x.key} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-ink" : "bg-ink/15"}`} />
        ))}
      </div>
      <p className="mt-6 text-ink-soft">
        Soru {step + 1} / {questions.length}
      </p>
      <fieldset className="mt-2">
        <legend className="font-display text-[clamp(1.75rem,4.5vw,2.75rem)] leading-tight font-bold tracking-[-0.03em]">
          {q.title}
        </legend>
        <div className="mt-8 grid gap-3">
          {q.options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setAnswers((a) => ({ ...a, [q.key]: o.value }))}
              className="min-h-16 rounded-2xl bg-card px-5 py-4 text-left text-lg font-semibold ring-1 ring-ink/10 transition hover:bg-lime hover:ring-ink"
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>
      {step > 0 && (
        <button
          type="button"
          onClick={() => {
            const prev = questions[step - 1].key;
            setAnswers((a) => {
              const next = { ...a };
              delete next[prev];
              return next;
            });
          }}
          className="mt-6 min-h-11 font-semibold underline underline-offset-4"
        >
          Önceki soru
        </button>
      )}
    </div>
  );
}
