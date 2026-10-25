"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { Check } from "lucide-react";
import { disciplines } from "@/content/site";
import { submitQuickRequest } from "@/app/kayit/actions";
import type { RegistrationState } from "@/app/kayit/actions";
import { buttonClass } from "@/components/ui";

const input =
  "mt-1.5 block min-h-12 w-full rounded-2xl bg-paper px-4 text-[16px] ring-1 ring-ink/15 outline-none transition-shadow focus:ring-2 focus:ring-ink aria-invalid:ring-2 aria-invalid:ring-danger";

/**
 * The short request: which lesson, name, mobile, consent. Everything else
 * (package, people, time, price) is settled on the call. The request goes to
 * the CRM's "Gelen aramalar".
 */
export function QuickRequest() {
  const [state, action, pending] = useActionState<RegistrationState, FormData>(submitQuickRequest, { status: "idle" });
  const errors = state.status === "error" ? state.errors : {};
  const values: Record<string, string> = state.status === "error" ? state.values : {};
  const [discipline, setDiscipline] = useState<string>(values.discipline ?? "");

  if (state.status === "ok") {
    return (
      <div role="status" className="flex min-h-[420px] flex-col justify-center rounded-[28px] bg-card p-7 sm:p-10">
        <span className="grid size-14 place-items-center rounded-full bg-lime">
          <Check className="size-7" aria-hidden />
        </span>
        <h3 className="mt-6 text-[2rem] leading-none font-semibold tracking-[-0.035em]">Talebin alındı.</h3>
        <p className="mt-3 max-w-md text-lg text-ink-soft">
          Talep numaran <strong className="text-ink tabular-nums">{state.reference}</strong>. Antrenörümüz uygun gün ve saati
          konuşmak için seni arayacak.
        </p>
      </div>
    );
  }

  return (
    <form
      // onSubmit rather than `action`, so a failed validation keeps what was typed.
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      noValidate
      className="rounded-[28px] bg-card p-6 sm:p-9"
    >
      <fieldset>
        <legend className="text-sm font-semibold">Hangi ders?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {disciplines.map((d) => (
            <label
              key={d.slug}
              className="cursor-pointer rounded-full bg-paper px-4 py-2.5 text-[15px] font-medium ring-1 ring-ink/15 transition-colors has-[:checked]:bg-ink has-[:checked]:text-paper has-[:checked]:ring-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
            >
              <input
                type="radio"
                name="discipline"
                value={d.slug}
                checked={discipline === d.slug}
                onChange={() => setDiscipline(d.slug)}
                className="sr-only"
              />
              {d.name}
            </label>
          ))}
        </div>
        {errors.discipline && (
          <p role="alert" className="mt-2 text-sm font-medium text-danger">
            {errors.discipline}
          </p>
        )}
        {discipline === "mat-pilates" && (
          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input type="checkbox" name="online" defaultChecked={values.online === "on"} className="mt-0.5 size-5 accent-ink" />
            <span>
              <span className="font-semibold">Online ders talebi</span>
              <span className="block text-sm text-ink-soft">Evden, canlı ders.</span>
            </span>
          </label>
        )}
      </fieldset>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Ad</span>
          <input name="firstName" autoComplete="given-name" defaultValue={values.firstName} aria-invalid={!!errors.firstName} className={input} />
          {errors.firstName && <span className="mt-1 block text-sm font-medium text-danger">{errors.firstName}</span>}
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Soyad</span>
          <input name="lastName" autoComplete="family-name" defaultValue={values.lastName} aria-invalid={!!errors.lastName} className={input} />
          {errors.lastName && <span className="mt-1 block text-sm font-medium text-danger">{errors.lastName}</span>}
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold">Cep telefonu</span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="05xx xxx xx xx"
            defaultValue={values.phone}
            aria-invalid={!!errors.phone}
            className={input}
          />
          {errors.phone && <span className="mt-1 block text-sm font-medium text-danger">{errors.phone}</span>}
        </label>
      </div>

      {/* Honeypot: hidden from people, filled by bots; such a request is never sent. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <label className="mt-6 flex items-start gap-3">
        <input
          type="checkbox"
          name="consent"
          defaultChecked={values.consent === "on"}
          aria-invalid={!!errors.consent}
          className="mt-1 size-5 shrink-0 accent-ink"
        />
        <span className="text-[15px] text-ink-soft">
          Kişisel verilerimin ders talebimin değerlendirilmesi için işlenmesine ilişkin{" "}
          <Link href="/kvkk" target="_blank" className="font-semibold text-ink underline underline-offset-4">
            aydınlatma metnini
          </Link>{" "}
          okudum.
        </span>
      </label>
      {errors.consent && <p className="mt-2 text-sm font-medium text-danger">{errors.consent}</p>}

      {state.status === "error" && (
        <p role="alert" className="mt-6 rounded-2xl bg-danger/10 px-4 py-3 font-medium text-danger">
          {state.message}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={pending} className={buttonClass("primary", "w-full sm:w-auto sm:px-8")}>
          {pending ? "Gönderiliyor…" : "Talebi gönder"}
        </button>
        <Link href="/kayit" className="text-sm font-semibold text-ink-soft underline-offset-4 hover:text-ink hover:underline">
          Paket ya da kişi sayısı seçerek gönder
        </Link>
      </div>
    </form>
  );
}
