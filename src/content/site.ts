import type { StaticImageData } from "next/image";
import hero from "@/assets/photos/hero.jpg";
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
  // TODO(studio): fill in before launch.
  address: null as string | null,
  phoneDisplay: null as string | null,
  email: null as string | null,
  instagram: null as string | null,
};

/** WhatsApp number in international format without "+", e.g. 905321234567. */
export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export type FormatId = "studio" | "live" | "coaching";

export type Format = {
  id: FormatId;
  name: string;
  summary: string;
  points: string[];
};

export const formats: Format[] = [
  {
    id: "studio",
    name: "Stüdyoda",
    summary: "Ekipmanın başında, antrenörün yanında.",
    points: [
      "Reformer ve mat derslerinde küçük gruplar",
      "Birebir ve düet ders seçeneği",
      "Ders saatinden önce SMS hatırlatma",
    ],
  },
  {
    id: "live",
    name: "Canlı online",
    summary: "Evinden katıl, antrenör seni ekranda görsün.",
    points: [
      "Kamera açık, küçük gruplar: düzeltme anında gelir",
      "Bağlantı ders öncesi telefonuna gelir",
      "Bir mat ve birkaç metrekare yeterli",
    ],
  },
  {
    id: "coaching",
    name: "Online personal training",
    summary: "Sana yazılmış program, haftalık takip.",
    points: [
      "Hedefine ve ekipmanına göre haftalık program",
      "Hareket videonu gönder, antrenörün formunu düzeltsin",
      "Haftada bir görüntülü değerlendirme",
    ],
  },
];

export type DisciplineSlug =
  | "reformer-pilates"
  | "mat-pilates"
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
  photo: { src: StaticImageData; alt: string };
};

// Studio photo shoot, September 2026.
export const heroPhoto = {
  src: hero,
  alt: "Kollarını yaylı kayışlarla yukarı uzatıp merkezini çalıştıran sporcu",
};

export const disciplines: Discipline[] = [
  {
    slug: "reformer-pilates",
    name: "Reformer Pilates",
    tagline: "Yaylı direnç, kontrollü hareket.",
    description:
      "Reformer'ın yay direnci her hareketi hem destekler hem zorlar. Derin karın kaslarını, duruşu ve eklem hareket açıklığını birlikte çalışırsın. Ekipmana bağlı olduğu için yalnızca stüdyoda yapılır.",
    goodFor: [
      "Duruş ve bel-sırt sağlığı",
      "Güç kaybetmeden esneklik",
      "Pilatese yeni başlayanlar",
    ],
    bring: "Kaymaz çorap ve rahat kıyafet.",
    formats: ["studio"],
    coaches: ["Şüheda"],
    photo: { src: reformer, alt: "Reformer üzerinde kollarıyla yükselip bir bacağını havaya kaldıran sporcu" },
  },
  {
    slug: "mat-pilates",
    name: "Mat Pilates",
    tagline: "Tek ekipman: kendi vücudun.",
    description:
      "Matın üzerinde, vücut ağırlığıyla çalışan klasik pilates. Merkez gücünü ve nefes kontrolünü geliştirir. Stüdyodaki grup derslerine katılabilir ya da aynı dersi evinden canlı olarak yapabilirsin.",
    goodFor: [
      "Evden düzenli antrenman",
      "Merkez gücü ve nefes",
      "Grup enerjisiyle çalışmayı sevenler",
    ],
    bring: "Bir mat, su ve rahat kıyafet.",
    formats: ["studio", "live"],
    coaches: ["Ece", "Zeynep"],
    photo: { src: matPilates, alt: "Mat üzerinde esneme yapan üyenin duruşunu düzelten antrenör" },
  },
  {
    slug: "kickboks",
    name: "Kickboks",
    tagline: "Tempo, teknik, kafayı boşaltmak.",
    description:
      "Yumruk ve tekme kombinasyonları, ayak hareketi ve kondisyon blokları. Teknik önce gelir; tempo seviyene göre artar. Stüdyoda pad çalışması yapılır, online programda gölge boks ve kondisyon ağırlıklıdır.",
    goodFor: [
      "Kondisyon ve yağ yakımı",
      "Stres atmak",
      "Koordinasyon ve refleks",
    ],
    bring: "Bandaj ve eldiven; ilk derste stüdyodakileri kullanabilirsin.",
    formats: ["studio", "coaching"],
    coaches: ["Ali"],
    photo: { src: kickboks, alt: "Eldivenleriyle gard alıp yumruk atan kickboksçu" },
  },
  {
    slug: "fonksiyonel-antrenman",
    name: "Fonksiyonel antrenman",
    tagline: "Günlük hayatta işe yarayan güç.",
    description:
      "Çekme, itme, çömelme, taşıma: vücudun gerçek hayatta yaptığı hareketlerle güç ve dayanıklılık. Birebir stüdyoda ya da evdeki ekipmanına göre yazılmış online programla yapılır.",
    goodFor: [
      "Kişisel hedefe göre program",
      "Güç ve dayanıklılık",
      "Evde az ekipmanla antrenman",
    ],
    bring: "Spor ayakkabı, havlu, su.",
    formats: ["studio", "live", "coaching"],
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

export type PlanId =
  | "studio-8"
  | "studio-12"
  | "private-8"
  | "live-8"
  | "coaching-month";

export type Plan = {
  id: PlanId;
  name: string;
  format: FormatId;
  detail: string;
  includes: string[];
  /** TRY, VAT included. `null` = shared during registration. */
  price: number | null;
};

export const plans: Plan[] = [
  {
    id: "studio-8",
    name: "8 ders",
    format: "studio",
    detail: "4 hafta, haftada 2 grup dersi",
    includes: ["Sabah ya da akşam grubu", "Pazartesi ve çarşamba"],
    price: null,
  },
  {
    id: "studio-12",
    name: "12 ders",
    format: "studio",
    detail: "4 hafta, haftada 3 grup dersi",
    includes: ["Sabah ya da akşam grubu", "Pazartesi, çarşamba ve cuma"],
    price: null,
  },
  {
    id: "private-8",
    name: "Birebir 8 ders",
    format: "studio",
    detail: "Antrenörünle birlikte belirlediğin saatlerde",
    includes: ["Reformer, kickboks ya da fonksiyonel", "Düet olarak da alınabilir"],
    price: null,
  },
  {
    id: "live-8",
    name: "Canlı online 8 ders",
    format: "live",
    detail: "4 hafta, haftada 2 canlı ders",
    includes: ["Kamera açık küçük grup", "Ders bağlantısı SMS ile"],
    price: null,
  },
  {
    id: "coaching-month",
    name: "Aylık online program",
    format: "coaching",
    detail: "4 hafta kişisel program ve takip",
    includes: [
      "Haftalık güncellenen program",
      "Form videosu geri bildirimi",
      "Haftalık görüntülü değerlendirme",
    ],
    price: null,
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
    a: "Sana uygun dersi bul testini çöz; üç soruda hedefine ve programına uyan branşı ve formatı öneriyoruz. Kararsız kalırsan ön kayıtta not bırak, antrenörümüz seni arasın.",
  },
  {
    q: "Canlı online derse katılmak için neye ihtiyacım var?",
    a: "Kamerası olan bir telefon ya da bilgisayar, bir mat ve birkaç metrekare boş alan. Ders bağlantısı dersten önce telefonuna gelir.",
  },
  {
    q: "Online personal training nasıl işliyor?",
    a: "İlk görüşmede hedefini, sağlık geçmişini ve evdeki ekipmanını konuşuyoruz. Antrenörün haftalık programını yazıyor; hareket videolarını gönderdiğinde formunu düzeltiyor ve haftada bir görüntülü değerlendirme yapıyorsunuz.",
  },
  {
    q: "Kaçırdığım grup dersinin yerine başka gün gelebilir miyim?",
    a: "8 ve 12 derslik grup paketlerinde telafi yoktur; seçtiğin sabah ya da akşam grubuna devam edersin. Stüdyonun iptal ettiği ders ise paketinin sonuna eklenir.",
  },
  {
    q: "Ödemeyi nasıl yapıyorum?",
    a: "Şu an ön kayıt alıyoruz; ödemeyi stüdyoda ya da havale ile yapabilirsin. Kartla online ödeme yakında eklenecek.",
  },
];
