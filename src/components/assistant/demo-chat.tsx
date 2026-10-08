"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Mail, Phone, RotateCcw, Sparkles } from "lucide-react";
import { demoScenarios } from "@/content/demo";
import type { LandingCopy, Lang } from "@/content/landing";
import { parseReply } from "@/lib/assistant/actions";
import { greeting } from "@/lib/assistant/greeting";
import { buttonClass } from "@/components/ui";

type Phase = "idle" | "user" | "typing" | "done";

const channelIcons = [MessageCircle, Phone, Mail];

/**
 * Plays scripted conversations in the assistant's real chat UI. No API call:
 * the text "streams" locally, and the enrol / hand-off buttons come from the
 * same marker parser the live panel uses.
 */
export function DemoChat({ lang, copy }: { lang: Lang; copy: LandingCopy["demo"] }) {
  const scenarios = demoScenarios[lang];
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0);
  const [run, setRun] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scenario = scenarios[index];

  // Start the first run when the demo scrolls into view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun((r) => (r === 0 ? 1 : r));
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (run === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const full = scenario.assistant.length;
    const timers: number[] = [];
    if (reduce) {
      timers.push(window.setTimeout(() => {
        setPhase("done");
        setShown(full);
      }, 0));
      return () => timers.forEach(clearTimeout);
    }
    timers.push(window.setTimeout(() => {
      setPhase("idle");
      setShown(0);
    }, 0));
    timers.push(window.setTimeout(() => setPhase("user"), 250));
    timers.push(window.setTimeout(() => setPhase("typing"), 900));
    let chars = 0;
    const tick = () => {
      chars = Math.min(full, chars + 3);
      setShown(chars);
      if (chars < full) timers.push(window.setTimeout(tick, 16));
      else setPhase("done");
    };
    timers.push(window.setTimeout(tick, 1500));
    return () => timers.forEach(clearTimeout);
  }, [run, scenario]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [shown, phase]);

  const reply = parseReply(scenario.assistant.slice(0, shown));
  const showUser = phase !== "idle";
  const showAssistant = phase === "typing" || phase === "done";

  return (
    <div ref={rootRef}>
      <div role="tablist" aria-label={copy.title} className="flex flex-wrap gap-2">
        {scenarios.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => {
              setIndex(i);
              setRun((r) => r + 1);
            }}
            className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
              i === index ? "bg-lime text-ink" : "text-paper/80 ring-1 ring-paper/25 hover:ring-paper/60"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <section
        aria-label={lang === "tr" ? "Zenn Asistan demo" : "Zenn Assistant demo"}
        className="mt-5 flex h-[520px] flex-col overflow-hidden rounded-[28px] bg-paper text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]"
      >
        <header className="flex items-center justify-between bg-ink px-5 py-4 text-paper ring-1 ring-paper/10">
          <div className="flex items-center gap-2.5">
            <Sparkles className="size-5 text-lime" aria-hidden />
            <p className="font-semibold">{lang === "tr" ? "Zenn Asistan" : "Zenn Assistant"}</p>
            <span className="rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-paper/30">
              {lang === "tr" ? "Yapay zekâ" : "AI"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-paper/80 hover:text-paper"
          >
            <RotateCcw className="size-4" aria-hidden />
            {copy.replay}
          </button>
        </header>

        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5" aria-live="polite">
          <div className="max-w-[88%] rounded-[20px] rounded-tl-md bg-card px-4 py-3 text-[15px] leading-relaxed">
            {greeting[lang]}
          </div>
          {showUser && (
            <div className="ml-auto max-w-[85%] rounded-[20px] rounded-tr-md bg-ink px-4 py-3 text-[15px] text-paper">
              {scenario.user}
            </div>
          )}
          {showAssistant && (
            <div className="max-w-[88%]">
              <div className="rounded-[20px] rounded-tl-md bg-card px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap">
                {reply.text || <span className="inline-block animate-pulse">…</span>}
              </div>
              {phase === "done" && reply.enroll && (
                <Link href={reply.enroll.href} className={buttonClass("primary", "mt-2 min-h-10")}>
                  {copy.enroll}
                </Link>
              )}
              {phase === "done" && reply.handoff && (
                <div className="mt-2 rounded-[18px] bg-paper p-4 ring-1 ring-ink/10">
                  <p className="text-sm font-semibold">{copy.handoffTitle}</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {copy.channels.map((c, i) => {
                      const Icon = channelIcons[i];
                      return (
                        <li key={c} className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-medium">
                          <Icon className="size-4" aria-hidden />
                          {c}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-2 text-xs text-ink-soft">{copy.handoffNote}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-ink/10 px-4 py-3">
          <p className="text-xs leading-snug text-ink-soft">{copy.note}</p>
        </div>
      </section>
    </div>
  );
}
