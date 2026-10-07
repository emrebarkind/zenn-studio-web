"use server";

import { registrationSchema, summarize } from "@/domain/registration";

export type RegistrationState =
  | { status: "idle" }
  | { status: "error"; errors: Record<string, string>; message: string; values: Record<string, string> }
  | { status: "ok"; reference: string; summary: string };

function makeReference(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return `ZS-${n.toString().padStart(6, "0")}`;
}

/**
 * Validates a pre-registration. There is no database on purpose (the site is
 * independent of the CRM); when REGISTRATION_WEBHOOK_URL is set, the record
 * is POSTed there as JSON (Google Apps Script, Make, Zapier, an e-mail relay…).
 * The visitor always gets a WhatsApp hand-off with the same summary.
 */
export async function submitRegistration(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const raw = Object.fromEntries(formData);
  // Echoed back so the form can restore what was typed (React resets forms
  // after an action completes).
  const values = Object.fromEntries(
    Object.entries(raw).filter((e): e is [string, string] => typeof e[1] === "string"),
  );
  const parsed = registrationSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { status: "error", errors, message: "Bazı alanları kontrol et.", values };
  }

  const reference = makeReference();
  const summary = summarize(parsed.data, reference);

  const webhook = process.env.REGISTRATION_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reference, createdAt: new Date().toISOString(), ...parsed.data }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
    } catch (err) {
      console.error("registration webhook failed", reference, err);
      return {
        status: "error",
        errors: {},
        values,
        message: "Ön kaydın şu an iletilemedi. Birkaç dakika sonra yeniden dene ya da WhatsApp'tan yaz.",
      };
    }
  }

  return { status: "ok", reference, summary };
}
