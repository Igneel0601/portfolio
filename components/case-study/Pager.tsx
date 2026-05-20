import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
          <span className="cs-pager-lbl">
            <ArrowLeft size={14} strokeWidth={1.5} aria-hidden /> prev
          </span>
          <span className="cs-pager-title">[{prev.title}]</span>
        </Link>
      ) : (
        <div className="cs-pager-card cs-pager-empty">
          <span className="cs-pager-lbl">
            <ArrowLeft size={14} strokeWidth={1.5} aria-hidden /> prev
          </span>
          <span className="cs-pager-empty-txt">no earlier study</span>
        </div>
      )}
      {next ? (
        <Link
          href={`/work/${next.slug}`}
          className="cs-pager-card cs-pager-link no-pop"
        >
          <span className="cs-pager-lbl">
            next <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
          </span>
          <span className="cs-pager-title">[{next.title}]</span>
        </Link>
      ) : (
        <div className="cs-pager-card cs-pager-empty">
          <span className="cs-pager-lbl">
            next <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
          </span>
          <span className="cs-pager-empty-txt">end of series</span>
        </div>
      )}
    </nav>
  );
}
