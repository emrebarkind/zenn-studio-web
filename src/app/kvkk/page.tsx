import type { Metadata } from "next";
import { company } from "@/content/company";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "KVKK aydınlatma metni",
  robots: { index: false },
};

// Facts come from content/company.ts (the build refuses to ship empty
// required fields). Legal wording is the studio's; do not extend it here
// without legal review.
const sections = [
  {
    title: "Veri sorumlusu",
    body: `${company.address ? `${company.address}, ${company.city} adresinde faaliyet gösteren ` : ""}${
      company.legalName ? `${company.legalName} ("Zenn Studio")` : "Zenn Studio"
    }, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusudur.`,
  },
  {
    title: "İşlenen kişisel veriler",
    body: "Ön kayıt formunda paylaştığın ad, soyad, cep telefonu, e-posta adresi, seçtiğin branş, paket ve ödeme tercihi ile not alanına yazdığın bilgiler; Zenn Asistan'a yazdığın mesajlar.",
  },
  {
    title: "İşleme amaçları",
    body: "Ön kaydının değerlendirilmesi, seninle iletişime geçilmesi, ilk dersinin planlanması ve Zenn Asistan üzerinden sorularının yanıtlanması.",
  },
  {
    title: "Aktarım",
    body: [
      "Site, barındırma hizmeti sağlayıcımız Vercel Inc. altyapısında çalışır; ön kayıt formu ve Zenn Asistan mesajları bu altyapı üzerinden iletilir.",
      "Zenn Asistan'a yazdığın mesajlar, yanıt üretilebilmesi için yapay zekâ hizmet sağlayıcımız Anthropic, PBC'ye iletilir. Asistanın kart, IBAN ya da TC kimlik numarası ya da sağlık konusu olarak tanıdığı mesajlar Anthropic'e iletilmez.",
      "Ön kaydını WhatsApp üzerinden göndermeyi seçersen mesajın WhatsApp altyapısı üzerinden iletilir.",
    ],
  },
  {
    title: "Haklarınız",
    body: company.email
      ? `Kanun'un 11. maddesi kapsamındaki taleplerini ${company.email} adresine iletebilirsin.`
      : "Kanun'un 11. maddesi kapsamındaki taleplerini sitedeki iletişim kanallarımız üzerinden iletebilirsin.",
  },
];

export default function KvkkPage() {
  return (
    <section className="pt-12 pb-24 sm:pt-20">
      <Container className="max-w-3xl">
        <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
          KVKK aydınlatma metni
        </h1>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-xl font-bold tracking-tight">{s.title}</h2>
              {(Array.isArray(s.body) ? s.body : [s.body]).map((p) => (
                <p key={p} className="mt-2 leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
