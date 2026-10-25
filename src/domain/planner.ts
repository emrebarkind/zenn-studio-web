import { disciplines, plans, type DisciplineSlug } from "@/content/site";
import { WEEKDAYS, type WeekdayId } from "@/domain/registration";

/**
 * "İlk dersini birlikte planlayalım": six questions, one plan — which
 * discipline, how (group class or private lesson, for how many), how many days
 * a week and when. Pure and deterministic so it can be unit-tested.
 */

export type PlannerAnswers = {
  goal: "posture" | "strength" | "fitness" | "stress";
  level: "new" | "some" | "regular";
  company: "group" | "solo" | "friends";
  pace: "calm" | "intense";
  frequency: "2" | "3" | "flexible";
  time: "sabah" | "öğle" | "akşam";
};

export type PlannerQuestion<K extends keyof PlannerAnswers = keyof PlannerAnswers> = {
  key: K;
  title: string;
  options: { value: PlannerAnswers[K]; label: string; hint?: string }[];
};

export const plannerQuestions: PlannerQuestion[] = [
  {
    key: "goal",
    title: "En çok ne için başlıyorsun?",
    options: [
      { value: "posture", label: "Duruş ve bel-sırt", hint: "Daha dik, daha rahat bir vücut" },
      { value: "strength", label: "Güç", hint: "Daha güçlü ve sıkı" },
      { value: "fitness", label: "Kondisyon", hint: "Nefes, dayanıklılık, yağ yakımı" },
      { value: "stress", label: "Stres atmak", hint: "Kafayı boşaltmak" },
    ],
  },
  {
    key: "level",
    title: "Spor geçmişin nasıl?",
    options: [
      { value: "new", label: "Yeni başlıyorum" },
      { value: "some", label: "Arada bir yaptım" },
      { value: "regular", label: "Düzenli yapıyorum" },
    ],
  },
  {
    key: "company",
    title: "Nasıl çalışmak istersin?",
    options: [
      { value: "group", label: "Grupla", hint: "Belli günlerde grup dersi" },
      { value: "solo", label: "Birebir", hint: "Sadece sen ve antrenörün" },
      { value: "friends", label: "Arkadaşlarımla", hint: "6 kişiye kadar kendi grubun" },
    ],
  },
  {
    key: "pace",
    title: "Hangi tempo sana göre?",
    options: [
      { value: "calm", label: "Kontrollü ve odaklı" },
      { value: "intense", label: "Hareketli ve terletici" },
    ],
  },
  {
    key: "frequency",
    title: "Haftada kaç gün gelebilirsin?",
    options: [
      { value: "2", label: "2 gün" },
      { value: "3", label: "3 gün" },
      { value: "flexible", label: "Duruma göre" },
    ],
  },
  {
    key: "time",
    title: "Hangi saatler sana uyar?",
    options: [
      { value: "sabah", label: "Sabah" },
      { value: "öğle", label: "Öğle" },
      { value: "akşam", label: "Akşam" },
    ],
  },
];

export type Plan = {
  discipline: DisciplineSlug;
  format: "group" | "private";
  /** Group: the package; private: who comes. */
  detail: string;
  /** "Haftada 2 gün, akşam" */
  rhythm: string;
  /** Days to pre-tick in the request (group days for a group class). */
  days: WeekdayId[];
  /** One line on why this plan. */
  why: string;
};

const GOAL_WEIGHT: Record<PlannerAnswers["goal"], Partial<Record<DisciplineSlug, number>>> = {
  posture: { "reformer-pilates": 3, "mat-pilates": 3, "fonksiyonel-antrenman": 1 },
  strength: { "fonksiyonel-antrenman": 3, "reformer-pilates": 2, kickboks: 1 },
  fitness: { spinning: 3, kickboks: 2, "fonksiyonel-antrenman": 2 },
  stress: { kickboks: 3, spinning: 2, "mat-pilates": 1 },
};
const PACE_WEIGHT: Record<PlannerAnswers["pace"], Partial<Record<DisciplineSlug, number>>> = {
  calm: { "mat-pilates": 2, "reformer-pilates": 2 },
  intense: { spinning: 2, kickboks: 2, "fonksiyonel-antrenman": 1 },
};

const WHY: Record<PlannerAnswers["goal"], string> = {
  posture: "Duruş ve bel-sırt için merkez gücünü kontrollü çalışırsın.",
  strength: "Gücü vücudun gerçek hareketleriyle, adım adım artırırsın.",
  fitness: "Kondisyonu tempoyla, her derste biraz daha yukarı taşırsın.",
  stress: "Tempolu ve odaklı bir ders, günün yükünü bırakmanı sağlar.",
};

export function makePlan(a: PlannerAnswers): Plan {
  // Group classes run as group lessons; everything else is private (1-6 people).
  const wantsGroup = a.company === "group";
  const candidates = disciplines.filter((d) => d.formats.includes(wantsGroup ? "group" : "private"));
  const score = (slug: DisciplineSlug) =>
    (GOAL_WEIGHT[a.goal][slug] ?? 0) * 2 +
    (PACE_WEIGHT[a.pace][slug] ?? 0) +
    // A first-timer who wants posture work is best started on the reformer, with a coach beside them.
    (a.level === "new" && slug === "reformer-pilates" ? 1 : 0);
  const best = [...candidates].sort((x, y) => score(y.slug) - score(x.slug))[0];

  if (wantsGroup) {
    const plan = plans.find((p) => p.id === (a.frequency === "3" ? "group-12" : "group-8"))!;
    const slot = a.time === "sabah" ? "sabah" : "akşam";
    const days = (plan.groupDays ?? []).map((n) => WEEKDAYS[n - 1].id);
    return {
      discipline: best.slug,
      format: "group",
      detail: `${plan.name} paketi, ${slot} grubu`,
      rhythm: `Haftada ${days.length} gün: ${days.map((d) => WEEKDAYS.find((w) => w.id === d)!.label).join(", ")}`,
      days,
      why: `${WHY[a.goal]}${a.time === "öğle" ? " Grup dersleri sabah ve akşam; sana en yakını sabah grubu." : ""}`,
    };
  }
  const times = a.frequency === "flexible" ? "Haftada 1-3 gün" : `Haftada ${a.frequency} gün`;
  return {
    discipline: best.slug,
    format: "private",
    detail: a.company === "friends" ? "Özel ders, arkadaşlarınla (2-6 kişi)" : "Özel ders, birebir",
    rhythm: `${times}, ${a.time}`,
    days: [],
    why: WHY[a.goal],
  };
}
