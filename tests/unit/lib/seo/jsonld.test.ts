import { describe, expect, it } from "vitest";
import { personJsonLd, articleJsonLd } from "@/lib/seo/jsonld";
import { makePost } from "@/lib/__fixtures__/post";

describe("personJsonLd", () => {
  it("emits a schema.org Person", () => {
    expect(personJsonLd()).toMatchSnapshot();
  });
});

describe("articleJsonLd", () => {
  it("emits a BlogPosting with absolute image + url", () => {
    expect(articleJsonLd(makePost(), "hello-world")).toMatchSnapshot();
  });

  it("omits wordCount when 0", () => {
    expect(articleJsonLd(makePost({ wordCount: 0 }), "s").wordCount).toBeUndefined();
  });

  it("dateModified falls back to publishedAt", () => {
    const jsonld = articleJsonLd(
      makePost({ updatedAt: "", publishedAt: "2026-06-01T00:00:00Z" }),
      "s",
    );
    expect(jsonld.dateModified).toBe("2026-06-01T00:00:00Z");
  });
});
