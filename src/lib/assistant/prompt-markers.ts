// Action markers the model may put on the last line of an answer. The chat
// panel turns them into buttons and never shows them as text (see actions.ts).
// Kept apart from prompt.ts so client code can import them without the prompt.
export const ENROLL_MARKER = "<<KAYIT";
export const HANDOFF_MARKER = "<<EKIP>>";
