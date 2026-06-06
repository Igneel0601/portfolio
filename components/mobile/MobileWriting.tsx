/* Server component — the category filter and pagination are URL-driven
   (/writing?tag=&page=), so this just renders the page the server fetched. */

import Link from "next/link";
import { CornerDownRight } from "lucide-react";
import type { PostListItem, CategoryCount } from "@/lib/posts";
import { writingHref } from "@/lib/writing";
import { PagerControls } from "@/components/writing/PagerControls";
import { DashedRule } from "./parts";

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
      <div className="px-[1.375rem] py-[1.125rem]">
        <div className="l-tag mt-6 mb-1 text-ink-dim">archive · {new Date().getFullYear()}</div>
        <h1 className="t-display m-0 text-ink">
          writing<span className="text-accent">.</span>
        </h1>
        <p className="t-lead m-0 mt-[0.85rem] max-w-[42ch] italic text-ink-soft">{SUBTITLE}</p>
        <div className="c-xs flex items-center justify-between gap-3 mt-[1.1rem] text-accent">
          <span>$ ls /writing</span>
          <span className="text-ink-dim">
            {total} entries
            {counts.latest ? ` · last commit ${fmtDate(counts.latest)}` : ""}
          </span>
        </div>
      </div>

      <div className="flex gap-[0.4rem] pt-[0.9rem] px-[1.375rem] pb-[0.1rem] overflow-x-auto scrollbar-none [mask-image:linear-gradient(90deg,#000_88%,transparent)] [-webkit-mask-image:linear-gradient(90deg,#000_88%,transparent)]">
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

        <div className="max-w-[34rem] mx-auto">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/writing/${p.slug}`}
              className="block py-[1.15rem] px-[1.375rem] border-b border-[var(--hair)] text-inherit no-underline no-pop active:bg-[color-mix(in_oklab,var(--accent)_5%,transparent)]"
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <span className="l-meta text-accent">{p.categories[0]?.title ?? "post"}</span>
                <span className="l-meta text-ink-dim whitespace-nowrap">{fmtDate(p.publishedAt ?? p.updatedAt)}</span>
              </div>
              <h2 className="t-h4 m-0 mb-[0.45rem] text-ink text-balance">{p.title}</h2>
              {p.metaDescription && (
                <p className="t-body m-0 mb-[0.6rem] max-w-[46ch] italic text-ink-soft line-clamp-2">
                  {p.metaDescription}
                </p>
              )}
              <div className="c-xs flex items-center gap-2 text-ink-dim">
                {p.readMinutes} min read
                <span className="opacity-40">·</span>
                {p.wordCount.toLocaleString()} words
              </div>
            </Link>
          ))}
        </div>

      {totalPages > 1 && (
        <nav className="flex justify-end pt-10 px-[1.375rem] pb-[1.2rem]" aria-label="pages">
          <PagerControls page={page} totalPages={totalPages} tag={tag} />
        </nav>
      )}

      <div className="l-meta max-w-[34rem] mx-auto mt-[0.6rem] mb-12 px-[1.375rem] flex items-center justify-between gap-3 text-ink-dim">
        <span>{"// end of log"}</span>
        <a href="/rss.xml" className="inline-flex items-center gap-[0.4rem] text-accent no-underline no-pop">
          <CornerDownRight className="i-sm" aria-hidden /> rss
        </a>
      </div>
    </>
  );
}
