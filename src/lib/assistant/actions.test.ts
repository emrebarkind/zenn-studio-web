import { describe, expect, it } from "vitest";
import { parseReply } from "./actions";

describe("parseReply", () => {
  it("turns an enrol marker into a /kayit link and hides it", () => {
    const r = parseReply("Mat pilates grup dersi sana uygun.\n<<KAYIT brans=mat-pilates format=group paket=group-8>>");
    expect(r.text).toBe("Mat pilates grup dersi sana uygun.");
    expect(r.enroll?.href).toBe("/kayit?brans=mat-pilates&format=group&paket=group-8");
    expect(r.handoff).toBe(false);
  });

  it("drops a format the discipline is not offered in", () => {
    // Reformer is individual / small group only.
    const r = parseReply("x\n<<KAYIT brans=reformer-pilates format=group>>");
    expect(r.enroll?.href).toBe("/kayit?brans=reformer-pilates");
  });

  it("drops a plan that belongs to another format", () => {
    const r = parseReply("x\n<<KAYIT brans=mat-pilates format=group paket=online>>");
    expect(r.enroll?.href).toBe("/kayit?brans=mat-pilates&format=group");
  });

  it("ignores an unknown discipline", () => {
    expect(parseReply("x <<KAYIT brans=yoga format=group>>").enroll).toBeNull();
  });

  it("detects a hand-off", () => {
    const r = parseReply("Bu konuda bilgim yok, ekibe iletiyorum.\n<<EKIP>>");
    expect(r.handoff).toBe(true);
    expect(r.text).toBe("Bu konuda bilgim yok, ekibe iletiyorum.");
  });

  it("hides a marker that is still streaming in", () => {
    expect(parseReply("Harika seçim.\n<<KAY").text).toBe("Harika seçim.");
    expect(parseReply("Harika seçim.\n<").text).toBe("Harika seçim.");
    expect(parseReply("Harika seçim.\n<<KAYIT brans=kickboks").text).toBe("Harika seçim.");
  });
});
