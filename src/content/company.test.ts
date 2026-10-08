import { describe, expect, it } from "vitest";
import { companyProblems, contactChannels, type Company } from "./company";

const filled: Company = {
  legalName: "Zenn Spor Hizmetleri Ltd. Şti.",
  address: "Örnek Mah. Deneme Sok. No: 1",
  city: "İstanbul",
  taxOffice: "Kadıköy",
  taxNumber: "1234567890",
  mersis: "0123456789012345",
  email: "info@zenn-studio.com",
  phone: "0532 000 00 00",
  whatsapp: "905320000000",
  instagram: "zennstudio",
  mapsUrl: "",
};

describe("companyProblems", () => {
  it("passes a complete record", () => {
    expect(companyProblems(filled)).toEqual([]);
  });

  it("reports every empty required field", () => {
    const problems = companyProblems({ ...filled, legalName: "", mersis: " " });
    expect(problems).toContain("legalName boş");
    expect(problems).toContain("mersis boş");
  });

  it("never lets a bracketed placeholder through", () => {
    expect(companyProblems({ ...filled, email: "[DOLDUR]@zenn-studio.com" }).join()).toMatch(/yer tutucu/);
    expect(companyProblems({ ...filled, instagram: "[DOLDUR]" }).join()).toMatch(/instagram yer tutucu/);
  });

  it("validates formats", () => {
    expect(companyProblems({ ...filled, whatsapp: "+90 532" })).toContain("whatsapp 905xxxxxxxxx biçiminde olmalı");
    expect(companyProblems({ ...filled, mersis: "123" })).toContain("mersis 16 haneli olmalı");
  });
});

describe("contactChannels", () => {
  it("lists only filled channels", () => {
    expect(contactChannels({ ...filled, whatsapp: "", instagram: "" }).map((c) => c.kind)).toEqual(["phone", "email"]);
    expect(contactChannels(filled)[0].href).toBe("https://wa.me/905320000000");
  });
});
