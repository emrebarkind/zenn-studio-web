import type { Metadata } from "next";
import { landing } from "@/content/landing";
import { Landing } from "@/components/landing";

export const metadata: Metadata = {
  title: { absolute: landing.en.meta.title },
  description: landing.en.meta.description,
  alternates: { canonical: "/en", languages: { tr: "/", en: "/en" } },
  openGraph: { locale: "en_US" },
};

export default function EnglishHome() {
  return <Landing lang="en" />;
}
