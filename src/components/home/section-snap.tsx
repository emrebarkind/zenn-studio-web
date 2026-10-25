"use client";

import { useEffect } from "react";

/** Where each screen of the home page starts: hero, each section, then the end of the page. */
function stops(): Stop[] {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const tops = [...document.querySelectorAll<HTMLElement>("main section[id]")]
    .filter((el) => el.offsetParent !== null)
    .map((el) => ({ top: Math.min(el.getBoundingClientRect().top + window.scrollY, max), height: el.offsetHeight }));
  return [...tops, { top: max, height: 0 }];
}

export type Stop = { top: number; height: number };

/**
 * Where the page should glide to after coming to rest at `y`, having started
 * from `from`; null to leave it where it is. `stops` are the screens' tops in
 * order, the last one being the end of the page.
 */
export function restingPlace(stops: Stop[], y: number, from: number, vh: number): number | null {
  let i = 0;
  while (i < stops.length - 1 && stops[i + 1].top <= y + 1) i++;
  const here = stops[i];
  const next = stops[i + 1];
  if (!next || Math.abs(y - here.top) < 2) return null;
  // Inside a screen taller than the window, with neither edge reached: leave it.
  if (y > here.top + 2 && y + vh < here.top + here.height - 2) return null;
  const past = y - here.top;
  const gap = next.top - here.top;
  // Any deliberate move (one gentle wheel notch is ~100px) carries on; only a graze slides back.
  const nudge = Math.min(40, gap / 4);
  const target = y >= from ? (past > nudge ? next.top : here.top) : gap - past > nudge ? here.top : next.top;
  return Math.abs(target - y) < 2 ? null : target;
}

/**
 * The home page reads as a stack of screens on a wide screen, and each one
 * comes to rest flush with the top (owner, 2026-10-25).
 *
 * Scrolling itself is never taken over: the wheel, trackpad, keyboard and
 * scrollbar move the page freely and softly. Only once the page comes to rest
 * does it glide onto a screen edge, in the direction it was going: a small
 * deliberate move past an edge, however gentle, carries on to the next screen;
 * only a graze (under 40px) slides back. A screen taller than the window rests wherever it
 * was left until one of its edges is in view. Touching the page again while
 * it glides stops the glide. Reduced motion and narrow screens scroll plainly.
 *
 * An effect rather than CSS scroll snapping, which (mandatory) let short or
 * gentle scrolls fall back to where they started and (proximity) left screens
 * half way. The `.snap-sections` class still marks the home page as on screen,
 * because Next keeps a page you left in the DOM, hidden.
 */
export function SectionSnap() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("snap-sections");

    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let restedAt = window.scrollY; // where the page last came to rest
    let gliding = false;
    let timer = 0;

    const settle = () => {
      const y = window.scrollY;
      const from = restedAt;
      restedAt = y;
      if (gliding) {
        gliding = false;
        return;
      }
      if (!wide.matches || still.matches) return;

      const target = restingPlace(stops(), y, from, window.innerHeight);
      if (target === null) return;
      gliding = true;
      restedAt = target;
      window.scrollTo({ top: target, behavior: "smooth" });
    };

    // The page has come to rest: scrollend where the browser has it, otherwise a short quiet spell.
    const native = "onscrollend" in window;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 160);
    };
    // A new touch of the wheel or trackpad during a glide hands control back.
    const onInput = () => {
      gliding = false;
    };
    if (native) window.addEventListener("scrollend", settle);
    else window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("keydown", onInput);
    window.addEventListener("pointerdown", onInput);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scrollend", settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("keydown", onInput);
      window.removeEventListener("pointerdown", onInput);
      root.classList.remove("snap-sections");
    };
  }, []);
  return null;
}
