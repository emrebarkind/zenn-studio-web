// B2B landing page copy (/ and /en). Every claim here must stay true:
// - company facts were supplied by the founders (2026-10);
// - "studio software" items are features running today in the studio's CRM;
// - assistant behaviour matches src/lib/assistant (guards, prompt, limits).
// No invented metrics, customers, testimonials or results.

export type Lang = "tr" | "en";

type Item = { title: string; text: string };

export type LandingCopy = {
  meta: { title: string; description: string };
  ids: { product: string; demo: string; how: string; trust: string; customer: string; contact: string };
  heroAlt: string;
  intro: { title: string; text: string; primary: string; secondary: string };
  pillars: { title: string; items: Item[] };
  demo: { title: string; lead: string; note: string; replay: string; enroll: string; handoffTitle: string; handoffNote: string; channels: string[] };
  how: { title: string; steps: Item[] };
  trust: { title: string; lead: string; items: Item[] };
  customer: {
    title: string;
    lead: string;
    facts: { value: string; label: string }[];
    softwareTitle: string;
    software: string[];
    link: string;
  };
  claude: { title: string; items: Item[] };
  contact: { title: string; text: string; empty: string; studioLink: string };
};

export const landing: Record<Lang, LandingCopy> = {
  tr: {
    meta: {
      title: "Zenn — fitness stüdyoları için yapay zekâ destekli satış ve müşteri hizmetleri",
      description:
        "Zenn, fitness stüdyoları için Claude ile çalışan bir satış ve müşteri hizmetleri asistanı geliştiriyor. Tekirdağ'daki kendi stüdyomuzun içinde.",
    },
    ids: { product: "urun", demo: "demo", how: "nasil", trust: "guven", customer: "studyo", contact: "iletisim" },
    heroAlt: "Zenn Studio'da reformer üzerinde egzersiz yapan sporcu",
    intro: {
      title: "Stüdyonuzun satış ve müşteri hizmetleri, yapay zekâ ile.",
      text: "Zenn, fitness stüdyoları için Claude ile çalışan bir satış ve müşteri hizmetleri asistanı geliştiriyor. Asistan web sitenizdeki soruları stüdyonuzun kendi bilgileriyle yanıtlar, doğru paketi önerir, ön kaydı başlatır ve gerektiğinde ekibinize devreder. Ürünü İstanbul'daki kendi stüdyomuzun içinde geliştiriyoruz.",
      primary: "Demoyu izle",
      secondary: "Stüdyonuz için konuşalım",
    },
    pillars: {
      title: "Ne yapar?",
      items: [
        {
          title: "Soruları anında yanıtlar",
          text: "Paketler, telafi kuralı, canlı dersler, ödeme yöntemleri: ziyaretçinin sorusunu stüdyonun yayınladığı bilgilerle, her saat yanıtlar.",
        },
        {
          title: "Satışa yönlendirir",
          text: "Hedefi ve programı sorar; uygun branşı, formatı ve paketi önerir, ön kayıt formunu doğru seçimlerle açar.",
        },
        {
          title: "Uydurmaz",
          text: "Sitede yazmayan fiyat, saat, kampanya ya da antrenör adı söylemez; bilmediğinde bilmediğini söyler.",
        },
        {
          title: "İnsana devreder",
          text: "Sağlık konularında yorum yapmaz; ziyaretçiyi WhatsApp, telefon ya da e-postayla ekibinize bağlar.",
        },
      ],
    },
    demo: {
      title: "Nasıl konuştuğunu görün",
      lead: "Ürünün gerçek arayüzü, asistanın kurallarına göre yazılmış dört konuşma. Bir senaryo seçin.",
      note: "Senaryolu demo: bu konuşmalar önceden yazılmıştır, canlı yapay zekâ yanıtı değildir.",
      replay: "Yeniden oynat",
      enroll: "Ön kayda geç",
      handoffTitle: "Ekibimize ulaş",
      handoffNote: "Stüdyonun kendi iletişim kanalları gösterilir.",
      channels: ["WhatsApp", "Telefon", "E-posta"],
    },
    how: {
      title: "Nasıl çalışır",
      steps: [
        {
          title: "Bilginiz kaynak olur",
          text: "Paketler, kurallar, sık sorulanlar ve iletişim bilgileri sitenizden tek bir bilgi metnine dönüşür. Asistan yalnızca bunu bilir.",
        },
        {
          title: "Claude konuşur, kurallar sunucuda da denetlenir",
          text: "Yanıtları Claude üretir. Sağlık konuları ve kart, IBAN, TC kimlik numarası gibi veriler modele gitmeden sunucuda yakalanır.",
        },
        {
          title: "Satış ve destek ekibinize akar",
          text: "Kayda hazır ziyaretçi ön kayıt formuna doğru seçimlerle gider; bir insan gerektiğinde konuşma ekibinize devredilir.",
        },
      ],
    },
    trust: {
      title: "Güven ve KVKK",
      lead: "Asistanın kuralları yalnızca talimatta yazmıyor; kodda uygulanıyor ve otomatik testlerle doğrulanıyor.",
      items: [
        { title: "Yapay zekâ olduğunu söyler", text: "Her konuşma, asistanın yapay zekâ olduğunu söyleyerek ve insana bağlanma seçeneği sunarak başlar." },
        { title: "Konuşmalar kaydedilmez", text: "Konuşma içeriği loglanmaz; yalnızca mesaj sayısı, token ve süre gibi sayılar tutulur." },
        { title: "Hassas veri modele gitmez", text: "Sağlık konuları ve ödeme ya da kimlik verileri sunucuda yakalanır, modele iletilmeden insana yönlendirilir." },
        { title: "Sınırlar içinde çalışır", text: "Yalnızca Türkçe ve İngilizce konuşur; mesaj uzunluğu, konuşma ve IP başına istek sınırları vardır." },
      ],
    },
    customer: {
      title: "İlk müşterimiz: kendi stüdyomuz",
      lead: "Zenn Studio 2025'te Tekirdağ'da kuruldu. Ürünü üyelerimizin ve antrenörlerimizin her gün içinde olduğu bir stüdyoda geliştiriyoruz.",
      facts: [
        { value: "Tekirdağ", label: "Stüdyo" },
        { value: "2025", label: "Kuruluş" },
        { value: "68", label: "Üye" },
        { value: "2", label: "Yazılımcı" },
      ],
      softwareTitle: "Stüdyoyu bugün kendi yazılımımızla yönetiyoruz",
      software: [
        "Antrenörlerin ortak ders takvimi",
        "Ders öncesi otomatik SMS hatırlatma",
        "Katılım, telafi ve paket takibi",
        "Grup dersi kayıtları",
        "Aylık ve yıllık raporlar",
      ],
      link: "Zenn Studio sitesine git",
    },
    claude: {
      title: "Claude ile geliştirildi",
      items: [
        { title: "Claude Code", text: "Bu site, iki kişilik yazılım ekibimiz tarafından Anthropic'in kodlama ajanı Claude Code ile geliştirildi." },
        {
          title: "Claude",
          text: "Asistan Anthropic'in Claude modelleriyle çalışacak şekilde tasarlandı. Sistem talimatı stüdyonun yayınladığı içerikten üretilir; davranış kuralları otomatik testlerle denetlenir.",
        },
      ],
    },
    contact: {
      title: "Stüdyonuz için konuşalım",
      text: "Asistanı kendi stüdyonuzda görmek ister misiniz? Bize yazın.",
      empty: "İletişim bilgilerimiz çok yakında burada.",
      studioLink: "Zenn Studio'yu ziyaret edin",
    },
  },
  en: {
    meta: {
      title: "Zenn — AI sales and customer service for fitness studios",
      description:
        "Zenn builds a Claude-powered sales and customer-service assistant for fitness studios, developed inside our own studio in Tekirdağ.",
    },
    ids: { product: "product", demo: "demo", how: "how", trust: "trust", customer: "studio", contact: "contact" },
    heroAlt: "Athlete exercising on a reformer at Zenn Studio",
    intro: {
      title: "AI sales and customer service for fitness studios.",
      text: "Zenn builds a Claude-powered sales and customer-service assistant for fitness studios. It answers website visitors with the studio's own information, recommends the right package, starts the pre-registration and hands over to the team when a person should answer. We build it inside our own studio in Istanbul.",
      primary: "Watch the demo",
      secondary: "Talk to us",
    },
    pillars: {
      title: "What it does",
      items: [
        {
          title: "Answers instantly",
          text: "Packages, make-up rules, live classes, payment options: it answers visitors around the clock from what the studio has published.",
        },
        {
          title: "Moves visitors to sign-up",
          text: "It asks about goals and schedule, recommends a class, format and package, and opens the pre-registration form with those choices.",
        },
        {
          title: "Doesn't make things up",
          text: "No prices, times, promotions or coach names that aren't on the site. When it doesn't know, it says so.",
        },
        {
          title: "Hands over to people",
          text: "It never comments on health matters; it connects the visitor with the team by WhatsApp, phone or e-mail.",
        },
      ],
    },
    demo: {
      title: "See how it talks",
      lead: "The product's real interface with four conversations written to the assistant's rules. Pick a scenario.",
      note: "Scripted demo: these conversations are pre-written, not live AI responses.",
      replay: "Replay",
      enroll: "Pre-register",
      handoffTitle: "Reach our team",
      handoffNote: "The studio's own contact channels appear here.",
      channels: ["WhatsApp", "Phone", "E-mail"],
    },
    how: {
      title: "How it works",
      steps: [
        {
          title: "Your information is the source",
          text: "Packages, rules, FAQs and contact details on your site become a single knowledge text. That is all the assistant knows.",
        },
        {
          title: "Claude talks, the server enforces the rules",
          text: "Claude writes the answers. Health topics and card, IBAN or national ID numbers are caught on the server before anything reaches the model.",
        },
        {
          title: "Sales and support reach your team",
          text: "Ready visitors land on the pre-registration form with the right choices; when a person is needed, the conversation goes to your team.",
        },
      ],
    },
    trust: {
      title: "Trust and privacy",
      lead: "The assistant's rules aren't only written in a prompt: they're enforced in code and checked by automated tests.",
      items: [
        { title: "Says it's an AI", text: "Every conversation opens by saying the assistant is an AI and offering a human." },
        { title: "No conversation logs", text: "Message content is never logged; only counts such as messages, tokens and duration." },
        { title: "Sensitive data stays out", text: "Health topics and payment or ID data are caught on the server and routed to a person, never to the model." },
        { title: "Runs within limits", text: "Turkish and English only, with caps on message length, conversation length and requests per IP." },
      ],
    },
    customer: {
      title: "Our first customer: our own studio",
      lead: "Zenn Studio was founded in Tekirdağ in 2025. We build the product inside a studio our members and coaches use every day.",
      facts: [
        { value: "Tekirdağ", label: "Studio" },
        { value: "2025", label: "Founded" },
        { value: "68", label: "Members" },
        { value: "2", label: "Software engineers" },
      ],
      softwareTitle: "We already run the studio on our own software",
      software: [
        "Shared class calendar for coaches",
        "Automatic SMS reminders before class",
        "Attendance, make-up and package tracking",
        "Group class enrolment",
        "Monthly and yearly reports",
      ],
      link: "Visit the Zenn Studio site",
    },
    claude: {
      title: "Built with Claude",
      items: [
        { title: "Claude Code", text: "This website was built with Claude Code, Anthropic's coding agent, by our two-person software team." },
        {
          title: "Claude",
          text: "The assistant is designed to run on Anthropic's Claude models. Its system prompt is generated from the studio's published content, and its behaviour rules are checked by automated tests.",
        },
      ],
    },
    contact: {
      title: "Let's talk about your studio",
      text: "Want to see the assistant in your own studio? Get in touch.",
      empty: "Our contact details will be here very soon.",
      studioLink: "Visit Zenn Studio",
    },
  },
};
