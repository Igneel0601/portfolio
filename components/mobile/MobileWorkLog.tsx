"use client";

/* Client component (filter state). Server page stays:
       const rows = await listWorkRows();
       return <MobileWorkLog rows={rows} />;
   Tag chips derive from `rows` → auto-scale, counts auto-correct.
   `lastCommit` is optional; pass it to append "· last commit …" to the
   status line, leave it off and the line is just "$ ls /work · N entries". */

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { WorkRow } from "@/lib/work-rows";
import { DashedRule } from "./parts";
import { RevealGroup } from "./Reveal";

export function MobileWorkLog({
  rows,
  commits,
  lastCommit,
}: {
  rows: WorkRow[];
  commits: string[];
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
        <p className="t-lead m-work-sub">
          Everything I&apos;ve built — shipped, shelved, or quietly killed. no
          survivorship bias.
        </p>
        <div className="c-xs m-work-status">
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
          className="c-xs m-chip"
          data-active={active === "all" ? "true" : undefined}
          onClick={(e) => pick("all", e.currentTarget)}
        >
          all <span>{rows.length}</span>
        </button>
        {tags.map((t) => (
          <button
            key={t.tag}
            type="button"
            className="c-xs m-chip"
            data-active={active === t.tag ? "true" : undefined}
            onClick={(e) => pick(t.tag, e.currentTarget)}
          >
            {t.tag} <span>{t.count}</span>
          </button>
        ))}
      </div>

      <DashedRule />

      <RevealGroup replayKey={active}>
        <div className="m-worklist">
        {shown.map((r, i) => {
          const dim = r.status === "archived" || r.status === "dead";
          const body = (
            <>
              <div className="m-wkrow-top">
                <span className="m-wkrow-name" data-linked={r.slug ? "true" : undefined}>
                  {r.name}
                </span>
                <span className="c-xs m-wkrow-status">{r.status}</span>
              </div>
              <p className="t-body m-wkrow-blurb">{r.blurb}</p>
              <span className="l-meta m-wkrow-tag">{r.tag}</span>
            </>
          );
          return r.slug ? (
            <Link
              key={`${r.name}-${i}`}
              href={`/work/${r.slug}`}
              className="m-wkrow m-reveal"
              data-status={r.status}
              data-dim={dim ? "true" : undefined}
            >
              {body}
            </Link>
          ) : (
            <div
              key={`${r.name}-${i}`}
              className="m-wkrow m-reveal"
              data-status={r.status}
              data-dim={dim ? "true" : undefined}
            >
              {body}
            </div>
          );
        })}
        </div>

        <div className="m-wklog m-reveal">
          <div className="c-xs m-wklog-h">$ git log --oneline | head -3</div>
        {commits.map((l, i) => {
          const [hash, ...rest] = l.split(" · ");
          return (
            <div key={i} className="c-xs m-wklog-l">
              <span className="m-wklog-hash">{hash}</span> · {rest.join(" · ")}
            </div>
          );
        })}
        <a
          href="https://github.com/Igneel0601"
          target="_blank"
          rel="noreferrer"
          className="l-meta m-wklog-more"
        >
          full log on github
          <ExternalLink aria-hidden className="i-xs" />
        </a>
        </div>
      </RevealGroup>
    </>
  );
}
