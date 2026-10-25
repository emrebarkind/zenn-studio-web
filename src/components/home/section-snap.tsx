"use client";

import { useEffect } from "react";

/**
 * Turns on the home page's screen-by-screen scrolling (`.snap-sections` in
 * globals.css) while the home page is on screen. An effect rather than a CSS
 * :has() check, because Next keeps a page you left in the DOM, hidden, and
 * the other pages must scroll freely.
 */
export function SectionSnap() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("snap-sections");
    return () => root.classList.remove("snap-sections");
  }, []);
  return null;
}
