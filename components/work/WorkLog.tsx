"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, ChevronRight } from "lucide-react";
import type { WorkRow, WorkTag } from "@/lib/work-rows";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { motionMM, MOTION_BREAKPOINTS } from "@/lib/match-media";
import { E } from "@/lib/motion-tokens";

type WorkFilter = WorkTag | "all";

function matchesFilter(row: WorkRow, filter: WorkFilter) {
  if (filter === "all") return true;
  return row.tag === filter;
}

export function WorkLog({
  rows,
  commits,
}: {
  rows: WorkRow[];
  commits: string[];
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [minH, setMinH] = useState<number>();

  // Tags present in the data, most-used first (mirrors the mobile work view).
  const tags = useMemo(() => {
    const m = new Map<WorkTag, number>();
    for (const r of rows) m.set(r.tag, (m.get(r.tag) ?? 0) + 1);
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [rows]);

  // Keep the table a constant height across filters: lock min-height to the
  // full ("all") row set, so filtering empties rows without resizing the box.
  useEffect(() => {
    const measure = () => {
      if (filter !== "all" || !boxRef.current) return;
      setMinH(boxRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [filter]);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const mm = motionMM();

    mm.add(MOTION_BREAKPOINTS, (ctx) => {
      const { isReduce, isMobile } = ctx.conditions as { isReduce: boolean; isMobile: boolean };
      const title = root.querySelector<HTMLElement>("[data-page-title]");
      const filters = gsap.utils.toArray<HTMLElement>("[data-filter]", root);
      const rowEls = gsap.utils.toArray<HTMLElement>("[data-row]", root);
      const gitLines = gsap.utils.toArray<HTMLElement>("[data-git-line]", root);

      if (isReduce || isMobile) {
        gsap.set([title, ...filters, ...rowEls, ...gitLines], {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        if (title) {
          const splitR = new SplitText(title, { type: "words" });
          gsap.set(splitR.words, { yPercent: 0, autoAlpha: 1 });
        }
        return;
      }

      let split: SplitText | null = null;
      if (title) {
        split = new SplitText(title, { type: "words" });
        gsap.set(split.words, { yPercent: 100, autoAlpha: 0 });
        gsap.to(split.words, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.55,
          ease: E.weighty,
          stagger: { each: 0.05, from: "start" },
          delay: 0.1,
        });
      }

      if (filters.length) {
        gsap.set(filters, { autoAlpha: 0, y: 8, scale: 0.96 });
        gsap.to(filters, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: E.precise,
          stagger: { each: 0.04, from: "start" },
          delay: 0.2,
        });
      }

      const rowTriggers: ScrollTrigger[] = [];
      rowEls.forEach((row) => {
        gsap.set(row, { autoAlpha: 0, x: -12 });
        rowTriggers.push(
          ScrollTrigger.create({
            trigger: row,
            start: "top 88%",
            once: true,
            onEnter: () =>
              gsap.to(row, {
                autoAlpha: 1,
                x: 0,
                duration: 0.4,
                ease: E.precise,
              }),
          }),
        );
      });

      const gitTriggers: ScrollTrigger[] = [];
      gitLines.forEach((line, i) => {
        const full = line.dataset.text || "";
        line.textContent = "";
        gitTriggers.push(
          ScrollTrigger.create({
            trigger: line,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(line, {
                duration: Math.min(0.6, full.length * 0.025),
                text: { value: full, delimiter: "" },
                ease: `steps(${Math.max(8, full.length)})`,
                delay: i * 0.15,
              });
            },
          }),
        );
      });

      return () => {
        rowTriggers.forEach((t) => t.kill());
        gitTriggers.forEach((t) => t.kill());
        split?.revert();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <section className="pt-6">
        <h1 data-page-title className="t-display">
          projects<span style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <p className="wk-sub t-lead">
          Everything I&apos;ve built — shipped, shelved, or quietly killed. no
          survivorship bias.
        </p>

        <div className="wk-filter mt-6" role="group" aria-label="Filter projects by tag">
          <button
            type="button"
            data-filter
            className="wk-chip l-meta no-pop"
            data-active={filter === "all" ? "true" : undefined}
            onClick={() => setFilter("all")}
          >
            all <span>{rows.length}</span>
          </button>
          {tags.map((t) => (
            <button
              key={t.tag}
              type="button"
              data-filter
              className="wk-chip l-meta no-pop"
              data-active={filter === t.tag ? "true" : undefined}
              onClick={() => setFilter(t.tag)}
            >
              {t.tag} <span>{t.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4">
        <div
          ref={boxRef}
          className="box p-3 md:p-4"
          style={{ background: "var(--paper-2)", minHeight: minH }}
        >
          <div
            className="l-meta mute hidden md:grid pb-2 mb-2 border-b border-dashed gap-4"
            style={{
              gridTemplateColumns: "180px 120px minmax(0, 1fr) 120px 28px",
              columnGap: "clamp(32px, 5vw, 64px)",
              borderColor: "var(--ink)",
            }}
          >
            <span>NAME</span>
            <span>TAG</span>
            <span>BLURB</span>
            <span>STATUS</span>
            <span />
          </div>
          {rows.map((row, i) => {
            const inner = (
              <>
                <span className="font-bold">{row.name}</span>
                <span className="mute">{row.tag}</span>
                <span className="work-blurb mute">{row.blurb}</span>
                <span data-status={row.status} className="work-status">
                  [{row.status}]
                </span>
                <span className="work-chev" aria-hidden>
                  {row.slug && <ChevronRight className="i-sm" />}
                </span>
              </>
            );

            const className = `work-row c-md py-2.5 ${
              i < rows.length - 1 ? "border-b border-dashed" : ""
            } md:grid md:items-center gap-4`;
            const style = {
              borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
              gridTemplateColumns: "180px 120px minmax(0, 1fr) 120px 28px",
              columnGap: "clamp(32px, 5vw, 64px)",
            } as const;

            return row.slug ? (
              <Link
                key={row.name + i}
                href={`/work/${row.slug}`}
                data-row
                data-link="true"
                data-hidden={!matchesFilter(row, filter) ? "true" : undefined}
                data-status-row={row.status}
                className={className + " no-pop block"}
                style={style}
              >
                {inner}
              </Link>
            ) : (
              <div
                key={row.name + i}
                data-row
                data-hidden={!matchesFilter(row, filter) ? "true" : undefined}
                data-status-row={row.status}
                className={className}
                style={style}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-6">
        <div className="c-sm mute">$ git log --oneline | head -3</div>
        <div data-git-log className="mt-1.5 space-y-1">
          {commits.map((line, i) => (
            <div
              key={i}
              data-git-line
              data-text={line}
              className="c-sm mute pl-4"
            >
              {line}
            </div>
          ))}
        </div>
        <a
          href="https://github.com/Igneel0601"
          target="_blank"
          rel="noopener"
          className="l-meta mute mt-4 inline-flex items-center gap-1.5 no-pop"
        >
          FULL LOG ON GITHUB.COM/IGNEEL0601
          <ExternalLink className="i-xs" aria-hidden />
        </a>
      </section>
    </div>
  );
}
