import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Project, TimelineStop } from "@/lib/content";
import { BOOT_LINES, CONTACT } from "@/lib/content";

/* ── tokens (subset) ───────────────────────────────────── */
const paper = "var(--paper)";
const paper2 = "var(--paper-2)";
const paper3 = "var(--paper-3)";
const ink = "var(--ink)";
const inkSoft = "var(--ink-soft)";
const inkDim = "var(--ink-dim)";
const hair = "var(--hair)";
const hair2 = "var(--hair-2)";
const accent = "var(--accent)";
const accent2 = "var(--accent-2)";
const hl = "var(--highlight)";

/* ── shared ────────────────────────────────────────────── */
export function AccentRule() {
  return (
    <div
      style={{
        height: 1,
        background: `linear-gradient(90deg, color-mix(in oklab, ${accent} 28%, transparent), transparent)`,
        margin: "0 22px",
        flexShrink: 0,
      }}
    />
  );
}

export function SectionHeader({ eyebrow, title }: { eyebrow: string; title: ReactNode }) {
  return (
    <div style={{ padding: "18px 22px 5px" }}>
      <div
        className="l-eyebrow"
        style={{ color: `color-mix(in oklab, ${accent} 55%, transparent)`, marginBottom: 4 }}
      >
        {eyebrow}
      </div>
      <h2 className="t-h1" style={{ color: ink, margin: 0 }}>
        {title}
      </h2>
    </div>
  );
}

function Btn({
  children,
  variant = "outline",
  href,
}: {
  children: ReactNode;
  variant?: "solid" | "outline";
  href?: string;
}) {
  // Use the shared .btn class from tokens.css so mobile matches desktop's
  // hard-shadow + uppercase aesthetic. Stretch full-width inside a stacked CTA.
  const className = variant === "solid" ? "btn solid" : "btn";
  const style: CSSProperties = {
    width: "100%",
    justifyContent: "center",
    WebkitTapHighlightColor: "transparent",
    textDecoration: "none",
  };
  if (!href) {
    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  }
  // mailto:, tel:, external URLs, and static-file paths (anything with a
  // dotted extension like .pdf) need a plain <a> — next/link tries to
  // client-route them and either 404s or fails to trigger a download.
  const isExternal =
    /^(mailto:|tel:|https?:)/i.test(href) || /\.[a-z0-9]+(\?|#|$)/i.test(href);
  if (isExternal) {
    const isFile = /\.[a-z0-9]+(\?|#|$)/i.test(href) && !/^https?:/i.test(href);
    return (
      <a
        href={href}
        className={className}
        style={style}
        {...(isFile ? { download: "" } : {})}
        {...(/^https?:/i.test(href) ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}

/* ── home ──────────────────────────────────────────────── */
export function BootBlock() {
  return (
    <div
      style={{
        padding: "10px 22px 9px",
        fontFamily: "var(--mono)",
        fontSize: 11,
        lineHeight: 1.75,
      }}
    >
      <div>
        <span style={{ color: accent }}>{BOOT_LINES[0].prompt}</span>
        <span style={{ color: ink }}> {BOOT_LINES[0].text}</span>
      </div>
      {BOOT_LINES.slice(1).map((l, i) => (
        <div key={i} style={{ paddingLeft: 10, color: inkDim }}>
          {l.text}
        </div>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <div style={{ padding: "18px 22px 22px" }}>
      <h1 className="t-display" style={{ color: ink, margin: "0 0 10px" }}>
        I&apos;m{" "}
        <span
          style={{
            background: `linear-gradient(transparent 62%, ${hl} 62%)`,
            padding: "0 .05em",
          }}
        >
          Vaibhav.
        </span>
        <br />I build software
        <br />
        that{" "}
        <em style={{ fontStyle: "italic", color: accent }}>teaches itself</em>
        <br />to write more
        <br />software.
      </h1>
      <p
        className="c-xs"
        style={{ color: inkDim, lineHeight: 1.65, margin: "0 0 16px" }}
      >
        B.Tech CSE · GBU · Noida
        <br />open to full-time + freelance.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <Btn variant="solid" href="/work">
          $ cat work →
        </Btn>
        <Btn href="/vaibhav_resume.pdf">$ download résumé.pdf</Btn>
        <Btn href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Btn>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.id}`}
      style={{
        display: "block",
        margin: "10px 22px",
        border: `1px solid color-mix(in oklab, ${accent} 20%, transparent)`,
        borderRadius: 10,
        overflow: "hidden",
        background: paper2,
        textDecoration: "none",
        color: "inherit",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          background: paper3,
        }}
      >
        <Image
          src={project.image}
          alt={`${project.name} screenshot`}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div style={{ padding: "10px 14px 13px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginBottom: 4,
          }}
        >
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: inkDim }}>
            {project.index}
          </span>
          <span className="t-h4" style={{ color: ink }}>
            {project.name}
          </span>
          <span
            className="l-meta"
            style={{ fontSize: 9, color: accent, marginLeft: "auto" }}
          >
            {project.kind}
          </span>
        </div>
        <p
          className="t-sm"
          style={{ color: inkSoft, margin: "0 0 9px", fontSize: 13 }}
        >
          {project.blurb}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            marginBottom: 9,
          }}
        >
          {project.stack.map((s) => (
            <span
              key={s}
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                padding: "2px 7px",
                border: `1px solid color-mix(in oklab, ${accent} 16%, transparent)`,
                borderRadius: 999,
                color: inkDim,
              }}
            >
              {s}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: accent2,
              letterSpacing: ".04em",
            }}
          >
            cat CASE_STUDY.md →
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: inkDim }}>
            {project.meta}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function TimelineSection({ stops }: { stops: TimelineStop[] }) {
  return (
    <>
      <SectionHeader eyebrow="$ git log --all" title="the long way around." />
      <div style={{ padding: "8px 22px 12px" }}>
        {stops.map((s, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "38px 14px 1fr",
              alignItems: "start",
              minHeight: 38,
              position: "relative",
            }}
          >
            {i < stops.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: 47,
                  top: 12,
                  bottom: -1,
                  borderLeft: `1.5px dashed color-mix(in oklab, ${accent} 22%, transparent)`,
                }}
              />
            )}
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                color: s.isNow ? accent : inkDim,
                textAlign: "right",
                paddingRight: 7,
                marginTop: 2,
                fontWeight: s.isNow ? 600 : 400,
              }}
            >
              {s.when}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  marginTop: 2,
                  flexShrink: 0,
                  border: `1.5px solid ${
                    s.isNow ? accent : `color-mix(in oklab, ${accent} 38%, transparent)`
                  }`,
                  background: s.isNow ? accent : paper,
                  boxShadow: s.isNow
                    ? `0 0 0 3px color-mix(in oklab, ${accent} 18%, transparent), 0 0 10px color-mix(in oklab, ${accent} 35%, transparent)`
                    : undefined,
                }}
              />
            </div>
            <div style={{ paddingLeft: 8 }}>
              <div
                className="t-sm"
                style={{
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: s.isNow
                    ? ink
                    : `color-mix(in oklab, ${ink} 80%, transparent)`,
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  color: inkDim,
                  lineHeight: 1.4,
                  marginTop: 1,
                }}
              >
                {s.blurb}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function CTASection() {
  return (
    <section
      className="box"
      style={{
        margin: "24px 22px",
        padding: 20,
        background: paper2,
        display: "grid",
        gap: 16,
      }}
    >
      <div>
        <div className="l-eyebrow" style={{ color: accent, marginBottom: 6 }}>
          END OF STORY · YOUR MOVE
        </div>
        <div className="t-h3" style={{ color: ink, margin: "0 0 4px" }}>
          Hiring? Building? Curious?
        </div>
        <div className="t-body mute" style={{ margin: 0 }}>
          Drop a line — I respond fast.
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Btn variant="solid" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </Btn>
        <Btn href={CONTACT.github}>github · linkedin · x</Btn>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 22px 20px",
        borderTop: `1px solid ${hair}`,
        fontFamily: "var(--mono)",
        fontSize: 9,
        color: inkDim,
        marginTop: 8,
      }}
    >
      <span>$ exit 0 · too much coffee</span>
      <span>© {new Date().getFullYear()}</span>
    </div>
  );
}

/* ── work ──────────────────────────────────────────────── */
type WorkRowLike = {
  status: string;
  tag: string;
  name: string;
  blurb: string;
  slug?: string;
};

export function WorkPageRow({ row }: { row: WorkRowLike }) {
  const linked = !!row.slug;
  const sc =
    ({ active: accent, wip: accent2, archived: inkDim } as Record<string, string>)[row.status] ||
    inkDim;
  const inner = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gridTemplateAreas: '"name chev" "blurb blurb" "tag status"',
        rowGap: 3,
        columnGap: 8,
        padding: "13px 22px",
        borderBottom: `1px solid ${hair}`,
        alignItems: "center",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        style={{
          gridArea: "name",
          fontFamily: "var(--mono)",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: ink,
        }}
      >
        {row.name}
      </span>
      <span
        style={{
          gridArea: "chev",
          fontFamily: "var(--mono)",
          fontSize: "0.8125rem",
          color: linked ? accent2 : "transparent",
        }}
      >
        ›
      </span>
      <p
        style={{
          gridArea: "blurb",
          fontFamily: "var(--font-serif)",
          fontSize: 13,
          lineHeight: 1.45,
          color: inkSoft,
          margin: "2px 0 4px",
        }}
      >
        {row.blurb}
      </p>
      <span
        style={{
          gridArea: "tag",
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: inkDim,
        }}
      >
        {row.tag}
      </span>
      <span
        style={{
          gridArea: "status",
          fontFamily: "var(--mono)",
          fontSize: 9,
          color: sc,
          border: `1px solid color-mix(in oklab, ${sc} 30%, transparent)`,
          padding: "1px 5px",
          borderRadius: 3,
          justifySelf: "end",
        }}
      >
        [{row.status}]
      </span>
    </div>
  );
  if (linked) {
    return (
      <Link
        href={`/work/${row.slug}`}
        style={{ display: "block", color: "inherit", textDecoration: "none" }}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}

/* ── writing ───────────────────────────────────────────── */
export function WritingRow({
  date,
  title,
  meta,
  href,
}: {
  date: string;
  title: string;
  meta: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        padding: "11px 22px",
        borderBottom: `1px solid ${hair}`,
        color: "inherit",
        textDecoration: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          color: inkDim,
          minWidth: 44,
          marginTop: 2,
        }}
      >
        {date}
      </span>
      <div>
        <div className="t-h5" style={{ color: ink, lineHeight: 1.3 }}>
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            color: inkDim,
            marginTop: 2,
          }}
        >
          {meta}
        </div>
      </div>
    </Link>
  );
}

export function PageHeader({
  back = "back home",
  backHref = "/",
  eyebrow,
  title,
}: {
  back?: string;
  backHref?: string;
  eyebrow?: string;
  title: ReactNode;
}) {
  return (
    <div style={{ padding: "18px 22px 6px" }}>
      <Link
        href={backHref}
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: accent2,
          marginBottom: 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          textDecoration: "none",
        }}
      >
        <span>←</span> {back}
      </Link>
      {eyebrow && (
        <div
          className="l-eyebrow"
          style={{ fontSize: 10, color: inkDim, marginBottom: 3, marginTop: 8 }}
        >
          {eyebrow}
        </div>
      )}
      <h1 className="t-display" style={{ color: ink, margin: 0 }}>
        {title}
        <span style={{ color: accent }}>.</span>
      </h1>
    </div>
  );
}

export function DashedRule() {
  return (
    <div
      style={{
        height: 1,
        background: `repeating-linear-gradient(90deg, ${hair2} 0 12px, transparent 12px 16px)`,
        margin: "0 22px",
      }}
    />
  );
}
