import { cannedReplies } from "@/lib/assistant/guard";
import { HANDOFF_MARKER } from "@/lib/assistant/prompt-markers";
import type { Lang } from "./landing";

// Scripted demo conversations, written to the assistant's rules and the
// studio's real content (packages, make-up rule). The health reply is the
// exact canned text the server sends. Labelled as scripted wherever shown.

export type DemoScenario = { id: string; label: string; user: string; assistant: string };

export const demoScenarios: Record<Lang, DemoScenario[]> = {
  tr: [
    {
      id: "sales",
      label: "Satış",
      user: "Evden çalışmak istiyorum, duruşumu düzeltmek istiyorum. Ne önerirsin?",
      assistant:
        "Duruş için en uygun branşımız mat pilates; evden çalışmak istediğin için canlı online formatını öneririm. Kamera açık küçük gruplarda antrenörün seni ekranda görür ve hareketini anında düzeltir. Canlı online 8 ders paketi 4 hafta sürer, haftada 2 ders. Fiyat ön kayıtta paylaşılıyor.\n<<KAYIT brans=mat-pilates format=live paket=live-8>>",
    },
    {
      id: "support",
      label: "Destek",
      user: "Kaçırdığım grup dersinin telafisi var mı?",
      assistant:
        "8 ve 12 derslik grup paketlerinde telafi yok; seçtiğin sabah ya da akşam grubuna devam ediyorsun ve katılmadığın ders de paketinden düşüyor. Stüdyonun iptal ettiği bir ders olursa paketinin sonuna ekleniyor.",
    },
    {
      id: "health",
      label: "Sağlık → insana devir",
      user: "Bel fıtığım var, reformer yapabilir miyim?",
      assistant: `${cannedReplies.health.tr}\n${HANDOFF_MARKER}`,
    },
    {
      id: "unknown",
      label: "Bilmediğinde",
      user: "Cumartesi sabah reformer dersi var mı?",
      assistant:
        "Ders saatleriyle ilgili sitede bir bilgi yok, o yüzden tahmin yürütmeyeyim. Bu konuda bilgim yok, ekibe iletiyorum.\n" +
        HANDOFF_MARKER,
    },
  ],
  en: [
    {
      id: "sales",
      label: "Sales",
      user: "I want to train from home and fix my posture. What do you suggest?",
      assistant:
        "For posture, Mat Pilates is our best fit, and since you want to train from home I'd suggest the live online format. Small groups keep cameras on, so your coach sees you on screen and corrects you in real time. The live online 8-class package runs for 4 weeks, 2 classes a week. The price is shared at pre-registration.\n<<KAYIT brans=mat-pilates format=live paket=live-8>>",
    },
    {
      id: "support",
      label: "Support",
      user: "Can I make up a group class I missed?",
      assistant:
        "Group packages of 8 and 12 classes have no make-ups: you stay with your morning or evening group, and a class you miss still counts. If the studio cancels a class, it's added to the end of your package.",
    },
    {
      id: "health",
      label: "Health → human",
      user: "I have a herniated disc. Can I do reformer?",
      assistant: `${cannedReplies.health.en}\n${HANDOFF_MARKER}`,
    },
    {
      id: "unknown",
      label: "When it doesn't know",
      user: "Is there a reformer class on Saturday morning?",
      assistant:
        "Class times aren't published on the site, so I won't guess. I don't have that information; I'm passing your question to the team.\n" +
        HANDOFF_MARKER,
    },
  ],
};
