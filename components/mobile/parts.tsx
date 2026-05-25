"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoveRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Project, TimelineStop } from "@/lib/content";
import { BOOT_LINES, CONTACT } from "@/lib/content";

/* ── shared ────────────────────────────────────────────── */
export function AccentRule() {
  return <div className="m-accent-rule" />;
}

export function DashedRule() {
  return <div className="m-dashed-rule" />;
}

export function SectionHeader({ eyebrow, title }: { eyebrow: string; title: ReactNode }) {
  return (
    <div className="m-section-header">
      <div className="l-eyebrow m-section-eyebrow">{eyebrow}</div>
      <h2 className="t-h1 m-section-title">{title}</h2>
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
  const className = `${variant === "solid" ? "btn solid" : "btn"} m-btn`;
  if (!href) {
    return <span className={className}>{children}</span>;
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
        {...(isFile ? { download: "" } : {})}
        {...(/^https?:/i.test(href) ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/* ── home ──────────────────────────────────────────────── */
export function BootBlock() {
  return (
    <div className="c-xs m-boot">
      <div>
        <span className="m-boot-prompt">{BOOT_LINES[0].prompt}</span>
        <span className="m-boot-text"> {BOOT_LINES[0].text}</span>
      </div>
      {BOOT_LINES.slice(1).map((l, i) => (
        <div key={i} className="m-boot-line">
          {l.text}
        </div>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <div className="m-hero">
      <h1 className="t-display m-hero-title">
        I&apos;m <span className="m-hero-highlight">Vaibhav.</span>
        <br />I build software
        <br />
        that <em className="m-hero-em">teaches itself</em>
        <br />to write more
        <br />software.
      </h1>
      <p className="c-xs m-hero-meta">
        B.Tech CSE · GBU · Noida
        <br />open to full-time + freelance.
      </p>
      <div className="m-hero-ctas">
        <Btn variant="solid" href="/work">
          $ cat work <MoveRight className="i-lg" aria-hidden />
        </Btn>
        <Btn href="/vaibhav_resume.pdf">$ download résumé.pdf</Btn>
        <Btn href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Btn>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.id}`} className="m-project-card">
      <div className="m-project-thumb">
        <Image
          src={project.image}
          alt={`${project.name} screenshot`}
          fill
          sizes="100vw"
        />
      </div>
      <div className="m-project-body">
        <div className="m-project-head">
          <span className="c-xs m-project-idx">{project.index}</span>
          <span className="t-h4 m-project-name">{project.name}</span>
          <span className="l-meta m-project-kind">{project.kind}</span>
        </div>
        <p className="t-sm m-project-blurb">{project.blurb}</p>
        <div className="m-project-stack">
          {project.stack.map((s) => (
            <span key={s} className="c-xs m-project-chip">
              {s}
            </span>
          ))}
        </div>
        <div className="m-project-foot">
          <span className="l-tag m-project-cta">
            cat CASE_STUDY.md{" "}
            <MoveRight aria-hidden className="i-xs m-project-cta-icon" />
          </span>
          <span className="c-xs m-project-meta">{project.meta}</span>
        </div>
      </div>
    </Link>
  );
}

export function TimelineSection({ stops }: { stops: TimelineStop[] }) {
  return (
    <>
      <SectionHeader eyebrow="$ git log --all" title="the long way around." />
      <div className="m-timeline">
        {stops.map((s, i) => {
          const now = s.isNow ? "true" : "false";
          return (
            <div key={i} className="m-timeline-row">
              {i < stops.length - 1 && <div className="m-timeline-rail" />}
              <div className="c-xs m-timeline-when" data-now={now}>
                {s.when}
              </div>
              <div className="m-timeline-dot-wrap">
                <div className="m-timeline-dot" data-now={now} />
              </div>
              <div className="m-timeline-body">
                <div className="t-sm m-timeline-title" data-now={now}>
                  {s.title}
                </div>
                <div className="c-xs m-timeline-blurb">{s.blurb}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function CTASection() {
  return (
    <section className="box m-cta">
      <div>
        <div className="l-eyebrow m-cta-eyebrow">END OF STORY · YOUR MOVE</div>
        <div className="t-h3 m-cta-title">Hiring? Building? Curious?</div>
        <div className="t-body mute m-cta-sub">Drop a line — I respond fast.</div>
      </div>
      <div className="m-cta-actions">
        <Btn variant="solid" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </Btn>
        <Btn href={CONTACT.github}>github · linkedin · x</Btn>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const rawPathname = usePathname();
  // Strip /d or /m prefix so suppression works on deep-links/share URLs that
  // bypass proxy.ts rewrites. Mirrors components/Footer.tsx.
  const pathname = rawPathname?.replace(/^\/[dm](?=\/|$)/, "") ?? "";

  const hasOwnFooter =
    pathname.startsWith("/writing/") ||
    pathname === "/experiments/writing-exploration" ||
    /^\/work\/[^/]+/.test(pathname);

  if (hasOwnFooter) return null;

  return (
    <div className="c-xs m-site-footer">
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
  const inner = (
    <div
      className="m-work-row-inner"
      data-status={row.status}
      data-dead={row.status === "dead" ? "true" : undefined}
    >
      <span className="c-sm m-work-name" data-linked={linked ? "true" : undefined}>
        {row.name}
      </span>
      <p className="t-sm m-work-blurb">{row.blurb}</p>
      <span className="l-meta m-work-tag">{row.tag}</span>
      <span className="c-xs m-work-status">[{row.status}]</span>
    </div>
  );
  if (linked) {
    return (
      <Link href={`/work/${row.slug}`} className="m-work-row">
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
    <Link href={href} className="m-writing-row">
      <span className="c-xs m-writing-date">{date}</span>
      <div>
        <div className="t-h5 m-writing-title">{title}</div>
        <div className="c-xs m-writing-meta">{meta}</div>
      </div>
    </Link>
  );
}

export function PageHeader({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: ReactNode;
}) {
  return (
    <div className="m-page-header">
      {eyebrow && <div className="l-meta m-page-eyebrow">{eyebrow}</div>}
      <h1
        className="t-display m-page-title"
        data-eyebrow={eyebrow ? "true" : "false"}
      >
        {title}
        <span className="m-page-title-dot">.</span>
      </h1>
    </div>
  );
}
