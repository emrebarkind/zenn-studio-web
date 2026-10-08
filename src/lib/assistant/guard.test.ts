import { describe, expect, it } from "vitest";
import { findSensitiveData, guessLang, mentionsHealth } from "./guard";

describe("mentionsHealth", () => {
  it.each([
    "Belim ağrıyor, reformer yapabilir miyim?",
    "bel fıtığım var",
    "Hamileyim, hangi ders uygun?",
    "3 ay önce ameliyat oldum",
    "Tansiyon ilacı kullanıyorum",
    "dizimde sakatlık var",
    "I have knee pain, can I join?",
    "I'm pregnant",
    "my doctor said I should exercise",
  ])("flags %s", (text) => expect(mentionsHealth(text)).toBe(true));

  it.each([
    "Bana hangi paket uygun?",
    "Ağırlık çalışması var mı?",
    "Kickboks kaç ders?",
    "How do live online classes work?",
    "Spain'den taşındım, stüdyo nerede?",
  ])("leaves %s alone", (text) => expect(mentionsHealth(text)).toBe(false));
});

describe("findSensitiveData", () => {
  it("finds a card number (Luhn-valid)", () => {
    expect(findSensitiveData("kartım 4111 1111 1111 1111")).toBe("card");
  });
  it("finds a TC kimlik number (checksum-valid)", () => {
    expect(findSensitiveData("TC: 10000000146")).toBe("tckn");
  });
  it("finds an IBAN", () => {
    expect(findSensitiveData("TR33 0006 1005 1978 6457 8413 26")).toBe("iban");
  });
  it("does not flag a phone number", () => {
    expect(findSensitiveData("beni 0532 123 45 67'den arayın")).toBeNull();
    expect(findSensitiveData("+90 532 123 45 67")).toBeNull();
  });
});

describe("guessLang", () => {
  it("tells Turkish from English", () => {
    expect(guessLang("Merhaba, fiyatlar nedir?")).toBe("tr");
    expect(guessLang("Hello, what are the prices?")).toBe("en");
    expect(guessLang("Hamileyim, reformer yapabilir miyim?")).toBe("tr");
    expect(guessLang("Paketler neler")).toBe("tr");
    expect(guessLang("I have back pain, is pilates ok?")).toBe("en");
    expect(guessLang("reformer")).toBe("tr");
  });
});
