/* Server component — the category filter and pagination are URL-driven
   (/writing?tag=&page=), so this just renders the page the server fetched.
   RevealGroup (client) re-staggers on tag/page change via replayKey. */

import Link from "next/link";
import { CornerDownRight } from "lucide-react";
import type { PostListItem, CategoryCount } from "@/lib/posts";
import { writingHref } from "@/lib/writing";
import { PagerControls } from "@/components/writing/PagerControls";
import { DashedRule } from "./parts";
import { RevealGroup } from "./Reveal";

const SUBTITLE =
  "Notes, essays, build logs — work-in-progress thoughts, written in plain text and read in any font.";

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}·${m}·${day}`;
}

type Props = {
  posts: PostListItem[];
  counts: { all: number; latest: string | null; tags: CategoryCount[] };
  total: number;
  tag: string | null;
  page: number;
  totalPages: number;
};

export function MobileWriting({ posts, counts, total, tag, page, totalPages }: Props) {
  return (
    <>
      <div className="m-page-header">
        <div className="l-tag m-page-eyebrow">archive · {new Date().getFullYear()}</div>
        <h1 className="t-display m-page-title" data-eyebrow="true">
          writing<span className="m-page-title-dot">.</span>
        </h1>
        <p className="t-lead m-writing-sub">{SUBTITLE}</p>
        <div className="c-xs m-writing-status">
          <span>$ ls /writing</span>
          <span className="m-writing-status-meta">
            {total} entries
            {counts.latest ? ` · last commit ${fmtDate(counts.latest)}` : ""}
          </span>
        </div>
      </div>

      <div className="m-wfilter">
        <Link
          href={writingHref(null, 1)}
          className="c-xs m-chip no-pop"
          data-active={tag === null ? "true" : undefined}
        >
          all <span>{counts.all}</span>
        </Link>
        {counts.tags.map((c) => (
          <Link
            key={c.slug}
            href={writingHref(c.slug, 1)}
            className="c-xs m-chip no-pop"
            data-active={tag === c.slug ? "true" : undefined}
          >
            {c.title} <span>{c.count}</span>
          </Link>
        ))}
      </div>

      <DashedRule />

      <RevealGroup replayKey={`${tag ?? "all"}-${page}`}>
        <div className="m-writing-list">
          {posts.map((p) => (
            <Link key={p.slug} href={`/writing/${p.slug}`} className="m-wrow m-reveal no-pop">
              <div className="m-wrow-top">
                <span className="l-meta m-wrow-cat">{p.categories[0]?.title ?? "post"}</span>
                <span className="l-meta m-wrow-date">{fmtDate(p.publishedAt ?? p.updatedAt)}</span>
              </div>
              <h2 className="t-h4 m-wrow-title">{p.title}</h2>
              {p.metaDescription && <p className="t-body m-wrow-dek">{p.metaDescription}</p>}
              <div className="c-xs m-wrow-meta">
                {p.readMinutes} min read
                <span className="m-wrow-sep">·</span>
                {p.wordCount.toLocaleString()} words
              </div>
            </Link>
          ))}
        </div>
      </RevealGroup>

      {totalPages > 1 && (
        <nav className="m-pager" aria-label="pages">
          <PagerControls page={page} totalPages={totalPages} tag={tag} />
        </nav>
      )}

      <div className="l-meta m-wfoot">
        <span>{"// end of log"}</span>
        <a href="/rss.xml" className="m-wfoot-rss no-pop">
          <CornerDownRight className="i-sm" aria-hidden /> rss
        </a>
      </div>
    </>
  );
}
