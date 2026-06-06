import { describe, expect, it } from "vitest";
import { PROJECTS } from "@/lib/content";
import { PROFILE } from "@/lib/profile";
import { PAGE_SEO, type PageKey } from "@/lib/seo/pages";
import { pageMetadata } from "@/lib/seo/metadata";

// These invariants guard the bug class we hit this session: project data
// drifting / missing showcase fields, SEO keys not resolving, identity copy
// duplicating the name. They fail loudly if a future edit breaks the shape.

describe("PROJECTS data invariants", () => {
  it.each(PROJECTS.map((p) => [p.id, p] as const))(
    "%s has valid showcase fields",
    (_id, p) => {
      expect(p.tagline.trim()).not.toBe("");
      expect(p.insight.trim()).not.toBe("");
      expect(p.status.trim()).not.toBe("");
      expect(["a", "s", "e"]).toContain(p.tint);
      // `*highlight*` markers must be balanced (even count of asterisks).
      expect((p.insight.split("*").length - 1) % 2).toBe(0);
    },
  );

  it("has unique ids", () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("PAGE_SEO invariants", () => {
  it.each(Object.keys(PAGE_SEO) as PageKey[])(
    "%s has an absolute path and builds without throwing",
    (key) => {
      expect(PAGE_SEO[key].path.startsWith("/")).toBe(true);
      const meta = pageMetadata(key);
      expect(meta.alternates?.canonical).toBe(PAGE_SEO[key].path);
    },
  );
});

describe("PROFILE invariants", () => {
  it("has the core identity fields", () => {
    for (const f of ["name", "role", "jobTitle", "brand", "resumePath"] as const) {
      expect(String(PROFILE[f]).trim()).not.toBe("");
    }
  });

  it("writingFeed.title is derived from the name (no duplicated literal drift)", () => {
    expect(PROFILE.writingFeed.title).toContain(PROFILE.name);
  });
});
