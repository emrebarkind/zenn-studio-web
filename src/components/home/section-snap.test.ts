import { describe, expect, it } from "vitest";
import { restingPlace, type Stop } from "./section-snap";

// Seven one-screen sections at 900px, then the end of the page (the footer is shorter).
const vh = 900;
const stops: Stop[] = [...Array.from({ length: 7 }, (_, i) => ({ top: i * vh, height: vh })), { top: 5901, height: 0 }];

describe("where the home page comes to rest", () => {
  it("carries a gentle scroll on to the next screen", () => {
    expect(restingPlace(stops, 150, 0, vh)).toBe(900);
    expect(restingPlace(stops, 1050, 900, vh)).toBe(1800);
  });

  it("carries a gentle scroll up to the screen above", () => {
    expect(restingPlace(stops, 750, 900, vh)).toBe(0);
    expect(restingPlace(stops, 1650, 1800, vh)).toBe(900);
  });

  it("slides back after a tiny nudge", () => {
    expect(restingPlace(stops, 30, 0, vh)).toBe(0);
    expect(restingPlace(stops, 870, 900, vh)).toBe(900);
  });

  it("moves on after a single gentle wheel notch, both ways", () => {
    expect(restingPlace(stops, 1000, 900, vh)).toBe(1800);
    expect(restingPlace(stops, 800, 900, vh)).toBe(0);
    expect(restingPlace(stops, 5801, 5901, vh)).toBe(5400);
  });

  it("moves exactly one screen per stop, never to the end of the page", () => {
    expect(restingPlace(stops, 151, 0, vh)).not.toBe(5901);
  });

  it("leaves a page already on a screen edge alone", () => {
    expect(restingPlace(stops, 1800, 900, vh)).toBeNull();
    expect(restingPlace(stops, 5901, 5400, vh)).toBeNull();
  });

  it("reaches the footer and comes back from it", () => {
    expect(restingPlace(stops, 5550, 5400, vh)).toBe(5901);
    expect(restingPlace(stops, 5700, 5901, vh)).toBe(5400);
  });

  it("lets a screen taller than the window be read freely", () => {
    const tall: Stop[] = [{ top: 0, height: 900 }, { top: 900, height: 1500 }, { top: 2400, height: 900 }, { top: 3300, height: 0 }];
    expect(restingPlace(tall, 1200, 1000, vh)).toBeNull();
    // Its bottom edge in view: on to the next screen.
    expect(restingPlace(tall, 1600, 1400, vh)).toBe(2400);
  });
});
