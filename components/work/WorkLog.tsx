"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, ChevronRight } from "lucide-react";
import type { WorkRow, WorkTag } from "@/lib/work-rows";

type WorkFilter = WorkTag | "all";

function matchesFilter(row: WorkRow, filter: WorkFilter) {
  if (filter === "all") return true;
  return row.tag === filter;
}

// Status → status-bar color (was .work-row[data-status-row=…] .work-status in
// desktop.css). dead also strikes through. Tokens live in @theme.
const STATUS_TEXT: Record<string, string> = {
  active: "text-status-active",
  wip: "text-status-wip",
  archived: "text-status-archived",
  dead: "text-status-dead line-through",
};

export function WorkLog({
  rows,
  commits,
  lastCommit,
}: {
  rows: WorkRow[];
  commits: string[];
  lastCommit?: string;
}) {
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

  return (
    <div>
      <section className="pt-6">
        <div className="l-eyebrow text-ink-dim">
          build log · {new Date().getFullYear()}
        </div>
        <h1 data-page-title className="t-display mt-3">
          projects<span className="text-accent">.</span>
        </h1>
        <p className="t-lead mt-[0.85rem] max-w-[52ch] italic text-ink-soft">
          Everything I&apos;ve built — shipped, shelved, or quietly killed. no
          survivorship bias.
        </p>

        <div className="c-md mt-12 text-ink-soft flex items-baseline gap-2.5 flex-wrap">
          <span className="text-accent">$ ls /work</span>
          <span className="opacity-50">·</span>
          <span>
            {rows.length} {rows.length === 1 ? "entry" : "entries"}
          </span>
          {lastCommit && (
            <>
              <span className="opacity-50">·</span>
              <span>last commit {lastCommit}</span>
            </>
          )}
        </div>

        <div className="tag-filter mt-6" role="group" aria-label="Filter projects by tag">
          <button
            type="button"
            data-filter
            className="tag-chip l-meta no-pop"
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
              className="tag-chip l-meta no-pop"
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
            const linked = !!row.slug;
            const inner = (
              <>
                <span className={`font-bold${linked ? " text-accent-2 group-hover:text-accent" : ""}`}>{row.name}</span>
                <span className="mute">{row.tag}</span>
                <span className="mute min-w-0">{row.blurb}</span>
                <span className={STATUS_TEXT[row.status]}>
                  [{row.status}]
                </span>
                <span className="opacity-0 transition-opacity text-accent justify-self-end group-hover:opacity-100" aria-hidden>
                  {row.slug && <ChevronRight className="i-sm" />}
                </span>
              </>
            );

            const className = `c-md py-2.5 relative transition-colors group data-[hidden=true]:hidden ${
              i < rows.length - 1 ? "border-b border-dashed" : ""
            } md:grid md:items-center gap-4${row.status === "dead" ? " opacity-50" : ""}`;
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
                className={className + " no-pop block cursor-pointer"}
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
        <p className="l-meta mute mt-4">
          FULL LOG ON{" "}
          <a
            href="https://github.com/Igneel0601"
            target="_blank"
            rel="noopener"
            className="whitespace-nowrap"
          >
            GITHUB.COM/IGNEEL0601
            <ExternalLink
              className="i-xs ml-1 inline-block align-[-0.15em]"
              aria-hidden
            />
          </a>
        </p>
      </section>
    </div>
  );
}
