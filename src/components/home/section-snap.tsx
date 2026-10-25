"use client";

import { useEffect } from "react";

/** The screens of the home page, top to bottom: hero, each section, footer. */
function screens() {
  return [...document.querySelectorAll<HTMLElement>("main section[id], footer")].filter((el) => el.offsetParent !== null);
}

/** Can an element between the pointer and the page still scroll that way itself? */
function scrollsInside(target: EventTarget | null, down: boolean) {
  for (let el = target instanceof Element ? target : null; el && el !== document.body; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
      if (down ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
    }
  }
  return false;
}

/**
 * Turns on the home page's screen-by-screen scrolling (`.snap-sections` in
 * globals.css) while the home page is on screen. An effect rather than a CSS
 * :has() check, because Next keeps a page you left in the DOM, hidden, and
 * the other pages must scroll freely.
 *
 * On a wide screen one wheel or trackpad gesture moves exactly one screen and
 * lands it flush (owner, 2026-10-25): CSS snapping alone lets a short wheel
 * tick fall back to where it started, and a fling skip ahead. The gesture's
 * tail (trackpad inertia) is swallowed until the wheel goes quiet. A screen
 * taller than the window scrolls normally until its edge is reached.
 * Keyboard and scrollbar use the CSS snapping; reduced motion keeps it all off.
 */
export function SectionSnap() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("snap-sections");

    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let locked = false;
    let lastWheel = 0;
    let target = 0;
    let startedAt = 0;

    const onWheel = (e: WheelEvent) => {
      if (!wide.matches || still.matches || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const down = e.deltaY > 0;
      if (scrollsInside(e.target, down)) return;
      const now = performance.now();
      const quiet = now - lastWheel > 220;
      lastWheel = now;
      // A new gesture only counts once the last move has landed (or the page was moved
      // another way meanwhile) and its tail has died down.
      if (locked && quiet && (Math.abs(window.scrollY - target) < 2 || now - startedAt > 1500)) locked = false;
      if (locked) return e.preventDefault();

      const list = screens();
      const tops = list.map((el) => el.getBoundingClientRect().top + window.scrollY);
      const y = window.scrollY;
      const i = tops.reduce((best, t, k) => (Math.abs(t - y) < Math.abs(tops[best] - y) ? k : best), 0);
      const current = list[i].getBoundingClientRect();
      // A screen taller than the window: read it to its edge first.
      if (down ? current.bottom > window.innerHeight + 2 : current.top < -2) return;

      const next = Math.min(Math.max(i + (down ? 1 : -1), 0), list.length - 1);
      e.preventDefault();
      if (next === i) return;
      // The footer is shorter than a screen; its stop is the end of the page.
      target = Math.min(tops[next], root.scrollHeight - window.innerHeight);
      locked = true;
      startedAt = now;
      window.scrollTo({ top: target, behavior: "smooth" });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      root.classList.remove("snap-sections");
    };
  }, []);
  return null;
}
