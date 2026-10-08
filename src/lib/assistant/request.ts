import { z } from "zod";
import { assistantLimits } from "./config";
import { findSensitiveData, mentionsHealth } from "./guard";

const message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

export const assistantRequestSchema = z
  .object({ messages: z.array(message).min(1).max(assistantLimits.maxUserMessages * 2) })
  .superRefine((v, ctx) => {
    if (v.messages[0].role !== "user") ctx.addIssue({ code: "custom", message: "first message must be from the user" });
    for (let i = 1; i < v.messages.length; i++) {
      if (v.messages[i].role === v.messages[i - 1].role) {
        ctx.addIssue({ code: "custom", message: "roles must alternate" });
        break;
      }
    }
    const last = v.messages.at(-1)!;
    if (last.role !== "user") ctx.addIssue({ code: "custom", message: "last message must be from the user" });
    if (last.content.length > assistantLimits.maxMessageChars) {
      ctx.addIssue({ code: "custom", message: "message too long" });
    }
    const userCount = v.messages.filter((m) => m.role === "user").length;
    if (userCount > assistantLimits.maxUserMessages) {
      ctx.addIssue({ code: "custom", message: "conversation limit reached" });
    }
  });

export type AssistantRequest = z.infer<typeof assistantRequestSchema>;

/**
 * Drops every user turn the guards stopped (health, payment/ID data) together
 * with the canned reply that followed it, so that content is never forwarded
 * to the model in a later request. Keeps roles alternating.
 */
export function withoutBlockedTurns(messages: AssistantRequest["messages"]): AssistantRequest["messages"] {
  const kept: AssistantRequest["messages"] = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (m.role === "user" && (mentionsHealth(m.content) || findSensitiveData(m.content))) {
      if (messages[i + 1]?.role === "assistant") i++;
      continue;
    }
    kept.push(m);
  }
  return kept;
}
