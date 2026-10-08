import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { company, contactChannels } from "@/content/company";
import { photos } from "@/content/site";
import { Container } from "@/components/ui";
import { AskAssistantButton } from "@/components/assistant/open-assistant";

export const metadata: Metadata = {
  title: { absolute: "Zenn Studio — training studio and online platform in Istanbul" },
  description:
    "Zenn Studio is a training studio in Istanbul with an online platform: live online classes, remote personal training and Zenn Assistant, an AI assistant built on Claude.",
  alternates: { canonical: "/en", languages: { tr: "/", en: "/en" } },
};

// Facts supplied by the studio (2026-10). Update here when they change.
const facts = [
  { value: "Istanbul", label: "Studio" },
  { value: "2025", label: "Founded" },
  { value: "68", label: "Members" },
  { value: "2", label: "Software engineers" },
];

const studioClasses = ["Reformer Pilates", "Mat Pilates", "Kickboxing", "Functional training"];

const online = [
  { name: "Live online classes", text: "Small groups with cameras on, so the coach sees and corrects you in real time." },
  {
    name: "Remote personal training",
    text: "A weekly program written for your goal and the equipment you have at home, video form feedback and a weekly video check-in.",
  },
];

const sectionTitle = "text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em]";

export default function EnglishPage() {
  const channels = contactChannels(company);
  const legal = [
    ["Legal name", company.legalName],
    ["Address", [company.address, company.city].filter(Boolean).join(", ")],
    ["Tax office", company.taxOffice],
    ["Tax number", company.taxNumber],
    ["MERSİS no", company.mersis],
  ].filter(([, v]) => v);

  return (
    <div lang="en">
      <section className="pt-6 pb-16 sm:pt-10">
        <Container>
          <div className="on-ink relative overflow-hidden rounded-[28px] bg-ink text-paper">
            <Image
              src={photos.hero.src}
              alt="Athlete holding a leg raise on a reformer"
              placeholder="blur"
              priority
              fill
              sizes="(min-width: 1152px) 1104px, 100vw"
              className="object-cover object-[60%_40%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/0" aria-hidden />
            <div className="relative flex min-h-[540px] flex-col justify-end p-6 sm:min-h-[600px] sm:p-10">
              <h1 className="max-w-3xl text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] font-semibold tracking-[-0.045em]">
                A training studio with an online platform.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-paper/80">
                Zenn Studio teaches Reformer Pilates, Mat Pilates, kickboxing and functional training in Istanbul, and
                takes the same coaching online.
              </p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="rounded-[24px] bg-card p-6">
                <dt className="text-sm text-ink-soft">{f.label}</dt>
                <dd className="mt-1 text-4xl font-semibold tracking-[-0.04em]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="offer" className="scroll-mt-24 pb-20 sm:pb-28">
        <Container>
          <h2 className={sectionTitle}>What we offer</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <article className="rounded-[24px] bg-card p-7">
              <h3 className="text-2xl font-semibold tracking-tight">Studio classes</h3>
              <p className="mt-2 text-ink-soft">Small groups and one-to-one sessions in our Istanbul studio.</p>
              <ul className="mt-5 space-y-1.5">
                {studioClasses.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </article>
            {online.map((o) => (
              <article key={o.name} className="rounded-[24px] bg-card p-7">
                <p className="text-sm font-semibold text-moss">Online platform</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight">{o.name}</h3>
                <p className="mt-2 text-ink-soft">{o.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-ink-soft">
            Coming soon: an on-demand video library, Apple Health and Garmin sync, a member dashboard and online card
            payments.
          </p>
        </Container>
      </section>

      <section id="claude" className="scroll-mt-24 pb-20 sm:pb-28">
        <Container>
          <div className="on-ink rounded-[28px] bg-ink p-7 text-paper sm:p-12">
            <Sparkles className="size-7 text-lime" aria-hidden />
            <h2 className={`mt-4 ${sectionTitle}`}>How we use Claude</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold">Built with Claude Code</h3>
                <p className="mt-2 text-paper/75">
                  This website was developed with Claude Code, Anthropic&apos;s coding agent, by our two-person software
                  team.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Zenn Assistant runs on Claude</h3>
                <p className="mt-2 text-paper/75">
                  The chat on this site answers questions about classes, packages and online training, recommends a
                  class and hands you over to our team when a person should answer. It says up front that it is an AI,
                  answers only from our own published information and never gives medical advice.
                </p>
              </div>
            </div>
            <AskAssistantButton
              question="What can you help me with?"
              className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-lime px-6 text-[15px] font-semibold text-ink hover:bg-lime-hover"
            >
              Try Zenn Assistant
            </AskAssistantButton>
          </div>
        </Container>
      </section>

      <section id="company" className="scroll-mt-24 pb-24 sm:pb-32">
        <Container className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] bg-card p-7">
            <h2 className="text-2xl font-semibold tracking-tight">Company</h2>
            <dl className="mt-5 space-y-3">
              {legal.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-sm text-ink-soft">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-[24px] bg-card p-7">
            <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
            <ul className="mt-5 space-y-2">
              {channels.map((c) => (
                <li key={c.kind}>
                  <a className="font-medium underline-offset-4 hover:underline" href={c.href}>
                    {c.kind === "whatsapp" ? "WhatsApp" : c.label}
                  </a>
                </li>
              ))}
              {company.mapsUrl && (
                <li>
                  <a className="font-medium underline-offset-4 hover:underline" href={company.mapsUrl}>
                    Directions on Google Maps
                  </a>
                </li>
              )}
            </ul>
            <p className="mt-6 text-sm text-ink-soft">
              The rest of the site is in Turkish.{" "}
              <Link href="/" hrefLang="tr" className="font-semibold text-ink underline underline-offset-4">
                Go to the Turkish site
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
