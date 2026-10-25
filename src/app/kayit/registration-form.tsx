"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import {
  disciplines,
  formats,
  plans,
  PRIVATE_GROUP_MAX,
  type DisciplineSlug,
  type FormatId,
  type PlanId,
} from "@/content/site";
import { company } from "@/content/company";
import { buttonClass } from "@/components/ui";
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
  const groupPlans = plans.filter((p) => p.format === "group");
  const initialPlan = pick<PlanId>(params.get("paket"), groupPlans.map((p) => p.id));
  const initialFormat =
    pick<FormatId>(params.get("format"), ["group", "private", "online"]) ??
    (initialPlan ? "group" : pick<FormatId>(params.get("paket"), ["private", "online"]));

  const [discipline, setDiscipline] = useState<DisciplineSlug | null>(
    pick(params.get("brans"), disciplines.map((d) => d.slug)),
  );
  const [format, setFormat] = useState<FormatId | null>(initialFormat);
  const [plan, setPlan] = useState<PlanId | null>(initialPlan);
  const [people, setPeople] = useState<number>(() => Math.min(PRIVATE_GROUP_MAX, Math.max(1, Number(params.get("kisi")) || 1)));

  const [state, action, pending] = useActionState<RegistrationState, FormData>(submitRegistration, {
    status: "idle",
  });
  const errors = state.status === "error" ? state.errors : {};
  const values: Record<string, string> = state.status === "error" ? state.values : {};

  const selected = disciplines.find((d) => d.slug === discipline);
  // Only the ways this discipline is offered; picking a discipline first narrows them.
  const availableFormats = formats.filter((f) => !selected || selected.formats.includes(f.id));
  const availableDisciplines = disciplines.filter((d) => !format || d.formats.includes(format));

  function chooseDiscipline(slug: DisciplineSlug) {
    setDiscipline(slug);
    const d = disciplines.find((x) => x.slug === slug)!;
    if (format && !d.formats.includes(format)) setFormat(d.formats.length === 1 ? d.formats[0] : null);
    else if (!format && d.formats.length === 1) setFormat(d.formats[0]);
  }

  if (state.status === "ok") {
    const wa = company.whatsapp ? `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(state.summary)}` : null;
    return (
      <div className="rounded-[28px] bg-card p-7 sm:p-10" role="status">
        <span className="grid size-14 place-items-center rounded-2xl bg-lime">
          <Check className="size-7" aria-hidden />
        </span>
        <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">Talebin alındı.</h2>
        <p className="mt-3 max-w-prose text-lg text-ink-soft">
          Talep numaran <strong className="text-ink tabular-nums">{state.reference}</strong>. Antrenörümüz uygun gün ve
          saati konuşmak için seni arayacak.
        </p>
        {wa && (
          <>
            <p className="mt-6 max-w-prose text-ink-soft">{"Daha hızlı dönüş için talebini WhatsApp'tan da gönderebilirsin."}</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("ink", "mt-4")}>
              <MessageCircle className="size-5" aria-hidden />
              {"WhatsApp'tan gönder"}
            </a>
          </>
        )}
        <pre className="mt-8 rounded-2xl bg-paper p-5 font-sans text-[15px] whitespace-pre-wrap">{state.summary}</pre>
      </div>
    );
  }

  const chip =
    "cursor-pointer rounded-full bg-card px-4 py-2 ring-1 ring-ink/15 has-[:checked]:bg-lime has-[:checked]:ring-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink";
  const slots = format === "private" ? (["sabah", "öğle", "akşam", "farketmez"] as const) : (["sabah", "akşam", "farketmez"] as const);
  const slotLabel = { sabah: "Sabah", öğle: "Öğle", akşam: "Akşam", farketmez: "Fark etmez" } as const;

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
          {availableDisciplines.map((d) => (
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

      <Step n={2} title="Nasıl" error={errors.format}>
        <div className="grid gap-3 sm:grid-cols-3">
          {availableFormats.map((f) => (
            <label key={f.id} className={optionClass}>
              <input
                type="radio"
                name="format"
                value={f.id}
                checked={format === f.id}
                onChange={() => setFormat(f.id)}
                className="sr-only"
              />
              <span className="font-semibold">{f.name}</span>
              <span className="text-sm text-ink-soft">{f.summary}</span>
            </label>
          ))}
        </div>
      </Step>

      <Step n={3} title="Ayrıntı" error={errors.plan ?? errors.people}>
        {format === "group" ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {groupPlans.map((p) => (
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
                  <span className="text-sm text-ink-soft">
                    {p.detail}; {p.includes[1]?.toLocaleLowerCase("tr")}
                  </span>
                </label>
              ))}
            </div>
          </>
        ) : format === "private" ? (
          <div>
            <p className="text-sm font-semibold">Kaç kişi olacaksınız?</p>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Kişi sayısı">
              {Array.from({ length: PRIVATE_GROUP_MAX }, (_, i) => i + 1).map((n) => (
                <label key={n} className={`${chip} min-w-12 text-center tabular-nums`}>
                  <input type="radio" name="people" value={n} checked={people === n} onChange={() => setPeople(n)} className="sr-only" />
                  {n === 1 ? "Yalnız ben" : n}
                </label>
              ))}
            </div>
          </div>
        ) : format === "online" ? (
          <p className="text-ink-soft">Antrenörümüz canlı ders mi kişisel program mı istediğini ve uygun saatleri seninle konuşur.</p>
        ) : (
          <p className="text-ink-soft">Önce nasıl çalışmak istediğini seç.</p>
        )}
        {format && format !== "online" && (
          <div className="mt-5">
            <p className="text-sm font-semibold">{format === "group" ? "Hangi grup" : "Sana uygun zaman"}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {slots.map((sl) => (
                <label key={sl} className={chip}>
                  <input type="radio" name="slot" value={sl} defaultChecked={sl === (values.slot ?? "farketmez")} className="sr-only" />
                  {sl === "farketmez" ? slotLabel[sl] : format === "group" ? `${slotLabel[sl]} grubu` : slotLabel[sl]}
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

      <div className="border-t border-ink/15 pt-8">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" defaultChecked={values.consent === "on"} className="mt-1 size-5 accent-ink" aria-invalid={!!errors.consent} />
          <span className="text-[15px]">
            Kişisel verilerimin ders talebimin değerlendirilmesi için işlenmesine ilişkin{" "}
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
          {pending ? "Gönderiliyor…" : "Talebi gönder"}
        </button>
        <p className="mt-3 text-sm text-ink-soft">Ödeme alınmaz; antrenörümüz seni arar.</p>
      </div>
    </form>
  );
}
