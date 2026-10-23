"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonClass } from "@/components/ui";

type Mode = "landing-tr" | "landing-en" | "studio";

// The studio site (home) and the B2B pages (/isletmeler, /en) share one header.
const nav: Record<Mode, { href: string; label: string }[]> = {
  "landing-tr": [
    { href: "/isletmeler#urun", label: "Ürün" },
    { href: "/isletmeler#demo", label: "Demo" },
    { href: "/isletmeler#guven", label: "Güven" },
    { href: "/", label: "Zenn Studio" },
  ],
  "landing-en": [
    { href: "/en#product", label: "Product" },
    { href: "/en#demo", label: "Demo" },
    { href: "/en#trust", label: "Trust" },
    { href: "/", label: "Zenn Studio" },
  ],
  studio: [
    { href: "/#branslar", label: "Branşlar" },
    { href: "/online", label: "Zenn Online" },
    { href: "/paketler", label: "Paketler" },
    { href: "/ders-bul", label: "Sana uygun ders" },
  ],
};

const ctas: Record<Mode, { href: string; label: string }> = {
  "landing-tr": { href: "/isletmeler#iletisim", label: "Bize ulaşın" },
  "landing-en": { href: "/en#contact", label: "Contact us" },
  studio: { href: "/kayit", label: "Ön kayıt yap" },
};

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`text-[26px] font-bold tracking-[-0.05em] ${className}`}>zenn</span>;
}

/** Floating dark pill. It is sticky, so pages flow below it; the home hero
 *  pulls itself up underneath with a negative margin equal to its height
 *  (pt-3 + h-14, sm: h-16). */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const lang = pathname.startsWith("/en") ? "en" : "tr";
  const mode: Mode = pathname.startsWith("/isletmeler") ? "landing-tr" : lang === "en" ? "landing-en" : "studio";
  const items = nav[mode];
  const cta = ctas[mode];
  // Small language switch: TR ↔ EN, on the B2B pages only (English covers those).
  const switcher = mode === "studio" ? null : (
    <Link
      href={lang === "en" ? "/isletmeler" : "/en"}
      hrefLang={lang === "en" ? "tr" : "en"}
      onClick={() => setOpen(false)}
      className="grid min-h-10 min-w-10 place-items-center rounded-full px-2 text-sm font-semibold text-paper/75 hover:text-paper"
      aria-label={lang === "en" ? "Türkçe" : "English"}
    >
      {lang === "en" ? "TR" : "EN"}
    </Link>
  );

  return (
    <header className="on-ink sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="mx-auto max-w-6xl rounded-[22px] bg-ink/80 text-paper shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-150">
        <div className="flex h-14 items-center justify-between pr-2 pl-5 sm:h-16 sm:pr-3 sm:pl-6">
          <Link href="/" aria-label="Zenn Studio ana sayfa" onClick={() => setOpen(false)}>
            <Wordmark />
          </Link>
          <nav aria-label="Ana menü" className="hidden items-center gap-7 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium text-paper/75 transition-colors hover:text-paper"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            {switcher}
            <Link href={cta.href} className={buttonClass("primary", "hidden min-h-10 px-5 sm:inline-flex")}>
              {cta.label}
            </Link>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? (lang === "en" ? "Close menu" : "Menüyü kapat") : lang === "en" ? "Open menu" : "Menüyü aç"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
        {open && (
          <nav id="mobile-nav" aria-label="Mobil menü" className="px-5 pb-5 md:hidden">
            <ul className="border-t border-paper/10 pt-2">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3.5 text-2xl font-semibold tracking-tight"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={cta.href} onClick={() => setOpen(false)} className={buttonClass("primary", "mt-3 w-full")}>
              {cta.label}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
