"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import {
  disciplines,
  formats,
  plans,
  whatsappNumber,
  type DisciplineSlug,
  type FormatId,
  type PlanId,
} from "@/content/site";
import { paymentMethods } from "@/domain/registration";
import { buttonClass, SoonTag } from "@/components/ui";
import { submitRegistration, type RegistrationState } from "./actions";

function pick<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

const optionClass =
  "relative flex cursor-pointer flex-col rounded-2xl bg-card p-4 ring-1 ring-ink/10 transition has-[:checked]:bg-lime has-[:checked]:ring-ink has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink";

function Step({ n, title, children, error }: { n: number; title: string; children: React.ReactNode; error?: string }) {
  return (
    <fieldset className="border-t border-ink/15 pt-8">
      <legend className="flex items-baseline gap-3 font-display text-2xl font-bold tracking-tight">
        <span className="text-moss tabular-nums">{n}</span>
        {title}
      </legend>
      <div className="mt-5">{children}</div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Field({
  label,
  name,
  error,
  optional,
  ...props
}: React.ComponentProps<"input"> & { label: string; name: string; error?: string; optional?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">
        {label} {optional && <span className="font-normal text-ink-soft">(isteğe bağlı)</span>}
      </span>
      <input
        name={name}
        aria-invalid={!!error}
        className="mt-1.5 block min-h-12 w-full rounded-xl bg-card px-4 ring-1 ring-ink/15 outline-none focus:ring-2 focus:ring-ink aria-invalid:ring-danger"
        {...props}
      />
      {error && <span className="mt-1 block text-sm font-medium text-danger">{error}</span>}
    </label>
  );
}

export function RegistrationForm() {
  const params = useSearchParams();
  const initialPlan = pick<PlanId>(params.get("paket"), plans.map((p) => p.id));
  const initialFormat =
    pick<FormatId>(params.get("format"), ["studio", "live", "coaching"]) ??
    (initialPlan ? plans.find((p) => p.id === initialPlan)!.format : null);

  const [discipline, setDiscipline] = useState<DisciplineSlug | null>(
    pick(params.get("brans"), disciplines.map((d) => d.slug)),
  );
  const [format, setFormat] = useState<FormatId | null>(initialFormat);
  const [plan, setPlan] = useState<PlanId | null>(initialPlan);

  const [state, action, pending] = useActionState<RegistrationState, FormData>(submitRegistration, {
    status: "idle",
  });
  const errors = state.status === "error" ? state.errors : {};
  const values: Record<string, string> = state.status === "error" ? state.values : {};

  const selected = disciplines.find((d) => d.slug === discipline);
  const availableFormats = formats.filter((f) => !selected || selected.formats.includes(f.id));
  const availablePlans = plans.filter((p) => p.format === format);

  function chooseDiscipline(slug: DisciplineSlug) {
    setDiscipline(slug);
    const d = disciplines.find((x) => x.slug === slug)!;
    if (format && !d.formats.includes(format)) {
      setFormat(null);
      setPlan(null);
    }
  }

  function chooseFormat(id: FormatId) {
    setFormat(id);
    if (plan && plans.find((p) => p.id === plan)!.format !== id) setPlan(null);
  }

  if (state.status === "ok") {
    const wa = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(state.summary)}` : null;
    return (
      <div className="rounded-[28px] bg-card p-7 sm:p-10" role="status">
        <span className="grid size-14 place-items-center rounded-2xl bg-lime">
          <Check className="size-7" aria-hidden />
        </span>
        <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">Ön kaydın alındı.</h2>
        <p className="mt-3 max-w-prose text-lg text-ink-soft">
          Kayıt numaran <strong className="text-ink tabular-nums">{state.reference}</strong>. Antrenörümüz ilk dersini
          planlamak için seni arayacak.
        </p>
        {wa && (
          <>
            <p className="mt-6 max-w-prose text-ink-soft">{"Daha hızlı dönüş için kaydını WhatsApp'tan da gönderebilirsin."}</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("ink", "mt-4")}>
              <MessageCircle className="size-5" aria-hidden />
              {"WhatsApp'tan gönder"}
            </a>
          </>
        )}
        <pre className="mt-8 rounded-2xl bg-stone p-5 font-sans text-[15px] whitespace-pre-wrap">{state.summary}</pre>
      </div>
    );
  }

  return (
    <form
      // Submitted through onSubmit rather than `action` so React does not
      // reset the form when validation fails and the visitor keeps their picks.
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="space-y-10"
      noValidate
    >
      <Step n={1} title="Branş" error={errors.discipline}>
        <div className="grid gap-3 sm:grid-cols-2">
          {disciplines.map((d) => (
            <label key={d.slug} className={optionClass}>
              <input
                type="radio"
                name="discipline"
                value={d.slug}
                checked={discipline === d.slug}
                onChange={() => chooseDiscipline(d.slug)}
                className="sr-only"
              />
              <span className="font-display text-xl font-bold tracking-tight">{d.name}</span>
              <span className="text-sm text-ink-soft">{d.tagline}</span>
            </label>
          ))}
        </div>
      </Step>

      <Step n={2} title="Nerede" error={errors.format}>
        <div className="grid gap-3 sm:grid-cols-3">
          {availableFormats.map((f) => (
            <label key={f.id} className={optionClass}>
              <input
                type="radio"
                name="format"
                value={f.id}
                checked={format === f.id}
                onChange={() => chooseFormat(f.id)}
                className="sr-only"
              />
              <span className="font-semibold">{f.name}</span>
              <span className="text-sm text-ink-soft">{f.summary}</span>
            </label>
          ))}
        </div>
      </Step>

      <Step n={3} title="Paket" error={errors.plan}>
        {format ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {availablePlans.map((p) => (
              <label key={p.id} className={optionClass}>
                <input
                  type="radio"
                  name="plan"
                  value={p.id}
                  checked={plan === p.id}
                  onChange={() => setPlan(p.id)}
                  className="sr-only"
                />
                <span className="font-semibold">{p.name}</span>
                <span className="text-sm text-ink-soft">{p.detail}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-ink-soft">Paketleri görmek için önce nerede çalışacağını seç.</p>
        )}
        {format === "studio" && (
          <div className="mt-5">
            <p className="text-sm font-semibold">Saat tercihin</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["sabah", "akşam", "farketmez"] as const).map((s) => (
                <label
                  key={s}
                  className="cursor-pointer rounded-full bg-card px-4 py-2 capitalize ring-1 ring-ink/15 has-[:checked]:bg-lime has-[:checked]:ring-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink"
                >
                  <input type="radio" name="slot" value={s} defaultChecked={s === (values.slot ?? "farketmez")} className="sr-only" />
                  {s === "farketmez" ? "Fark etmez" : s}
                </label>
              ))}
            </div>
          </div>
        )}
      </Step>

      <Step n={4} title="Bilgilerin">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ad" name="firstName" defaultValue={values.firstName} autoComplete="given-name" error={errors.firstName} required />
          <Field label="Soyad" name="lastName" defaultValue={values.lastName} autoComplete="family-name" error={errors.lastName} required />
          <Field
            label="Cep telefonu"
            name="phone"
            defaultValue={values.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="05xx xxx xx xx"
            error={errors.phone}
            required
          />
          <Field label="E-posta" name="email" defaultValue={values.email} type="email" autoComplete="email" error={errors.email} optional />
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold">
              Antrenörün bilmesi gereken bir şey var mı? <span className="font-normal text-ink-soft">(isteğe bağlı)</span>
            </span>
            <textarea
              name="note"
              defaultValue={values.note}
              rows={3}
              maxLength={500}
              placeholder="Örneğin bel fıtığı, gebelik, uygun olduğun günler"
              className="mt-1.5 block w-full rounded-xl bg-card px-4 py-3 ring-1 ring-ink/15 outline-none focus:ring-2 focus:ring-ink"
            />
          </label>
        </div>
      </Step>

      <Step n={5} title="Ödeme" error={errors.payment}>
        <div className="grid gap-3 sm:grid-cols-3">
          {paymentMethods.map((m) => (
            <label key={m.id} className={optionClass}>
              <input
                type="radio"
                name="payment"
                value={m.id}
                disabled={!m.available}
                defaultChecked={m.id === (values.payment ?? "studio")}
                className="sr-only"
              />
              <span className="flex items-center gap-2 font-semibold">
                {m.name} {!m.available && <SoonTag />}
              </span>
              <span className="text-sm text-ink-soft">{m.detail}</span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft">Ön kayıtta ödeme alınmaz.</p>
      </Step>

      <div className="border-t border-ink/15 pt-8">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" defaultChecked={values.consent === "on"} className="mt-1 size-5 accent-ink" aria-invalid={!!errors.consent} />
          <span className="text-[15px]">
            Kişisel verilerimin ön kaydımın değerlendirilmesi için işlenmesine ilişkin{" "}
            <Link href="/kvkk" target="_blank" className="font-semibold underline underline-offset-4">
              aydınlatma metnini
            </Link>{" "}
            okudum.
          </span>
        </label>
        {errors.consent && <p className="mt-2 text-sm font-medium text-danger">{errors.consent}</p>}

        {state.status === "error" && (
          <p role="alert" className="mt-6 rounded-xl bg-danger/10 px-4 py-3 font-medium text-danger">
            {state.message}
          </p>
        )}

        <button type="submit" disabled={pending} className={buttonClass("primary", "mt-6 w-full sm:w-auto sm:px-8")}>
          {pending ? "Gönderiliyor…" : "Ön kaydı gönder"}
        </button>
      </div>
    </form>
  );
}
