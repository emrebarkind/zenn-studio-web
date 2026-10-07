"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui";

const nav = [
  { href: "/#branslar", label: "Branşlar" },
  { href: "/online", label: "Online" },
  { href: "/paketler", label: "Paketler" },
  { href: "/ders-bul", label: "Sana uygun ders" },
];

export function Wordmark() {
  return (
    <span className="font-display text-[22px] font-extrabold tracking-[-0.04em]">
      zenn<span className="font-medium text-ink-soft"> studio</span>
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Zenn Studio ana sayfa">
          <Wordmark />
        </Link>
        <nav aria-label="Ana menü" className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/kayit" className="min-h-10 px-4">
            Ön kayıt yap
          </ButtonLink>
        </nav>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobil menü" className="border-t border-ink/10 bg-paper px-4 pb-6 md:hidden">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display text-2xl font-semibold tracking-tight"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/kayit" className="mt-2 w-full">
            Ön kayıt yap
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}
