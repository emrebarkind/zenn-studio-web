"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/content/site";

export type CoachCard = { name: string; branches: string; portrait: Photo; action: Photo };

/**
 * One coach, two photographs: the portrait, and the coach at work. Pointing
 * at the card (or focusing it) swaps to the second; on a touch screen a tap
 * swaps, and while the card is on screen the two alternate on their own.
 */
function Card({ coach, index }: { coach: CoachCard; index: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [second, setSecond] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || touched) return;
    const touch = window.matchMedia("(hover: none)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!touch || still) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    let start: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        clearInterval(timer);
        clearTimeout(start);
        if (!entry.isIntersecting) return;
        // Staggered, so the row does not flip all at once.
        start = setTimeout(() => {
          setSecond((v) => !v);
          timer = setInterval(() => setSecond((v) => !v), 3200);
        }, 900 + index * 700);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
      clearTimeout(start);
    };
  }, [index, touched]);

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={second}
      aria-label={`${coach.name}, ${coach.branches}. Diğer fotoğrafı göster`}
      onClick={() => {
        setTouched(true);
        setSecond((v) => !v);
      }}
      // Mouse only: a tap also fires pointer/focus events, and the click above already toggles.
      onPointerEnter={(e) => e.pointerType === "mouse" && setSecond(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setSecond(false)}
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && setSecond(true)}
      onBlur={() => setSecond(false)}
      className="group relative block aspect-[3/4.2] w-full overflow-hidden rounded-[28px] bg-paper/5 text-left"
    >
      <Image
        src={coach.portrait.src}
        alt={coach.portrait.alt}
        fill
        placeholder="blur"
        sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 78vw"
        className={`object-cover transition-[opacity,transform] duration-700 ease-out ${second ? "scale-[1.04] opacity-0" : "scale-100 opacity-100"}`}
        style={{ objectPosition: coach.portrait.position }}
      />
      <Image
        src={coach.action.src}
        alt={coach.action.alt}
        fill
        placeholder="blur"
        sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 78vw"
        className={`object-cover transition-[opacity,transform] duration-700 ease-out ${second ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
        style={{ objectPosition: coach.action.position }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/0" aria-hidden />
      {/* Two segments: which of the two photographs is showing. */}
      <div className="absolute inset-x-5 top-5 flex gap-1.5" aria-hidden>
        <span className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${second ? "bg-paper/35" : "bg-paper"}`} />
        <span className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${second ? "bg-paper" : "bg-paper/35"}`} />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="text-[2rem] leading-none font-semibold tracking-[-0.04em] text-paper">{coach.name}</p>
        <p className="mt-2 text-sm leading-snug text-paper/75">{coach.branches}</p>
      </div>
    </button>
  );
}

export function CoachCards({ coaches }: { coaches: CoachCard[] }) {
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
      {coaches.map((c, i) => (
        <li key={c.name} className={`w-[78vw] max-w-[340px] shrink-0 snap-center sm:w-[45vw] lg:w-auto lg:max-w-none ${i % 2 === 1 ? "lg:translate-y-12" : ""}`}>
          <Card coach={c} index={i} />
        </li>
      ))}
    </ul>
  );
}
