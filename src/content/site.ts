import type { StaticImageData } from "next/image";
import spinningBisiklet from "@/assets/photos/spinning-bisiklet.jpg";
import hero from "@/assets/photos/hero.jpg";
import reformerWide from "@/assets/photos/reformer-wide.jpg";
import kickboksWide from "@/assets/photos/kickboks-wide.jpg";
import birebirWide from "@/assets/photos/birebir-wide.jpg";
import reformerKollar from "@/assets/photos/reformer-kollar.jpg";
import matGrup from "@/assets/photos/mat-grup.jpg";
import kickboksTorba from "@/assets/photos/kickboks-torba.jpg";
import fonksiyonelBaris from "@/assets/photos/fonksiyonel-baris.jpg";
import antrenorAli from "@/assets/photos/antrenor-ali.jpg";
import antrenorSuheda from "@/assets/photos/antrenor-suheda.jpg";
import antrenorBaris from "@/assets/photos/antrenor-baris.jpg";
import antrenorZeynep from "@/assets/photos/antrenor-zeynep.jpg";
import antrenorZeynep2 from "@/assets/photos/antrenor-zeynep-2.jpg";
import antrenorSuheda2 from "@/assets/photos/antrenor-suheda-2.jpg";
import antrenorBaris2 from "@/assets/photos/antrenor-baris-2.jpg";
import antrenorEce from "@/assets/photos/antrenor-ece.jpg";
import antrenorEce3 from "@/assets/photos/antrenor-ece-3.jpg";

// Every piece of copy and every business fact on the site lives here, so the
// studio can change prices, coaches or contact details without touching
// layout code. Fields set to `null` are facts we do not have yet; the UI
// renders a neutral fallback for them instead of inventing a value.

export const studio = {
  name: "Zenn Studio",
  domain: "zenn-studio.com",
  url: "https://zenn-studio.com",
};

// Contact and legal details live in ./company.ts.

/**
 * Where we are (owner, 2026-10-25): Süleymanpaşa, Tekirdağ. Shown by its
 * coordinates only, never through the Google business listing, which still
 * carries a previous business's name until the owner sorts it out.
 */
export const studioLocation = {
  neighbourhood: "Hürriyet Mahallesi",
  street: "Şehit Mesut Bakan Cd. No:2",
  district: "Süleymanpaşa",
  city: "Tekirdağ",
  lat: 40.9811393,
  lng: 27.5509916,
};

/**
 * Opening hours (owner, 2026-11-17): every day including Sunday, 07:30-22:00,
 * lessons by request — the studio is open when an antrenör has a lesson.
 * Same hours as the Google Business Profile should show.
 */
export const studioHours = {
  opens: "07:30",
  closes: "22:00",
  label: "Her gün 07:30–22:00",
  note: "Pazar dahil, ders randevusuyla",
};

/** Directions to the coordinates (no business name attached). */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${studioLocation.lat},${studioLocation.lng}`;

/**
 * How we work (2026-10-25): the studio's own services first, group classes
 * and individual / small-group training for 1-6 people. Online is Mat Pilates
 * only, on request, and kept low-key: a tick box on the request form, not a
 * third way shown everywhere. The site informs and takes requests.
 */
export type FormatId = "group" | "private" | "online";

export type Format = {
  id: FormatId;
  name: string;
  /** Short label for chips and tables. */
  short: string;
  summary: string;
  points: string[];
};

export const formats: Format[] = [
  {
    id: "group",
    name: "Grup dersleri",
    short: "Grup dersi",
    summary: "Grup derslerimizi belli günlerde, sabah ve akşam gruplarıyla veriyoruz.",
    points: ["Mat Pilates ve Spinning", "8 ya da 12 derslik, 4 haftalık paket", "Sabah ya da akşam grubu"],
  },
  {
    id: "private",
    name: "Bireysel ve küçük grup",
    short: "1-6 kişi",
    summary: "Tek başına ya da 6 kişiye kadar; gün ve saati seninle birlikte belirliyoruz.",
    points: ["Mat ve Reformer Pilates, Kickboks, Fonksiyonel antrenman", "Tek başına, eşinle ya da arkadaşlarınla", "Saat ve günler sana göre"],
  },
  {
    id: "online",
    name: "Online ders",
    short: "Online",
    summary: "Mat Pilates'i talep üzerine evden, canlı olarak da veriyoruz.",
    points: ["Yalnız Mat Pilates", "Antrenörümüz seni ekranda görür", "Gün ve saati birlikte planlarız"],
  },
];

/** The ways to train in the studio; online (Mat Pilates only) is a tick box on the request form. */
export const studioFormats = formats.filter((f) => f.id !== "online");

/** Group size for individual / small-group training. */
export const PRIVATE_GROUP_MAX = 6;

export type DisciplineSlug =
  | "mat-pilates"
  | "spinning"
  | "reformer-pilates"
  | "kickboks"
  | "fonksiyonel-antrenman";

export type Photo = { src: StaticImageData; alt: string; position?: string };

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
  photo: Photo | null;
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
      "Matın üzerinde, vücut ağırlığıyla çalışan klasik pilates. Merkez gücünü, duruşu ve nefes kontrolünü geliştirir. Sabah ve akşam gruplarımızda haftada 2 ya da 3 gün çalışıyoruz; istersen tek başına ya da 6 kişiye kadar küçük grupla da.",
    goodFor: ["Merkez gücü ve nefes", "Duruş ve bel‑sırt sağlığı", "Grup enerjisiyle çalışmayı sevenler"],
    bring: "Rahat kıyafet ve su.",
    formats: ["group", "private", "online"],
    coaches: ["Ece", "Zeynep"],
    photo: { src: matGrup, alt: "Mat Pilates dersinde üyenin duruşunu düzelten antrenör", position: "50% 60%" },
  },
  {
    slug: "spinning",
    name: "Spinning",
    tagline: "Müzikle, ritimle, tempoyla.",
    description:
      "Sabit bisiklette, müzik eşliğinde aralıklı tempoyla kondisyon çalışıyoruz. Direnci herkes kendi seviyesine göre ayarlar; aynı grupta yeni başlayan da düzenli gelen de rahatça çalışır.",
    goodFor: ["Kondisyon ve yağ yakımı", "Eklemleri yormadan kardiyo", "Grup enerjisiyle çalışmayı sevenler"],
    bring: "Spor ayakkabı, havlu ve su.",
    formats: ["group"],
    coaches: [],
    // From the studio's own launch post, with its text cropped out.
    photo: { src: spinningBisiklet, alt: "Spinning bisikletinde pedal çeviren bir üyenin bacakları ve bisikletin volanı", position: "62% 50%" },
  },
  {
    slug: "reformer-pilates",
    name: "Reformer Pilates",
    tagline: "Yaylı direnç, kontrollü hareket.",
    description:
      "Reformer'ın yay direnci her hareketi hem destekler hem zorlar. Derin karın kaslarını, duruşu ve eklem hareket açıklığını birlikte çalışıyoruz. Derslerimizi tek başına ya da 6 kişiye kadar küçük gruplarla veriyoruz.",
    goodFor: ["Duruş ve bel‑sırt sağlığı", "Güç kaybetmeden esneklik", "Pilatese yeni başlayanlar"],
    bring: "Kaymaz çorap ve rahat kıyafet.",
    formats: ["private"],
    coaches: ["Şüheda", "Ece", "Sude"],
    photo: { src: reformerKollar, alt: "Reformer'da kayışlarla kollarını yukarı uzatan antrenör", position: "55% 30%" },
  },
  {
    slug: "kickboks",
    name: "Kickboks",
    tagline: "Doğru teknik, yüksek enerji.",
    description:
      "Gard, ayak hareketi, yumruk ve tekme: tekniği temelden, adım adım öğretiyoruz. Antrenörünün tuttuğu pedlere vurarak kombinasyonlar çalışıyorsun; kısa kondisyon bloklarıyla temponu artırıyoruz. Tempoyu her zaman seviyene göre ayarlıyoruz; ilk kez eldiven giyenle yıllardır çalışan aynı özeni görüyor.",
    goodFor: ["Kondisyon ve yağ yakımı", "Stres atmak", "Koordinasyon ve refleks"],
    bring: "Bandaj ve eldiven; ilk derste bizimkileri kullanabilirsin.",
    formats: ["private"],
    coaches: ["Ali"],
    photo: { src: kickboksTorba, alt: "Kum torbasına yumruk atan kickboks antrenörü", position: "45% 30%" },
  },
  {
    slug: "fonksiyonel-antrenman",
    name: "Fonksiyonel antrenman",
    tagline: "Gerçek hareketlerle güç ve denge.",
    description:
      "Çömelmek, eğilip kaldırmak, itmek, çekmek, taşımak: vücudunun her gün yaptığı hareketleri güçlendiriyoruz. Programı hedefine ve seviyene göre seninle birlikte kuruyor, ağırlığı ve tekrarı adım adım artırıyoruz. Amaç sadece daha güçlü olmak değil; günlük hayatta daha rahat ve dengeli hareket etmek.",
    goodFor: ["Kişisel hedefe göre program", "Güç ve dayanıklılık", "Bireysel takip isteyenler"],
    bring: "Spor ayakkabı, havlu, su.",
    formats: ["private"],
    coaches: ["Barış", "Ece", "Zeynep", "Sude"],
    photo: { src: fonksiyonelBaris, alt: "Makinede çalışan antrenörümüz Barış", position: "45% 42%" },
  },
];

export type Coach = {
  /** First name: the key everything else uses (lesson teams, blog reviewedBy, the CRM's coach list). */
  name: string;
  /** Shown after the first name on the site (owner, 2026-10-25). */
  surname?: string;
  /** What the coach works in professionally, as shown on their card when it differs from the lessons (Barış: Fitness). */
  areas?: string[];
  disciplines: DisciplineSlug[];
  /** Portrait, then a photo from a lesson; hovering (or tapping) the card swaps them. null until sent. */
  portrait: Photo | null;
  action: Photo | null;
};

/** "Ece Pekmezcioğulları", or just the first name when we have no surname yet. */
export function coachFullName(c: Pick<Coach, "name" | "surname">): string {
  return c.surname ? `${c.name} ${c.surname}` : c.name;
}

// Branşlar follow what each coach actually teaches in the CRM (2026-10-25).
// Second photo: another portrait from the same shoot (a different angle), Ali at the bag.
// TODO(studio): Sude's portrait and surname; short bios once approved.
export const coaches: Coach[] = [
  {
    name: "Zeynep",
    surname: "Doğan",
    disciplines: ["mat-pilates", "fonksiyonel-antrenman"],
    portrait: { src: antrenorZeynep, alt: "Antrenör Zeynep", position: "50% 20%" },
    action: { src: antrenorZeynep2, alt: "Antrenör Zeynep", position: "50% 20%" },
  },
  {
    name: "Ece",
    surname: "Pekmezcioğulları",
    disciplines: ["mat-pilates", "reformer-pilates", "fonksiyonel-antrenman"],
    portrait: { src: antrenorEce3, alt: "Antrenör Ece", position: "50% 20%" },
    action: { src: antrenorEce, alt: "Antrenör Ece", position: "50% 20%" },
  },
  {
    name: "Şüheda",
    surname: "Küçük",
    disciplines: ["reformer-pilates"],
    portrait: { src: antrenorSuheda, alt: "Antrenör Şüheda", position: "50% 20%" },
    action: { src: antrenorSuheda2, alt: "Antrenör Şüheda", position: "50% 20%" },
  },
  {
    name: "Barış",
    surname: "Öngören",
    areas: ["Fitness"],
    disciplines: ["fonksiyonel-antrenman"],
    portrait: { src: antrenorBaris, alt: "Antrenör Barış", position: "50% 20%" },
    action: { src: antrenorBaris2, alt: "Antrenör Barış", position: "50% 20%" },
  },
  {
    name: "Ali",
    surname: "Novruzov",
    disciplines: ["kickboks"],
    portrait: { src: antrenorAli, alt: "Antrenör Ali", position: "50% 20%" },
    action: { src: kickboksTorba, alt: "Ali kum torbasında", position: "45% 30%" },
  },
  { name: "Sude", disciplines: ["reformer-pilates", "fonksiyonel-antrenman"], portrait: null, action: null },
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
    detail: "1-6 kişi; ders sayısını ve saatleri birlikte belirleriz",
    includes: ["Reformer Pilates, Kickboks ya da Fonksiyonel", "Tek başına ya da en fazla 6 kişi"],
    price: null,
    weekNote: "Günleri ve saati antrenörünle birlikte belirlersin; arkadaşlarınla gelirsen grubu sen kurarsın.",
  },
  {
    id: "online",
    name: "Online ders",
    format: "online",
    detail: "Mat Pilates, evden canlı ders; talep üzerine",
    includes: ["Yalnız Mat Pilates", "Antrenörün seni ekranda görür"],
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
    a: "Talep formuna hedefini not et; antrenörümüz seni arayıp sana uygun dersi birlikte seçer. İstersen \"Sana uygun ders\" bölümündeki kısa soruları da cevaplayabilirsin.",
  },
  {
    q: "Grup dersi ile bireysel ders arasındaki fark ne?",
    a: "Grup derslerimizi (Mat Pilates, Spinning) belli günlerde sabah ve akşam gruplarıyla veriyoruz. Bireysel derslerde tek başına ya da 6 kişiye kadar küçük grupla çalışıyoruz; gün ve saati seninle birlikte belirliyoruz. Mat Pilates, Reformer Pilates, Kickboks ve Fonksiyonel antrenman bireysel olarak da veriliyor.",
  },
  {
    q: "Arkadaşlarımla birlikte gelebilir miyim?",
    a: "Evet. Bireysel derslerde 6 kişiye kadar küçük grup kurabilirsin; ayrıntılı talep formunda kaç kişi olacağınızı seçmen yeterli.",
  },
  {
    q: "Kaçırdığım grup dersinin yerine başka gün gelebilir miyim?",
    a: "8 ve 12 derslik grup paketlerinde telafi yoktur; seçtiğin sabah ya da akşam grubuna devam edersin. Bizim iptal ettiğimiz ders ise paketinin sonuna eklenir.",
  },
  {
    q: "Online ders de veriyor musunuz?",
    a: "Yalnız Mat Pilates için ve talep üzerine veriyoruz. Talep formunda \"Online ders talebi\" kutusunu işaretle; antrenörümüz uygun saati seninle konuşur.",
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
  "Bizim iptal ettiğimiz ders paketinin sonuna eklenir.",
];

/** How an online Mat Pilates lesson works, step by step (shown on /online). */
export const coachingFlow = [
  { title: "Talebini bırak", text: "Talep formunda \"Online ders talebi\" kutusunu işaretle; uygun olduğun günleri nota yaz." },
  { title: "Tanışma görüşmesi", text: "Antrenörün seni arar; seviyeni, hedefini ve evdeki alanını konuşursunuz." },
  { title: "Canlı ders", text: "Görüntülü bağlantıyla matta birlikte çalışırsınız; antrenörün seni ekranda görüp düzeltir." },
];
