import type { StaticImageData } from "next/image";
import hero from "@/assets/photos/hero.jpg";
import reformerWide from "@/assets/photos/reformer-wide.jpg";
import kickboksWide from "@/assets/photos/kickboks-wide.jpg";
import birebirWide from "@/assets/photos/birebir-wide.jpg";
import reformer from "@/assets/photos/reformer.jpg";
import matPilates from "@/assets/photos/mat-pilates.jpg";
import fonksiyonel from "@/assets/photos/fonksiyonel.jpg";
import kickboks from "@/assets/photos/kickboks.jpg";

// Every piece of copy and every business fact on the site lives here, so the
// studio can change prices, coaches or contact details without touching
// layout code. Fields set to `null` are facts we do not have yet — the UI
// renders a neutral fallback for them instead of inventing a value.

export const studio = {
  name: "Zenn Studio",
  domain: "zenn-studio.com",
  url: "https://zenn-studio.com",
};

// Contact and legal details live in ./company.ts.

/**
 * How we work (2026-10-25): the studio's own services first — group classes
 * and individual / small-group training for 1–6 people — and online lessons
 * on request. The site informs and takes requests; it does not sell online.
 */
export type FormatId = "group" | "private" | "online";

export type Format = {
  id: FormatId;
  name: string;
  /** Short label for tabs and tables. */
  short: string;
  summary: string;
  points: string[];
};

export const formats: Format[] = [
  {
    id: "group",
    name: "Grup dersleri",
    short: "Grup dersi",
    summary: "Belli günlerde, sabah ya da akşam grubunda.",
    points: ["Mat Pilates ve Spinning", "8 ya da 12 derslik, 4 haftalık paket", "Sabah ya da akşam grubu"],
  },
  {
    id: "private",
    name: "Bireysel ve küçük grup",
    short: "1–6 kişi",
    summary: "Tek başına ya da 6 kişiye kadar; gün ve saati antrenörünle belirlersin.",
    points: ["Reformer Pilates, Kickboks, Fonksiyonel antrenman", "Tek başına, eşinle ya da arkadaşlarınla", "Saat ve günler sana göre"],
  },
  {
    id: "online",
    name: "Online ders",
    short: "Online",
    summary: "Evden canlı ders ya da kişisel program; talep üzerine.",
    points: ["Antrenörün seni ekranda görür", "Evdeki ekipmanına göre program", "Talebini bırak, birlikte planlayalım"],
  },
];

/** Group size for individual / small-group training. */
export const PRIVATE_GROUP_MAX = 6;

export type DisciplineSlug =
  | "mat-pilates"
  | "spinning"
  | "reformer-pilates"
  | "kickboks"
  | "fonksiyonel-antrenman";

export type Discipline = {
  slug: DisciplineSlug;
  name: string;
  tagline: string;
  description: string;
  goodFor: string[];
  bring: string;
  formats: FormatId[];
  coaches: string[];
  /** null until the studio has a real photo (the UI then shows a typographic card). */
  photo: { src: StaticImageData; alt: string } | null;
};

// Studio photo shoot, September 2026.
export const photos = {
  hero: { src: reformerWide, alt: "Reformer üzerinde kollarıyla yükselip bir bacağını havaya kaldıran sporcu" },
  straps: { src: hero, alt: "Kollarını yaylı kayışlarla yukarı uzatıp merkezini çalıştıran sporcu" },
  kickboks: { src: kickboksWide, alt: "Kum torbasına yumruk atan kickboksçu" },
  coaching: { src: birebirWide, alt: "Antrenörüyle birlikte matta egzersiz yapan üye" },
};

export const disciplines: Discipline[] = [
  {
    slug: "mat-pilates",
    name: "Mat Pilates",
    tagline: "Tek ekipman: kendi vücudun.",
    description:
      "Matın üzerinde, vücut ağırlığıyla çalışan klasik pilates. Merkez gücünü, duruşu ve nefes kontrolünü geliştirir. Sabah ya da akşam grubunda, haftada 2 ya da 3 gün.",
    goodFor: ["Merkez gücü ve nefes", "Duruş ve bel-sırt sağlığı", "Grup enerjisiyle çalışmayı sevenler"],
    bring: "Rahat kıyafet ve su.",
    formats: ["group", "online"],
    coaches: ["Ece", "Zeynep"],
    photo: { src: matPilates, alt: "Mat üzerinde esneme yapan üyenin duruşunu düzelten antrenör" },
  },
  {
    slug: "spinning",
    name: "Spinning",
    tagline: "Müzikle, ritimle, tempoyla.",
    description:
      "Sabit bisiklette müzik eşliğinde, aralıklı tempo ile kondisyon antrenmanı. Direnci herkes kendi seviyesine göre ayarlar; aynı grupta yeni başlayan da düzenli gelen de rahatça çalışır.",
    goodFor: ["Kondisyon ve yağ yakımı", "Eklemleri yormadan kardiyo", "Grup enerjisiyle çalışmayı sevenler"],
    bring: "Spor ayakkabı, havlu ve su.",
    formats: ["group"],
    coaches: [],
    photo: null,
  },
  {
    slug: "reformer-pilates",
    name: "Reformer Pilates",
    tagline: "Yaylı direnç, kontrollü hareket.",
    description:
      "Reformer'ın yay direnci her hareketi hem destekler hem zorlar. Derin karın kaslarını, duruşu ve eklem hareket açıklığını birlikte çalışırsın. Tek başına ya da 6 kişiye kadar küçük grupla.",
    goodFor: ["Duruş ve bel-sırt sağlığı", "Güç kaybetmeden esneklik", "Pilatese yeni başlayanlar"],
    bring: "Kaymaz çorap ve rahat kıyafet.",
    formats: ["private"],
    coaches: ["Şüheda"],
    photo: { src: reformer, alt: "Reformer üzerinde kollarıyla yükselip bir bacağını havaya kaldıran sporcu" },
  },
  {
    slug: "kickboks",
    name: "Kickboks",
    tagline: "Tempo, teknik, kafayı boşaltmak.",
    description:
      "Yumruk ve tekme kombinasyonları, ayak hareketi ve kondisyon blokları. Teknik önce gelir; tempo seviyene göre artar. Pad çalışmasıyla, tek başına ya da 6 kişiye kadar.",
    goodFor: ["Kondisyon ve yağ yakımı", "Stres atmak", "Koordinasyon ve refleks"],
    bring: "Bandaj ve eldiven; ilk derste stüdyodakileri kullanabilirsin.",
    formats: ["private", "online"],
    coaches: ["Ali"],
    photo: { src: kickboks, alt: "Eldivenleriyle gard alıp yumruk atan kickboksçu" },
  },
  {
    slug: "fonksiyonel-antrenman",
    name: "Fonksiyonel antrenman",
    tagline: "Günlük hayatta işe yarayan güç.",
    description:
      "Çekme, itme, çömelme, taşıma: vücudun gerçek hayatta yaptığı hareketlerle güç ve dayanıklılık. Hedefine göre kurulan bireysel antrenman; istersen 6 kişiye kadar küçük grupla.",
    goodFor: ["Kişisel hedefe göre program", "Güç ve dayanıklılık", "Bireysel takip isteyenler"],
    bring: "Spor ayakkabı, havlu, su.",
    formats: ["private", "online"],
    coaches: [],
    photo: { src: fonksiyonel, alt: "Antrenörüyle birlikte matta egzersiz yapan üye" },
  },
];

export type Coach = { name: string; disciplines: DisciplineSlug[] };

// TODO(studio): add surnames, photos and short bios once the coaches approve them.
export const coaches: Coach[] = [
  { name: "Şüheda", disciplines: ["reformer-pilates"] },
  { name: "Ece", disciplines: ["mat-pilates"] },
  { name: "Zeynep", disciplines: ["mat-pilates"] },
  { name: "Ali", disciplines: ["kickboks"] },
];

export type PlanId = "group-8" | "group-12" | "private" | "online";

export type Plan = {
  id: PlanId;
  name: string;
  format: FormatId;
  detail: string;
  includes: string[];
  /** TRY, VAT included. `null` = shared when we call back. */
  price: number | null;
  /** Group packages: the weekdays of the group (1 = Monday … 7 = Sunday). */
  groupDays?: number[];
  /** One line on how the week looks, for requests without fixed group days. */
  weekNote?: string;
};

export const plans: Plan[] = [
  {
    id: "group-8",
    name: "8 ders",
    format: "group",
    detail: "4 hafta, haftada 2 grup dersi",
    includes: ["Sabah ya da akşam grubu", "Pazartesi ve çarşamba"],
    price: null,
    groupDays: [1, 3],
  },
  {
    id: "group-12",
    name: "12 ders",
    format: "group",
    detail: "4 hafta, haftada 3 grup dersi",
    includes: ["Sabah ya da akşam grubu", "Pazartesi, çarşamba ve cuma"],
    price: null,
    groupDays: [1, 3, 5],
  },
  {
    id: "private",
    name: "Bireysel ya da küçük grup",
    format: "private",
    detail: "1–6 kişi; ders sayısını ve saatleri birlikte belirleriz",
    includes: ["Reformer Pilates, Kickboks ya da Fonksiyonel", "Tek başına ya da en fazla 6 kişi"],
    price: null,
    weekNote: "Günleri ve saati antrenörünle birlikte belirlersin; arkadaşlarınla gelirsen grubu sen kurarsın.",
  },
  {
    id: "online",
    name: "Online ders",
    format: "online",
    detail: "Canlı ders ya da kişisel program, talep üzerine",
    includes: ["Antrenörün seni ekranda görür", "Evdeki ekipmanına göre program"],
    price: null,
    weekNote: "Talebini bırak; uygun gün ve saati birlikte planlayalım.",
  },
];

export const comingSoon = [
  {
    name: "Video kütüphanesi",
    detail: "Antrenörlerimizin kaydettiği dersleri istediğin saatte yap.",
  },
  {
    name: "Apple Sağlık ve Garmin bağlantısı",
    detail: "Nabız ve aktivite verin programına otomatik yansısın.",
  },
  {
    name: "Üye paneli",
    detail: "Kalan derslerini, programını ve antrenör notlarını tek yerde gör.",
  },
];

export const faqs = [
  {
    q: "Hiç pilates ya da kickboks yapmadım, hangi dersle başlamalıyım?",
    a: "Sana uygun ders testini çöz; iki soruda hedefine ve çalışma şekline uyan branşı öneriyoruz. Kararsız kalırsan talep formuna not bırak, antrenörümüz seni arasın.",
  },
  {
    q: "Grup dersi ile bireysel ders arasındaki fark ne?",
    a: "Grup dersleri (Mat Pilates, Spinning) belli günlerde sabah ya da akşam grubunda yapılır. Reformer Pilates, Kickboks ve Fonksiyonel antrenman ise tek başına ya da 6 kişiye kadar küçük grupla, gün ve saati antrenörünle belirleyerek yapılır.",
  },
  {
    q: "Arkadaşlarımla birlikte gelebilir miyim?",
    a: "Evet. Bireysel derslerde 6 kişiye kadar küçük grup kurabilirsin; talep formunda kaç kişi olacağınızı seçmen yeterli.",
  },
  {
    q: "Kaçırdığım grup dersinin yerine başka gün gelebilir miyim?",
    a: "8 ve 12 derslik grup paketlerinde telafi yoktur; seçtiğin sabah ya da akşam grubuna devam edersin. Stüdyonun iptal ettiği ders ise paketinin sonuna eklenir.",
  },
  {
    q: "Online ders de veriyor musunuz?",
    a: "Evet, talep üzerine. Mat Pilates, Kickboks ve Fonksiyonel antrenmanı evden canlı ders ya da kişisel programla yapabilirsin; talep formunda online'ı seç.",
  },
  {
    q: "Fiyatları nereden öğrenirim?",
    a: "Talebini bıraktığında antrenörümüz seni arar; fiyatı ve uygun saatleri o görüşmede paylaşırız. Ödeme şimdi alınmaz.",
  },
];

/** Rules shown on /paketler and given to Zenn Asistan verbatim. */
export const planRules = [
  "Grup paketleri 4 hafta geçerlidir ve seçtiğin sabah ya da akşam grubunda devam eder.",
  "8 derslik grup paketi pazartesi ve çarşamba, 12 derslik grup paketi pazartesi, çarşamba ve cuma günleridir.",
  "Grup derslerinde telafi yoktur; katılmadığın ders de paketinden düşer.",
  "Stüdyonun iptal ettiği ders paketinin sonuna eklenir.",
];

/** How online personal training works, step by step (shown on /online). */
export const coachingFlow = [
  { title: "Tanışma görüşmesi", text: "Hedefini, sağlık geçmişini, programını ve evdeki ekipmanını konuşuyoruz." },
  { title: "Programın yazılır", text: "Antrenörün sana özel haftalık programı hazırlar; her hareketin anlatımı yanında." },
  { title: "Videonu gönder", text: "Zorlandığın hareketi çek, gönder. Antrenörün formunu düzeltip geri döner." },
  { title: "Haftalık değerlendirme", text: "Görüntülü görüşmede haftayı konuşur, programı bir sonraki haftaya göre güncellersiniz." },
];
