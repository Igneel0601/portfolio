import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { writingHref } from "@/lib/writing";
import { PageJump } from "./PageJump";

// The pager control cluster shared by both shells: jump field · "page NN of
// NN" · « ‹ › » arrows (dimmed at the boundaries). Desktop pairs it with a
// "showing X–Y of N" status; mobile uses it alone, right-aligned. Styles live
// in tokens.css (.pager-*) so both shells get them.
export function PagerControls({
  page,
  totalPages,
  tag,
}: {
  page: number;
  totalPages: number;
  tag: string | null;
}) {
  return (
    <div className="pager-ctl c-xs">
      <span className="pager-jump-label">jump</span>
      <PageJump page={page} totalPages={totalPages} tag={tag} />
      <span className="pager-of">
        page <b>{String(page).padStart(2, "0")}</b> of {String(totalPages).padStart(2, "0")}
      </span>
      <div className="pager-arrows">
        {page > 1 ? (
          <Link className="pager-nav" href={writingHref(tag, 1)} aria-label="first page">
            <ChevronsLeft className="i-sm" aria-hidden />
          </Link>
        ) : (
          <span className="pager-nav" data-disabled aria-hidden>
            <ChevronsLeft className="i-sm" />
          </span>
        )}
        {page > 1 ? (
          <Link className="pager-nav" href={writingHref(tag, page - 1)} aria-label="previous page">
            <ChevronLeft className="i-sm" aria-hidden />
          </Link>
        ) : (
          <span className="pager-nav" data-disabled aria-hidden>
            <ChevronLeft className="i-sm" />
          </span>
        )}
        {page < totalPages ? (
          <Link className="pager-nav" href={writingHref(tag, page + 1)} aria-label="next page">
            <ChevronRight className="i-sm" aria-hidden />
          </Link>
        ) : (
          <span className="pager-nav" data-disabled aria-hidden>
            <ChevronRight className="i-sm" />
          </span>
        )}
        {page < totalPages ? (
          <Link className="pager-nav" href={writingHref(tag, totalPages)} aria-label="last page">
            <ChevronsRight className="i-sm" aria-hidden />
          </Link>
        ) : (
          <span className="pager-nav" data-disabled aria-hidden>
            <ChevronsRight className="i-sm" />
          </span>
        )}
      </div>
    </div>
  );
}
