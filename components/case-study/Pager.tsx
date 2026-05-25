import Link from "next/link";
import { MoveLeft, MoveRight } from "lucide-react";
import type { StudyMeta } from "@/lib/case-studies";

export function Pager({
  prev,
  next,
}: {
  prev: StudyMeta | null;
  next: StudyMeta | null;
}) {
  return (
    <nav className="cs-pager" aria-label="case study navigation">
      {prev ? (
        <Link
          href={`/work/${prev.slug}`}
          className="cs-pager-card cs-pager-link no-pop"
        >
          <span className="cs-pager-lbl l-eyebrow">
            <MoveLeft className="i-sm" aria-hidden /> prev
          </span>
          <span className="cs-pager-title t-body">[{prev.title}]</span>
        </Link>
      ) : (
        <div className="cs-pager-card cs-pager-empty">
          <span className="cs-pager-lbl l-eyebrow">
            <MoveLeft className="i-sm" aria-hidden /> prev
          </span>
          <span className="cs-pager-empty-txt c-md">no earlier study</span>
        </div>
      )}
      {next ? (
        <Link
          href={`/work/${next.slug}`}
          className="cs-pager-card cs-pager-link no-pop"
        >
          <span className="cs-pager-lbl l-eyebrow">
            next <MoveRight className="i-sm" aria-hidden />
          </span>
          <span className="cs-pager-title t-body">[{next.title}]</span>
        </Link>
      ) : (
        <div className="cs-pager-card cs-pager-empty">
          <span className="cs-pager-lbl l-eyebrow">
            next <MoveRight className="i-sm" aria-hidden />
          </span>
          <span className="cs-pager-empty-txt c-md">end of series</span>
        </div>
      )}
    </nav>
  );
}
