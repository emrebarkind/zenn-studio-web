"use client";

export const OPEN_ASSISTANT_EVENT = "zenn-assistant:open";

/** Opens the Zenn Asistan panel from anywhere, optionally sending a question. */
export function openAssistant(question?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT, { detail: { question } }));
}
