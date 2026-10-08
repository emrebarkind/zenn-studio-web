// Cost and abuse limits for Zenn Asistan. Shared by the route handler and the
// chat panel so the UI enforces the same numbers the server does.

export const assistantLimits = {
  /** Characters per user message. */
  maxMessageChars: 500,
  /** User messages per conversation. */
  maxUserMessages: 20,
  /** Output cap per answer. */
  maxOutputTokens: 700,
  /** Requests per IP per window. */
  rateLimitRequests: 20,
  rateLimitWindowMs: 10 * 60 * 1000,
} as const;

export const defaultAssistantModel = "claude-haiku-4-5-20251001";

export function assistantModel(): string {
  return process.env.ZENN_ASSISTANT_MODEL?.trim() || defaultAssistantModel;
}
