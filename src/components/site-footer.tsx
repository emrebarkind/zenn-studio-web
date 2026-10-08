import Link from "next/link";
import { disciplines, studio } from "@/content/site";
import { Wordmark } from "@/components/site-header";

export function SiteFooter() {
  return (
    <footer className="on-ink mt-auto bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6">
        <div className="text-center">
          <Wordmark className="text-4xl" />
          <p className="mx-auto mt-3 max-w-sm text-paper/60">
            Reformer, mat pilates, kickboks ve fonksiyonel antrenman. Stüdyoda ya da online, aynı antrenörlerle.
          </p>
        </div>
        <div className="mt-14 grid gap-10 text-center sm:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold">Branşlar</h2>
            <ul className="mt-4 space-y-2 text-paper/60">
              {disciplines.map((d) => (
                <li key={d.slug}>
                  <Link className="hover:text-paper" href={`/branslar/${d.slug}`}>
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Stüdyo</h2>
            <ul className="mt-4 space-y-2 text-paper/60">
              <li><Link className="hover:text-paper" href="/online">Online antrenman</Link></li>
              <li><Link className="hover:text-paper" href="/paketler">Paketler</Link></li>
              <li><Link className="hover:text-paper" href="/ders-bul">Sana uygun dersi bul</Link></li>
              <li><Link className="hover:text-paper" href="/kayit">Ön kayıt</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold">İletişim</h2>
            <address className="mt-4 space-y-2 text-paper/60 not-italic">
              {studio.address && <p>{studio.address}</p>}
              {studio.phoneDisplay && <p>{studio.phoneDisplay}</p>}
              {studio.email && <p>{studio.email}</p>}
              <p>
                <Link className="hover:text-paper" href="/kvkk">KVKK aydınlatma metni</Link>
              </p>
            </address>
          </div>
        </div>
        <p className="mt-14 border-t border-paper/10 pt-6 text-center text-sm text-paper/40">© {studio.name}</p>
      </div>
    </footer>
  );
}
