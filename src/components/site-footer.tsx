import Link from "next/link";
import { company, contactChannels } from "@/content/company";
import { disciplines, studio } from "@/content/site";
import { Wordmark } from "@/components/site-header";

export function SiteFooter() {
  const channels = contactChannels(company);
  // Empty fields are not rendered; the build refuses to ship missing required ones.
  const legal = [
    company.legalName,
    [company.address, company.city].filter(Boolean).join(", "),
    company.taxOffice && company.taxNumber && `Vergi dairesi: ${company.taxOffice} · Vergi no: ${company.taxNumber}`,
    company.mersis && `MERSİS: ${company.mersis}`,
  ].filter(Boolean) as string[];

  return (
    <footer className="on-ink mt-auto bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6">
        <div className="text-center">
          <Wordmark className="text-4xl" />
          <p className="mx-auto mt-3 max-w-sm text-paper/60">
            Reformer, mat pilates, kickboks ve fonksiyonel antrenman. Stüdyoda ya da online. İstanbul.
          </p>
        </div>
        <div className="mt-14 grid gap-10 text-center sm:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold">Zenn Studio</h2>
            <ul className="mt-4 space-y-2 text-paper/60">
              <li><Link className="hover:text-paper" href="/">Stüdyo</Link></li>
              {disciplines.map((d) => (
                <li key={d.slug}>
                  <Link className="hover:text-paper" href={`/branslar/${d.slug}`}>
                    {d.name}
                  </Link>
                </li>
              ))}
              <li><Link className="hover:text-paper" href="/online">Zenn Online</Link></li>
              <li><Link className="hover:text-paper" href="/paketler">Paketler</Link></li>
              <li><Link className="hover:text-paper" href="/kayit">Ön kayıt</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold">İletişim</h2>
            <address className="mt-4 space-y-2 text-paper/60 not-italic">
              {company.address && (
                <p>
                  {company.mapsUrl ? (
                    <a className="hover:text-paper" href={company.mapsUrl} target="_blank" rel="noopener noreferrer">
                      {company.address}, {company.city}
                    </a>
                  ) : (
                    `${company.address}, ${company.city}`
                  )}
                </p>
              )}
              {channels.map((c) => (
                <p key={c.kind}>
                  <a
                    className="hover:text-paper"
                    href={c.href}
                    target={c.kind === "phone" || c.kind === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                  >
                    {c.kind === "whatsapp" ? "WhatsApp'tan yaz" : c.label}
                  </a>
                </p>
              ))}
              <p>
                <Link className="hover:text-paper" href="/kvkk">KVKK aydınlatma metni</Link>
              </p>
            </address>
          </div>
          <div>
            <h2 className="text-sm font-semibold">İşletmeler için</h2>
            <ul className="mt-4 space-y-2 text-paper/60">
              <li><Link className="hover:text-paper" href="/isletmeler#urun">Zenn yapay zekâ asistanı</Link></li>
              <li><Link className="hover:text-paper" href="/isletmeler#demo">Demo</Link></li>
              <li><Link className="hover:text-paper" href="/isletmeler#guven">Güven ve KVKK</Link></li>
              <li><Link className="hover:text-paper" href="/en" hrefLang="en">English</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 border-t border-paper/10 pt-6 text-center text-sm text-paper/40">
          {legal.length > 0 && (
            <ul className="mb-3 space-y-1">
              {legal.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
          <p>© {studio.name}</p>
        </div>
      </div>
    </footer>
  );
}
