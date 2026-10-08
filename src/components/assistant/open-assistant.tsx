"use client";

import type { ReactNode } from "react";

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
  return (
    <button type="button" className={className} onClick={() => openAssistant(question)}>
      {children}
    </button>
  );
}
