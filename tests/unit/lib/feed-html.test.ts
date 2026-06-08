import { describe, it, expect } from "vitest";
import { lexicalToHtml } from "@/lib/feed-html";
import type { LexicalContent } from "@/lib/posts";

const SITE = "https://vergnyx.dev";

function doc(...children: unknown[]): LexicalContent {
  return { root: { type: "root", children } } as LexicalContent;
}

describe("lexicalToHtml", () => {
  it("returns empty string for missing content", () => {
    expect(lexicalToHtml(null, SITE)).toBe("");
    expect(lexicalToHtml(undefined, SITE)).toBe("");
  });

  it("wraps paragraph text in <p> and escapes HTML", () => {
    const html = lexicalToHtml(
      doc({ type: "paragraph", children: [{ type: "text", text: "a < b & c" }] }),
      SITE,
    );
    expect(html).toBe("<p>a &lt; b &amp; c</p>");
  });

  it("applies text format bitmask (bold+code)", () => {
    const html = lexicalToHtml(
      doc({
        type: "paragraph",
        children: [
          { type: "text", text: "x", format: 1 }, // bold
          { type: "text", text: "y", format: 16 }, // code
        ],
      }),
      SITE,
    );
    expect(html).toBe("<p><strong>x</strong><code>y</code></p>");
  });

  it("renders headings with their tag", () => {
    const html = lexicalToHtml(
      doc({ type: "heading", tag: "h2", children: [{ type: "text", text: "Hi" }] }),
      SITE,
    );
    expect(html).toBe("<h2>Hi</h2>");
  });

  it("renders ordered and unordered lists", () => {
    const html = lexicalToHtml(
      doc({
        type: "list",
        listType: "number",
        children: [
          { type: "listitem", children: [{ type: "text", text: "one" }] },
          { type: "listitem", children: [{ type: "text", text: "two" }] },
        ],
      }),
      SITE,
    );
    expect(html).toBe("<ol><li>one</li><li>two</li></ol>");
  });

  it("absolutizes internal links and passes external through", () => {
    const internal = lexicalToHtml(
      doc({
        type: "paragraph",
        children: [
          {
            type: "link",
            fields: { linkType: "internal", doc: { value: { slug: "foo" } } },
            children: [{ type: "text", text: "foo" }],
          },
        ],
      }),
      SITE,
    );
    expect(internal).toBe(`<p><a href="${SITE}/writing/foo">foo</a></p>`);

    const external = lexicalToHtml(
      doc({
        type: "paragraph",
        children: [
          {
            type: "link",
            fields: { url: "https://example.com" },
            children: [{ type: "text", text: "ex" }],
          },
        ],
      }),
      SITE,
    );
    expect(external).toBe(`<p><a href="https://example.com">ex</a></p>`);
  });

  it("renders code blocks as <pre><code> with raw (escaped) text", () => {
    const html = lexicalToHtml(
      doc({
        type: "code",
        language: "ts",
        children: [
          { type: "text", text: "const a = 1 < 2" },
          { type: "linebreak" },
          { type: "text", text: "return a" },
        ],
      }),
      SITE,
    );
    expect(html).toBe(
      '<pre><code class="language-ts">const a = 1 &lt; 2\nreturn a</code></pre>',
    );
  });

  it("renders an upload as an absolutized <figure><img>", () => {
    const html = lexicalToHtml(
      doc({
        type: "upload",
        value: { url: "/api/media/file/pic.png", alt: "shot" },
      }),
      SITE,
    );
    expect(html).toBe(
      `<figure><img src="${SITE}/api/bloggz-media/pic.png" alt="shot" /></figure>`,
    );
  });

  it("unwraps a paragraph whose only child is an upload", () => {
    const html = lexicalToHtml(
      doc({
        type: "paragraph",
        children: [{ type: "upload", value: { url: "/api/media/file/x.png", alt: "" } }],
      }),
      SITE,
    );
    expect(html).toBe(
      `<figure><img src="${SITE}/api/bloggz-media/x.png" alt="" /></figure>`,
    );
  });
});
