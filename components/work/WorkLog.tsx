"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MoveLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import type { WorkRow } from "@/lib/work-rows";

const WORK_TAGS = ["all", "product", "event", "tool", "next"] as const;
type WorkFilter = (typeof WORK_TAGS)[number];
import { GIT_LOG_PREVIEW } from "@/lib/content";
import { gsap, Flip, ScrollTrigger, SplitText } from "@/lib/gsap";
import { motionMM, MOTION_BREAKPOINTS } from "@/lib/match-media";
import { D, E } from "@/lib/motion-tokens";

function matchesFilter(row: WorkRow, filter: WorkFilter) {
  if (filter === "all") return true;
  return row.tag === filter;
}

export function WorkLog({ rows }: { rows: WorkRow[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<WorkFilter>("all");

  const filterCounts = useMemo(() => {
    const counts: Record<WorkFilter, number> = {
      all: rows.length,
      product: 0,
      event: 0,
      tool: 0,
      next: 0,
    };
    for (const r of rows) counts[r.tag] = (counts[r.tag] ?? 0) + 1;
    return counts;
  }, [rows]);

  const showFilters = rows.length > 5;

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const mm = motionMM();

    mm.add(MOTION_BREAKPOINTS, (ctx) => {
      const { isReduce } = ctx.conditions as { isReduce: boolean };
      const back = root.querySelector<HTMLElement>("[data-back-link]");
      const title = root.querySelector<HTMLElement>("[data-page-title]");
      const filters = gsap.utils.toArray<HTMLElement>("[data-filter]", root);
      const rowEls = gsap.utils.toArray<HTMLElement>("[data-row]", root);
      const gitLines = gsap.utils.toArray<HTMLElement>("[data-git-line]", root);

      if (isReduce) {
        gsap.set([back, title, ...filters, ...rowEls, ...gitLines], {
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

      gsap.set(back, { autoAlpha: 0, x: -8 });
      gsap.to(back, { autoAlpha: 1, x: 0, duration: D.sm, ease: E.precise });

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

  const handleFilter = (next: WorkFilter) => {
    if (next === filter || !rootRef.current) {
      setFilter(next);
      return;
    }
    const rowEls = Array.from(
      rootRef.current.querySelectorAll<HTMLElement>("[data-row]"),
    );
    const state = Flip.getState(rowEls);
    setFilter(next);
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.55,
        ease: E.weighty,
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.35 },
          ),
        onLeave: (els) =>
          gsap.to(els, { autoAlpha: 0, y: -8, duration: 0.25 }),
      });
    });
  };

  return (
    <div ref={rootRef}>
      <section className="pt-6 mx-auto" style={{ maxWidth: 1280 }}>
        <Link
          data-back-link
          href="/"
          className="work-back-link mono mute c-xs tracking-[0.18em] inline-flex items-center gap-1.5 no-pop"
        >
          <MoveLeft size={18} strokeWidth={1.5} aria-hidden /> <span style={{ color: "var(--accent-2)" }}>/</span>back home
        </Link>
        <h1
          data-page-title
          className="t-display mt-3 mb-2"
        >
          All projects.
        </h1>

      </section>

      <section className="px-6 md:px-10 mt-10">
        <div
          className="box p-3 md:p-4 mx-auto"
          style={{ background: "var(--paper-2)", maxWidth: 1280 }}
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
                  {row.slug && <ChevronRight size={14} strokeWidth={1.5} />}
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

      <section className="py-6 mx-auto" style={{ maxWidth: 1280 }}>
        <div className="c-sm mute">$ git log --oneline | head -3</div>
        <div data-git-log className="mt-1.5 space-y-1">
          {GIT_LOG_PREVIEW.map((line, i) => (
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
          <ArrowUpRight size={12} aria-hidden />
        </a>
      </section>
    </div>
  );
}
