import { describe, expect, it } from "vitest";
import { assessIntake, intakeCrmNote, intakeNotes, intakeSteps, intakeWhatsApp, levelOf, type IntakeAnswers } from "./intake";

const base: IntakeAnswers = {
  goals: ["posture", "mobility"],
  activity: "0",
  sitting: "8+",
  pace: "2",
  tried: ["none"],
  interests: ["open"],
  company: "solo",
  schedule: "varies",
  frequency: "2",
  days: ["car", "pzt"],
  windows: ["evening"],
  age: "35-44",
};

describe("intake questions", () => {
  it("never asks group or private outright", () => {
    const text = JSON.stringify(intakeSteps).toLocaleLowerCase("tr");
    expect(text).not.toMatch(/grup mu|bireysel mi|grup dersi mi/);
  });

  it("asks nothing about health", () => {
    expect(JSON.stringify(intakeSteps).toLocaleLowerCase("tr")).not.toMatch(/sağlık|sakatlık|ağrı|hastalık|hamile/);
  });
});

describe("assessIntake", () => {
  it("keeps the lesson the visitor picked", () => {
    const x = assessIntake({ ...base, interests: ["kickboks"] });
    expect(x).toMatchObject({ discipline: "kickboks", inferred: false, format: "private" });
  });

  it("makes a first guess for the coaches when the visitor left it to us", () => {
    const x = assessIntake(base);
    expect(x.inferred).toBe(true);
    expect(["reformer-pilates", "mat-pilates"]).toContain(x.discipline);
  });

  it("picks among the chosen lessons by the answers", () => {
    expect(assessIntake({ ...base, goals: ["fitness"], pace: "5", interests: ["spinning", "mat-pilates"] }).discipline).toBe("spinning");
  });

  it("puts Mat Pilates in the group class only for a fixed week, alone, two or three days", () => {
    const group = { ...base, interests: ["mat-pilates" as const], schedule: "fixed" as const };
    expect(assessIntake(group)).toMatchObject({ format: "group", plan: "group-8", slot: "akşam" });
    expect(assessIntake({ ...group, frequency: "3" }).plan).toBe("group-12");
    expect(assessIntake({ ...group, company: "pair" }).format).toBe("private");
    expect(assessIntake({ ...group, schedule: "shifts" }).format).toBe("private");
  });

  it("keeps Spinning a group class", () => {
    expect(assessIntake({ ...base, interests: ["spinning"], company: "small" }).format).toBe("group");
  });

  it("spans the chosen time windows", () => {
    expect(assessIntake({ ...base, windows: ["evening", "morning"] })).toMatchObject({ timeFrom: "07:00", timeTo: "22:00" });
  });

  it("reads the level from the activity and what was tried", () => {
    expect(levelOf({ activity: "0", tried: ["none"] })).toBe("new");
    expect(levelOf({ activity: "0", tried: ["yoga"] })).toBe("some");
    expect(levelOf({ activity: "3-4", tried: [] })).toBe("regular");
  });
});

describe("what the visitor and the coaches read", () => {
  it("says the answers back without telling the visitor which sport suits them", () => {
    const text = [...intakeNotes(base), intakeWhatsApp(base, "Ayşe", "Kaya")].join(" ");
    expect(text).not.toMatch(/sana uygun|senin için ideal|öneriyoruz|en iyi/i);
    expect(text).toMatch(/Pazartesi ve Çarşamba/);
  });

  it("writes the WhatsApp message in the visitor's voice", () => {
    const m = intakeWhatsApp(base, "Ayşe", "Kaya");
    expect(m).toMatch(/^Merhaba Zenn Studio, ben Ayşe Kaya\./);
    expect(m).toContain("Hedefim duruşumu ve bel-sırt rahatlığımı geliştirmek ve daha esnek ve rahat hareket etmek.");
    expect(m).toContain("Hangi dersle başlayacağıma birlikte karar vermek istiyorum.");
  });

  it("gives the coaches every answer and our first take, within 500 characters", () => {
    const note = intakeCrmNote(base, assessIntake(base));
    expect(note.length).toBeLessThanOrEqual(500);
    expect(note).toMatch(/Ön değerlendirme: .*\(üye karar vermedi\)/);
    expect(note).toContain("Oturma: 8 saatten fazla");
    expect(intakeCrmNote({ ...base, windows: ["morning", "evening"] }, assessIntake(base))).toContain("Saat: sabah 07:00-10:00, akşam 17:00-22:00");
  });
});
