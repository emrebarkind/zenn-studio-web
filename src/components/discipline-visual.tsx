import Image from "next/image";
import type { Discipline } from "@/content/site";

/**
 * A discipline's picture. Until the studio has a real photo of a discipline
 * (Spinning, October 2026) it is a typographic card instead — never a stock or
 * generated image standing in for the studio.
 */
export function DisciplineVisual({ d, sizes, priority, className = "" }: { d: Discipline; sizes: string; priority?: boolean; className?: string }) {
  if (d.photo) {
    return (
      <Image
        src={d.photo.src}
        alt={d.photo.alt}
        placeholder="blur"
        priority={priority}
        fill
        sizes={sizes}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden bg-ink ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(225,255,130,0.28),transparent_55%)]" />
      <p className="absolute -right-[0.06em] -bottom-[0.18em] text-[clamp(5rem,30vw,9rem)] leading-none font-bold tracking-[-0.06em] text-lime/90 select-none [writing-mode:vertical-rl] rotate-180">
        {d.name.toLocaleLowerCase("tr")}
      </p>
    </div>
  );
}
