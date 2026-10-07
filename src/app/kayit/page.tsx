import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui";
import { RegistrationForm } from "./registration-form";

export const metadata: Metadata = {
  title: "Ön kayıt",
  description: "Branşını, formatını ve paketini seç; antrenörümüz ilk dersini planlamak için seni arasın.",
};

export default function RegistrationPage() {
  return (
    <section className="pt-12 pb-24 sm:pt-20">
      <Container className="max-w-3xl">
        <h1 className="font-display text-[clamp(2.75rem,8vw,5rem)] leading-[0.92] font-extrabold tracking-[-0.05em]">
          Ön kayıt
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft">
          İki dakika sürer. Ödeme şimdi alınmaz; antrenörümüz seni arayıp ilk dersini birlikte planlar.
        </p>
        <div className="mt-12">
          <Suspense fallback={<div className="h-96 rounded-3xl bg-stone" aria-busy />}>
            <RegistrationForm />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
