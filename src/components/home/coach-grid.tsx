"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/content/site";

export type CoachCard = { name: string; surname?: string; areas: string[]; portrait: Photo; action: Photo };

/**
 * A dark card (owner, 2026-10-25, after a testimonial-card reference): the
 * photo on top melting into black, the areas they work in on the photo, the
 * name under it. Pointing at the photo (or tapping it) turns to a second
 * portrait from another angle (Ali: at the bag) and leans in a little.
 */
function Card({ coach, className = "" }: { coach: CoachCard; className?: string }) {
  const [second, setSecond] = useState(false);
  const fade = "object-cover transition-[opacity,transform] duration-500 ease-out";
  return (
    <li className={`on-ink overflow-hidden rounded-2xl bg-ink text-paper ${className}`}>
      <button
        type="button"
        aria-pressed={second}
        aria-label={`${coach.name}${coach.surname ? ` ${coach.surname}` : ""}: diğer fotoğrafı göster`}
        onClick={() => setSecond((v) => !v)}
        onPointerEnter={(e) => e.pointerType === "mouse" && setSecond(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setSecond(false)}
        className="relative -mt-px block aspect-[4/5] w-full overflow-hidden rounded-2xl"
      >
        <Image
          src={coach.portrait.src}
          alt={coach.portrait.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 1280px) 400px, (min-width: 640px) 33vw, 50vw"
          className={`${fade} ${second ? "scale-105 opacity-0" : "scale-100 opacity-100"}`}
          style={{ objectPosition: coach.portrait.position }}
        />
        <Image
          src={coach.action.src}
          alt={coach.action.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 1280px) 400px, (min-width: 640px) 33vw, 50vw"
          className={`${fade} ${second ? "scale-105 opacity-100" : "scale-100 opacity-0"}`}
          style={{ objectPosition: coach.action.position }}
        />
        {/* The photo melts into the card; what they work in sits on it as plain text, no chips (owner, 2026-10-25). */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
        <span className="absolute inset-x-3 bottom-2.5 text-left text-[12px] leading-snug font-medium text-paper/85 sm:inset-x-5 sm:bottom-3 sm:text-[14px]">
          {coach.areas.join(" · ")}
        </span>
      </button>
      {/* First name small, surname large (owner, 2026-10-25); sized so the longest surname fits a phone card. */}
      <div className="px-3 pt-2 pb-4 sm:px-5 sm:pb-5">
        {coach.surname && <p className="text-[14px] leading-tight font-medium text-paper/60 sm:text-[15px]">{coach.name}</p>}
        {/* A long surname (Pekmezcioğulları) steps down a size on a phone card rather than breaking mid-word. */}
        <p
          className={`mt-0.5 leading-[1.05] font-semibold tracking-[-0.03em] whitespace-nowrap ${
            (coach.surname ?? coach.name).length > 12 ? "text-[0.9rem] sm:text-[1.2rem] lg:text-[1.6rem]" : "text-[1.2rem] sm:text-[1.45rem] lg:text-[1.9rem]"
          }`}
        >
          {coach.surname ?? coach.name}
        </p>
      </div>
    </li>
  );
}

export function CoachGrid({ coaches }: { coaches: CoachCard[] }) {
  return (
    // Three to a row across the full width, the last two centred under them (six columns, two each), owner 2026-10-25.
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-5 lg:gap-6">
      {coaches.map((c, i) => {
        const rest = coaches.length % 3;
        const lastRow = i >= coaches.length - rest;
        const firstOfLastRow = i === coaches.length - rest;
        return (
          <Card
            key={c.name}
            coach={c}
            className={`sm:col-span-2 ${lastRow && firstOfLastRow ? (rest === 2 ? "sm:col-start-2" : "sm:col-start-3") : ""} ${
              coaches.length % 2 === 1 && i === coaches.length - 1 ? "col-span-2 mx-auto w-[calc(50%-0.375rem)] sm:mx-0 sm:w-full" : ""
            }`}
          />
        );
      })}
    </ul>
  );
}
