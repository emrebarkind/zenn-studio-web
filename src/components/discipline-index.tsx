import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { disciplines, formats } from "@/content/site";

const formatName = Object.fromEntries(formats.map((f) => [f.id, f.name]));

/** The page's signature element: the disciplines as an oversized type index.
 *  Native exclusive <details> (shared `name`) — one open at a time, no JS. */
export function DisciplineIndex() {
  return (
    <ul className="border-t border-ink/15">
      {disciplines.map((d) => (
        <li key={d.slug} className="border-b border-ink/15">
          <details name="discipline" className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 sm:py-7 [&::-webkit-details-marker]:hidden">
              <span className="font-display text-[clamp(2.25rem,7.5vw,5.75rem)] leading-[0.95] font-bold tracking-[-0.045em] transition-colors group-open:text-moss group-hover:text-moss">
                {d.name}
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-ink/20 transition-transform group-open:rotate-45 group-open:bg-lime group-open:ring-0">
                <Plus className="size-5" aria-hidden />
              </span>
            </summary>
            <div className="grid gap-6 pb-8 md:grid-cols-[1.3fr_1fr] md:gap-12">
              <Image
                src={d.photo.src}
                alt={d.photo.alt}
                placeholder="blur"
                sizes="(min-width: 768px) 55vw, 100vw"
                className="aspect-[16/10] w-full rounded-3xl object-cover md:row-span-2"
              />
              <div>
                <p className="font-display text-xl font-semibold tracking-tight">{d.tagline}</p>
                <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">{d.description}</p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {d.formats.map((f) => (
                    <span key={f} className="rounded-full bg-moss-soft px-3 py-1 text-sm font-medium text-moss">
                      {formatName[f]}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/branslar/${d.slug}`}
                  className="inline-block font-semibold underline decoration-2 underline-offset-4 hover:text-moss"
                >
                  {d.name} hakkında her şey
                </Link>
              </div>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
