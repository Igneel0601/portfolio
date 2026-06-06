import { describe, expect, it } from "vitest";
import { resolveMediaUrl } from "@/lib/media";

describe("resolveMediaUrl", () => {
  it("returns null for empty input", () => {
    expect(resolveMediaUrl(null)).toBeNull();
    expect(resolveMediaUrl(undefined)).toBeNull();
    expect(resolveMediaUrl("")).toBeNull();
  });

  it("rewrites a relative bloggz media path to the local proxy", () => {
    expect(resolveMediaUrl("/api/media/file/x.png")).toBe("/api/bloggz-media/x.png");
  });

  it("rewrites an absolute bloggz media url to the local proxy", () => {
    expect(resolveMediaUrl("http://localhost:3001/api/media/file/y.png")).toBe(
      "/api/bloggz-media/y.png",
    );
  });

  it("passes through a non-bloggz absolute url unchanged", () => {
    expect(resolveMediaUrl("https://cdn.example.com/z.png")).toBe(
      "https://cdn.example.com/z.png",
    );
  });

  it("drops a bare relative path (next/image would throw)", () => {
    expect(resolveMediaUrl("media/x.png")).toBeNull();
  });

  // Documents CURRENT behavior for protocol-relative urls (todo §5.2 — not yet
  // special-cased). Update this test when §5.2 lands.
  it("does not yet treat protocol-relative urls as absolute", () => {
    const out = resolveMediaUrl("//cdn.example.com/x.png");
    expect(out).not.toBe("//cdn.example.com/x.png");
  });
});
