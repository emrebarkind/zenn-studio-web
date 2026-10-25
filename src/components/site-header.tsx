"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonClass } from "@/components/ui";
import { ZennWordmark } from "@/components/brand";

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
    { href: "/#hizmetler", label: "Hizmetlerimiz" },
    { href: "/#antrenorler", label: "Eğitmen Kadromuz" },
    { href: "/#plan", label: "Sana uygun ders" },
    { href: "/#konum", label: "Konum" },
    { href: "/blog", label: "Blog" },
  ],
};

const ctas: Record<Mode, { href: string; label: string }> = {
  "landing-tr": { href: "/isletmeler#iletisim", label: "Bize ulaşın" },
  "landing-en": { href: "/en#contact", label: "Contact us" },
  studio: { href: "/#talep", label: "Ders talebi" },
};

/** Floating dark pill. It is sticky, so pages flow below it; the home hero
 *  pulls itself up underneath with a negative margin equal to its height
 *  (pt-3 + h-14, sm: h-16). Over the home hero it is an open, full-width bar
 *  instead (owner, 2026-10-25, after a reference): logo left, links centred,
 *  two lime dot links right; past the hero it gathers into the pill. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const lang = pathname.startsWith("/en") ? "en" : "tr";
  const mode: Mode = pathname.startsWith("/isletmeler") ? "landing-tr" : lang === "en" ? "landing-en" : "studio";
  const items = nav[mode];
  const cta = ctas[mode];
  const home = pathname === "/";
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    if (!home) return;
    const check = () => setPastHero(window.scrollY >= window.innerHeight - 120);
    const first = requestAnimationFrame(check);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [home]);
  const onHero = home && !pastHero && !open;
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
    <header className="on-ink sticky top-0 z-40 px-3 pt-3 sm:px-5" style={{ viewTransitionName: "site-header" }}>
      <div
        className={`mx-auto rounded-[22px] text-paper transition-[max-width,background-color,box-shadow,backdrop-filter] duration-500 ease-out ${
          onHero
            ? "max-w-[88rem] bg-transparent shadow-none"
            : "max-w-6xl bg-ink/80 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-150"
        }`}
      >
        <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center pr-2 pl-5 sm:h-16 sm:pr-3 sm:pl-6">
          <Link href="/" aria-label="Zenn Studio ana sayfa" onClick={() => setOpen(false)} className="min-h-11 content-center justify-self-start">
            <ZennWordmark className="text-[19px] sm:text-[21px]" />
          </Link>
          <nav aria-label="Ana menü" className="hidden items-center gap-7 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[15px] font-medium transition-colors hover:text-paper ${onHero ? "text-paper/90" : "text-paper/75"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="col-start-3 flex items-center justify-end gap-1">
            {switcher}
            {/* Over the hero: two lime dot links, as in the reference; after it, the lime button. */}
            {onHero && mode === "studio" ? (
              <span className="hidden items-center gap-6 pr-3 sm:flex">
                {[cta, { href: "/#konum", label: "İletişim" }].map((l) => (
                  <Link key={l.href} href={l.href} className="inline-flex min-h-10 items-center gap-2 text-[14px] font-semibold tracking-[0.04em] text-lime uppercase transition-opacity hover:opacity-80">
                    <span aria-hidden className="size-1.5 rounded-full bg-lime" />
                    {l.label}
                  </Link>
                ))}
              </span>
            ) : (
              /* On phones the menu (and on the studio pages the bottom bar) carries it. */
              <span className="hidden sm:block">
                <Link href={cta.href} className={buttonClass("primary", "min-h-10 px-5")}>
                  {cta.label}
                </Link>
              </span>
            )}
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
