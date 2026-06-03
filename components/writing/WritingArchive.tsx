import Link from 'next/link'
import { CornerDownRight } from 'lucide-react'
import type { PostListItem, CategoryCount } from '@/lib/posts'
import { writingHref } from '@/lib/writing'
import { PagerControls } from './PagerControls'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toISOString().slice(0, 10).replace(/-/g, '·')
}

type Props = {
  posts: PostListItem[]
  counts: { all: number; latest: string | null; tags: CategoryCount[] }
  total: number
  tag: string | null
  page: number
  totalPages: number
  perPage: number
}

export function WritingArchive({ posts, counts, total, tag, page, totalPages, perPage }: Props) {
  const above = (page - 1) * perPage
  const start = total === 0 ? 0 : above + 1
  const end = above + posts.length
  return (
    <>
      <div className="wa-prompt c-md">
        <span className="wa-cmd">$ ls /writing</span>
        <span className="wa-sep">·</span>
        <span>
          {total} {total === 1 ? 'entry' : 'entries'}
        </span>
        {counts.latest && (
          <>
            <span className="wa-sep">·</span>
            <span>last commit {formatDate(counts.latest).replace(/·/g, '-')}</span>
          </>
        )}
      </div>

      {/* Filter is URL-driven (server-side) so it composes with pagination —
          each pill is a link to /writing?tag=…, resetting to page 1. */}
      <div className="wa-filter-row tag-filter" role="group" aria-label="filter by category">
        <Link
          href={writingHref(null, 1)}
          className="tag-chip l-meta no-pop"
          data-active={tag === null ? 'true' : undefined}
        >
          all <span>{counts.all}</span>
        </Link>
        {counts.tags.map((t) => (
          <Link
            key={t.slug}
            href={writingHref(t.slug, 1)}
            className="tag-chip l-meta no-pop"
            data-active={tag === t.slug ? 'true' : undefined}
          >
            {t.title} <span>{t.count}</span>
          </Link>
        ))}
      </div>

      <div className="wa-table">
        {posts.length === 0 ? (
          <p className="wa-empty c-md">{'// no entries match this filter'}</p>
        ) : (
          posts.map((p) => (
            <Link key={p.id} href={`/writing/${p.slug}`} className="wa-row no-pop" prefetch={false}>
              <div>
                {p.categories.length > 0 && (
                  <div className="wa-row-top l-eyebrow">
                    {p.categories.map((c, i) => (
                      <span key={c.slug}>
                        <span className={i === 0 ? 'wa-acc' : undefined}>{c.title.toLowerCase()}</span>
                        {i < p.categories.length - 1 && <span className="wa-sep"> · </span>}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="wa-title t-h3">{p.title}</h2>
                {p.metaDescription && <p className="wa-dek t-body">{p.metaDescription}</p>}
              </div>
              <div className="wa-row-bot c-xs">
                <span>{formatDate(p.publishedAt)}</span>
                <span>
                  <b>{p.readMinutes}</b> min · {p.wordCount.toLocaleString()} words
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <nav className="wa-pager c-xs" aria-label="pages">
          <span className="wa-pager-status">
            showing <b>{start}–{end}</b> of <b>{total}</b> entries
          </span>

          <PagerControls page={page} totalPages={totalPages} tag={tag} />
        </nav>
      )}

      <div className="wa-foot l-meta">
        <span>{'// end of log'}</span>
        <a href="/rss.xml" className="wa-rss" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <CornerDownRight className="i-sm" aria-hidden /> rss
        </a>
      </div>
    </>
  )
}
