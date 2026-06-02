import { describe, expect, it } from "vitest";
import { listWorkRows } from "@/lib/work-rows";
import { PROJECTS } from "@/lib/content";

const STATUSES = ["active", "wip", "archived", "dead"];
const TAGS = ["product", "event", "tool", "next"];
const RANK: Record<string, number> = { active: 0, wip: 1, archived: 2, dead: 3 };

describe("listWorkRows", () => {
  it("returns rows with valid status/tag unions", async () => {
    const rows = await listWorkRows();
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) {
      expect(STATUSES).toContain(r.status);
      expect(TAGS).toContain(r.tag);
      expect(r.name.trim()).not.toBe("");
    }
  });

  it("represents every case-study project as a linkable row", async () => {
    const slugs = new Set((await listWorkRows()).map((r) => r.slug).filter(Boolean));
    for (const p of PROJECTS) {
      expect(slugs.has(p.id)).toBe(true);
    }
  });

  it("is bucketed active → wip → archived → dead", async () => {
    const ranks = (await listWorkRows()).map((r) => RANK[r.status]);
    const sorted = [...ranks].sort((a, b) => a - b);
    expect(ranks).toEqual(sorted);
  });
});
