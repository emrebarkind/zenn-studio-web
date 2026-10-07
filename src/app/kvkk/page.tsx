import type { Metadata } from "next";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "KVKK aydınlatma metni",
  robots: { index: false },
};

// TODO(studio): this is a structural draft, not legal advice. Replace every
// bracketed field and have the final text reviewed before launch.
const sections = [
  {
    title: "Veri sorumlusu",
    body: "[Ticari unvan], [adres] adresinde faaliyet gösteren Zenn Studio, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusudur.",
  },
  {
    title: "İşlenen kişisel veriler",
    body: "Ön kayıt formunda paylaştığın ad, soyad, cep telefonu, e-posta adresi, seçtiğin branş, paket ve ödeme tercihi ile not alanına yazdığın bilgiler.",
  },
  {
    title: "İşleme amaçları",
    body: "Ön kaydının değerlendirilmesi, seninle iletişime geçilmesi ve ilk dersinin planlanması.",
  },
  {
    title: "Aktarım",
    body: "[Verilerin aktarıldığı hizmet sağlayıcılar ve aktarım dayanağı.]",
  },
  {
    title: "Haklarınız",
    body: "Kanun'un 11. maddesi kapsamındaki taleplerini [e-posta adresi] üzerinden iletebilirsin.",
  },
];

export default function KvkkPage() {
  return (
    <section className="pt-12 pb-24 sm:pt-20">
      <Container className="max-w-3xl">
        <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
          KVKK aydınlatma metni
        </h1>
        <p className="mt-4 rounded-xl bg-stone px-4 py-3 text-sm text-ink-soft">Taslak metin. Yayından önce güncellenecektir.</p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-xl font-bold tracking-tight">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
