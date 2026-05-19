import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content/case-studies");

export type StudyMeta = {
  slug: string;
  title: string;
  tagline?: string;
  order: number;
};

export async function listCaseStudies(): Promise<StudyMeta[]> {
  const files = await fs.readdir(DIR);
  const metas = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(DIR, f), "utf-8");
        const { data } = matter(raw);
        return {
          slug: f.replace(/\.mdx$/, ""),
          title: data.title as string,
          tagline: data.tagline as string | undefined,
          order: (data.order as number) ?? 999,
        };
      }),
  );
  return metas.sort((a, b) => a.order - b.order);
}

export async function getNeighbors(slug: string) {
  const all = await listCaseStudies();
  const idx = all.findIndex((m) => m.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null,
  };
}
