import { describe, expect, it } from "vitest";
import { writingHref } from "@/lib/writing";

describe("writingHref", () => {
  it("drops page=1 and empty tag for a clean canonical URL", () => {
    expect(writingHref(null, 1)).toBe("/writing");
    expect(writingHref("security", 1)).toBe("/writing?tag=security");
  });

  it("includes page when > 1, with the tag", () => {
    expect(writingHref(null, 3)).toBe("/writing?page=3");
    expect(writingHref("ai", 2)).toBe("/writing?tag=ai&page=2");
  });
});
