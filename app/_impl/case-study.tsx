import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import {
  buildMdxComponents,
  Frontmatter,
} from "@/components/case-study/mdx-components";
import { MoveUpRight } from "lucide-react";
import { Breadcrumb } from "@/components/case-study/Breadcrumb";
import { Toc } from "@/components/case-study/Toc";
import { Pager } from "@/components/case-study/Pager";
import { StudyFooter } from "@/components/case-study/StudyFooter";
import { slugify } from "@/components/case-study/slug";
import { listCaseStudies, getNeighbors } from "@/lib/case-studies";
import { caseStudyMetadata } from "@/lib/seo/metadata";

const CASE_DIR = path.join(process.cwd(), "content/case-studies");

async function loadCase(slug: string) {
  try {
    const file = await fs.readFile(path.join(CASE_DIR, `${slug}.mdx`), "utf-8");
    const { content, data } = matter(file);
    return { content, data };
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const all = await listCaseStudies();
  return all.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loaded = await loadCase(slug);
  if (!loaded) return { title: "Not found" };
  return caseStudyMetadata(
    loaded.data as { title: string; tagline?: string },
    slug,
  );
}

export async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loaded = await loadCase(slug);
  if (!loaded) notFound();
  const { content, data } = loaded;

  const { prev, next } = await getNeighbors(slug);

  const tocItems = [...content.matchAll(/^## (.+)$/gm)].map((m, i) => {
    const title = m[1].trim();
    return {
      n: String(i + 1).padStart(2, "0"),
      title,
      id: slugify(title),
    };
  });

  return (
    <>
      <main className="page-shell">
        <div className="cs-doc">
          <article className="cs-content">
            <Breadcrumb section="work" file={`${slug}.md`} />

            <h1 className="cs-hero-title t-display">
              {data.title}
              <span className="acc">.</span>
            </h1>
            {data.tagline && <p className="cs-hero-tag t-lead">{data.tagline}</p>}

            {(data.links?.live || data.links?.repo) && (
              <div className="cs-hero-actions">
                {data.links.live && (
                  <a
                    className="cs-pill c-sm no-pop"
                    href={data.links.live}
                    target="_blank"
                    rel="noopener"
                  >
                    <span className="live">●</span> live ·{" "}
                    {data.links.live.replace(/^https?:\/\//, "").replace(/\/$/, "")}{" "}
                    <MoveUpRight className="i-xs ext" aria-hidden />
                  </a>
                )}
                {data.links.repo && (
                  <a
                    className="cs-pill c-sm no-pop"
                    href={data.links.repo}
                    target="_blank"
                    rel="noopener"
                  >
                    $ git source <MoveUpRight className="i-xs ext" aria-hidden />
                  </a>
                )}
              </div>
            )}

            <Frontmatter data={data} />

            {/* Both TOC variants render; CSS shows the inline copy below 60rem
                and the sidebar copy at/above 60rem — the same single cutoff,
                so exactly one is ever visible. TocHighlight (mounted by the
                sidebar) updates both copies via querySelectorAll. */}
            <Toc items={tocItems} variant="inline" />

            <MDXRemote source={content} components={buildMdxComponents()} />

            <Pager prev={prev} next={next} />
          </article>

          <Toc items={tocItems} variant="sidebar" />
        </div>
      </main>
      <StudyFooter slug={slug} />
    </>
  );
}
