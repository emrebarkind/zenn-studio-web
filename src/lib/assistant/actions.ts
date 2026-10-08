import { disciplines, plans, type DisciplineSlug, type FormatId, type PlanId } from "@/content/site";

// Turns the action markers the model writes (see prompt.ts) into buttons, and
// hides them from the visible text — including half-streamed ones.

export type EnrollAction = { discipline: DisciplineSlug; format?: FormatId; plan?: PlanId; href: string };

export type ParsedReply = {
  text: string;
  enroll: EnrollAction | null;
  handoff: boolean;
};

const markerPattern = /<<\s*(KAYIT|EKIP)([^>]*)>>/gi;

function parseParams(raw: string): Record<string, string> {
  const params: Record<string, string> = {};
  for (const m of raw.matchAll(/(\w+)\s*=\s*([\w-]+)/g)) params[m[1].toLowerCase()] = m[2];
  return params;
}

/** Validated against site content; anything the site does not offer is dropped. */
export function toEnrollAction(params: Record<string, string>): EnrollAction | null {
  const discipline = disciplines.find((d) => d.slug === params.brans);
  if (!discipline) return null;
  const format = discipline.formats.find((f) => f === params.format);
  const plan = plans.find((p) => p.id === params.paket && (!format || p.format === format));
  const query = new URLSearchParams({ brans: discipline.slug });
  const resolvedFormat = format ?? plan?.format;
  if (resolvedFormat && !discipline.formats.includes(resolvedFormat)) return null;
  if (resolvedFormat) query.set("format", resolvedFormat);
  if (plan && (!resolvedFormat || plan.format === resolvedFormat)) query.set("paket", plan.id);
  return {
    discipline: discipline.slug,
    format: resolvedFormat,
    plan: query.has("paket") ? plan?.id : undefined,
    href: `/kayit?${query}`,
  };
}

export function parseReply(raw: string): ParsedReply {
  let enroll: EnrollAction | null = null;
  let handoff = false;
  for (const m of raw.matchAll(markerPattern)) {
    if (m[1].toUpperCase() === "EKIP") handoff = true;
    else enroll = toEnrollAction(parseParams(m[2])) ?? enroll;
  }
  const text = raw
    .replace(markerPattern, "")
    // A marker still streaming in: hide everything from its opening "<<".
    .replace(/<<[^>]*>?$/, "")
    .replace(/<$/, "")
    .trim();
  return { text, enroll, handoff };
}
