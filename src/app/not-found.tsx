import { ButtonLink, Container } from "@/components/ui";

/** Any unknown address: say so plainly and offer the two ways on. */
export default function NotFound() {
  return (
    <section className="pt-16 pb-28 sm:pt-24">
      {/* React hoists this into <head>, so the tab says what happened (Next already marks the page noindex). */}
      <title>Sayfa bulunamadı | Zenn Studio</title>
      <Container className="max-w-3xl">
        <p className="text-[clamp(5rem,18vw,10rem)] leading-none font-bold tracking-[-0.06em] text-ink/15 tabular-nums">404</p>
        <h1 className="mt-4 text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.04em]">Bu sayfa yok.</h1>
        <p className="mt-4 max-w-md text-lg text-ink-soft">Adres değişmiş ya da yanlış yazılmış olabilir. Dersleri ana sayfada bulabilirsin.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Ana sayfa</ButtonLink>
          <ButtonLink href="/#talep" variant="ghost">
            Ders talebi
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
