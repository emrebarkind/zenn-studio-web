"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { assistantLive } from "@/lib/assistant/config";

export const OPEN_ASSISTANT_EVENT = "zenn-assistant:open";

/** Opens the Zenn Asistan panel from anywhere, optionally sending a question. */
export function openAssistant(question?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT, { detail: { question } }));
}

export function AskAssistantButton({
  question,
  className,
  children,
}: {
  question?: string;
  className?: string;
  children: ReactNode;
}) {
  // Without the live assistant, the same buttons lead to the scripted demo.
  if (!assistantLive) {
    return (
      <Link href="/#demo" className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={() => openAssistant(question)}>
      {children}
    </button>
  );
}
