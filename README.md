# zenn-studio.com

Public website for Zenn Studio: disciplines, online training, packages, a
"find your class" quiz and pre-registration. Independent of the studio CRM —
no shared database.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Where things live

- `src/content/site.ts` — all copy and business facts (disciplines, coaches,
  plans and prices, FAQ, contact). `null` fields render a neutral fallback;
  fill them in before launch.
- `src/domain/matcher.ts` — quiz questions and the recommendation rule.
- `src/domain/registration.ts` — pre-registration schema (Zod) and payment
  options. Card payment (iyzico) is shown as "Yakında" and cannot be chosen.
- `src/app/kayit/actions.ts` — server action: validates, optionally POSTs to
  `REGISTRATION_WEBHOOK_URL`, returns a reference + WhatsApp hand-off.

## Before launch

1. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` and/or `REGISTRATION_WEBHOOK_URL`
   (see `.env.example`). With neither set, pre-registrations reach nobody.
2. Fill address/phone/e-mail, coach details and prices in `src/content/site.ts`.
3. Replace the draft text in `src/app/kvkk/page.tsx`.
