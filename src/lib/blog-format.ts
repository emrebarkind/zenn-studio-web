/** "Ekim 2026" from "2026-10-25": the month only, no day (owner, 2026-10-25); the same in any time zone. */
export function formatPostDate(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric", timeZone: "UTC" }).format(Date.UTC(y, m - 1, 1));
}
