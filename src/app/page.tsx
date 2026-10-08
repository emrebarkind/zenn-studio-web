import type { Metadata } from "next";
import { landing } from "@/content/landing";
import { Landing } from "@/components/landing";

export const metadata: Metadata = {
  title: { absolute: landing.tr.meta.title },
  description: landing.tr.meta.description,
  alternates: { canonical: "/", languages: { tr: "/", en: "/en" } },
};

export default function Home() {
  return <Landing lang="tr" />;
}
