import { MapPin, MessageCircle, Navigation } from "lucide-react";
import { company } from "@/content/company";
import { directionsUrl, studioHours, studioLocation as loc } from "@/content/site";
import { buttonClass } from "@/components/ui";

// A small OpenStreetMap window centred on the studio. OpenStreetMap rather
// than a Google embed: Google's map still labels this spot with a previous
// business's name, and only the coordinates are ours to show.
const span = { lng: 0.0075, lat: 0.0028 };
const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${loc.lng - span.lng},${loc.lat - span.lat},${loc.lng + span.lng},${loc.lat + span.lat}&layer=mapnik`;

/**
 * "Bizi nerede bulabilirsin?": a light, grey map (owner: white, not black), with our
 * pin in the middle and the address and two ways to reach us over it. The
 * map itself is a picture; tapping it opens directions.
 */
export function FindUs() {
  const whatsapp = company.whatsapp
    ? `https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Merhaba Zenn Studio, stüdyonuza nasıl gelebilirim?")}`
    : null;
  return (
    <div className="relative isolate flex flex-col overflow-hidden rounded-[28px] bg-card text-ink sm:block sm:aspect-[16/10] lg:aspect-auto lg:h-[clamp(360px,50svh,560px)]">
      {/* The map stage: on a phone a band above the address, on wider screens the whole card. */}
      <div className="relative h-72 overflow-hidden sm:absolute sm:inset-0 sm:h-auto">
        {/* Larger than the stage on every side, so the map's own controls stay out of view; the centre stays the studio. */}
        <iframe
          title="Zenn Studio'nun haritadaki konumu"
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute -inset-20 h-[calc(100%+10rem)] w-[calc(100%+10rem)] border-0 [filter:grayscale(1)_brightness(1.06)_contrast(0.92)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0,transparent_40%,rgba(255,255,255,0.55)_100%)]" />

        {/* Our pin, exactly in the middle of the map. */}
        <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="map-ping absolute inset-0 rounded-full bg-ink/25" />
          <span className="relative grid size-12 place-items-center rounded-full bg-ink text-lime shadow-[0_12px_28px_-8px_rgba(21,25,21,0.6)]">
            <MapPin className="size-6" strokeWidth={2.25} />
          </span>
          <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-sm font-semibold whitespace-nowrap text-paper">
            Zenn Studio
          </span>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Haritada yol tarifi al"
          className="absolute inset-0"
        />
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-2 bottom-1 z-10 inline-flex min-h-6 items-center px-1.5 text-[11px] text-ink/60 hover:text-ink/80"
        >
          © OpenStreetMap katkıcıları
        </a>
      </div>

      <div className="on-ink relative z-10 m-3 rounded-[22px] bg-ink p-5 text-paper sm:absolute sm:bottom-5 sm:left-5 sm:m-0 sm:max-w-md sm:bg-ink/90 sm:p-6 sm:shadow-[0_20px_50px_-20px_rgba(21,25,21,0.6)] sm:backdrop-blur-xl">
        <p className="text-sm font-semibold text-lime">Adresimiz</p>
        <p className="mt-1.5 text-xl leading-snug font-semibold tracking-tight">
          {loc.street}
          <br />
          {loc.neighbourhood}
          <br />
          {loc.district} / {loc.city}
        </p>
        <p className="mt-3 text-sm text-paper/75">
          <span className="font-semibold text-paper">{studioHours.label}</span> · {studioHours.note}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "min-h-12 px-5")}>
            <Navigation className="size-4" aria-hidden />
            Yol tarifi al
          </a>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={buttonClass("outline", "min-h-12 px-5")}>
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp&apos;tan yaz
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
