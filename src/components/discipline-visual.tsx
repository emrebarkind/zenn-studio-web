import Image from "next/image";
import type { Discipline } from "@/content/site";

/**
 * A discipline's picture. A discipline without a studio photo gets a
 * typographic card instead, its own line set large; never a stock image
 * standing in for the studio.
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
        style={{ objectPosition: d.photo.position }}
      />
    );
  }
  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden bg-ink ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(225,255,130,0.22),transparent_60%)]" />
      <p className="absolute top-5 right-5 left-5 text-[clamp(1.25rem,12cqw,3.25rem)] leading-[0.95] font-bold tracking-[-0.045em] text-lime">
        {d.tagline.split(/,\s*/).map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}
