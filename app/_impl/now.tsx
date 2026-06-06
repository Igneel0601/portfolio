import { ExternalLink } from "lucide-react";
import { NOW } from "@/lib/content";
import { NowClock } from "@/components/NowClock";

// Shared /now body — status board (live IST clock + cards) + dated log.
// Copy lives in lib/content.ts:NOW; reuses the .ab-* page-head atoms.
export function NowPage() {
  return (
    <main className="flex-1">
      <section className="page-shell now pre-footer-pad pt-[clamp(1.25rem,2.5vw,1.75rem)]">
        <div className="l-eyebrow text-ink-dim mt-2">{NOW.eyebrow}</div>
        <h1 className="t-display mt-3">
          now<span className="text-accent">.</span>
        </h1>
        <p className="t-lead mt-4 max-w-[28ch] text-ink-soft italic">{NOW.lede}</p>

        <div className="ab-cmd c-sm">
          <span className="ab-prompt">$</span> date
          <span>
            <span className="ab-sep">·</span>last updated {NOW.updated}
          </span>
          <span>
            <span className="ab-sep">·</span>goes stale in ~{NOW.staleInDays} days
          </span>
        </div>

        <div className="now-board grid [grid-template-columns:repeat(4,1fr)] mt-[2.75rem] border border-[var(--hair)] rounded-[0.375rem] overflow-hidden">
          <div className="now-cell py-[1.375rem] px-6 border-r border-[var(--hair)] last:border-r-0">
            <div className="mono text-[0.6875rem] tracking-[0.16em] uppercase text-ink-dim mb-[0.875rem]">local time · noida</div>
            <div className="mono text-[1.0625rem] text-ink flex flex-col gap-[0.3rem] leading-[1.2]">
              <NowClock />
              <span className="text-[0.6875rem] text-ink-dim tracking-[0.04em]">IST · UTC+5:30</span>
            </div>
          </div>
          {NOW.board.map((c) => (
            <div className="now-cell py-[1.375rem] px-6 border-r border-[var(--hair)] last:border-r-0" key={c.k}>
              <div className="mono text-[0.6875rem] tracking-[0.16em] uppercase text-ink-dim mb-[0.875rem]">{c.k}</div>
              <div className={`mono text-[1.0625rem] flex flex-col gap-[0.3rem] leading-[1.2] ${"accent" in c && c.accent ? "text-accent" : "text-ink"}`}>
                {c.v}
                <span className="text-[0.6875rem] text-ink-dim tracking-[0.04em]">{c.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          {NOW.log.map((b) => (
            <section className="now-logblock grid [grid-template-columns:10rem_1fr] gap-8 py-[1.875rem] border-t border-[var(--hair)] items-start first:border-t-0" key={b.cat}>
              <div className="l-meta text-accent pt-1">{b.cat}</div>
              <div className="flex flex-col gap-5">
                {b.entries.map((e, i) => (
                  <div className="flex flex-col gap-[0.375rem]" key={i}>
                    <p className="serif text-[1.25rem] leading-[1.45] text-ink m-0 max-w-[60ch] text-pretty">{e.line}</p>
                    {e.meta && <span className="mono text-[0.7rem] text-ink-dim tracking-[0.03em]">{e.meta}</span>}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="serif italic text-[1.125rem] text-ink-dim mt-10 border-t border-[var(--hair)] pt-[1.6rem]">
          {NOW.note}
          <span className="not-italic mono text-[0.75rem]">
            {" "}
            — inspired by{" "}
            <a
              href="https://nownownow.com"
              target="_blank"
              rel="noopener"
              className="text-accent whitespace-nowrap"
            >
              nownownow.com
              <ExternalLink
                className="i-xs ml-1 inline-block align-[-0.15em]"
                aria-hidden
              />
            </a>
          </span>
        </p>
      </section>
    </main>
  );
}
