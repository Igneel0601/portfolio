"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WORK_LOG_ROWS, WORK_FILTERS, GIT_LOG_PREVIEW, type WorkLogRow } from "@/lib/content";
import { gsap, Flip, ScrollTrigger, SplitText } from "@/lib/gsap";
import { motionMM, MOTION_BREAKPOINTS } from "@/lib/match-media";
import { D, E } from "@/lib/motion-tokens";

type Filter = (typeof WORK_FILTERS)[number];

function matchesFilter(row: WorkLogRow, filter: Filter) {
  if (filter === "all") return true;
  if (filter === "wip") return row.status === "wip";
  return row.tag === filter;
}

export function WorkLog() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const mm = motionMM();

    mm.add(MOTION_BREAKPOINTS, (ctx) => {
      const { isReduce } = ctx.conditions as { isReduce: boolean };
      const back = root.querySelector<HTMLElement>("[data-back-link]");
      const title = root.querySelector<HTMLElement>("[data-page-title]");
      const filters = gsap.utils.toArray<HTMLElement>("[data-filter]", root);
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root);
      const gitLines = gsap.utils.toArray<HTMLElement>("[data-git-line]", root);

      if (isReduce) {
        gsap.set([back, title, ...filters, ...rows, ...gitLines], { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        if (title) {
          const splitR = new SplitText(title, { type: "words" });
          gsap.set(splitR.words, { yPercent: 0, autoAlpha: 1 });
        }
        return;
      }

      // W1.0 back link
      gsap.set(back, { autoAlpha: 0, x: -8 });
      gsap.to(back, { autoAlpha: 1, x: 0, duration: D.sm, ease: E.precise });

      // W1.1 page title word reveal
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

      // W1.2 filter pills
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

      // W1.3 rows per-element
      const rowTriggers: ScrollTrigger[] = [];
      rows.forEach((row) => {
        gsap.set(row, { autoAlpha: 0, x: -12 });
        rowTriggers.push(
          ScrollTrigger.create({
            trigger: row,
            start: "top 88%",
            once: true,
            onEnter: () => gsap.to(row, { autoAlpha: 1, x: 0, duration: 0.40, ease: E.precise }),
          }),
        );
      });

      // W1.4 git log type-on
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

  const handleFilter = (next: Filter) => {
    if (next === filter || !rootRef.current) {
      setFilter(next);
      return;
    }
    const rows = Array.from(rootRef.current.querySelectorAll<HTMLElement>("[data-row]"));
    const state = Flip.getState(rows);
    setFilter(next);
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.55,
        ease: E.weighty,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, y: -8, duration: 0.25 }),
      });
    });
  };

  return (
    <div ref={rootRef}>
      <section className="px-6 md:px-10 pt-10">
        <Link data-back-link href="/" className="mono mute text-[11px] tracking-[0.18em] inline-block">
          ↩ <span style={{ color: "var(--accent-2)" }}>/</span> back home
        </Link>
        <h1 data-page-title className="serif text-5xl md:text-6xl font-extrabold mt-3 mb-2">
          All projects.
        </h1>
        <p className="mute text-base max-w-xl">
          Everything I&apos;ve shipped, in build-log form. Filter by tag, click a row to expand.
        </p>

        <div className="flex flex-wrap gap-2 mt-4 items-center">
          <span className="mono mute text-[11px] tracking-[0.14em] mr-1">FILTER —</span>
          {WORK_FILTERS.map((f) => (
            <button
              key={f}
              data-filter
              data-active={f === filter ? "true" : undefined}
              onClick={() => handleFilter(f)}
              className="pill text-[11px]"
              style={{
                background: f === filter ? "var(--ink)" : "var(--paper-2)",
                color: f === filter ? "var(--paper)" : "var(--ink)",
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
          <span className="mono mute text-[11px] tracking-[0.14em] ml-auto hidden md:inline">sort: ↓ recency</span>
        </div>
      </section>

      <section className="px-6 md:px-10 mt-4">
        <div className="box p-3 md:p-4" style={{ background: "var(--paper-2)" }}>
          <div
            className="mono mute hidden md:grid pb-2 mb-2 border-b border-dashed text-[10px] tracking-[0.14em]"
            style={{ gridTemplateColumns: "60px 100px 130px 1fr 1.1fr 70px 110px", borderColor: "var(--ink)" }}
          >
            <span>STATUS</span><span>TAG</span><span>NAME</span><span>BLURB</span><span>STACK</span><span>YEAR</span><span className="text-right">NOTES</span>
          </div>
          {WORK_LOG_ROWS.map((row, i) => (
            <div
              key={row.name + i}
              data-row
              data-hidden={!matchesFilter(row, filter) ? "true" : undefined}
              className={`mono text-[13px] py-2.5 ${i < WORK_LOG_ROWS.length - 1 ? "border-b border-dashed" : ""} md:grid md:items-center grid-cols-1 md:[grid-template-columns:60px_100px_130px_1fr_1.1fr_70px_110px] gap-4`}
              style={{ borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)" }}
            >
              <span data-status={row.status} style={{ color: row.status === "ok" ? "var(--accent)" : "#b06b00" }}>
                [{row.status === "ok" ? " ok " : "wip "}]
              </span>
              <span className="mute">{row.tag}</span>
              <span className="font-bold">{row.name}</span>
              <span className="mute">{row.blurb}</span>
              <span className="mute text-[11px]">{row.stack}</span>
              <span className="mute text-[11px]">{row.year}</span>
              <span className="mute text-right text-[11px]">{row.notes}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-6">
        <div className="mono mute text-xs">$ git log --oneline | head -3</div>
        <div data-git-log className="mt-1.5 space-y-1">
          {GIT_LOG_PREVIEW.map((line, i) => (
            <div key={i} data-git-line data-text={line} className="mono mute text-xs pl-4">
              {line}
            </div>
          ))}
        </div>
        <div className="mono mute text-[11px] mt-4 tracking-[0.14em]">
          → FULL LOG ON GITHUB.COM/IGNEEL0601
        </div>
      </section>
    </div>
  );
}
