/**
 * The logo is type only (owner, 2026-10-25): "Zenn" bold and "Studio" light,
 * as in the printed logo. No mark, and never a lowercase "zenn".
 */
export function ZennWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.2em] leading-none font-bold tracking-[-0.045em] whitespace-nowrap ${className}`}>
      <span>Zenn</span>
      <span className="font-normal tracking-[-0.03em] opacity-55">Studio</span>
    </span>
  );
}
