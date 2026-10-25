"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { company } from "@/content/company";
import { submitStudioRequest, type RegistrationState } from "@/app/kayit/actions";
import { whatsappMessage, type WeekdayId } from "@/domain/registration";
import { buttonClass } from "@/components/ui";

export type RequestChoice = {
  discipline: string;
  format: "group" | "private";
  plan?: string;
  slot?: "sabah" | "akşam";
  days: WeekdayId[];
  timeFrom: string;
  timeTo: string;
  /** Extra line for the studio, e.g. the planner's suggestion. */
  note?: string;
};

const input =
  "mt-1.5 block min-h-13 w-full rounded-2xl bg-paper px-4 text-[16px] ring-1 ring-ink/15 outline-none transition-shadow focus:ring-2 focus:ring-ink aria-invalid:ring-2 aria-invalid:ring-danger";

/**
 * The last step of both home-page flows: name (and a mobile number when the
 * studio has no WhatsApp line yet), consent, send. With WhatsApp the visitor
 * lands in a chat with everything they chose already written; the same
 * request is recorded in the studio's CRM.
 */
export function RequestFinish({
  choice,
  form,
  onBack,
  onDone,
}: {
  choice: RequestChoice;
  form: "wizard" | "planner";
  onBack?: () => void;
  /** Called once the request is sent (or WhatsApp opened), so the parent can drop its own heading. */
  onDone?: () => void;
}) {
  const [state, action, pending] = useActionState<RegistrationState, FormData>(submitStudioRequest, { status: "idle" });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [consent, setConsent] = useState(false);
  const [local, setLocal] = useState<Record<string, string>>({});
  const [chatUrl, setChatUrl] = useState<string | null>(null);
  const wa = company.whatsapp;
  const errors = { ...(state.status === "error" ? state.errors : {}), ...local };
  const done = state.status === "ok" || !!chatUrl;

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  if (done) {
    return (
      <div role="status" className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-lime">
          <Check className="size-8" aria-hidden />
        </span>
        <h3 className="mt-6 text-[2rem] leading-none font-semibold tracking-[-0.035em]">
          {chatUrl ? "Mesajın WhatsApp'ta hazır." : "Talebin alındı."}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-lg text-ink-soft">
          {chatUrl
            ? "Gönder'e basman yeterli; antrenörümüz oradan dönüş yapar."
            : `Talep numaran ${state.status === "ok" ? state.reference : ""}. Antrenörümüz seni arayacak.`}
        </p>
        {chatUrl && (
          <a href={chatUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("ink", "mt-6")}>
            <MessageCircle className="size-5" aria-hidden />
            WhatsApp&apos;ı tekrar aç
          </a>
        )}
      </div>
    );
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // Checked here so every missing field shows at once, and so WhatsApp opens
    // in the same tap (a pop-up must come from the click itself). The server checks again.
    const missing: Record<string, string> = {};
    if (firstName.trim().length < 2) missing.firstName = "Adını yaz.";
    if (lastName.trim().length < 2) missing.lastName = "Soyadını yaz.";
    if (!wa && !String(data.get("phone") ?? "").trim()) missing.phone = "Cep telefonunu yaz.";
    if (!consent) missing.consent = "Devam etmek için aydınlatma metnini onayla.";
    setLocal(missing);
    if (Object.keys(missing).length) return;
    if (wa) {
      const text = whatsappMessage(
        { firstName: firstName.trim(), lastName: lastName.trim(), discipline: choice.discipline, format: choice.format, days: choice.days, timeFrom: choice.timeFrom, timeTo: choice.timeTo },
        choice.note,
      );
      const url = `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener");
      setChatUrl(url);
    }
    startTransition(() => action(data));
  }

  return (
    <form onSubmit={submit} noValidate>
      <input type="hidden" name="form" value={form} />
      <input type="hidden" name="channel" value={wa ? "whatsapp" : "form"} />
      <input type="hidden" name="discipline" value={choice.discipline} />
      <input type="hidden" name="format" value={choice.format} />
      <input type="hidden" name="plan" value={choice.plan ?? ""} />
      <input type="hidden" name="slot" value={choice.slot ?? "farketmez"} />
      <input type="hidden" name="timeFrom" value={choice.timeFrom} />
      <input type="hidden" name="timeTo" value={choice.timeTo} />
      <input type="hidden" name="note" value={choice.note ?? ""} />
      {choice.days.map((d) => (
        <input key={d} type="hidden" name="days" value={d} />
      ))}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-left">
          <span className="text-sm font-semibold">Ad</span>
          <input name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" aria-invalid={!!errors.firstName} className={input} />
          {errors.firstName && <span className="mt-1 block text-sm font-medium text-danger">{errors.firstName}</span>}
        </label>
        <label className="block text-left">
          <span className="text-sm font-semibold">Soyad</span>
          <input name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" aria-invalid={!!errors.lastName} className={input} />
          {errors.lastName && <span className="mt-1 block text-sm font-medium text-danger">{errors.lastName}</span>}
        </label>
        {!wa && (
          <label className="block text-left sm:col-span-2">
            <span className="text-sm font-semibold">Cep telefonu</span>
            <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="05xx xxx xx xx" aria-invalid={!!errors.phone} className={input} />
            {errors.phone && <span className="mt-1 block text-sm font-medium text-danger">{errors.phone}</span>}
          </label>
        )}
      </div>

      <label className="mt-5 flex items-start gap-3 text-left">
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
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
      {errors.consent && <p className="mt-2 text-left text-sm font-medium text-danger">{errors.consent}</p>}

      {state.status === "error" && !Object.keys(state.errors).length && (
        <p role="alert" className="mt-5 rounded-2xl bg-danger/10 px-4 py-3 font-medium text-danger">
          {state.message}
        </p>
      )}

      <div className="mt-7 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-center">
        {onBack && (
          <button type="button" onClick={onBack} className={buttonClass("ghost", "w-full sm:w-auto")}>
            Geri
          </button>
        )}
        <button type="submit" disabled={pending} className={buttonClass("primary", "min-h-14 w-full px-8 text-base sm:w-auto")}>
          {wa && <MessageCircle className="size-5" aria-hidden />}
          {pending ? "Gönderiliyor…" : wa ? "WhatsApp'tan ders talebi gönder" : "Ders talebini gönder"}
        </button>
      </div>
    </form>
  );
}
