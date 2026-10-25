"use server";

import { randomUUID } from "node:crypto";
import {
  crmPayload,
  inStudioFormat,
  registrationSchema,
  summarize,
  type Registration,
  type RequestForm,
} from "@/domain/registration";
import { sendRequestToCrm } from "@/lib/crm-request";

export type RegistrationState =
  | { status: "idle" }
  | { status: "error"; errors: Record<string, string>; message: string; values: Record<string, string> }
  | { status: "ok"; reference: string; summary: string };

const FAILED = "Talebin şu an iletilemedi. Birkaç dakika sonra yeniden dene.";

function makeReference(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return `ZS-${n.toString().padStart(6, "0")}`;
}

function textValues(raw: Record<string, FormDataEntryValue>): Record<string, string> {
  return Object.fromEntries(Object.entries(raw).filter((e): e is [string, string] => typeof e[1] === "string"));
}

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

/**
 * Sends a validated request to the CRM ("Gelen aramalar"). Without the CRM
 * settings a production request fails loudly instead of being dropped; on a
 * developer machine it is only logged.
 */
async function deliver(r: Registration, form: RequestForm): Promise<{ ok: true; reference: string } | { ok: false }> {
  const reference = makeReference();
  const delivery = await sendRequestToCrm(
    crmPayload(r, { requestId: randomUUID(), reference, submittedAt: new Date().toISOString(), form }),
  );
  if (delivery.ok) return { ok: true, reference };
  if (delivery.reason === "not_configured" && process.env.NODE_ENV !== "production") {
    console.warn("REGISTRATION_WEBHOOK_URL / _SECRET not set; request not sent to the CRM", reference);
    return { ok: true, reference };
  }
  console.error("lesson request not delivered to the CRM", reference, delivery.reason);
  return { ok: false };
}

/** The full request form (/kayit): discipline, way, package or people, time, contact. */
export async function submitRegistration(_prev: RegistrationState, formData: FormData): Promise<RegistrationState> {
  const raw = Object.fromEntries(formData);
  // Echoed back so the form can restore what was typed.
  const values = textValues(raw);
  // Honeypot: people never fill a field they cannot see.
  if (values.website) return { status: "ok", reference: makeReference(), summary: "" };

  const parsed = registrationSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error.issues), message: "Bazı alanları kontrol et.", values };
  }

  const sent = await deliver(parsed.data, "detailed");
  if (!sent.ok) return { status: "error", errors: {}, values, message: FAILED };
  return { status: "ok", reference: sent.reference, summary: summarize(parsed.data, sent.reference) };
}

/**
 * The short form on the home page: which lesson, name, mobile. The way to
 * train follows from the lesson (group classes are group, the rest private),
 * Mat Pilates can be asked for online; package, people and time are settled
 * on the call.
 */
export async function submitQuickRequest(_prev: RegistrationState, formData: FormData): Promise<RegistrationState> {
  const raw = Object.fromEntries(formData);
  const values = textValues(raw);
  if (values.website) return { status: "ok", reference: makeReference(), summary: "" };

  const discipline = values.discipline ?? "";
  const online = values.online === "on" && discipline === "mat-pilates";
  const parsed = registrationSchema.safeParse({
    discipline,
    format: online ? "online" : inStudioFormat(discipline),
    plan: "",
    people: "1",
    slot: "farketmez",
    firstName: values.firstName ?? "",
    lastName: values.lastName ?? "",
    phone: values.phone ?? "",
    email: "",
    note: "",
    consent: values.consent,
  });
  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error.issues), message: "Bazı alanları kontrol et.", values };
  }

  const sent = await deliver(parsed.data, "quick");
  if (!sent.ok) return { status: "error", errors: {}, values, message: FAILED };
  return { status: "ok", reference: sent.reference, summary: summarize(parsed.data, sent.reference) };
}
