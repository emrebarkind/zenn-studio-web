import { describe, expect, it } from "vitest";
import { disciplines } from "@/content/site";
import { makePlan, plannerQuestions, type PlannerAnswers } from "./planner";

const base: PlannerAnswers = { goal: "posture", level: "new", company: "solo", pace: "calm", frequency: "2", time: "akşam" };

describe("makePlan", () => {
  it("has six questions", () => {
    expect(plannerQuestions).toHaveLength(6);
  });

  it("never recommends a discipline in a way it is not offered", () => {
    for (const goal of ["posture", "strength", "fitness", "stress"] as const)
      for (const company of ["group", "solo", "friends"] as const)
        for (const pace of ["calm", "intense"] as const) {
          const p = makePlan({ ...base, goal, company, pace });
          const d = disciplines.find((x) => x.slug === p.discipline)!;
          expect(d.formats).toContain(p.format);
        }
  });

  it("starts a newcomer who wants posture work on the reformer, one to one", () => {
    expect(makePlan(base)).toMatchObject({ discipline: "reformer-pilates", format: "private", detail: "Özel ders, birebir" });
  });

  it("turns a group answer into the package and its days", () => {
    const p = makePlan({ ...base, goal: "fitness", company: "group", pace: "intense", frequency: "3", time: "sabah" });
    expect(p).toMatchObject({ discipline: "spinning", format: "group", detail: "12 ders paketi, sabah grubu", days: ["pzt", "car", "cum"] });
  });

  it("sends friends who want to sweat to kickboks together", () => {
    expect(makePlan({ ...base, goal: "stress", company: "friends", pace: "intense" })).toMatchObject({
      discipline: "kickboks",
      detail: "Özel ders, arkadaşlarınla (2-6 kişi)",
    });
  });
});
