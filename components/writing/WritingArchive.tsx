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
      <div className="c-md mt-12 text-ink-soft flex items-baseline gap-2.5 flex-wrap">
        <span className="text-accent">$ ls /writing</span>
        <span className="opacity-50">·</span>
        <span>
          {total} {total === 1 ? 'entry' : 'entries'}
        </span>
        {counts.latest && (
          <>
            <span className="opacity-50">·</span>
            <span>last commit {formatDate(counts.latest).replace(/·/g, '-')}</span>
          </>
        )}
      </div>

      {/* Filter is URL-driven (server-side) so it composes with pagination —
          each pill is a link to /writing?tag=…, resetting to page 1. */}
      <div className="mt-5 tag-filter" role="group" aria-label="filter by category">
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

      <div className="mt-6 grid gap-0">
        {posts.length === 0 ? (
          <p className="c-md text-ink-dim py-8">{'// no entries match this filter'}</p>
        ) : (
          posts.map((p) => (
            <Link
              key={p.id}
              data-wa-row
              href={`/writing/${p.slug}`}
              className="no-pop group grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center py-5 border-b border-hair [&:first-child]:border-t text-inherit no-underline transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--accent)_4%,transparent)]"
              prefetch={false}
            >
              <div>
                {p.categories.length > 0 && (
                  <div className="l-eyebrow flex items-baseline gap-1 text-ink-dim mb-[0.45rem]">
                    {p.categories.map((c, i) => (
                      <span key={c.slug}>
                        <span data-wa-cat={i === 0 ? '' : undefined} className={i === 0 ? 'text-accent' : undefined}>{c.title.toLowerCase()}</span>
                        {i < p.categories.length - 1 && <span className="opacity-50"> · </span>}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="t-h3 text-ink m-0 transition-colors duration-[250ms] group-hover:text-accent">{p.title}</h2>
                {p.metaDescription && <p className="t-body mt-[0.4rem] italic text-ink-soft max-w-[72ch]">{p.metaDescription}</p>}
              </div>
              <div className="c-xs flex flex-col items-end gap-[0.35rem] text-ink-dim text-right whitespace-nowrap">
                <span>{formatDate(p.publishedAt)}</span>
                <span>
                  <b className="text-ink-soft font-medium">{p.readMinutes}</b> min · {p.wordCount.toLocaleString()} words
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <nav className="c-xs flex items-center justify-between flex-wrap gap-4 mt-10 text-ink-dim" aria-label="pages">
          <span>
            showing <b className="text-ink-soft font-medium">{start}–{end}</b> of{' '}
            <b className="text-ink-soft font-medium">{total}</b> entries
          </span>

          <PagerControls page={page} totalPages={totalPages} tag={tag} />
        </nav>
      )}

      <div className="l-meta mt-8 flex justify-between text-ink-dim">
        <span>{'// end of log'}</span>
        <a
          href="/rss.xml"
          className="text-accent no-underline hover:underline inline-flex items-center gap-[6px]"
        >
          <CornerDownRight className="i-sm" aria-hidden /> rss
        </a>
      </div>
    </>
  )
}
