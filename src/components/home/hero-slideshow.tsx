"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

export type HeroSlide = {
  key: string;
  label: string;
  href: string;
  /** Landscape frame for tablets and up. */
  wide: { src: StaticImageData; alt: string; position?: string };
  /** Portrait frame for phones (a wide shot crops to legs on a phone). */
  tall: { src: StaticImageData; alt: string; position?: string };
};

const INTERVAL_MS = 6500;

/**
 * The hero's photographs, changing on their own: a slow cross-fade with a
 * gentle push-in on the active frame, a progress bar per photo (tap to jump)
 * and a pause button — auto-moving content must be stoppable (WCAG 2.2.2).
 * Honours reduced motion (no auto-advance, no push-in), and stops while the
 * tab is hidden so it never burns a phone's battery in the background.
 */
export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const vis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => {
      mq.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  const running = !paused && !hidden && !reduced && slides.length > 1;
  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(next, INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [running, index, next]);

  const current = slides[index];

  return (
    <>
      <div className="absolute inset-0" aria-roledescription="slayt gösterisi" aria-label="Stüdyodan fotoğraflar">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.key}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${active ? "opacity-100" : "opacity-0"}`}
            >
              <div className={`absolute inset-0 ${active && !reduced ? "hero-push" : ""}`}>
                <Image
                  src={s.tall.src}
                  alt={s.tall.alt}
                  placeholder="blur"
                  priority={i === 0}
                  fill
                  sizes="(min-width: 640px) 1px, 100vw"
                  className="object-cover sm:hidden"
                  style={{ objectPosition: s.tall.position ?? "50% 30%" }}
                />
                <Image
                  src={s.wide.src}
                  alt={s.wide.alt}
                  placeholder="blur"
                  priority={i === 0}
                  fill
                  sizes="(min-width: 640px) 100vw, 1px"
                  className="hidden object-cover sm:block"
                  style={{ objectPosition: s.wide.position ?? "60% 40%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Which discipline is on screen, and a bar per photo. */}
      <div className="absolute inset-x-0 top-[calc(68px+1rem)] z-10 sm:top-[calc(76px+1.25rem)]">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link
            href={current.href}
            className="min-w-0 shrink truncate rounded-full bg-ink/45 px-3 py-1.5 text-sm font-semibold text-paper backdrop-blur-md hover:bg-ink/65"
            aria-live="polite"
          >
            {current.label}
          </Link>
          <div className="flex flex-1 gap-1.5" role="group" aria-label="Fotoğraf seç">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}. fotoğraf: ${s.label}`}
                aria-current={i === index ? "true" : undefined}
                className="group grid h-8 flex-1 place-items-center"
              >
                <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-paper/30">
                  <span
                    key={i === index ? `on-${index}` : "off"}
                    className={`absolute inset-y-0 left-0 rounded-full bg-paper ${
                      i < index ? "w-full" : i === index ? (running ? "hero-progress" : "w-full") : "w-0"
                    }`}
                    style={i === index ? { animationDuration: `${INTERVAL_MS}ms` } : undefined}
                  />
                </span>
              </button>
            ))}
          </div>
          {slides.length > 1 && !reduced ? (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Fotoğrafları oynat" : "Fotoğrafları durdur"}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/45 text-paper backdrop-blur-md hover:bg-ink/65"
            >
              {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
