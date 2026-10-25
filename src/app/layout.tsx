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
    default: "Zenn Studio | Pilates, Kickboks ve Fonksiyonel antrenman, İstanbul",
    template: "%s | Zenn Studio",
  },
  description:
    "Mat Pilates ve Spinning grup dersleri; Reformer Pilates, Kickboks ve Fonksiyonel antrenman tek başına ya da 6 kişiye kadar. Ders talebini bırak, antrenörün seni arasın.",
  openGraph: { siteName: "Zenn Studio", locale: "tr_TR", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" data-scroll-behavior="smooth" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {assistantLive && <AssistantWidget />}
      </body>
    </html>
  );
}
