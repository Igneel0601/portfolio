"use client";

/* Client component now (was server-only) because the category filter holds
   interactive state. The server page still does the data fetch:
       const posts = await getAllPosts();
       return <MobileWriting posts={posts} />;
   so all DB work stays on the server — this piece only owns filter state.
   Chips + counts derive from `posts`, so new categories appear automatically
   with correct counts and need zero maintenance. */

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CornerDownRight } from "lucide-react";
import type { PostListItem } from "@/lib/posts";
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

function catOf(p: PostListItem): string {
  return p.categories[0]?.title ?? "post";
}

export function MobileWriting({ posts }: { posts: PostListItem[] }) {
  const [active, setActive] = useState("all");
  const stripRef = useRef<HTMLDivElement>(null);

  // categories derived from posts → sorted by frequency, biggest first.
  const cats = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of posts) m.set(catOf(p), (m.get(catOf(p)) ?? 0) + 1);
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([title, count]) => ({ title, count }));
  }, [posts]);

  const shown = active === "all" ? posts : posts.filter((p) => catOf(p) === active);
  const lastCommit = fmtDate(posts[0]?.publishedAt ?? posts[0]?.updatedAt ?? null);

  // scroll the picked chip toward centre without scrollIntoView (which can
  // hijack the whole page scroll).
  function pick(name: string, el: HTMLButtonElement) {
    setActive(name);
    const strip = stripRef.current;
    if (strip) {
      strip.scrollTo({
        left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }

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
            {posts.length} entries · last commit {lastCommit}
          </span>
        </div>
      </div>

      <div className="m-wfilter" ref={stripRef}>
        <button
          type="button"
          className="c-xs m-chip"
          data-active={active === "all" ? "true" : undefined}
          onClick={(e) => pick("all", e.currentTarget)}
        >
          all <span>{posts.length}</span>
        </button>
        {cats.map((c) => (
          <button
            key={c.title}
            type="button"
            className="c-xs m-chip"
            data-active={active === c.title ? "true" : undefined}
            onClick={(e) => pick(c.title, e.currentTarget)}
          >
            {c.title} <span>{c.count}</span>
          </button>
        ))}
      </div>

      <DashedRule />

      <RevealGroup replayKey={active}>
        <div className="m-writing-list">
          {shown.map((p) => (
            <Link key={p.slug} href={`/writing/${p.slug}`} className="m-wrow m-reveal">
            <div className="m-wrow-top">
              <span className="l-meta m-wrow-cat">{catOf(p)}</span>
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

      <div className="l-meta m-wfoot">
        <span>// end of log</span>
        <a href="/rss.xml" className="m-wfoot-rss">
          <CornerDownRight className="i-sm" aria-hidden /> rss
        </a>
      </div>
    </>
  );
}
