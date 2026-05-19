import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type WorkStatus = "active" | "wip" | "archived" | "dead";
export type WorkTag = "product" | "event" | "tool" | "next";

export type WorkRow = {
  status: WorkStatus;
  tag: WorkTag;
  name: string;
  blurb: string;
  slug?: string;
  order: number;
};

const DIR = path.join(process.cwd(), "content/case-studies");

const EXTRAS: WorkRow[] = [
  {
    status: "active",
    tag: "tool",
    name: "wall-engine",
    blurb: "wallpaper switcher I built because I kept breaking the last one.",
    order: 10,
  },
  {
    status: "archived",
    tag: "tool",
    name: "arch-install",
    blurb: "scripted my Arch setup. now it breaks less. I think.",
    order: 11,
  },
  {
    status: "wip",
    tag: "next",
    name: "…",
    blurb: "writing the README first this time.",
    order: 99,
  },
];

export async function listWorkRows(): Promise<WorkRow[]> {
  const files = await fs.readdir(DIR);
  const fromCaseStudies = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(DIR, f), "utf-8");
        const { data } = matter(raw);
        const slug = f.replace(/\.mdx$/, "");
        return {
          status: (data.indexStatus as WorkStatus) ?? "archived",
          tag: (data.tag as WorkTag) ?? "product",
          name: slug,
          blurb: (data.blurb as string) ?? (data.tagline as string) ?? "",
          slug,
          order: (data.order as number) ?? 999,
        } satisfies WorkRow;
      }),
  );
  return [...fromCaseStudies, ...EXTRAS].sort((a, b) => a.order - b.order);
}

export const WORK_TAGS = ["all", "product", "event", "tool", "next"] as const;
export type WorkFilter = (typeof WORK_TAGS)[number];
