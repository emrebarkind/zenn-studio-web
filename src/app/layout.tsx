import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { studio } from "@/content/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
});

const body = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(studio.url),
  title: {
    default: "Zenn Studio — Reformer, Mat Pilates, Kickboks ve online antrenman",
    template: "%s | Zenn Studio",
  },
  description:
    "Reformer pilates, mat pilates, kickboks ve fonksiyonel antrenman. Stüdyoda, canlı online ya da sana özel online programla. Ön kaydını hemen yap.",
  openGraph: { siteName: "Zenn Studio", locale: "tr_TR", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
