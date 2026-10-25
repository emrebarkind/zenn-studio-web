"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Discipline } from "@/content/site";
import { DisciplineVisual } from "@/components/discipline-visual";
import { buttonClass } from "@/components/ui";

export type AccordionItem = Discipline & { formatLabel: string; coachLine: string | null };

/**
 * The five disciplines as photo panels. On a wide screen they sit side by
 * side and the one you point at (or tab to) opens up to its line, its coaches
 * and a request link; on a phone they stack, each one a link to its page.
 */
export function DisciplineAccordion({ items }: { items: AccordionItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="hidden h-[min(620px,74vh)] min-h-[520px] gap-3 lg:flex">
        {items.map((d, i) => {
          const open = i === active;
          return (
            <article
              key={d.slug}
              onMouseEnter={() => setActive(i)}
              onFocusCapture={() => setActive(i)}
              className={`on-ink @container relative min-w-0 basis-0 overflow-hidden rounded-[28px] bg-ink text-paper transition-[flex-grow] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                open ? "grow-[3.4]" : "grow"
              }`}
            >
              <DisciplineVisual
                d={d}
                sizes="(min-width: 1024px) 560px, 1px"
                className={`transition-transform duration-1000 ease-out ${open ? "scale-[1.03]" : "scale-100"}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/0" aria-hidden />
              {/* The whole panel opens on tap too; links below sit above this button. */}
              <button
                type="button"
                className="absolute inset-0 cursor-pointer"
                aria-expanded={open}
                aria-controls={`brans-${d.slug}`}
                aria-label={d.name}
                onClick={() => setActive(i)}
              />
              <div className={`pointer-events-none absolute inset-x-0 bottom-0 transition-[padding] duration-500 ${open ? "p-6 xl:p-7" : "p-4 xl:p-5"}`}>
                <p
                  className={`mb-3 w-fit rounded-full bg-paper/15 px-3 py-1 text-[13px] font-semibold backdrop-blur transition-opacity duration-500 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {d.formatLabel}
                </p>
                <h3
                  lang="tr"
                  className={`font-semibold tracking-[-0.035em] text-balance hyphens-auto transition-[font-size] duration-500 ${
                    open ? "text-[2.5rem] leading-[1]" : "text-[clamp(1.05rem,12.5cqw,1.5rem)] leading-[1.08]"
                  }`}
                >
                  {d.name}
                </h3>
                <div
                  id={`brans-${d.slug}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="mt-3 max-w-md text-[15px] leading-relaxed text-paper/80">{d.description}</p>
                    {d.coachLine && <p className="mt-3 text-sm font-medium text-paper/60">{d.coachLine}</p>}
                    <div className="pointer-events-auto mt-5 flex flex-wrap items-center gap-2" inert={!open}>
                      <Link href={`/kayit?brans=${d.slug}`} className={buttonClass("primary", "relative z-10 min-h-11 px-5")}>
                        Ders talebi
                      </Link>
                      <Link
                        href={`/branslar/${d.slug}`}
                        className="relative z-10 inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[15px] font-semibold text-paper/85 hover:text-paper"
                      >
                        Branşı incele
                        <ArrowUpRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:hidden">
        {items.map((d, i) => (
          <li key={d.slug} className={i === 0 ? "sm:col-span-2" : ""}>
            <Link
              href={`/branslar/${d.slug}`}
              className={`group on-ink @container relative block overflow-hidden rounded-[28px] bg-ink text-paper ${i === 0 ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-[4/3]"}`}
            >
              <DisciplineVisual d={d} sizes="(min-width: 640px) 50vw, 100vw" className="transition-transform duration-700 group-active:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/0" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-paper/70">{d.formatLabel}</p>
                  <h3 className="mt-1 text-[1.75rem] leading-[1.05] font-semibold tracking-[-0.035em]">{d.name}</h3>
                  <p className="mt-1 text-[15px] text-paper/75">{d.tagline}</p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper/15 backdrop-blur" aria-hidden>
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
