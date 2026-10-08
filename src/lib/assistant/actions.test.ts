import { describe, expect, it } from "vitest";
import { parseReply } from "./actions";

describe("parseReply", () => {
  it("turns an enrol marker into a /kayit link and hides it", () => {
    const r = parseReply("Mat pilates canlı online sana uygun.\n<<KAYIT brans=mat-pilates format=live paket=live-8>>");
    expect(r.text).toBe("Mat pilates canlı online sana uygun.");
    expect(r.enroll?.href).toBe("/kayit?brans=mat-pilates&format=live&paket=live-8");
    expect(r.handoff).toBe(false);
  });

  it("drops a format the discipline is not offered in", () => {
    // Reformer is studio-only.
    const r = parseReply("x\n<<KAYIT brans=reformer-pilates format=live>>");
    expect(r.enroll?.href).toBe("/kayit?brans=reformer-pilates");
  });

  it("drops a plan that belongs to another format", () => {
    const r = parseReply("x\n<<KAYIT brans=mat-pilates format=studio paket=live-8>>");
    expect(r.enroll?.href).toBe("/kayit?brans=mat-pilates&format=studio");
  });

  it("ignores an unknown discipline", () => {
    expect(parseReply("x <<KAYIT brans=yoga format=studio>>").enroll).toBeNull();
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
