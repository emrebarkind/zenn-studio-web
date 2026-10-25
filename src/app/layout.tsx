import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AssistantWidget } from "@/components/assistant/assistant-widget";
import { assistantLive } from "@/lib/assistant/config";
import { studio } from "@/content/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

// Real italics for the one emphasised word in a heading (owner, 2026-10-25).
// Not preloaded: it is a word or two per screen, so it must not hold up the
// first paint; until it arrives that word shows upright for a moment.
const interItalic = Inter({
  variable: "--font-inter-italic",
  subsets: ["latin", "latin-ext"],
  style: "italic",
  preload: false,
});

// The logo alone is set in Geist (owner, 2026-10-25); every other word stays Inter.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(studio.url),
  title: {
    default: "Zenn Studio | Pilates, Kickboks ve Fonksiyonel antrenman, Tekirdağ",
    template: "%s | Zenn Studio",
  },
  description:
    "Tekirdağ Süleymanpaşa'da Mat Pilates ve Spinning grup dersleri veriyoruz; Mat ve Reformer Pilates, Kickboks ve Fonksiyonel antrenmanda tek başına ya da 6 kişiye kadar çalışıyoruz. Ders talebini bırak, seni arayalım.",
  openGraph: { siteName: "Zenn Studio", locale: "tr_TR", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" data-scroll-behavior="smooth" className={`${inter.variable} ${interItalic.variable} ${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {assistantLive && <AssistantWidget />}
      </body>
    </html>
  );
}
