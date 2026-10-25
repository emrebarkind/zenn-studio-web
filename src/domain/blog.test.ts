import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parsePost, postProblems, wordCount } from "./blog";

const words = (n: number) => Array.from({ length: n }, () => "kelime").join(" ");

function post(body: string, front: Record<string, string> = {}) {
  const fm = {
    title: '"Tekirdağ\'da reformer pilatese başlamak"',
    description: '"Tekirdağ Süleymanpaşa\'daki stüdyomuzda reformer pilatese nasıl başlandığını ve ilk derste neler olduğunu anlatıyoruz."',
    date: "2026-10-25",
    keywords: "[tekirdağ reformer pilates, reformer pilates nedir]",
    ...front,
  };
  const head = Object.entries(fm)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return parsePost("deneme", `---\n${head}\n---\n${body}`);
}

const good = `## Bir\n${words(300)}\n\n## İki\n${words(300)}\n\n## Üç\n${words(150)} [Reformer](/branslar/reformer-pilates) ve [talep](/#talep).`;

describe("parsePost", () => {
  it("reads the frontmatter, lists included; a post is live unless it says draft: true", () => {
    const p = post(good);
    expect(p.keywords).toEqual(["tekirdağ reformer pilates", "reformer pilates nedir"]);
    expect(p.draft).toBe(false);
    expect(post(good, { draft: "true" }).draft).toBe(true);
  });

  it("refuses a reviewer who is not one of our coaches", () => {
    expect(() => post(good, { reviewedBy: "Ayşe" })).toThrow(/reviewedBy/);
  });

  it("refuses a malformed date", () => {
    expect(() => post(good, { date: "25.10.2026" })).toThrow(/date/);
  });
});

describe("postProblems", () => {
  it("passes a post that follows the house rules", () => {
    expect(postProblems(post(good))).toEqual([]);
  });

  it("asks for length, headings and the two links", () => {
    const problems = postProblems(post(`## Tek\n${words(100)}`));
    expect(problems.join(" | ")).toMatch(/700 kelime/);
    expect(problems.join(" | ")).toMatch(/3 ara başlık/);
    expect(problems.join(" | ")).toMatch(/ders talebine/);
    expect(problems.join(" | ")).toMatch(/branş sayfasına/);
  });

  it("refuses prices, guarantees and health or weight-loss promises", () => {
    const p = (extra: string) => postProblems(post(`${good}\n\n${extra}`));
    expect(p("Aylık 1.500 TL.")).toContain("fiyat yazma; fiyatı telefonda paylaşıyoruz");
    expect(p("Sonuç garantili.")).toContain("sonuç garantisi verme");
    expect(p("Bel fıtığını tedavi eder.").join()).toMatch(/tedavi/);
    expect(p("Ayda 5 kilo verirsin.").join()).toMatch(/kilo/);
    expect(p("Tekirdağ'ın en iyi stüdyosu.").join()).toMatch(/üstünlük/);
  });

  it("counts words without link targets", () => {
    expect(wordCount("[iki kelime](/branslar/kickboks) daha")).toBe(3);
  });
});

// The guard that keeps the SEO agent honest: every file in content/blog must pass.
describe("content/blog", () => {
  const dir = path.join(process.cwd(), "content", "blog");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_")) : [];

  it.each(files)("%s follows the house rules", (file) => {
    const p = parsePost(file.replace(/\.md$/, ""), fs.readFileSync(path.join(dir, file), "utf8"));
    expect(file).toMatch(/^[a-z0-9-]+\.md$/);
    expect(postProblems(p)).toEqual([]);
  });

  it("has no two posts on the same main search", () => {
    const main = files.map((f) => parsePost(f, fs.readFileSync(path.join(dir, f), "utf8")).keywords[0]);
    expect(new Set(main).size).toBe(main.length);
  });
});
