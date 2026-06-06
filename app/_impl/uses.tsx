"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { USES, CONTACT } from "@/lib/content";

// Shared /uses body — categorized gear with a small in-page category filter
// (client state; fixed list, so no URL/pagination). Reuses the .tag-* pills.
export function UsesPage() {
  const [filter, setFilter] = useState<string>("all");
  const total = USES.cats.reduce((n, c) => n + c.rows.length, 0);
  const visible = filter === "all" ? USES.cats : USES.cats.filter((c) => c.key === filter);

  return (
    <main className="flex-1">
      <section className="page-shell uses pre-footer-pad pt-[clamp(1.25rem,2.5vw,1.75rem)]">
        <div className="l-eyebrow text-ink-dim mt-2">{USES.eyebrow}</div>
        <h1 className="t-display mt-3">
          uses<span className="text-accent">.</span>
        </h1>
        <p className="t-lead mt-4 max-w-[28ch] text-ink-soft italic">{USES.lede}</p>

        <div className="ab-cmd c-sm">
          <span className="ab-prompt">$</span> ls /uses
          <span>
            <span className="ab-sep">·</span>
            {total} items
          </span>
          <span>
            <span className="ab-sep">·</span>
            {USES.cats.length} categories
          </span>
        </div>

        <div className="tag-filter mt-6" role="group" aria-label="filter by category">
          <button
            type="button"
            className="tag-chip l-meta no-pop"
            data-active={filter === "all" ? "true" : undefined}
            onClick={() => setFilter("all")}
          >
            all <span>{total}</span>
          </button>
          {USES.cats.map((c) => (
            <button
              key={c.key}
              type="button"
              className="tag-chip l-meta no-pop"
              data-active={filter === c.key ? "true" : undefined}
              onClick={() => setFilter(c.key)}
            >
              {c.key} <span>{c.rows.length}</span>
            </button>
          ))}
        </div>

        <div className="mt-10">
          {visible.map((cat) => (
            <section className="uses-cat" key={cat.key}>
              <div className="uses-cathead">
                <span className="l-meta">{cat.label}</span>
                <span className="uses-rule" />
                <span className="c-xs mute">{cat.rows.length}</span>
              </div>
              <div>
                {cat.rows.map((r) => (
                  <div className="uses-row" key={r.name}>
                    <span className="uses-name">{r.name}</span>
                    <span className="uses-note">{r.note}</span>
                    <span className="uses-metawrap">
                      {r.meta && (
                        <span className="uses-chip">{r.meta}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16">
          <div className="ab-cmd c-sm">
            <span className="ab-prompt">$</span> cat ~/.dotfiles/README
          </div>
          <p className="uses-dot">
            Everything above is wired together on{" "}
            <a href={CONTACT.github} target="_blank" rel="noopener" className="uses-link">
              GitHub <ExternalLink className="i-xs" aria-hidden />
            </a>
            . Steal whatever&apos;s useful. It&apos;ll probably break differently for you.
          </p>
        </div>
      </section>
    </main>
  );
}
