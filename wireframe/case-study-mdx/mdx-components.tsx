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

/* ─── primitives ───────────────────────────────────────── */

/** A 3-bullet skim list. Use right under the `## tl;dr` heading. */
export function TLDR({ children }: { children: React.ReactNode }) {
  return <ul className={styles.tldr}>{children}</ul>;
}

/** A generic bulleted list with the › marker. Used for constraints, learned, next. */
export function Bullets({ children }: { children: React.ReactNode }) {
  return <ul className={styles.ul}>{children}</ul>;
}

/** Inline status tag — `<Tag>in progress</Tag>`. */
export function Tag({ children }: { children: React.ReactNode }) {
  return <span className={styles.inlineTag}>{children}</span>;
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
  const [errored, setErrored] = React.useState(false);
  const showPlaceholder = !src || errored;
  const aspectClass = aspect ? styles[`aspect_${aspect}`] : styles.aspect_wide;

  return (
    <figure className={styles.figure}>
      {showPlaceholder ? (
        <div className={`${styles.imgPh} ${aspectClass}`}>
          <div className={styles.imgPhLbl}>
            <span className={styles.imgPhTag}>{n ? `[ image · ${n} ]` : "[ image ]"}</span>
            <span className={styles.imgPhDesc}>
              {placeholder || alt || "drop a screenshot here"}
            </span>
            {src && <span className={styles.imgPhPath}>{src}</span>}
          </div>
        </div>
      ) : (
        <img
          className={`${styles.figureImg} ${aspectClass}`}
          src={src}
          alt={alt || ""}
          onError={() => setErrored(true)}
          loading="lazy"
        />
      )}
      {caption && (
        <figcaption className={styles.caption}>
          fig. {n && <span className={styles.captionN}>{n}</span>} · {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ─── ASCII architecture diagram ───────────────────────── */

export function AsciiDiagram({
  children,
  caption,
  n,
}: {
  children: React.ReactNode;
  caption?: string;
  n?: string;
}) {
  return (
    <figure className={styles.figure}>
      <div className={styles.code}>
        <div className={styles.codeHead}>
          <span>diagram</span>
          <span className={styles.codeLang}>ascii</span>
        </div>
        <pre className={styles.codePre}>{children}</pre>
      </div>
      {caption && (
        <figcaption className={styles.caption}>
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
        <div className={styles.codeHead}>
          <span>{file || "snippet"}</span>
          <span className={styles.codeLang}>{lang}</span>
        </div>
        <pre className={styles.codePre}>{children}</pre>
      </div>
      {caption && (
        <figcaption className={styles.caption}>
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
    <div className={styles.decision}>
      <span className={styles.decisionNum}>{n}</span>
      <div className={styles.decisionBody}>
        <h4 className={styles.decisionH}>
          <span className={styles.picked}>{picked}</span>
          {rejected && (
            <>
              <span className={styles.vs}>vs.</span>
              <span className={styles.rejected}>{rejected}</span>
            </>
          )}
        </h4>
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
      <div className={styles.stepLabel}>
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
    <div className={styles.stat}>
      <div className={styles.statV}>
        {value}
        {unit && <span className={styles.statUnit}>{unit}</span>}
      </div>
      <div className={styles.statK}>{label}</div>
    </div>
  );
}

/* ─── frontmatter renderer (for top of page) ───────────── */
//
// not invoked from inside .mdx — call this in your page layout
// with the parsed frontmatter object.

export function Frontmatter({ data }: { data: Record<string, any> }) {
  const rows: [string, React.ReactNode][] = [
    ["project", <span className={styles.fmStr}>"{data.title}"</span>],
    ["tagline", <span className={styles.fmStr}>"{data.tagline}"</span>],
    ["role", <span className={styles.fmStr}>"{data.role}"</span>],
    ["status", <span className={styles.fmStr}>"{data.status}"</span>],
    ["timeline", <>{data.timeline}</>],
    ["commits", <span className={styles.fmNum}>{data.commits}</span>],
    ["stack", <>{(data.stack || []).join(" · ")}</>],
    ["infra", <>{(data.infra || []).join(" · ")}</>],
  ];
  return (
    <div className={styles.frontmatter}>
      <div className={styles.fmBar}>
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
    return (
      <h2 className={styles.h2} id={id}>
        <span className={styles.h2N}>{idx}</span>
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
    p:  (props: any) => <p className={styles.lede} {...props} />,
    ul: (props: any) => <ul className={styles.mdUl} {...props} />,
    code: (props: any) => <code className={styles.inlineCode} {...props} />,
    a: (props: any) => <a className={styles.link} {...props} />,

    // custom components used in mdx
    TLDR,
    Bullets,
    Tag,
    Figure,
    AsciiDiagram,
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
