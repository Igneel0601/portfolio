import type { WorkRow } from "@/lib/work-rows";
import { GIT_LOG_PREVIEW } from "@/lib/content";
import { DashedRule, PageHeader, WorkPageRow } from "./parts";

export function MobileWorkLog({ rows }: { rows: WorkRow[] }) {
  return (
    <div style={{ background: "var(--paper)" }}>
      <PageHeader title="All projects" />
      <DashedRule />
      {rows.map((r, i) => (
        <WorkPageRow key={`${r.name}-${i}`} row={r} />
      ))}
      <div
        style={{
          padding: "14px 22px 24px",
          borderTop: "1px dashed var(--hair)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            color: "var(--ink-dim)",
            marginBottom: 6,
          }}
        >
          $ git log --oneline | head -3
        </div>
        {GIT_LOG_PREVIEW.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              color: "var(--ink-dim)",
              paddingLeft: 14,
              lineHeight: 1.9,
            }}
          >
            {l}
          </div>
        ))}
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            color: "var(--accent-2)",
            marginTop: 8,
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          FULL LOG ON GITHUB ↗
        </div>
      </div>
    </div>
  );
}
