import type { Metadata } from "next";
import { landing } from "@/content/landing";
import { Landing } from "@/components/landing";

export const metadata: Metadata = {
  title: { absolute: landing.tr.meta.title },
  description: landing.tr.meta.description,
  alternates: { canonical: "/isletmeler", languages: { tr: "/isletmeler", en: "/en" } },
};

/** "/isletmeler" — Zenn for other studios (B2B); the home page is the studio itself. */
export default function BusinessLanding() {
  return <Landing lang="tr" />;
}
