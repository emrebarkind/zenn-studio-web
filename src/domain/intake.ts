import { disciplines, type DisciplineSlug, type FormatId } from "@/content/site";
import { joinTr, WEEKDAYS, type WeekdayId } from "@/domain/registration";

/**
 * "Sana uygun dersi birlikte seçelim" (owner, 2026-10-25): a short intake that
 * gets to know the visitor, then sends what we learned to our coaches. It
 * never tells the visitor which sport is "right" for them and never asks
 * "group or private?". What we infer (level, a likely lesson and way to
 * train) goes to the coaches as a note; the visitor sees their own answers
 * back, in plain words, and decides whether to send them.
 *
 * No health questions: health data is a special category under KVKK. The
 * summary invites the visitor to tell the coach in person instead.
 */

export type GoalId = "posture" | "strength" | "fitness" | "mobility" | "stress" | "coordination";
export type TriedId = "pilates" | "cycling" | "boxing" | "weights" | "yoga" | "none";
export type InterestId = DisciplineSlug | "open";
export type WindowId = "morning" | "midday" | "afternoon" | "evening";

export type IntakeAnswers = {
  goals: GoalId[];
  activity: "0" | "1-2" | "3-4" | "5+";
  sitting: "<2" | "2-5" | "5-8" | "8+";
  /** 1 = calm and controlled … 5 = high tempo. */
  pace: "1" | "2" | "3" | "4" | "5";
  tried: TriedId[];
  interests: InterestId[];
  company: "solo" | "pair" | "small";
  schedule: "fixed" | "varies" | "shifts";
  frequency: "1" | "2" | "3" | "4+";
  days: WeekdayId[];
  windows: WindowId[];
  age: "18-24" | "25-34" | "35-44" | "45-54" | "55+" | "skip";
};

type Option<V extends string = string> = { value: V; label: string; hint?: string };

export type IntakeStep =
  | { key: "goals" | "tried" | "interests"; kind: "multi"; title: string; hint?: string; options: Option[]; max?: number; exclusive?: string }
  | { key: "activity" | "sitting" | "company" | "schedule" | "frequency" | "age"; kind: "single"; title: string; hint?: string; options: Option[] }
  | { key: "pace"; kind: "scale"; title: string; hint?: string; low: string; high: string }
  | { key: "when"; kind: "when"; title: string; hint?: string };

export const WINDOWS: { id: WindowId; label: string; from: string; to: string }[] = [
  { id: "morning", label: "Sabah", from: "07:00", to: "10:00" },
  { id: "midday", label: "Öğle", from: "10:00", to: "14:00" },
  { id: "afternoon", label: "Öğleden sonra", from: "14:00", to: "17:00" },
  { id: "evening", label: "Akşam", from: "17:00", to: "22:00" },
];

const GOALS: Option<GoalId>[] = [
  { value: "posture", label: "Duruş ve bel‑sırt", hint: "Daha dik, daha rahat" },
  { value: "strength", label: "Güç ve sıkılık", hint: "Daha güçlü bir vücut" },
  { value: "fitness", label: "Kondisyon", hint: "Nefes ve dayanıklılık" },
  { value: "mobility", label: "Esneklik", hint: "Daha rahat hareket" },
  { value: "stress", label: "Stres atmak", hint: "Zihni dinlendirmek" },
  { value: "coordination", label: "Koordinasyon", hint: "Refleks ve denge" },
];

const SITTING: Option<IntakeAnswers["sitting"]>[] = [
  { value: "<2", label: "2 saatten az" },
  { value: "2-5", label: "2-5 saat" },
  { value: "5-8", label: "5-8 saat" },
  { value: "8+", label: "8 saatten fazla" },
];

const TRIED: Option<TriedId>[] = [
  { value: "pilates", label: "Pilates" },
  { value: "cycling", label: "Spinning ya da bisiklet" },
  { value: "boxing", label: "Kickboks ya da boks" },
  { value: "weights", label: "Fitness, ağırlık" },
  { value: "yoga", label: "Yoga" },
  { value: "none", label: "Hiçbirini" },
];

export const intakeSteps: IntakeStep[] = [
  { key: "goals", kind: "multi", title: "En çok neyi geliştirmek istiyorsun?", hint: "En fazla iki tane seç.", options: GOALS, max: 2 },
  {
    key: "activity",
    kind: "single",
    title: "Şu an haftada kaç gün spor yapıyorsun?",
    hint: "Yürüyüş, bisiklet, salon; düzenli olan her şey sayılır.",
    options: [
      { value: "0", label: "Hiç" },
      { value: "1-2", label: "1-2 gün" },
      { value: "3-4", label: "3-4 gün" },
      { value: "5+", label: "5 gün ve üzeri" },
    ],
  },
  {
    key: "sitting",
    kind: "single",
    title: "Gün içinde ortalama kaç saat oturuyorsun?",
    hint: "İş, okul, araba, ekran başı; hepsi birlikte.",
    options: SITTING,
  },
  { key: "pace", kind: "scale", title: "Antrenmanda hangi tempo sana iyi gelir?", low: "Sakin ve kontrollü", high: "Yüksek tempo, bol ter" },
  { key: "tried", kind: "multi", title: "Daha önce neleri denedin?", hint: "Birden fazla seçebilirsin.", options: TRIED, exclusive: "none" },
  {
    key: "interests",
    kind: "multi",
    title: "Hangi derslerimizle ilgileniyorsun?",
    hint: "Birden fazla seçebilirsin. Emin değilsen birlikte karar veririz.",
    options: [
      ...disciplines.map((d) => ({ value: d.slug, label: d.name })),
      { value: "open", label: "Henüz karar vermedim", hint: "Siz yönlendirin" },
    ],
    exclusive: "open",
  },
  {
    key: "company",
    kind: "single",
    title: "Derslere kiminle gelmeyi düşünüyorsun?",
    options: [
      { value: "solo", label: "Tek başıma" },
      { value: "pair", label: "Eşim ya da bir arkadaşımla" },
      { value: "small", label: "3-6 kişilik bir grubumla" },
    ],
  },
  {
    key: "schedule",
    kind: "single",
    title: "Haftalık programın nasıl?",
    options: [
      { value: "fixed", label: "Her hafta aynı", hint: "Gün ve saatlerim belli" },
      { value: "varies", label: "Haftadan haftaya değişiyor", hint: "Esnek planlamam gerekiyor" },
      { value: "shifts", label: "Vardiyalı çalışıyorum", hint: "Saatlerim dönüşümlü" },
    ],
  },
  {
    key: "frequency",
    kind: "single",
    title: "Haftada kaç gün derse ayırabilirsin?",
    options: [
      { value: "1", label: "1 gün" },
      { value: "2", label: "2 gün" },
      { value: "3", label: "3 gün" },
      { value: "4+", label: "4 gün ve üzeri" },
    ],
  },
  { key: "when", kind: "when", title: "Hangi gün ve saatler sana uyar?", hint: "Gün ve saat aralığı seç; birden fazla olabilir." },
  {
    key: "age",
    kind: "single",
    title: "Yaş aralığın?",
    hint: "Antrenörümüz ilk dersi buna göre hazırlar. İstersen belirtme.",
    options: [
      { value: "18-24", label: "18-24" },
      { value: "25-34", label: "25-34" },
      { value: "35-44", label: "35-44" },
      { value: "45-54", label: "45-54" },
      { value: "55+", label: "55 ve üzeri" },
      { value: "skip", label: "Belirtmek istemiyorum" },
    ],
  },
];

// ---------------------------------------------------------------------------
// What we infer, for the coaches only.

type Score = Partial<Record<DisciplineSlug, number>>;
const GOAL_WEIGHT: Record<GoalId, Score> = {
  posture: { "reformer-pilates": 3, "mat-pilates": 3, "fonksiyonel-antrenman": 1 },
  strength: { "fonksiyonel-antrenman": 3, "reformer-pilates": 2, kickboks: 1 },
  fitness: { spinning: 3, kickboks: 2, "fonksiyonel-antrenman": 2 },
  mobility: { "reformer-pilates": 3, "mat-pilates": 2 },
  stress: { kickboks: 3, spinning: 2, "mat-pilates": 1 },
  coordination: { kickboks: 3, "fonksiyonel-antrenman": 1 },
};

export type Level = "new" | "some" | "regular";

export function levelOf(a: Pick<IntakeAnswers, "activity" | "tried">): Level {
  if (a.activity === "3-4" || a.activity === "5+") return "regular";
  const triedSomething = a.tried.some((t) => t !== "none");
  return a.activity === "0" && !triedSomething ? "new" : "some";
}

export type Assessment = {
  /** The lesson the visitor picked, or our first guess when they left it to us. */
  discipline: DisciplineSlug;
  inferred: boolean;
  format: Exclude<FormatId, "online">;
  level: Level;
  plan?: "group-8" | "group-12";
  slot?: "sabah" | "akşam";
  timeFrom: string;
  timeTo: string;
};

function scoreOf(a: IntakeAnswers, slug: DisciplineSlug): number {
  const pace = Number(a.pace);
  let s = a.goals.reduce((sum, g) => sum + (GOAL_WEIGHT[g][slug] ?? 0) * 2, 0);
  if (pace <= 2 && (slug === "mat-pilates" || slug === "reformer-pilates")) s += 2;
  if (pace >= 4 && (slug === "spinning" || slug === "kickboks")) s += 2;
  if (pace >= 3 && slug === "fonksiyonel-antrenman") s += 1;
  if ((a.sitting === "5-8" || a.sitting === "8+") && (slug === "mat-pilates" || slug === "reformer-pilates")) s += 1;
  if (levelOf(a) === "new" && slug === "reformer-pilates") s += 1;
  return s;
}

export function assessIntake(a: IntakeAnswers): Assessment {
  const picked = a.interests.filter((i): i is DisciplineSlug => i !== "open");
  const pool = picked.length ? disciplines.filter((d) => picked.includes(d.slug)) : disciplines;
  const best = [...pool].sort((x, y) => scoreOf(a, y.slug) - scoreOf(a, x.slug))[0];
  const offered = best.formats.filter((f): f is "group" | "private" => f !== "online");

  // Taught both ways: a fixed week, coming alone and two or three days point to the group class.
  const groupFits = a.schedule === "fixed" && a.company === "solo" && (a.frequency === "2" || a.frequency === "3");
  const format = offered.length === 1 ? offered[0] : groupFits ? "group" : "private";

  const chosen = WINDOWS.filter((w) => a.windows.includes(w.id));
  const timeFrom = chosen.length ? chosen[0].from : "";
  const timeTo = chosen.length ? chosen[chosen.length - 1].to : "";
  const morningOnly = chosen.length > 0 && chosen.every((w) => w.id === "morning" || w.id === "midday");
  const eveningOnly = chosen.length > 0 && chosen.every((w) => w.id === "afternoon" || w.id === "evening");

  return {
    discipline: best.slug,
    inferred: picked.length === 0,
    format,
    level: levelOf(a),
    plan: format === "group" ? (a.frequency === "2" ? "group-8" : a.frequency === "3" ? "group-12" : undefined) : undefined,
    slot: format === "group" ? (morningOnly ? "sabah" : eveningOnly ? "akşam" : undefined) : undefined,
    timeFrom,
    timeTo,
  };
}

// ---------------------------------------------------------------------------
// Words.

const label = <V extends string>(options: Option<V>[], v: V) => options.find((o) => o.value === v)?.label ?? v;
const lower = (s: string) => s.toLocaleLowerCase("tr");
const dayNames = (days: WeekdayId[]) => WEEKDAYS.filter((d) => days.includes(d.id)).map((d) => d.long);
const windowNames = (ws: WindowId[]) => WINDOWS.filter((w) => ws.includes(w.id)).map((w) => lower(w.label));
const disciplineNames = (ids: InterestId[]) =>
  disciplines.filter((d) => ids.includes(d.slug)).map((d) => d.name);

// Each goal as something to do, said to the visitor.
const GOAL_YOU: Record<GoalId, string> = {
  posture: "duruşunu ve bel-sırt rahatlığını geliştirmek",
  strength: "güçlenmek",
  fitness: "kondisyonunu artırmak",
  mobility: "daha esnek ve rahat hareket etmek",
  stress: "stres atıp zihnini dinlendirmek",
  coordination: "koordinasyonunu geliştirmek",
};

/** The visitor's answers, said back in plain words. Nothing here tells them what to do. */
export function intakeNotes(a: IntakeAnswers): string[] {
  const notes: string[] = [];
  if (a.goals.length) notes.push(`Hedefin: ${joinTr(a.goals.map((g) => GOAL_YOU[g]))}.`);

  const activity =
    a.activity === "0"
      ? "Şu an düzenli spor yapmıyorsun; başlangıcı buna göre kuruyoruz."
      : `Şu an haftada ${a.activity === "5+" ? "5 gün ya da daha fazla" : `${a.activity} gün`} spor yapıyorsun.`;
  notes.push(activity);
  if (a.sitting === "5-8" || a.sitting === "8+") notes.push("Günün büyük kısmı oturarak geçiyor; bunu not aldık.");

  const pace = Number(a.pace);
  notes.push(pace <= 2 ? "Sakin ve kontrollü bir tempo seni daha rahat ettiriyor." : pace >= 4 ? "Yüksek tempoyu seviyorsun." : "Orta bir tempo sana uyuyor.");

  const tried = a.tried.filter((t) => t !== "none").map((t) => label(TRIED, t));
  if (tried.length) notes.push(`Daha önce denediklerin: ${joinTr(tried)}.`);

  const picked = disciplineNames(a.interests);
  notes.push(picked.length ? `İlgilendiğin dersler: ${joinTr(picked)}.` : "Hangi dersle başlayacağını seninle birlikte seçeceğiz.");

  notes.push(
    a.company === "solo" ? "Tek başına gelmek istiyorsun." : a.company === "pair" ? "Eşin ya da bir arkadaşınla geleceksin." : "3-6 kişilik bir grupla geleceksin.",
  );

  const days = dayNames(a.days);
  const when = [days.length ? `${joinTr(days)} günleri` : "", windowNames(a.windows).length ? `${joinTr(windowNames(a.windows))} saatlerinde` : ""]
    .filter(Boolean)
    .join(", ");
  const often = a.frequency === "4+" ? "Haftada 4 gün ya da daha fazla" : `Haftada ${a.frequency} gün`;
  notes.push(`${often}${when ? `, ${when}` : ""} gelebilirsin.`);
  if (a.schedule !== "fixed") notes.push(a.schedule === "shifts" ? "Vardiyalı çalışıyorsun; saatleri buna göre planlıyoruz." : "Programın değişken; saatleri esnek planlıyoruz.");
  if (a.age !== "skip") notes.push(`Yaş aralığın: ${a.age}.`);
  return notes;
}

const FORMAT_NAME = { group: "grup dersi", private: "bireysel" } as const;
const LEVEL_NAME: Record<Level, string> = { new: "yeni başlıyor", some: "arada bir yapmış", regular: "düzenli yapıyor" };

/** The note our coaches read in the CRM: every answer plus our first take. At most 500 characters. */
export function intakeCrmNote(a: IntakeAnswers, x: Assessment): string {
  const name = disciplines.find((d) => d.slug === x.discipline)!.name;
  const picked = disciplineNames(a.interests);
  const parts = [
    "Planlama testi",
    `Hedef: ${a.goals.map((g) => label(GOALS, g)).join(", ")}`,
    `Seviye: ${LEVEL_NAME[x.level]} (haftada ${a.activity === "0" ? "0" : a.activity} gün)`,
    `Oturma: ${label(SITTING, a.sitting)}`,
    `Tempo: ${a.pace}/5`,
    `Denedi: ${a.tried.includes("none") || !a.tried.length ? "hiçbiri" : a.tried.map((t) => label(TRIED, t)).join(", ")}`,
    `İlgi: ${picked.length ? picked.join(", ") : "siz yönlendirin"}`,
    `Kiminle: ${a.company === "solo" ? "tek" : a.company === "pair" ? "2 kişi" : "3-6 kişi"}`,
    `Program: ${a.schedule === "fixed" ? "sabit" : a.schedule === "varies" ? "değişken" : "vardiyalı"}`,
    `Sıklık: haftada ${a.frequency}`,
    // The CRM's time field spans first to last window; say which ones exactly.
    `Saat: ${WINDOWS.filter((w) => a.windows.includes(w.id)).map((w) => `${lower(w.label)} ${w.from}-${w.to}`).join(", ")}`,
    a.age !== "skip" ? `Yaş: ${a.age}` : "",
    `Ön değerlendirme: ${name}, ${FORMAT_NAME[x.format]}${x.inferred ? " (üye karar vermedi)" : ""}`,
  ].filter(Boolean);
  const note = parts.join(". ") + ".";
  return note.length > 500 ? `${note.slice(0, 497)}...` : note;
}
