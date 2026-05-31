import Link from "next/link";
import { MoveRight } from "lucide-react";
import type { ReactNode } from "react";
import { PROJECTS } from "@/lib/content";
import { SectionHeader } from "./parts";

/* Per-project presentation extras that don't live in the content model:
   which accent each panel themes to (1/2/3 → --accent/-2/-3, set via
   data-accent so there's no inline CSS), a one-line "insight" in Vaibhav's
   voice, and the status badge label. Keyed by project id so content.ts
   stays the single source of truth for everything else. */
type PanelExtra = { accent: 1 | 2 | 3; badge: string; insight: ReactNode };

const PANEL_EXTRAS: Record<string, PanelExtra> = {
  codeflow: {
    accent: 1,
    badge: "live",
    insight: (
      <>
        <em>Inngest</em> runs each agent step as a durable job — long chains
        never freeze the UI. <em>E2B</em> sandboxes run the output.
      </>
    ),
  },
  taskforge: {
    accent: 2,
    badge: "live",
    insight: (
      <>
        <em>Liveblocks</em> runs the whole real-time layer — presence, shared
        storage, conflict resolution. Zero websocket code.
      </>
    ),
  },
  traveloop: {
    accent: 3,
    badge: "2nd place",
    insight: (
      <>
        Trips → stops → days → activities → budgets: a{" "}
        <em>nested document model</em> that maps the domain exactly. Four
        people, one weekend.
      </>
    ),
  },
};

const FALLBACK: PanelExtra = { accent: 1, badge: "shipped", insight: null };

export function MobileProjects() {
  return (
    <>
      <SectionHeader eyebrow="$ ls ~/projects" title="three things I shipped." />
      <div className="m-projects">
        {PROJECTS.map((p) => {
          const x = PANEL_EXTRAS[p.id] ?? FALLBACK;
          return (
            <article key={p.id} className="m-panel" data-accent={x.accent}>
              <div className="l-meta m-panel-meta">
                <span className="m-panel-num">{p.index}</span>
                <span className="m-panel-sep">/</span>
                <span>{p.meta}</span>
                <span className="m-panel-badge">
                  <i className="m-panel-dot" aria-hidden />
                  {x.badge}
                </span>
              </div>

              <h3 className="m-panel-name">{p.name}</h3>
              <div className="m-panel-rule" />

              <p className="t-lead m-panel-tagline">{p.blurb}</p>
              {x.insight && <p className="c-xs m-panel-insight">{x.insight}</p>}

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
          );
        })}
      </div>
    </>
  );
}
