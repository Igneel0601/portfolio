import Link from "next/link";
import { MoveRight } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/content";
import { Insight } from "@/components/Insight";
import { SectionHeader } from "./parts";
import { RevealGroup } from "./Reveal";

/* tint (a/s/e) → data-accent (1/2/3), which mobile.css maps to --accent/-2/-3.
   Everything else a panel shows — status badge, insight — comes straight from
   lib/content.ts, the single source of truth shared with the desktop showcase. */
const ACCENT: Record<Project["tint"], 1 | 2 | 3> = { a: 1, s: 2, e: 3 };

/* Each panel is its own full-screen page (a direct child of the deck track),
   so the pager treats them as separate swipes. Reveal is scoped per panel. */
export function MobileProjects() {
  return PROJECTS.map((p, i) => {
    return (
      <section key={p.id} className="m-panel-screen">
        {i === 0 && (
          <SectionHeader
            eyebrow={
              <Link href="/work" style={{ color: "inherit" }}>
                $ ls /projects
              </Link>
            }
            title="three things I shipped."
          />
        )}
        <RevealGroup>
          <article className="m-panel m-reveal" data-accent={ACCENT[p.tint]}>
            <div className="l-meta m-panel-meta">
              <span className="m-panel-num">{p.index}</span>
              <span className="m-panel-sep">/</span>
              <span>{p.meta}</span>
              <span className="m-panel-badge">
                <i className="m-panel-dot" aria-hidden />
                {p.status}
              </span>
            </div>

            <h3 className="m-panel-name">{p.name}</h3>
            <div className="m-panel-rule" />

            <p className="t-lead m-panel-tagline">{p.blurb}</p>
            {p.insight && (
              <p className="c-xs m-panel-insight">
                <Insight text={p.insight} breaks={false} />
              </p>
            )}

            <div className="m-panel-stack">
              {p.stack.map((s) => (
                <span key={s} className="c-xs m-panel-chip">
                  {s}
                </span>
              ))}
            </div>

            <Link href={`/work/${p.id}`} className="c-md m-panel-cta">
              cat {p.id}.mdx
              <MoveRight className="i-sm m-panel-cta-icon" aria-hidden />
            </Link>
          </article>
        </RevealGroup>
      </section>
    );
  });
}
