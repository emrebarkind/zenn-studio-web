"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/content/site";

export type CoachCard = { name: string; branches: string; portrait: Photo; action: Photo };

/** Portrait first; pointing at it (or tapping it) turns to a second portrait from another angle (Ali: at the bag). */
function Card({ coach }: { coach: CoachCard }) {
  const [second, setSecond] = useState(false);
  const fade = "object-cover transition-[opacity,transform] duration-700 ease-out";
  return (
    <li className="text-center">
      <button
        type="button"
        aria-pressed={second}
        aria-label={`${coach.name}: diğer fotoğrafı göster`}
        onClick={() => setSecond((v) => !v)}
        onPointerEnter={(e) => e.pointerType === "mouse" && setSecond(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setSecond(false)}
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-[24px] bg-card"
      >
        <Image
          src={coach.portrait.src}
          alt={coach.portrait.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 270px, 50vw"
          className={`${fade} ${second ? "scale-[1.03] opacity-0" : "scale-100 opacity-100"}`}
          style={{ objectPosition: coach.portrait.position }}
        />
        <Image
          src={coach.action.src}
          alt={coach.action.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 270px, 50vw"
          className={`${fade} ${second ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"}`}
          style={{ objectPosition: coach.action.position }}
        />
      </button>
      <p className="mt-4 text-2xl font-semibold tracking-[-0.03em]">{coach.name}</p>
      <p className="mt-1 text-[15px] leading-snug text-ink-soft">{coach.branches}</p>
    </li>
  );
}

export function CoachGrid({ coaches }: { coaches: CoachCard[] }) {
  return (
    <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5">
      {coaches.map((c) => (
        <Card key={c.name} coach={c} />
      ))}
    </ul>
  );
}
