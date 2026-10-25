import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "ink" | "ghost" | "light" | "outline";

const variants: Record<Variant, string> = {
  primary: "bg-lime text-ink hover:bg-lime-hover",
  ink: "bg-ink text-paper hover:bg-moss",
  ghost: "text-ink ring-1 ring-ink/20 hover:ring-ink/50",
  light: "bg-paper text-ink hover:bg-stone",
  // Secondary action on a dark band or over a photograph.
  outline: "text-paper ring-1 ring-paper/35 hover:bg-paper/10 hover:ring-paper/60",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold whitespace-nowrap transition-[color,background-color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${extra}`;
}

export function ButtonLink({
  variant,
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link {...props} className={buttonClass(variant, className)} />;
}

export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return <div {...props} className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`} />;
}

export function SectionTitle({ children, lead }: { children: React.ReactNode; lead?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em]">
        {children}
      </h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lead}</p>}
    </div>
  );
}

/** Home-page section heading: one big line, an optional short line under it. */
export function SectionHeading({
  title,
  lead,
  tone = "ink",
  size = "lg",
  align = "center",
  className = "",
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  tone?: "ink" | "paper";
  /** "md" for a heading that shares its row with a form or a picture. */
  size?: "lg" | "md";
  /** The home page flows down the middle; pages with a side picture align left. */
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={`rise max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      <h2
        className={`font-semibold tracking-[-0.035em] text-balance ${
          size === "lg" ? "text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.05]" : "text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08]"
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`mt-3 max-w-[38rem] text-base leading-relaxed sm:text-lg ${align === "center" ? "mx-auto" : ""} ${tone === "paper" ? "text-paper/70" : "text-ink-soft"}`}>{lead}</p>
      )}
    </div>
  );
}

export function SoonTag() {
  return (
    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-ink-soft ring-1 ring-ink/20">Yakında</span>
  );
}
