"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Photo } from "@/content/site";

export type HeroSlide = { wide: Photo; tall: Photo };

/**
 * One large studio photograph behind the hero text, changing on its own every
 * few seconds with a slow cross-fade (landscape crops on wide screens,
 * portrait crops on phones). Stays on the first photo under reduced motion and
 * while the tab is hidden.
 */
export function HeroPhotos({ slides, interval = 6500 }: { slides: HeroSlide[]; interval?: number }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [slides.length, interval]);

  return (
    <div aria-hidden className="absolute inset-0">
      {slides.map((s, i) => {
        const on = i === active;
        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${on ? "opacity-100" : "opacity-0"}`}
          >
            <div className={on ? "hero-zoom absolute inset-0" : "absolute inset-0"}>
              <Image
                src={s.wide.src}
                alt=""
                fill
                placeholder="blur"
                priority={i === 0}
                sizes="(min-width: 640px) 100vw, 1px"
                className="hidden object-cover sm:block"
                style={{ objectPosition: s.wide.position }}
              />
              <Image
                src={s.tall.src}
                alt=""
                fill
                placeholder="blur"
                priority={i === 0}
                sizes="(min-width: 640px) 1px, 100vw"
                className="object-cover sm:hidden"
                style={{ objectPosition: s.tall.position }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
