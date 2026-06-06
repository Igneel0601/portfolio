import { describe, expect, it } from "vitest";
import {
  pageMetadata,
  caseStudyMetadata,
  postMetadata,
} from "@/lib/seo/metadata";
import { PAGE_SEO, type PageKey } from "@/lib/seo/pages";
import { makePost } from "@/lib/__fixtures__/post";

describe("pageMetadata", () => {
  for (const key of Object.keys(PAGE_SEO) as PageKey[]) {
    it(`builds metadata for "${key}"`, () => {
      expect(pageMetadata(key)).toMatchSnapshot();
    });
  }
});

describe("caseStudyMetadata", () => {
  it("composes title + canonical from slug", () => {
    expect(
      caseStudyMetadata({ title: "CodeFlow", tagline: "AI builder." }, "codeflow"),
    ).toMatchSnapshot();
  });
});

describe("postMetadata", () => {
  it("builds title/description/canonical/og from a post", () => {
    expect(postMetadata(makePost(), "hello-world")).toMatchSnapshot();
  });

  it("falls back to post.title when metaTitle is absent", () => {
    expect(postMetadata(makePost({ metaTitle: null }), "hello-world").title).toBe(
      "Hello World",
    );
  });
});
