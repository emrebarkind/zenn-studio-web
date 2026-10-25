"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import type { Photo } from "@/content/site";

/**
 * The studio's photographs flowing round a slow ring behind the wordmark.
 * Decorative (the heading and the discipline section carry the content), so
 * the ring is hidden from screen readers; the pause button is not (moving
 * content longer than five seconds must be stoppable).
 */
export function HeroRing({ photos }: { photos: Photo[] }) {
  const [paused, setPaused] = useState(false);
  const n = photos.length;

  return (
    <>
      <div aria-hidden className="ring-stage absolute inset-x-0 top-0 h-[70%] sm:h-[74%]">
        <div className="ring" data-paused={paused} style={{ "--n": n } as CSSProperties}>
          {photos.map((p, i) => (
            <div key={i} className="ring-card" style={{ "--i": i } as CSSProperties}>
              <Image
                src={p.src}
                alt=""
                fill
                placeholder="blur"
                // The cards facing the viewer first.
                priority={i < 3 || i > n - 3}
                sizes="(min-width: 1024px) 360px, 220px"
                className="object-cover"
                style={{ objectPosition: p.position }}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        aria-label={paused ? "Fotoğrafları oynat" : "Fotoğrafları durdur"}
        className="absolute right-4 bottom-5 z-20 grid size-11 place-items-center rounded-full bg-paper/10 text-paper ring-1 ring-paper/20 backdrop-blur transition-colors hover:bg-paper/20 sm:right-6 sm:bottom-8"
      >
        {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
      </button>
    </>
  );
}
