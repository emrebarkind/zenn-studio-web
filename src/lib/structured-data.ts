import { company } from "@/content/company";
import { disciplines, studio, studioLocation as loc } from "@/content/site";

/**
 * The studio as search engines read it (schema.org ExerciseGym, a
 * LocalBusiness): name, address, coordinates, contact and what we teach.
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
    areaServed: [loc.district, loc.city],
    knowsAbout: disciplines.map((d) => d.name),
    ...(company.instagram ? { sameAs: [`https://www.instagram.com/${company.instagram}`] } : {}),
  };
}

/** For a <script type="application/ld+json">, safe inside HTML. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
