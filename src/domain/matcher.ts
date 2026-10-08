import type { DisciplineSlug, FormatId } from "@/content/site";

// "Sana uygun dersi bul": three questions, a deterministic score, one
// recommendation. Pure so it can be unit-tested and reused server-side.

export type Goal = "posture" | "strength" | "stress" | "fitness";
export type Place = "studio" | "home" | "both";
export type Guidance = "group" | "personal";

export type Answers = { goal: Goal; place: Place; guidance: Guidance };

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
    key: "place",
    title: "Nerede antrenman yapmak istersin?",
    options: [
      { value: "studio", label: "Stüdyoda" },
      { value: "home", label: "Evde" },
      { value: "both", label: "İkisi de olur" },
    ],
  },
  {
    key: "guidance",
    title: "Nasıl çalışmayı seversin?",
    options: [
      { value: "group", label: "Grupla, belli saatlerde" },
      { value: "personal", label: "Bana özel program ve birebir takip" },
    ],
  },
] as const;

export const goalFit: Record<Goal, DisciplineSlug[]> = {
  posture: ["reformer-pilates", "mat-pilates"],
  strength: ["fonksiyonel-antrenman", "reformer-pilates"],
  stress: ["kickboks", "mat-pilates"],
  fitness: ["kickboks", "fonksiyonel-antrenman"],
};

const disciplineFormats: Record<DisciplineSlug, FormatId[]> = {
  "reformer-pilates": ["studio"],
  "mat-pilates": ["studio", "live"],
  kickboks: ["studio", "coaching"],
  "fonksiyonel-antrenman": ["studio", "live", "coaching"],
};

function formatFor(place: Place, guidance: Guidance): FormatId[] {
  if (place === "studio") return ["studio"];
  if (place === "home") return guidance === "personal" ? ["coaching", "live"] : ["live", "coaching"];
  return guidance === "personal" ? ["coaching", "studio", "live"] : ["studio", "live", "coaching"];
}

export type Recommendation = { discipline: DisciplineSlug; format: FormatId };

/** First goal-fit discipline that is offered in the most preferred format. */
export function recommend({ goal, place, guidance }: Answers): Recommendation {
  const preferred = formatFor(place, guidance);
  for (const format of preferred) {
    for (const discipline of goalFit[goal]) {
      if (disciplineFormats[discipline].includes(format)) return { discipline, format };
    }
  }
  // Every format is covered by fonksiyonel antrenman, so this is unreachable
  // for valid answers; keep a safe default for the type checker.
  return { discipline: "fonksiyonel-antrenman", format: preferred[0] };
}
