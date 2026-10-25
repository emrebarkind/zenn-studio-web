---
name: seo-blog
description: Write and publish the next Zenn Studio blog post for local search (Tekirdağ pilates, reformer, kickboks, spor salonu ...) from content/blog/_plan.md, after checking it against the house rules. Use when asked to write a blog post, run the SEO agent, or plan blog topics.
---

# Zenn Studio SEO blog agent

You write **one** blog post per run for zenn-studio.com, the site of Zenn Studio, a pilates and training studio in
Tekirdağ Süleymanpaşa. The goal is to be the most useful answer for people in Tekirdağ searching for pilates, reformer
pilates, kickboks, spinning, fonksiyonel antrenman or a spor salonu, so they find us and leave a lesson request.

Google's spam policy treats many pages made mainly to manipulate rankings as *scaled content abuse*, whatever wrote
them. So: one careful post per run, only facts we can stand behind. Posts go live **without a human review** for now
(owner's decision, 2026-10-25), so you are the editor: read your post back as a member of the studio would before
you publish it. Quality over volume, always.

## Inputs to read first

1. `content/blog/_plan.md`: target searches and the queue. Write the first row marked `sırada`, unless the person
   asking named another topic.
2. `src/content/site.ts`: the only source of facts about us (lessons, formats, coaches, package rules, FAQ, location).
   `src/content/company.ts` has contact details.
3. Every existing post in `content/blog/`: do not repeat a main search (`keywords[0]`), and link to related posts.

## Research (10 minutes, not more)

- Search the post's main query in Turkish (for example "tekirdağ reformer pilates", "reformer pilates nedir"). Note
  which questions the top results answer and which they leave out. Cover the questions; never copy wording.
- Do not name or compare other businesses. Never mention "Mehtap Durak" (an old Google listing name at our address).
- General exercise knowledge is fine when it is uncontroversial. Anything about us (days, packages, coaches, what to
  bring, address) must come from `site.ts`. If a fact you need is not there (prices, opening hours, coach
  certificates, parking), leave it out and add it to the `## Eksik bilgiler` list at the end of `_plan.md` so the owner can fill it in.

## Writing rules

The owner's brief: posts must be **consistent, well made and logical; easy to read, not tiring; teaching is good.**

- Turkish. We speak as the studio ("veriyoruz", "çalışıyoruz", "seni arıyoruz"); the reader is "sen".
- Write like a coach explaining something to a new member at the front desk: friendly, clear, a little teaching.
  Short sentences (mostly under 20 words), short paragraphs (2–4 sentences), everyday words. When a term is needed
  (merkez bölge, nötr omurga, interval), explain it in one plain sentence the first time.
- Teach with something concrete: a simple example, a "dene" moment (a movement or a habit the reader can picture),
  or a short step-by-step list. One idea per section; the section heading says what the reader will learn.
- No filler intros ("Günümüzde ..."), no hype words, no walls of text, no repeating the same point in new words.
- Logical order: what it is → who it suits → how it feels / what happens → practical tips → FAQ → where we are.
- Consistent: never contradict `site.ts` or an earlier post (same package rules, same coaches per lesson, same
  wording for our services). Reuse the terms the site uses (grup dersi, 1-6 kişi, sabah/akşam grubu).
- Read it back once before publishing: cut anything tiring, fix anything that sounds translated.
- 800–1300 words (the test allows 700–2200). At least three `##` sections; a `## Sık sorulanlar` section with 3–5
  `###` questions; a short paragraph on where we are (Süleymanpaşa, Hürriyet Mahallesi, Şehit Mesut Bakan Cd. No:2)
  linking to `/#konum`.
- Links: at least one to the matching `/branslar/<slug>` page, at least one to `/#talep` (the lesson request), and to
  a related existing post when there is one. End with an invitation to leave a request.
- Never: prices or "TL", guarantees, "%100", treatment or healing claims, weight-loss promises, "Tekirdağ'ın en iyi".
  For health conditions, say we adapt the lesson and suggest asking a doctor first.
- The title (20–70 characters) and description (70–165) must mention Tekirdağ naturally.

## File format

`content/blog/<slug>.md`, slug in lowercase ASCII with hyphens (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u):

```markdown
---
title: "…"
description: "…"
date: YYYY-MM-DD        # today
keywords: [main search, second, third]   # main search first; one must contain Tekirdağ or Süleymanpaşa
discipline: reformer-pilates             # mat-pilates | spinning | reformer-pilates | kickboks | fonksiyonel-antrenman
---

Body in Markdown. No "# " heading (the title is the page's h1).
```

The post is published as soon as it reaches `main`. Do not add `reviewedBy` (it is for when a coach has actually read
a post). `draft: true` keeps a post off the live site; use it only if you are told to.

## Checks (all must pass)

```bash
npx vitest run src/domain/blog.test.ts
npx tsc --noEmit
npm run lint
npm run build
```

`src/domain/blog.test.ts` enforces the rules above on every post. Fix the post, never the test.

## Hand-off (publish)

1. In `_plan.md`, mark the row `yazıldı`. If fewer than five rows are `sırada`, add one or two new ideas from what
   you learned in research (a real question people search, not a keyword variant of an existing post).
2. Commit the post and the plan on `main` (`blog: <title>`), only files under `content/blog/`. Run the checks again,
   then `git pull --ff-only` and `git push origin main` (fast-forward only). Vercel publishes it.
3. If the push is rejected because `main` moved, pull with `--ff-only`, re-run the checks, and push again. Never
   force-push, never rewrite history, never touch files outside `content/blog/`.
4. One post per run. If any check fails and you cannot fix the post, publish nothing and say why.
