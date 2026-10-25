"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/content/site";

export type CoachCard = { name: string; surname?: string; areas: string[]; portrait: Photo; action: Photo };

/** Portrait first; pointing at it (or tapping it) turns to a second portrait from another angle (Ali: at the bag). */
function Card({ coach, className = "" }: { coach: CoachCard; className?: string }) {
  const [second, setSecond] = useState(false);
  const fade = "object-cover transition-[opacity,transform] duration-700 ease-out";
  return (
    <li className={`rise text-center ${className}`}>
      <button
        type="button"
        aria-pressed={second}
        aria-label={`${coach.name}${coach.surname ? ` ${coach.surname}` : ""}: diğer fotoğrafı göster`}
        onClick={() => setSecond((v) => !v)}
        onPointerEnter={(e) => e.pointerType === "mouse" && setSecond(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setSecond(false)}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-card lg:aspect-[3/5] lg:max-h-[54svh]"
      >
        <Image
          src={coach.portrait.src}
          alt={coach.portrait.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw"
          className={`${fade} ${second ? "scale-[1.03] opacity-0" : "scale-100 opacity-100"}`}
          style={{ objectPosition: coach.portrait.position }}
        />
        <Image
          src={coach.action.src}
          alt={coach.action.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 370px, (min-width: 640px) 33vw, 50vw"
          className={`${fade} ${second ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"}`}
          style={{ objectPosition: coach.action.position }}
        />
        {/* What they work in, on the photo itself. */}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="on-ink absolute inset-x-2 bottom-2.5 flex flex-wrap justify-center gap-1.5">
          {coach.areas.map((a) => (
            <span key={a} className="rounded-full bg-paper/20 px-2 py-1 text-[11px] leading-none font-semibold whitespace-nowrap text-paper backdrop-blur-md sm:px-2.5 sm:text-[13px]">
              {a}
            </span>
          ))}
        </span>
      </button>
      {/* First name small, surname large (owner, 2026-10-25); sized so the longest surname fits a phone card. */}
      {coach.surname && <p className="mt-4 text-[15px] leading-tight font-medium text-ink-soft sm:text-base">{coach.name}</p>}
      <p className={`${coach.surname ? "mt-0.5" : "mt-4"} text-[1.3rem] leading-[1.05] font-semibold tracking-[-0.03em] break-words sm:text-[1.6rem]`}>
        {coach.surname ?? coach.name}
      </p>
    </li>
  );
}

export function CoachGrid({ coaches }: { coaches: CoachCard[] }) {
  return (
    // Three to a row, a short last row centred (six columns, two each); all five in one row on a wide screen.
    <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-6 sm:gap-x-6 lg:grid-cols-5">
      {coaches.map((c, i) => {
        const rest = coaches.length % 3;
        const lastRow = i >= coaches.length - rest;
        const firstOfLastRow = i === coaches.length - rest;
        return (
          <Card
            key={c.name}
            coach={c}
            className={`sm:col-span-2 lg:col-span-1 lg:col-start-auto ${lastRow && firstOfLastRow ? (rest === 2 ? "sm:col-start-2" : "sm:col-start-3") : ""} ${
              coaches.length % 2 === 1 && i === coaches.length - 1 ? "col-span-2 mx-auto w-[calc(50%-0.5rem)] sm:mx-0 sm:w-full" : ""
            }`}
          />
        );
      })}
    </ul>
  );
}
