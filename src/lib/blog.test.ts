import { describe, expect, it } from "vitest";
import { renderPost, safeHref } from "./blog";
import type { Post } from "@/domain/blog";

const post = (body: string) => ({ body }) as Post;

describe("blog post rendering (posts go live without review)", () => {
  it("shows raw HTML as text instead of running it", () => {
    const html = renderPost(post('Merhaba <script>alert(1)</script>\n\n<img src=x onerror="alert(1)">'));
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
  });

  it("drops javascript: and data: links but keeps our own and the web", () => {
    const html = renderPost(post("[a](javascript:alert(1)) [b](data:text/html,x) [c](/branslar/kickboks) [d](https://example.com)"));
    expect(html).not.toMatch(/href="(javascript|data):/i);
    expect(html).toContain('href="/branslar/kickboks"');
    expect(html).toContain('href="https://example.com"');
  });

  it("knows a safe link", () => {
    expect(safeHref("/#talep")).toBe(true);
    expect(safeHref("//evil.example")).toBe(false);
    expect(safeHref(" JavaScript:alert(1)")).toBe(false);
  });
});
