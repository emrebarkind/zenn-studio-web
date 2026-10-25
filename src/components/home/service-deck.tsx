"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import { disciplines, type Discipline } from "@/content/site";
import { DisciplineVisual } from "@/components/discipline-visual";

type Config = { x: number; y: number; rotate: number; shrink: number };

// How far apart, how low, how tilted and how much smaller the cards beside the centre sit.
function configFor(width: number): Config {
  if (width < 640) return { x: 92, y: 18, rotate: 7, shrink: 0.07 };
  if (width < 1024) return { x: 150, y: 28, rotate: 9, shrink: 0.09 };
  return { x: 215, y: 34, rotate: 10, shrink: 0.1 };
}

/** -total/2 … total/2: where a card sits relative to the centre, wrapping around. */
function wrapOffset(index: number, progress: number, total: number) {
  let diff = (index - progress) % total;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

/**
 * Hizmetlerimiz as a stacked deck (owner, 2026-10-25, after a stacked
 * carousel reference). The front card is a lesson; the others fan out behind
 * it. Pointing near the left or right edge lets the deck flow that way;
 * clicking a card brings it to the front, and clicking the front card opens
 * the lesson. It can be dragged (or swiped), and the arrows and Tab key work
 * too. Under reduced motion the cards move without animating.
 */
export function ServiceDeck() {
  const total = disciplines.length;
  const progress = useMotionValue(0);
  const reduce = useReducedMotion();
  const box = React.useRef<HTMLDivElement>(null);
  const spring = React.useRef<AnimationPlaybackControls | null>(null);
  const edge = React.useRef(0); // -1 … 1 while the mouse is near an edge
  const pan = React.useRef({ start: 0, moved: false });
  const [config, setConfig] = React.useState<Config>(configFor(1280));
  const [front, setFront] = React.useState(0);

  React.useEffect(() => {
    const fit = () => setConfig(configFor(window.innerWidth));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  React.useEffect(() => progress.on("change", (p) => setFront(((Math.round(p) % total) + total) % total)), [progress, total]);

  const settle = React.useCallback(
    (target: number) => {
      spring.current?.stop();
      if (reduce) progress.set(target);
      else spring.current = animate(progress, target, { type: "spring", stiffness: 200, damping: 30, mass: 1 });
    },
    [progress, reduce],
  );

  /** Bring a card to the front the short way round. */
  const bringToFront = React.useCallback(
    (index: number) => settle(progress.get() + wrapOffset(index, progress.get(), total)),
    [progress, settle, total],
  );

  // Edge flow: while the mouse is near an edge, the deck keeps moving that way.
  React.useEffect(() => {
    let frame = 0;
    const tick = () => {
      if (edge.current !== 0) progress.set(progress.get() + edge.current * 0.03);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [progress]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || reduce || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const t = (e.clientX - r.left) / r.width;
    const zone = 0.2;
    const next = t < zone ? -(zone - t) / zone : t > 1 - zone ? (t - (1 - zone)) / zone : 0;
    if (next !== 0 && edge.current === 0) spring.current?.stop();
    if (next === 0 && edge.current !== 0) settle(Math.round(progress.get()));
    edge.current = next;
  };
  const onPointerLeave = () => {
    if (edge.current !== 0) settle(Math.round(progress.get()));
    edge.current = 0;
  };

  return (
    // overflow-x-clip: the fanned-out cards may pass the screen edge, never widen the page.
    <div className="flex w-full flex-col items-center overflow-x-clip">
      <motion.div
        ref={box}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPanStart={() => {
          spring.current?.stop();
          pan.current = { start: progress.get(), moved: false };
        }}
        onPan={(_, info) => {
          if (Math.abs(info.offset.x) > 6) pan.current.moved = true;
          progress.set(pan.current.start - info.offset.x / (config.x * 1.2));
        }}
        onPanEnd={(_, info) => {
          const shift = Math.max(-3, Math.min(3, Math.round(-info.offset.x / (config.x * 1.2) - info.velocity.x / 900)));
          settle(Math.round(pan.current.start) + shift);
        }}
        className="relative flex h-[23rem] w-full touch-pan-y items-center justify-center select-none sm:h-[28rem] lg:h-[min(31rem,56svh)]"
        role="group"
        aria-roledescription="kart destesi"
        aria-label="Hizmetlerimiz"
      >
        {disciplines.map((d, i) => (
          <DeckCard
            key={d.slug}
            d={d}
            index={i}
            total={total}
            progress={progress}
            config={config}
            isFront={i === front}
            onSelect={(e) => {
              if (pan.current.moved) {
                e.preventDefault();
                pan.current.moved = false;
                return;
              }
              // The front card is a plain link to the lesson; any other card comes to the front first.
              if (i !== front) {
                e.preventDefault();
                bringToFront(i);
              }
            }}
            onFocus={() => bringToFront(i)}
          />
        ))}
      </motion.div>

      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={() => settle(Math.round(progress.get()) - 1)} aria-label="Önceki ders" className="grid size-11 place-items-center rounded-full bg-card transition-colors hover:bg-ink hover:text-paper">
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        <p className="min-w-40 text-center text-sm font-semibold" aria-live="polite">
          {disciplines[front].name}
        </p>
        <button type="button" onClick={() => settle(Math.round(progress.get()) + 1)} aria-label="Sonraki ders" className="grid size-11 place-items-center rounded-full bg-card transition-colors hover:bg-ink hover:text-paper">
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

function DeckCard({
  d,
  index,
  total,
  progress,
  config,
  isFront,
  onSelect,
  onFocus,
}: {
  d: Discipline;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: Config;
  isFront: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onFocus: () => void;
}) {
  const offset = useTransform(progress, (p) => wrapOffset(index, p, total));
  const x = useTransform(offset, (o) => o * config.x);
  const y = useTransform(offset, (o) => (Math.abs(o) < 0.05 ? 0 : Math.abs(o) * config.y));
  const rotate = useTransform(offset, (o) => (Math.abs(o) < 0.05 ? 0 : o * config.rotate));
  const scale = useTransform(offset, (o) => 1 - Math.abs(o) * config.shrink);
  const zIndex = useTransform(offset, (o) => Math.round(100 - Math.abs(o) * 10));
  const opacity = useTransform(offset, [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2], [0, 1, 1, 1, 0]);
  const shade = useTransform(offset, [-2, -0.5, 0, 0.5, 2], [0.55, 0.25, 0, 0.25, 0.55]);
  const words = useTransform(offset, [-0.6, 0, 0.6], [0, 1, 0]);

  return (
    <motion.div
      style={{ x, y, rotate, scale, zIndex, opacity }}
      className="on-ink absolute h-[19rem] w-[13.5rem] sm:h-[23rem] sm:w-[16rem] lg:h-[min(27rem,48svh)] lg:w-[min(18rem,32svh)]"
    >
      <Link
        href={`/branslar/${d.slug}`}
        onClick={onSelect}
        onFocus={onFocus}
        draggable={false}
        className="group relative block h-full w-full overflow-hidden rounded-2xl bg-ink text-paper shadow-[0_24px_50px_-24px_rgba(21,25,21,0.55)] outline-offset-4"
      >
        <DisciplineVisual d={d} morph sizes="(min-width: 1024px) 290px, (min-width: 640px) 256px, 216px" className="transition-transform duration-700 group-hover:scale-110" />
        <motion.span aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-black" />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        {/* Only a lesson that runs solely as a group class says so (Spinning). */}
        {d.formats.every((f) => f === "group") && (
          <span className="absolute top-4 right-4 rounded-full bg-paper/95 px-3 py-1 text-[11px] font-bold tracking-wide text-ink uppercase">Grup dersi</span>
        )}
        <motion.span style={{ opacity: words }} className="absolute inset-x-5 bottom-6 block">
          <span className="block text-[1.6rem] leading-[1.05] font-semibold tracking-[-0.03em]">{d.name}</span>
          <span className="mt-1 block text-[14px] text-paper/75">{d.tagline}</span>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-lime">
            İncele
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </motion.span>
        {/* Spoken after the visible words, so the link's name still starts with what is on screen. */}
        {!isFront && <span className="sr-only"> (öne getir)</span>}
      </Link>
    </motion.div>
  );
}
