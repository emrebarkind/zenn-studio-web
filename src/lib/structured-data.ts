import { company } from "@/content/company";
import { disciplines, studio, studioHours, studioLocation as loc } from "@/content/site";

/**
 * The studio as search engines read it (schema.org ExerciseGym, a
 * LocalBusiness): name, address, coordinates, opening hours, contact and
 * what we teach.
 * The same name, address and phone as the footer and, once restored, the
 * Google Business Profile; consistency is what local search rewards.
 */
export function studioJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["ExerciseGym", "SportsActivityLocation"],
    "@id": `${studio.url}/#studio`,
    name: studio.name,
    url: studio.url,
    ...(company.whatsapp ? { telephone: `+${company.whatsapp}` } : {}),
    ...(company.email ? { email: company.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${loc.neighbourhood}, ${loc.street}`,
      addressLocality: loc.district,
      addressRegion: loc.city,
      addressCountry: "TR",
    },
    geo: { "@type": "GeoCoordinates", latitude: loc.lat, longitude: loc.lng },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: studioHours.opens,
      closes: studioHours.closes,
    },
    areaServed: [loc.district, loc.city],
    knowsAbout: disciplines.map((d) => d.name),
    ...(company.instagram ? { sameAs: [`https://www.instagram.com/${company.instagram}`] } : {}),
  };
}

/**
 * A page's questions and answers as schema.org FAQPage, exactly as shown on
 * the page (search engines and AI answers read both and expect them to match).
 */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** For a <script type="application/ld+json">, safe inside HTML. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
