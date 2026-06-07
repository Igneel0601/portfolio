import Link from "next/link";
import { MoveRight, Quote } from "lucide-react";
import { ABOUT } from "@/lib/content";

// Shared /about body (both shells). Narrative serif bio + mono fact rail —
// the one deliberately expressive personal page. Copy lives in lib/content.ts.
export function AboutPage() {
  return (
    <main className="flex-1">
      <section className="page-shell ab pt-[clamp(1.25rem,2.5vw,1.75rem)]">
        <div className="l-eyebrow text-ink-dim mt-2">{ABOUT.eyebrow}</div>
        <h1 className="t-display mt-3">
          about<span className="text-accent">.</span>
        </h1>
        <p className="t-lead mt-4 max-w-[28ch] text-ink-soft italic">{ABOUT.lede}</p>

        <div className="ab-cmd c-sm">
          <span className="ab-prompt">$</span> whoami
          {ABOUT.whoami.map((w) => (
            <span key={w}>
              <span className="ab-sep">·</span>
              {w}
            </span>
          ))}
        </div>

        <div className="ab-grid">
          <div className="ab-prose">
            {ABOUT.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="ab-sign">
              {ABOUT.sign} Say hi on{" "}
              <Link href="/contact" className="ab-link no-pop">
                /contact
              </Link>
              .
            </p>
          </div>

          <aside className="ab-rail-wrap">
            <div className="border border-[var(--hair)] rounded-[0.375rem] overflow-hidden">
              {ABOUT.rail.map((r) => (
                <div className="grid [grid-template-columns:5.5rem_1fr] gap-4 py-[0.65rem] px-4 border-b border-[var(--hair)] mono text-[0.8125rem] last:border-b-0" key={r.k}>
                  <span className="text-ink-dim">{r.k}</span>
                  <span className="text-ink-soft">{r.v}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-6 pt-5 pr-[1.4rem] pb-5 pl-[2.4rem] border border-[var(--hair)] border-l-2 border-l-accent bg-paper-2 rounded-[0.1875rem] serif italic text-ink-soft leading-[1.4]">
              <Quote
                className="absolute text-accent w-6 h-6"
                style={{ top: '0.85rem', left: '0.55rem', opacity: 0.3, transform: 'scaleX(-1)' }}
                aria-hidden
              />
              {ABOUT.quote}
            </div>
          </aside>
        </div>

        <div className="mt-20">
          <div className="ab-cmd c-sm">
            <span className="ab-prompt">$</span> cat next_steps.txt
          </div>
          <div className="ab-links">
            <Link href="/now" className="ab-biglink no-pop">
              <span className="ab-bl-k">/now</span>
              <span className="ab-bl-v">what I&apos;m actually doing this week</span>
              <MoveRight className="i-sm ab-bl-ar" aria-hidden />
            </Link>
            <Link href="/uses" className="ab-biglink no-pop">
              <span className="ab-bl-k">/uses</span>
              <span className="ab-bl-v">the desk, the keys, the dotfiles</span>
              <MoveRight className="i-sm ab-bl-ar" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
