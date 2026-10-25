import { describe, expect, it } from "vitest";
import { disciplines } from "@/content/site";
import { disciplineFormats, goalFit, questions, recommend, type Answers } from "./matcher";

describe("recommend", () => {
  it("mirrors the site's disciplines", () => {
    for (const d of disciplines) expect(disciplineFormats[d.slug]).toEqual(d.formats);
  });
  it("always recommends a discipline that is offered the chosen way", () => {
    for (const goal of Object.keys(goalFit) as Answers["goal"][]) {
      for (const o of questions[1].options) {
        const r = recommend({ goal, way: o.value });
        expect(disciplineFormats[r.discipline]).toContain(o.value);
      }
    }
  });
  it("picks by goal", () => {
    expect(recommend({ goal: "posture", way: "private" })).toEqual({ discipline: "reformer-pilates", format: "private" });
    expect(recommend({ goal: "fitness", way: "group" })).toEqual({ discipline: "spinning", format: "group" });
    expect(recommend({ goal: "posture", way: "group" })).toEqual({ discipline: "mat-pilates", format: "group" });
  });
});
