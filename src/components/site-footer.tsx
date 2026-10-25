import Link from "next/link";
import { company, contactChannels } from "@/content/company";
import { disciplines, studioLocation } from "@/content/site";
import { ZennWordmark } from "@/components/brand";
import { ButtonLink } from "@/components/ui";

const link = "transition-colors hover:text-paper";

export function SiteFooter() {
  const channels = contactChannels(company);
  // Empty fields are not rendered; the build refuses to ship malformed ones.
  const legal = [
    company.legalName,
    company.address && [company.address, company.city].filter(Boolean).join(", "),
    company.taxOffice && company.taxNumber && `Vergi dairesi: ${company.taxOffice}, vergi no: ${company.taxNumber}`,
    company.mersis && `MERSİS: ${company.mersis}`,
  ].filter(Boolean) as string[];

  return (
    <footer className="on-ink mt-auto bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-10 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" aria-label="Zenn Studio ana sayfa">
              <ZennWordmark className="text-[clamp(2.25rem,4.5vw,3rem)]" />
            </Link>
            <p className="mt-5 max-w-sm leading-relaxed text-paper/60">
              Mat Pilates ve Spinning grup dersleri veriyoruz; Mat ve Reformer Pilates, Kickboks ve Fonksiyonel antrenmanda tek başına ya da
              6 kişiye kadar çalışıyoruz. {studioLocation.district}, {studioLocation.city}.
            </p>
            <ButtonLink href="/#talep" className="mt-7">
              Ders talebi
            </ButtonLink>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="text-sm font-semibold">Dersler</h2>
              <ul className="mt-4 space-y-2.5 text-paper/60">
                {disciplines.map((d) => (
                  <li key={d.slug}>
                    <Link className={link} href={`/branslar/${d.slug}`}>
                      {d.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link className={link} href="/online">
                    Online Mat Pilates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Stüdyo</h2>
              <ul className="mt-4 space-y-2.5 text-paper/60">
                <li><Link className={link} href="/paketler">Paketler</Link></li>
                <li><Link className={link} href="/#antrenorler">Eğitmen Kadromuz</Link></li>
                <li><Link className={link} href="/ders-bul">Sana uygun ders</Link></li>
                <li><Link className={link} href="/#sss">Sık sorulanlar</Link></li>
                <li><Link className={link} href="/blog">Blog</Link></li>
                <li><Link className={link} href="/kayit">Ayrıntılı talep formu</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold">{company.address || channels.length ? "İletişim" : "Bilgi"}</h2>
              <address className="mt-4 space-y-2.5 text-paper/60 not-italic">
                {company.address && (
                  <p>
                    {company.mapsUrl ? (
                      <a className={link} href={company.mapsUrl} target="_blank" rel="noopener noreferrer">
                        {company.address}, {company.city}
                      </a>
                    ) : (
                      <Link className={link} href="/#konum">
                        {company.address}, {company.city}
                      </Link>
                    )}
                  </p>
                )}
                {!company.address && (
                  <p>
                    <Link className={link} href="/#konum">
                      {studioLocation.neighbourhood}, {studioLocation.district} / {studioLocation.city}
                    </Link>
                  </p>
                )}
                {channels.map((c) => (
                  <p key={c.kind}>
                    <a
                      className={link}
                      href={c.href}
                      target={c.kind === "phone" || c.kind === "email" ? undefined : "_blank"}
                      rel="noopener noreferrer"
                    >
                      {c.kind === "whatsapp" ? "WhatsApp'tan yaz" : c.label}
                    </a>
                  </p>
                ))}
                <p>
                  <Link className={link} href="/kvkk">KVKK aydınlatma metni</Link>
                </p>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/10 pt-6 text-sm text-paper/60 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {legal.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>© Zenn Studio</p>
          </div>
          <p className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className={link} href="/isletmeler">
              İşletmeler için Zenn
            </Link>
            <Link className={link} href="/en" hrefLang="en">
              English
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
