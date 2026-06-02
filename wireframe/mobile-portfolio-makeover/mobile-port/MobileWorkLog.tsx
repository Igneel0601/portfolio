"use client";

/* Client component (filter state). Server page stays:
       const rows = await listWorkRows();
       return <MobileWorkLog rows={rows} />;
   Tag chips derive from `rows` → auto-scale, counts auto-correct.
   Header is title-only, matching desktop /work (no eyebrow/subtitle —
   desktop doesn't have them, so mobile doesn't invent them). */

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MoveUpRight } from "lucide-react";
import type { WorkRow } from "@/lib/work-rows";
import { GIT_LOG_PREVIEW } from "@/lib/content";

export function MobileWorkLog({
  rows,
  lastCommit,
}: {
  rows: WorkRow[];
  lastCommit?: string;
}) {
  const [active, setActive] = useState("all");
  const stripRef = useRef<HTMLDivElement>(null);

  const tags = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r.tag, (m.get(r.tag) ?? 0) + 1);
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [rows]);

  const shown = active === "all" ? rows : rows.filter((r) => r.tag === active);

  function pick(name: string, el: HTMLButtonElement) {
    setActive(name);
    const s = stripRef.current;
    if (s) {
      s.scrollTo({
        left: el.offsetLeft - s.clientWidth / 2 + el.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }

  return (
    <>
      <div className="m-page-header">
        <div className="l-tag m-page-eyebrow">build log · {new Date().getFullYear()}</div>
        <h1 className="t-display m-page-title" data-eyebrow="true">
          projects<span className="m-page-title-dot">.</span>
        </h1>
        <p className="m-work-sub">
          Everything I&apos;ve built — shipped, shelved, or quietly killed. no
          survivorship bias.
        </p>
        <div className="m-work-status">
          <span>$ ls /work</span>
          <span className="m-work-status-meta">
            {rows.length} entries
            {lastCommit ? ` · last commit ${lastCommit}` : ""}
          </span>
        </div>
      </div>

      {/* chips reuse .m-wfilter / .m-chip from the /writing CSS block */}
      <div className="m-wfilter" ref={stripRef}>
        <button
          type="button"
          className="m-chip"
          data-active={active === "all" ? "true" : undefined}
          onClick={(e) => pick("all", e.currentTarget)}
        >
          all <span>{rows.length}</span>
        </button>
        {tags.map((t) => (
          <button
            key={t.tag}
            type="button"
            className="m-chip"
            data-active={active === t.tag ? "true" : undefined}
            onClick={(e) => pick(t.tag, e.currentTarget)}
          >
            {t.tag} <span>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="m-dashed-rule" />

      <div className="m-worklist">
        {shown.map((r, i) => {
          const dim = r.status === "archived" || r.status === "dead";
          const body = (
            <>
              <div className="m-wkrow-top">
                <span className="m-wkrow-name" data-linked={r.slug ? "true" : undefined}>
                  {r.name}
                </span>
                <span className="m-wkrow-status">{r.status}</span>
              </div>
              <p className="m-wkrow-blurb">{r.blurb}</p>
              <span className="m-wkrow-tag">{r.tag}</span>
            </>
          );
          return r.slug ? (
            <Link
              key={`${r.name}-${i}`}
              href={`/work/${r.slug}`}
              className="m-wkrow"
              data-status={r.status}
              data-dim={dim ? "true" : undefined}
            >
              {body}
            </Link>
          ) : (
            <div
              key={`${r.name}-${i}`}
              className="m-wkrow"
              data-status={r.status}
              data-dim={dim ? "true" : undefined}
            >
              {body}
            </div>
          );
        })}
      </div>

      <div className="m-wklog">
        <div className="m-wklog-h">$ git log --oneline | head -3</div>
        {GIT_LOG_PREVIEW.map((l, i) => {
          const [hash, ...rest] = l.split(" · ");
          return (
            <div key={i} className="m-wklog-l">
              <span className="m-wklog-hash">{hash}</span> · {rest.join(" · ")}
            </div>
          );
        })}
        <a
          href="https://github.com/Igneel0601"
          target="_blank"
          rel="noreferrer"
          className="m-wklog-more"
        >
          full log on github
          <MoveUpRight aria-hidden className="i-xs" />
        </a>
      </div>
    </>
  );
}
