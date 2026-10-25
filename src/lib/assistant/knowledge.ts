import { company, contactChannels } from "@/content/company";
import {
  coachingFlow,
  comingSoon,
  disciplines,
  faqs,
  formats,
  planRules,
  plans,
  studio,
} from "@/content/site";
import { goalFit, questions } from "@/domain/matcher";
import { paymentMethods } from "@/domain/registration";

const tl = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

/**
 * Everything Zenn Asistan is allowed to know, rendered from the same content
 * the site renders. Deterministic (no dates, no randomness) so the system
 * prompt stays byte-identical across requests and can be cached.
 */
export function buildKnowledge(): string {
  const formatName = Object.fromEntries(formats.map((f) => [f.id, f.name]));
  const lines: string[] = [];
  const h = (title: string) => lines.push("", `## ${title}`);

  lines.push(`# ${studio.name} (${studio.domain})`);
  lines.push(
    `İstanbul'da bir stüdyo. Mat Pilates ve Spinning grup dersleri; Reformer Pilates, Kickboks ve Fonksiyonel antrenman tek başına ya da 6 kişiye kadar küçük grupla; talep üzerine yalnız Mat Pilates için online ders.`,
  );

  h("Formatlar");
  for (const f of formats) {
    lines.push(`- ${f.name} (id: ${f.id}): ${f.summary} ${f.points.join("; ")}.`);
  }

  h("Branşlar");
  for (const d of disciplines) {
    lines.push(
      `- ${d.name} (slug: ${d.slug}): ${d.tagline} ${d.description} Kimler için iyi: ${d.goodFor.join(", ")}. Yanına al: ${d.bring} Verildiği formatlar: ${d.formats
        .map((f) => `${formatName[f]} (${f})`)
        .join(", ")}.${d.coaches.length ? ` Antrenör: ${d.coaches.join(", ")}.` : ""}`,
    );
  }

  h("Paketler");
  for (const p of plans) {
    const price = p.price === null ? "fiyat sitede yazmıyor, ön kayıtta paylaşılıyor" : `fiyat ${tl.format(p.price)}`;
    lines.push(`- ${p.name} (id: ${p.id}, format: ${p.format}): ${p.detail}. İçerik: ${p.includes.join("; ")}. ${price}.`);
  }
  lines.push("Paket kuralları:");
  for (const rule of planRules) lines.push(`- ${rule}`);

  h("Ödeme");
  for (const m of paymentMethods) {
    lines.push(`- ${m.name}: ${m.available ? "kullanılabilir" : "henüz yok, yakında"}. ${m.detail}`);
  }
  lines.push("Ön kayıtta ödeme alınmaz. Ön kayıt /kayit sayfasından yapılır; antrenör ilk dersi planlamak için arar.");

  h("Online Mat Pilates nasıl işliyor");
  coachingFlow.forEach((s, i) => lines.push(`${i + 1}. ${s.title}: ${s.text}`));

  h("Henüz yayında olmayanlar (yakında)");
  for (const c of comingSoon) lines.push(`- ${c.name}: ${c.detail}`);
  lines.push("- Kartla online ödeme (iyzico).");

  h("Sık sorulanlar");
  for (const f of faqs) lines.push(`S: ${f.q}`, `C: ${f.a}`);

  h("Branş önerme mantığı (Sana uygun ders testi)");
  lines.push("Sorular: " + questions.map((q) => `${q.title} [${q.options.map((o) => o.label).join(" / ")}]`).join(" "));
  const goalLabel = Object.fromEntries(questions[0].options.map((o) => [o.value, o.label]));
  for (const [goal, slugs] of Object.entries(goalFit)) {
    lines.push(`- Hedef "${goalLabel[goal]}": öncelik sırasıyla ${slugs.join(", ")}.`);
  }
  lines.push(
    "Çalışma şekli: grupla → group (Mat Pilates, Spinning); tek başına ya da en fazla 6 kişi → private (Reformer Pilates, Kickboks, Fonksiyonel); evden → online (yalnız Mat Pilates, talep üzerine; kendiliğinden önerme). Seçilen branşın verilmediği şekli önerme.",
  );

  h("İletişim (insana bağlanma)");
  const channels = contactChannels(company);
  if (channels.length === 0) lines.push("İletişim bilgisi henüz sitede yok; ön kayıt formu (/kayit) kullanılır.");
  for (const c of channels) lines.push(`- ${c.kind}: ${c.label}`);
  if (company.address) lines.push(`- Adres: ${company.address}, ${company.city}`);

  return lines.join("\n").trim();
}
