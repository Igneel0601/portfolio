// case-study-mdx/mdx-components.tsx
//
// the React component map for case-study .mdx files.
// every <Component> the .mdx uses must be exported here.
//
// usage with @next/mdx:
//   import { mdxComponents } from "@/case-study-mdx/mdx-components";
//   <MDXProvider components={mdxComponents}>...</MDXProvider>
//
// usage with `next-mdx-remote`:
//   <MDXRemote source={...} components={mdxComponents} />
//
// all class names map 1:1 to ./case-study.module.css.

import * as React from "react";
import styles from "./case-study.module.css";
import { slugify } from "./slug";
import { ZoomableImage } from "./ZoomableImage";

function nodeText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return nodeText(props.children);
  }
  return "";
}

/* ─── primitives ───────────────────────────────────────── */

/** A 3-bullet skim list. Use right under the `## tl;dr` heading. */
export function TLDR({ children }: { children: React.ReactNode }) {
  return <ul className={`${styles.tldr} t-lead`}>{children}</ul>;
}

/** A generic bulleted list with the › marker. Used for constraints, learned, next. */
export function Bullets({ children }: { children: React.ReactNode }) {
  return <ul className={`${styles.ul} t-lead`}>{children}</ul>;
}

/** Inline status tag — `<Tag>in progress</Tag>`. */
export function Tag({ children }: { children: React.ReactNode }) {
  return <span className={`${styles.inlineTag} l-tag`}>{children}</span>;
}

/* ─── figure / image placeholder ───────────────────────── */

type FigureProps = {
  src?: string;
  alt?: string;
  caption?: string;
  n?: string;              // figure number, e.g. "01"
  aspect?: "wide" | "tall" | "square";  // aspect-ratio class
  placeholder?: string;    // shown when src is missing or fails to load
};

export function Figure({ src, alt, caption, n, aspect, placeholder }: FigureProps) {
  const aspectClass = aspect ? styles[`aspect_${aspect}`] : styles.aspect_wide;
  const showPlaceholder = !src;

  return (
    <figure className={styles.figure}>
      {showPlaceholder ? (
        <div className={`${styles.imgPh} ${aspectClass}`}>
          <div className={styles.imgPhLbl}>
            <span className={`${styles.imgPhTag} l-meta`}>{n ? `[ image · ${n} ]` : "[ image ]"}</span>
            <span className={`${styles.imgPhDesc} l-meta`}>
              {placeholder || alt || "drop a screenshot here"}
            </span>
          </div>
        </div>
      ) : (
        <img
          className={`${styles.figureImg} ${aspectClass}`}
          src={src}
          alt={alt || ""}
          loading="lazy"
        />
      )}
      {caption && (
        <figcaption className={`${styles.caption} c-sm`}>
          fig. {n && <span className={styles.captionN}>{n}</span>} · {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ─── ASCII architecture diagram ───────────────────────── */

export function AsciiDiagram({
  children,
  art,
  caption,
  n,
}: {
  children?: React.ReactNode;
  art?: string;
  caption?: string;
  n?: string;
}) {
  return (
    <figure className={styles.figure}>
      <div className={styles.code}>
        <div className={`${styles.codeHead} l-meta`}>
          <span>diagram</span>
          <span className={`${styles.codeLang} l-meta`}>ascii</span>
        </div>
        <pre className={`${styles.codePre} c-md`}>{art ?? children}</pre>
      </div>
      {caption && (
        <figcaption className={`${styles.caption} c-sm`}>
          fig. {n && <span className={styles.captionN}>{n}</span>} · {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ─── code block ───────────────────────────────────────── */

export function Code({
  children,
  file,
  lang = "typescript",
  caption,
  n,
}: {
  children: React.ReactNode;
  file?: string;
  lang?: string;
  caption?: string;
  n?: string;
}) {
  return (
    <figure className={styles.figure}>
      <div className={styles.code}>
        <div className={`${styles.codeHead} l-meta`}>
          <span>{file || "snippet"}</span>
          <span className={`${styles.codeLang} l-meta`}>{lang}</span>
        </div>
        <pre className={`${styles.codePre} c-md`}>{children}</pre>
      </div>
      {caption && (
        <figcaption className={`${styles.caption} c-sm`}>
          snippet {n && <span className={styles.captionN}>{n}</span>} · {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ─── numbered decision card ───────────────────────────── */

export function Decision({
  n,
  picked,
  rejected,
  children,
}: {
  n: string;
  picked: string;
  rejected?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.decision} t-body`}>
      <span className={`${styles.decisionNum} c-sm`}>{n}</span>
      <div className={styles.decisionBody}>
        <h3 className={`${styles.decisionH} t-h5`}>
          <span className={styles.picked}>{picked}</span>
          {rejected && (
            <>
              <span className={styles.vs}>vs.</span>
              <span className={styles.rejected}>{rejected}</span>
            </>
          )}
        </h3>
        <div className={styles.decisionP}>{children}</div>
      </div>
    </div>
  );
}

/* ─── walkthrough step grid ────────────────────────────── */

export function Steps({ children }: { children: React.ReactNode }) {
  return <div className={styles.steps}>{children}</div>;
}

export function Step({
  n,
  label,
  hint,
  children,
}: {
  n: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.step}>
      <div className={`${styles.stepLabel} c-sm`}>
        <span className={styles.stepN}>{n}.</span>
        <span>{label}</span>
        {hint && <span className={styles.stepHint}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ─── stats grid ───────────────────────────────────────── */

export function Stats({ children }: { children: React.ReactNode }) {
  return <div className={styles.stats}>{children}</div>;
}

export function Stat({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <div className={`${styles.stat} c-md`}>
      <div className={`${styles.statV} t-h3`}>
        {value}
        {unit && <span className={`${styles.statUnit} t-sm`}>{unit}</span>}
      </div>
      <div className={`${styles.statK} l-meta`}>{label}</div>
    </div>
  );
}

/* ─── frontmatter renderer (for top of page) ───────────── */
//
// not invoked from inside .mdx — call this in your page layout
// with the parsed frontmatter object.

type FrontmatterData = {
  title?: string;
  tagline?: string;
  role?: string;
  status?: string;
  timeline?: React.ReactNode;
  commits?: React.ReactNode;
  stack?: string[];
  infra?: string[];
  notes?: string[];
  slug?: string;
};

export function Frontmatter({ data }: { data: FrontmatterData }) {
  const rows: [string, React.ReactNode][] = [
    ["project", <span key="project" className={styles.fmStr}>&quot;{data.title}&quot;</span>],
    ["tagline", <span key="tagline" className={styles.fmStr}>&quot;{data.tagline}&quot;</span>],
    ["role", <span key="role" className={styles.fmStr}>&quot;{data.role}&quot;</span>],
    ["status", <span key="status" className={styles.fmStr}>&quot;{data.status}&quot;</span>],
    ["timeline", <React.Fragment key="timeline">{data.timeline}</React.Fragment>],
    ["commits", <span key="commits" className={styles.fmNum}>{data.commits}</span>],
    ["stack", <React.Fragment key="stack">{(data.stack || []).join(" · ")}</React.Fragment>],
    ["infra", <React.Fragment key="infra">{(data.infra || []).join(" · ")}</React.Fragment>],
  ];
  if (Array.isArray(data.notes) && data.notes.length > 0) {
    rows.push([
      "notes",
      <span key="notes" className={styles.fmNotes}>
        {(data.notes as string[]).map((n, i) => (
          <span key={i} className={styles.fmNote}>{n}</span>
        ))}
      </span>,
    ]);
  }
  return (
    <div className={`${styles.frontmatter} c-md`}>
      <div className={`${styles.fmBar} l-meta`}>
        --- <span style={{ marginLeft: "auto" }}>{data.slug}.yaml</span>
      </div>
      <div className={styles.fmBody}>
        {rows.map(([k, v]) => (
          <div className={styles.fmRow} key={k}>
            <span className={styles.fmK}>{k}</span>
            <span className={styles.fmV}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── default markdown elements (h2, p, code, etc) ─────── */
//
// the MDX renderer maps `## heading` → <h2>. we wrap with our
// numbered-section style. you can extend this for h3, blockquote, etc.

export function makeH2(counter: { n: number }) {
  return function H2({ children, id }: { children: React.ReactNode; id?: string }) {
    counter.n += 1;
    const idx = String(counter.n).padStart(2, "0");
    const resolvedId = id ?? slugify(nodeText(children));
    return (
      <h2 className={`${styles.h2} t-h3`} id={resolvedId} data-toc-section={resolvedId}>
        <span className={`${styles.h2N} l-meta`}>{idx}</span>
        <span className={styles.h2Hash}>#</span>
        <span>{children}</span>
      </h2>
    );
  };
}

/** Build the full component map. Call once per page render. */
export function buildMdxComponents() {
  const counter = { n: 0 };
  return {
    h2: makeH2(counter),
    p:  (props: React.ComponentPropsWithoutRef<"p">) => <p className={`${styles.lede} t-lead`} {...props} />,
    ul: (props: React.ComponentPropsWithoutRef<"ul">) => <ul className={`${styles.mdUl} t-lead`} {...props} />,
    code: (props: React.ComponentPropsWithoutRef<"code">) => <code className={`${styles.inlineCode} c-md`} {...props} />,
    pre: (props: React.ComponentPropsWithoutRef<"pre">) => <pre className={`${styles.codeBlock} c-md`} {...props} />,
    a: (props: React.ComponentPropsWithoutRef<"a">) => <a className={styles.link} {...props} />,

    // custom components used in mdx
    TLDR,
    Bullets,
    Tag,
    Figure,
    AsciiDiagram,
    ZoomableImage,
    Code,
    Decision,
    Steps,
    Step,
    Stats,
    Stat,
    Frontmatter,
  };
}

// shorthand if you don't need the auto-numbered h2 counter:
export const mdxComponents = {
  TLDR, Bullets, Tag, Figure, AsciiDiagram, Code,
  Decision, Steps, Step, Stats, Stat, Frontmatter,
};
