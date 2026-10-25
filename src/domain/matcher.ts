import type { DisciplineSlug, FormatId } from "@/content/site";

// "Sana uygun ders": two questions, a deterministic pick, one
// recommendation. Pure so it can be unit-tested and reused server-side.

export type Goal = "posture" | "strength" | "stress" | "fitness";
export type Way = FormatId;

export type Answers = { goal: Goal; way: Way };

export const questions = [
  {
    key: "goal",
    title: "En çok neyi değiştirmek istiyorsun?",
    options: [
      { value: "posture", label: "Duruşumu ve bel-sırt sağlığımı" },
      { value: "strength", label: "Daha güçlü olmayı" },
      { value: "stress", label: "Kafamı boşaltıp stres atmayı" },
      { value: "fitness", label: "Kondisyonumu ve yağ oranımı" },
    ],
  },
  {
    key: "way",
    title: "Nasıl çalışmak istersin?",
    options: [
      { value: "group", label: "Grupla, belli gün ve saatlerde" },
      { value: "private", label: "Tek başıma ya da birkaç arkadaşımla (en fazla 6 kişi)" },
    ],
  },
] as const;

/** Best-fitting disciplines per goal, best first. */
export const goalFit: Record<Goal, DisciplineSlug[]> = {
  posture: ["reformer-pilates", "mat-pilates", "fonksiyonel-antrenman"],
  strength: ["fonksiyonel-antrenman", "reformer-pilates", "kickboks"],
  stress: ["kickboks", "spinning", "mat-pilates"],
  fitness: ["spinning", "kickboks", "fonksiyonel-antrenman"],
};

/** Mirrors `disciplines[].formats` in content/site.ts (kept here so this stays pure). */
export const disciplineFormats: Record<DisciplineSlug, FormatId[]> = {
  "mat-pilates": ["group", "private", "online"],
  spinning: ["group"],
  "reformer-pilates": ["private"],
  kickboks: ["private"],
  "fonksiyonel-antrenman": ["private"],
};

export type Recommendation = { discipline: DisciplineSlug; format: FormatId };

/** The best goal-fit discipline offered the chosen way; else any discipline offered that way. */
export function recommend({ goal, way }: Answers): Recommendation {
  const fit = goalFit[goal].find((d) => disciplineFormats[d].includes(way));
  if (fit) return { discipline: fit, format: way };
  const any = (Object.keys(disciplineFormats) as DisciplineSlug[]).find((d) => disciplineFormats[d].includes(way));
  return { discipline: any ?? "fonksiyonel-antrenman", format: way };
}
