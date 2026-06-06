"use client";

/* Client component (filter state). Server page stays:
       const rows = await listWorkRows();
       return <MobileWorkLog rows={rows} />;
   Tag chips derive from `rows` → auto-scale, counts auto-correct.
   `lastCommit` is optional; pass it to append "· last commit …" to the
   status line, leave it off and the line is just "$ ls /work · N entries". */

import { useMemo, useRef, useState } from "react";

const STATUS_COLOR: Record<string, string> = {
  active: "text-[var(--status-active)]",
  wip: "text-[var(--status-wip)]",
  archived: "text-[var(--status-archived)]",
  dead: "text-[var(--status-dead)] line-through",
};
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { WorkRow } from "@/lib/work-rows";
import { DashedRule } from "./parts";

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
      <div className="px-[1.375rem] py-[1.125rem]">
        <div className="l-tag mt-6 mb-1 text-ink-dim">build log · {new Date().getFullYear()}</div>
        <h1 className="t-display m-0 text-ink">
          projects<span className="text-accent">.</span>
        </h1>
        <p className="t-lead m-0 mt-[0.85rem] max-w-[44ch] italic text-ink-soft">
          Everything I&apos;ve built — shipped, shelved, or quietly killed. no
          survivorship bias.
        </p>
        <div className="c-xs flex items-center justify-between gap-3 mt-[1.1rem] text-accent">
          <span>$ ls /work</span>
          <span className="text-ink-dim">
            {rows.length} entries
            {lastCommit ? ` · last commit ${lastCommit}` : ""}
          </span>
        </div>
      </div>

      {/* chips reuse .m-chip from mobile.css; layout from utilities */}
      <div className="flex gap-[0.4rem] pt-[0.9rem] px-[1.375rem] pb-[0.1rem] overflow-x-auto scrollbar-none [mask-image:linear-gradient(90deg,#000_88%,transparent)] [-webkit-mask-image:linear-gradient(90deg,#000_88%,transparent)]" ref={stripRef}>
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

      <div className="max-w-[34rem] mx-auto">
        {shown.map((r, i) => {
          const dim = r.status === "archived" || r.status === "dead";
          const rowCls = `block py-[1.05rem] px-[1.375rem] border-b border-[var(--hair)] text-inherit no-underline no-pop${dim ? " opacity-55" : ""} active:bg-[color-mix(in_oklab,var(--accent)_5%,transparent)]`;
          const body = (
            <>
              <div className="flex items-baseline justify-between gap-3 mb-[0.35rem]">
                <span
                  className={`font-[var(--mono)] text-[0.92rem] font-semibold tracking-[-0.01em]${r.slug ? " text-[var(--accent-2)]" : " text-ink"}`}
                >
                  {r.name}
                </span>
                <span className={`c-xs whitespace-nowrap ${STATUS_COLOR[r.status] ?? ""}`}>
                  [{r.status}]
                </span>
              </div>
              <p className="t-body m-0 mb-2 max-w-[48ch] italic text-ink-soft">{r.blurb}</p>
              <span className="l-meta text-ink-dim">{r.tag}</span>
            </>
          );
          return r.slug ? (
            <Link
              key={`${r.name}-${i}`}
              href={`/work/${r.slug}`}
              className={rowCls}
              data-status={r.status}
            >
              {body}
            </Link>
          ) : (
            <div
              key={`${r.name}-${i}`}
              className={rowCls}
              data-status={r.status}
            >
              {body}
            </div>
          );
        })}
      </div>

      <div className="max-w-[34rem] mx-auto mt-2 px-[1.375rem] pt-5 pb-6">
        <div className="c-xs mb-[0.55rem] text-ink-dim">$ git log --oneline | head -3</div>
        {commits.map((l, i) => {
          const [hash, ...rest] = l.split(" · ");
          return (
            <div key={i} className="c-xs pl-3 leading-[1.95] text-ink-soft whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-[var(--accent-2)]">{hash}</span> · {rest.join(" · ")}
            </div>
          );
        })}
        <a
          href="https://github.com/Igneel0601"
          target="_blank"
          rel="noreferrer"
          className="l-meta inline-flex items-center gap-[0.4rem] mt-3 text-[var(--accent-2)] no-underline no-pop"
        >
          full log on github
          <ExternalLink aria-hidden className="i-xs" />
        </a>
      </div>
    </>
  );
}
