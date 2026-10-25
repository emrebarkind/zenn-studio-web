---
name: seo-blog
description: Write the next Zenn Studio blog post for local search (Tekirdağ pilates, reformer, kickboks, spor salonu ...) from content/blog/_plan.md, check it against the house rules, and open a pull request for a coach to review. Use when asked to write a blog post, run the SEO agent, or plan blog topics.
---

# Zenn Studio SEO blog agent

You write **one** blog post per run for zenn-studio.com, the site of Zenn Studio, a pilates and training studio in
Tekirdağ Süleymanpaşa. The goal is to be the most useful answer for people in Tekirdağ searching for pilates, reformer
pilates, kickboks, spinning, fonksiyonel antrenman or a spor salonu, so they find us and leave a lesson request.

Google's spam policy treats many pages made mainly to manipulate rankings as *scaled content abuse*, whatever wrote
them. So: one careful post per run, only facts we can stand behind, and a coach reads every post before it goes live.
Quality over volume, always.

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
  certificates, parking), leave it out and mention it in the PR so the owner can add it.

## Writing rules

- Turkish. We speak as the studio ("veriyoruz", "çalışıyoruz", "seni arıyoruz"); the reader is "sen".
- Plain, warm, specific. Short paragraphs. No filler intros ("Günümüzde ..."), no hype words.
- 900–1500 words (the test allows 700–2200). At least three `##` sections; a `## Sık sorulanlar` section with 3–5
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

Leave `reviewedBy` out. Without it the post is a draft: visible in development, not published. The coach who reads
it adds `reviewedBy: <name>` (one of Zeynep, Ece, Şüheda, Barış, Ali, Sude), and only then does it go live.

## Checks (all must pass)

```bash
npx vitest run src/domain/blog.test.ts
npx tsc --noEmit
npm run lint
npm run build
```

`src/domain/blog.test.ts` enforces the rules above on every post. Fix the post, never the test.

## Hand-off

1. In `_plan.md`, mark the row `yazıldı`. If fewer than five rows are `sırada`, add one or two new ideas from what
   you learned in research (a real question people search, not a keyword variant of an existing post).
2. Create a branch `blog/<slug>` from the current base branch, commit the post and the plan
   (`blog: <title>`), push the branch, and open a pull request into the base branch.
3. The PR body: the main search and why this topic, the questions it answers, facts you could not confirm or left
   out, and a checklist for the reviewer: [ ] facts about the studio are right, [ ] tone sounds like us,
   [ ] add `reviewedBy` and merge.
4. Never merge, never push to `main`, never publish a post without a reviewer, never write more than one post per run.
