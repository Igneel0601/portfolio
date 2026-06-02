import { Fragment } from "react";
import { MoveRight } from "lucide-react";

// Render a date range: a `→` in the string becomes a lucide MoveRight icon.
// Strings without an arrow (e.g. "Odoo Hackathon") render plain. Used by the
// desktop showcase (ProjectsShowcaseCinematic).
export function DateRange({ text }: { text: string }) {
  const parts = text.split("→");
  if (parts.length === 1) return <>{text}</>;
  return (
    <span className="inline-flex items-center gap-1.5">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <MoveRight className="i-xs" aria-hidden />}
          {part.trim()}
        </Fragment>
      ))}
    </span>
  );
}
