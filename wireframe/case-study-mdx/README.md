# case-study-mdx

Drop-in scaffold for MDX-authored case studies in `igneel.dev`.

```
case-study-mdx/
├── _template.mdx           ← copy this for each new case study
├── mdx-components.tsx       ← React component map
├── case-study.module.css    ← styles (matches site terminal theme)
└── README.md                ← you are here
```

## quickstart

```bash
# from your Next.js project root
pnpm add @next/mdx @mdx-js/react @mdx-js/loader gray-matter
```

Drop `mdx-components.tsx` and `case-study.module.css` into `components/case-study/`.

Add the route:

```tsx
// app/work/[slug]/page.tsx
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents, Frontmatter } from "@/components/case-study/mdx-components";

export default async function CaseStudy({ params }: { params: { slug: string } }) {
  const file = await fs.readFile(
    path.join(process.cwd(), "content/case-studies", `${params.slug}.mdx`),
    "utf-8",
  );
  const { content, data } = matter(file);

  return (
    <article>
      <h1>{data.title}</h1>
      <p>{data.tagline}</p>
      <Frontmatter data={data} />
      <MDXRemote source={content} components={mdxComponents} />
    </article>
  );
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "content/case-studies");
  const files = await fs.readdir(dir);
  return files
    .filter(f => f.endsWith(".mdx") && !f.startsWith("_"))
    .map(f => ({ slug: f.replace(".mdx", "") }));
}
```

## authoring a new case study

1. `cp _template.mdx content/case-studies/my-project.mdx`
2. Fill in frontmatter (everything between the `---` lines).
3. Walk top-to-bottom replacing `[REPLACE: ...]` labels and lorem ipsum.
4. Drop screenshots in `public/case/my-project/` matching the paths in `<Figure src=...>` calls.
5. Delete sections that don't apply (small project? drop `## deep dive`).
6. Ship.

## components reference

| component | when to use |
|---|---|
| `<TLDR>` | 3-bullet skim list right after `## tl;dr` |
| `<Bullets>` | constraints, what-i-learned, what's-next |
| `<Tag>in progress</Tag>` | inline status pill |
| `<Figure src caption n placeholder>` | image with caption + placeholder fallback |
| `<AsciiDiagram caption n>` | architecture diagram in a `<pre>` block |
| `<Code file lang caption n>` | code block with header chrome |
| `<Decision n picked rejected>` | numbered tradeoff card |
| `<Steps>` + `<Step n label hint>` | walkthrough grid |
| `<Stats>` + `<Stat value unit label>` | 4-up metrics row |
| `<Frontmatter data>` | renders the YAML header (call from page layout, not MDX) |

## frontmatter schema

Validate with Zod at build time so you can't ship a half-finished case study:

```ts
// lib/case-study-schema.ts
import { z } from "zod";

export const caseStudyMeta = z.object({
  slug:        z.string(),
  title:       z.string(),
  tagline:     z.string().max(120),
  role:        z.string(),
  status:      z.enum(["live", "archived", "wip", "shipped"]).or(z.string()),
  timeline:    z.string(),
  commits:     z.number().int().nonnegative(),
  order:       z.number().int(),
  stack:       z.array(z.string()),
  infra:       z.array(z.string()).optional(),
  links:       z.object({
    live:  z.string().url().optional(),
    repo:  z.string().url().optional(),
    demo:  z.string().url().optional(),
    rfc:   z.string().optional(),
  }),
  cover:       z.string().optional(),
});
```

## placeholder convention

Until real screenshots exist, `<Figure>` falls back to a striped placeholder
showing `[ image · NN ]` + a one-line description of what should go there.
Drop the file at the `src` path and it'll swap in automatically.

## why MDX vs raw HTML

- Author in prose, not divs.
- Adding a project = duplicate one file, not maintain 900 lines of HTML.
- Custom components keep the design consistent across case studies.
- Frontmatter doubles as the data source for the `/work` index.

## adjacent pages

- `/work` — index, reads frontmatter from every case study, sorts by `order`.
- `/work/[slug]` — this page.
- The prev/next pager auto-generates from `order`.
