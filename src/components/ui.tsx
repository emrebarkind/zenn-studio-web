import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "ink" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-lime text-ink hover:bg-lime-hover",
  ink: "bg-ink text-paper hover:bg-moss",
  ghost: "text-ink ring-1 ring-ink/20 hover:ring-ink/50",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${extra}`;
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
      <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-bold tracking-[-0.03em]">
        {children}
      </h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lead}</p>}
    </div>
  );
}

export function SoonTag() {
  return (
    <span className="rounded-full bg-stone px-2.5 py-0.5 text-xs font-semibold text-ink-soft">Yakında</span>
  );
}
