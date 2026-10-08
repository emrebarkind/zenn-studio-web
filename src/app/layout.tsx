import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(studio.url),
  title: {
    default: "Zenn Studio — Reformer, Mat Pilates, Kickboks ve online antrenman",
    template: "%s | Zenn Studio",
  },
  description:
    "Reformer pilates, mat pilates, kickboks ve fonksiyonel antrenman; stüdyoda, canlı online ya da sana özel online programla. Yapay zekâ destekli Zenn Asistan sorularını anında yanıtlar.",
  openGraph: { siteName: "Zenn Studio", locale: "tr_TR", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {assistantLive && <AssistantWidget />}
      </body>
    </html>
  );
}
