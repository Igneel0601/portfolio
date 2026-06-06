import "@/app/case-study.css";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { buildMdxComponents } from "@/components/case-study/mdx-components";
import { Toc } from "@/components/case-study/Toc";
import { slugify } from "@/components/case-study/slug";

export const metadata = {
  title: "case study v2 — Experiments — Vaibhav Verma",
  description: "Trial: 65ch prose with figures breaking out wider.",
};

const CASE_DIR = path.join(process.cwd(), "content/case-studies");
const SAMPLE_SLUG = "codeflow"; // borrowed real case study for layout testing

export default async function CaseStudyV2() {
  let file: string;
  try {
    file = await fs.readFile(path.join(CASE_DIR, `${SAMPLE_SLUG}.mdx`), "utf-8");
  } catch {
    notFound();
  }
  const { content, data } = matter(file);

  const tocItems = [...content.matchAll(/^## (.+)$/gm)].map((m, i) => {
    const title = m[1].trim();
    return {
      n: String(i + 1).padStart(2, "0"),
      title,
      id: slugify(title),
    };
  });

  return (
    <main className="flex-1 page-shell pt-[clamp(1.25rem,2.5vw,1.75rem)]">
      <style>{`
        .exp-content [class*="steps"] {
          grid-template-columns: 1fr !important;
        }
      `}</style>
      <div className="exp-doc">
        <article className="exp-content">
          <div className="l-eyebrow" style={{ color: "var(--ink-dim)" }}>
            experiment · /experiments/case-study-v2 · borrowed: {SAMPLE_SLUG}.mdx
          </div>

          <h1 className="t-display" style={{ marginTop: "0.5rem" }}>
            {data.title}
            <span style={{ color: "var(--accent)" }}>.</span>
          </h1>
          {data.tagline && (
            <p className="t-lead" style={{ color: "var(--ink-soft)", marginTop: "1rem" }}>
              {data.tagline}
            </p>
          )}

          <MDXRemote source={content} components={buildMdxComponents()} />
        </article>

        <Toc items={tocItems} variant="sidebar" />
      </div>
    </main>
  );
}
