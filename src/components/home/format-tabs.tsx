"use client";

import { useState } from "react";
import { studioFormats, type FormatId } from "@/content/site";
import { ButtonLink } from "@/components/ui";

/**
 * The hero's ways to train: group classes and individual / small group (1–6).
 * Tabs switch the line and the points; the request link carries the choice.
 */
export function FormatTabs() {
  const [id, setId] = useState<FormatId>("group");
  const f = studioFormats.find((x) => x.id === id)!;
  return (
    <div className="w-full max-w-md rounded-[28px] bg-ink/55 p-3 text-paper ring-1 ring-paper/10 backdrop-blur-xl sm:p-4">
      <div role="tablist" aria-label="Antrenman formatı" className="grid grid-cols-2 gap-1 rounded-full bg-paper/10 p-1">
        {studioFormats.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            id={`format-tab-${x.id}`}
            aria-selected={x.id === id}
            aria-controls="format-panel"
            onClick={() => setId(x.id)}
            className={`min-h-10 rounded-full px-2 text-sm font-semibold transition-colors ${
              x.id === id ? "bg-lime text-ink" : "text-paper/75 hover:text-paper"
            }`}
          >
            {x.short}
          </button>
        ))}
      </div>
      <div id="format-panel" role="tabpanel" aria-labelledby={`format-tab-${id}`} className="px-2 pt-4 pb-1">
        <p className="text-base font-semibold tracking-tight sm:text-lg">{f.summary}</p>
        {/* Phones keep the photo visible: the points show from tablet width up. */}
        <ul className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
          {f.points.map((p) => (
            <li key={p} className="rounded-full bg-paper/10 px-3 py-1 text-[13px] text-paper/85">
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5">
          <ButtonLink href={`/kayit?format=${f.id}`} className="px-3 whitespace-nowrap">
            Ders talebi
          </ButtonLink>
          <ButtonLink href="/#ders-bul" variant="light" className="bg-paper/15 px-3 whitespace-nowrap text-paper hover:bg-paper/25">
            Bana uyanı bul
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
