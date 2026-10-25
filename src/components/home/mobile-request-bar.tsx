"use client";

import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";

/**
 * Phones only: once the hero is out of view, a request button stays within
 * thumb reach at the bottom of the screen, and steps aside while the request
 * form itself (or the footer) is on screen.
 */
export function MobileRequestBar() {
  const [seen, setSeen] = useState<Record<string, boolean>>({ top: true });

  useEffect(() => {
    const targets = [document.getElementById("top"), document.getElementById("talep"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => !!el,
    );
    const io = new IntersectionObserver((entries) => {
      setSeen((prev) => {
        const next = { ...prev };
        for (const e of entries) next[e.target.id || e.target.tagName.toLowerCase()] = e.isIntersecting;
        return next;
      });
    });
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const show = !seen.top && !seen.talep && !seen.footer;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-30 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <a href="#talep" tabIndex={show ? 0 : -1} className={buttonClass("primary", "w-full shadow-[0_12px_30px_-10px_rgba(21,25,21,0.55)]")}>
        Ders talebi
      </a>
    </div>
  );
}
