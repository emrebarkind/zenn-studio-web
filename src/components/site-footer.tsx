import Link from "next/link";
import { disciplines, studio } from "@/content/site";
import { Wordmark } from "@/components/site-header";

export function SiteFooter() {
  return (
    <footer className="on-ink bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-paper/70">
            Stüdyoda, evinden canlı ya da sana yazılmış programla. Aynı antrenörler, aynı standart.
          </p>
          <address className="mt-6 space-y-1 text-sm text-paper/70 not-italic">
            {studio.address && <p>{studio.address}</p>}
            {studio.phoneDisplay && <p>{studio.phoneDisplay}</p>}
            {studio.email && <p>{studio.email}</p>}
          </address>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">Branşlar</h2>
          <ul className="mt-4 space-y-2 text-paper/70">
            {disciplines.map((d) => (
              <li key={d.slug}>
                <Link className="hover:text-lime" href={`/branslar/${d.slug}`}>
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">Stüdyo</h2>
          <ul className="mt-4 space-y-2 text-paper/70">
            <li><Link className="hover:text-lime" href="/online">Online antrenman</Link></li>
            <li><Link className="hover:text-lime" href="/paketler">Paketler</Link></li>
            <li><Link className="hover:text-lime" href="/ders-bul">Sana uygun dersi bul</Link></li>
            <li><Link className="hover:text-lime" href="/kayit">Ön kayıt</Link></li>
            <li><Link className="hover:text-lime" href="/kvkk">KVKK aydınlatma metni</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-8 text-sm text-paper/50 sm:px-6">
        © {studio.name}
      </div>
    </footer>
  );
}
