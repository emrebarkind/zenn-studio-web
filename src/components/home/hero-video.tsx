"use client";

import { useEffect, useState } from "react";

/**
 * The hero's moving background (owner, 2026-10-25): ten seconds of a pilates
 * session, looped and silent. Wide screens get a landscape cut of the portrait
 * video (each scene cropped around the action), phones the portrait original
 * at 720p. Files: public/video/hero-{wide,tall}.*
 *
 * The still underneath is what paints first; the video only starts loading
 * once the page itself has loaded, so it never competes with the text and
 * fonts for a phone's bandwidth, and it fades in once it is actually playing.
 * Reduced motion or a data-saver setting keep the still alone.
 */
export function HeroVideo() {
  // Which cut to play, chosen once the page has loaded (browsers ignore `media` on a video <source>).
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (still || saveData) return;
    let timer = 0;
    const start = () => {
      const wide = window.matchMedia("(min-width: 640px)").matches;
      timer = window.setTimeout(() => setSrc(wide ? "/video/hero-wide.mp4" : "/video/hero-tall.mp4"), 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-hidden className="absolute inset-0">
      <picture>
        <source media="(min-width: 640px)" srcSet="/video/hero-wide.webp" type="image/webp" />
        <source media="(min-width: 640px)" srcSet="/video/hero-wide.jpg" />
        <source srcSet="/video/hero-tall.webp" type="image/webp" />
        <img src="/video/hero-tall.jpg" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      {src && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
