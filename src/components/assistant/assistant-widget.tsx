"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Mail, MessageCircle, Phone, Sparkles, X, AtSign } from "lucide-react";
import { company, contactChannels } from "@/content/company";
import { assistantLimits } from "@/lib/assistant/config";
import { parseReply } from "@/lib/assistant/actions";
import { greeting } from "@/lib/assistant/greeting";
import { buttonClass } from "@/components/ui";
import { OPEN_ASSISTANT_EVENT } from "./open-assistant";

type Message = { role: "user" | "assistant"; content: string };

const copy = {
  tr: {
    launcher: "Asistana sor",
    title: "Zenn Asistan",
    badge: "Yapay zekâ",
    close: "Asistanı kapat",
    placeholder: "Sorunu yaz…",
    send: "Gönder",
    human: "Ekibimize bağlan",
    handoffTitle: "Ekibimize ulaş",
    noChannels: "İletişim bilgilerimiz yakında burada. Şimdilik ön kayıt formunu kullanabilirsin.",
    enroll: "Ön kayda geç",
    limit: "Bu sohbette mesaj sınırına ulaşıldı. Devamı için ekibimize yazabilirsin.",
    offline: "Şu an yanıt veremiyorum. Seni ekibimize bağlayayım.",
    suggestions: ["Bana hangi paket uygun?", "Canlı online derse nasıl katılırım?", "Kaçırdığım dersin telafisi var mı?"],
    note: "Zenn Asistan yapay zekâ ile çalışır ve hata yapabilir. Yanıt üretmek için mesajların hizmet sağlayıcımız Anthropic'e iletilir; kart, kimlik ya da sağlık bilgisi paylaşma.",
    kvkk: "KVKK aydınlatma metni",
  },
  en: {
    launcher: "Ask the assistant",
    title: "Zenn Assistant",
    badge: "AI",
    close: "Close assistant",
    placeholder: "Type your question…",
    send: "Send",
    human: "Talk to our team",
    handoffTitle: "Reach our team",
    noChannels: "Our contact details will be here soon. For now, use the pre-registration form.",
    enroll: "Pre-register",
    limit: "This conversation has reached its message limit. Please contact our team to continue.",
    offline: "I can't answer right now. Let me connect you with our team.",
    suggestions: ["Which package fits me?", "How do live online classes work?", "Can I make up a missed class?"],
    note: "Zenn Assistant is AI-powered and can make mistakes. Your messages are sent to our provider Anthropic to generate answers; don't share card, ID or health details.",
    kvkk: "Privacy notice (KVKK)",
  },
};

const channelIcon = { whatsapp: MessageCircle, phone: Phone, email: Mail, instagram: AtSign };

function Handoff({ t }: { t: (typeof copy)["tr"] }) {
  const channels = contactChannels(company);
  return (
    <div className="mt-2 rounded-[18px] bg-paper p-4 ring-1 ring-ink/10">
      <p className="text-sm font-semibold">{t.handoffTitle}</p>
      {channels.length ? (
        <ul className="mt-2 space-y-1.5">
          {channels.map((c) => {
            const Icon = channelIcon[c.kind];
            return (
              <li key={c.kind}>
                <a
                  href={c.href}
                  target={c.kind === "phone" || c.kind === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex min-h-10 items-center gap-2.5 rounded-xl px-2 font-medium hover:bg-card"
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {c.label}
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-ink-soft">
          {t.noChannels}{" "}
          <Link href="/kayit" className="font-semibold text-ink underline underline-offset-4">
            /kayit
          </Link>
        </p>
      )}
    </div>
  );
}

export function AssistantWidget() {
  const pathname = usePathname();
  const lang = pathname?.startsWith("/en") ? "en" : "tr";
  const t = copy[lang];

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const userCount = messages.filter((m) => m.role === "user").length;
  const atLimit = userCount >= assistantLimits.maxUserMessages;

  const send = useCallback(
    async (text: string) => {
      const content = text.trim().slice(0, assistantLimits.maxMessageChars);
      if (!content || busy) return;
      const history: Message[] = [...messages, { role: "user", content }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setInput("");
      setBusy(true);
      const controller = new AbortController();
      abortRef.current = controller;
      const appendToLast = (chunk: string) =>
        setMessages((prev) => {
          const next = prev.slice();
          next[next.length - 1] = { role: "assistant", content: next[next.length - 1].content + chunk };
          return next;
        });
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "content-type": "application/json" },
          // An answer cut off by closing the panel may be empty; keep turns valid.
          body: JSON.stringify({
            messages: history.map((m) => (m.content.trim() ? m : { ...m, content: "…" })),
          }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          const body = (await res.json().catch(() => null)) as { message?: string } | null;
          appendToLast(`${body?.message ?? t.offline}\n<<EKIP>>`);
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          appendToLast(decoder.decode(value, { stream: true }));
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") appendToLast(`${t.offline}\n<<EKIP>>`);
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, messages, t.offline],
  );

  // Open requests from elsewhere on the page ("Asistana sor" buttons).
  useEffect(() => {
    function onOpen(e: Event) {
      setOpen(true);
      const question = (e as CustomEvent<{ question?: string }>).detail?.question;
      if (question) void send(question);
      else requestAnimationFrame(() => inputRef.current?.focus());
    }
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen);
  }, [send]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, showHandoff]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="on-ink fixed right-4 bottom-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-paper shadow-[0_12px_30px_-10px_rgba(0,0,0,0.55)] transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-6"
      >
        <Sparkles className="size-4 text-lime" aria-hidden />
        {t.launcher}
      </button>
    );
  }

  return (
    <section
      role="dialog"
      aria-label={t.title}
      lang={lang}
      className="fixed inset-0 z-50 flex flex-col bg-paper sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(640px,calc(100svh-6rem))] sm:w-[400px] sm:rounded-[28px] sm:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] sm:ring-1 sm:ring-ink/10"
    >
      <header className="on-ink flex items-center justify-between bg-ink px-5 py-4 text-paper sm:rounded-t-[28px]">
        <div className="flex items-center gap-2.5">
          <Sparkles className="size-5 text-lime" aria-hidden />
          <p className="font-semibold">{t.title}</p>
          <span className="rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-paper/30">{t.badge}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t.close}
          className="grid size-10 place-items-center rounded-full hover:bg-paper/10"
        >
          <X className="size-5" />
        </button>
      </header>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5" aria-live="polite">
        <div className="max-w-[88%] rounded-[20px] rounded-tl-md bg-card px-4 py-3 text-[15px] leading-relaxed">
          {greeting[lang]}
          <button
            type="button"
            onClick={() => setShowHandoff(true)}
            className="mt-2 block font-semibold underline underline-offset-4"
          >
            {t.human}
          </button>
        </div>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {t.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void send(s)}
                className="rounded-full px-3.5 py-2 text-left text-sm font-medium ring-1 ring-ink/15 hover:bg-card"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => {
          if (m.role === "user") {
            return (
              <div key={i} className="ml-auto max-w-[85%] rounded-[20px] rounded-tr-md bg-ink px-4 py-3 text-[15px] text-paper">
                {m.content}
              </div>
            );
          }
          const reply = parseReply(m.content);
          const streaming = busy && i === messages.length - 1;
          return (
            <div key={i} className="max-w-[88%]">
              <div className="rounded-[20px] rounded-tl-md bg-card px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap">
                {reply.text || (streaming ? <span className="inline-block animate-pulse">…</span> : null)}
              </div>
              {!streaming && reply.enroll && (
                <Link href={reply.enroll.href} onClick={() => setOpen(false)} className={buttonClass("primary", "mt-2 min-h-10")}>
                  {t.enroll}
                </Link>
              )}
              {!streaming && reply.handoff && <Handoff t={t} />}
            </div>
          );
        })}

        {showHandoff && <Handoff t={t} />}
        {atLimit && <p className="text-sm text-ink-soft">{t.limit}</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="border-t border-ink/10 px-4 pt-3 pb-3"
      >
        <div className="flex items-end gap-2">
          <label className="sr-only" htmlFor="assistant-input">
            {t.placeholder}
          </label>
          <textarea
            id="assistant-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            maxLength={assistantLimits.maxMessageChars}
            disabled={atLimit}
            placeholder={t.placeholder}
            className="max-h-32 min-h-11 flex-1 resize-none rounded-[18px] bg-card px-4 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-ink disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={busy || atLimit || !input.trim()}
            aria-label={t.send}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-ink hover:bg-lime-hover disabled:opacity-40"
          >
            <ArrowUp className="size-5" />
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-ink-soft">
          {t.note}{" "}
          <Link href="/kvkk" className="underline underline-offset-2">
            {t.kvkk}
          </Link>
        </p>
      </form>
    </section>
  );
}
