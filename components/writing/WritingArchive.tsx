'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { CornerDownRight } from 'lucide-react'
import type { PostListItem } from '@/lib/posts'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toISOString().slice(0, 10).replace(/-/g, '·')
}

type Props = { posts: PostListItem[] }

export function WritingArchive({ posts }: Props) {
  const [active, setActive] = useState<string | null>(null)

  const tagCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of posts) {
      for (const c of p.categories) {
        map.set(c.slug, (map.get(c.slug) ?? 0) + 1)
      }
    }
    return map
  }, [posts])

  const tags = useMemo(() => {
    const seen = new Map<string, { slug: string; title: string }>()
    for (const p of posts) for (const c of p.categories) if (!seen.has(c.slug)) seen.set(c.slug, c)
    return [...seen.values()]
  }, [posts])

  const filtered = useMemo(() => {
    if (!active) return posts
    return posts.filter((p) => p.categories.some((c) => c.slug === active))
  }, [posts, active])

  const lastCommit = useMemo(() => {
    const stamps = posts.map((p) => p.publishedAt || p.updatedAt).filter(Boolean) as string[]
    if (stamps.length === 0) return null
    return stamps.sort().slice(-1)[0]
  }, [posts])

  return (
    <>
      <div className="wa-prompt c-md">
        <span className="wa-cmd">$ ls /writing</span>
        <span className="wa-sep">·</span>
        <span>
          {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
        </span>
        {lastCommit && (
          <>
            <span className="wa-sep">·</span>
            <span>last commit {formatDate(lastCommit).replace(/·/g, '-')}</span>
          </>
        )}
        <details className="wa-filter no-pop">
          <summary className="wa-filter-summary no-pop">
            <span className="wa-filter-label">filter</span>
            <span className="wa-filter-current">
              {active
                ? `${tags.find((t) => t.slug === active)?.title.toLowerCase() ?? active} (${tagCounts.get(active) ?? 0})`
                : `all (${posts.length})`}
            </span>
          </summary>
          <div className="wa-filter-menu" role="listbox" aria-label="filter by category">
            <button
              type="button"
              role="option"
              aria-selected={active === null}
              className={`wa-filter-opt no-pop${active === null ? ' on' : ''}`}
              onClick={(e) => {
                setActive(null)
                ;(e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open')
              }}
            >
              all <span className="wa-ct">({posts.length})</span>
            </button>
            {tags.map((t) => (
              <button
                key={t.slug}
                type="button"
                role="option"
                aria-selected={active === t.slug}
                className={`wa-filter-opt no-pop${active === t.slug ? ' on' : ''}`}
                onClick={(e) => {
                  setActive(t.slug)
                  ;(e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open')
                }}
              >
                {t.title.toLowerCase()} <span className="wa-ct">({tagCounts.get(t.slug) ?? 0})</span>
              </button>
            ))}
          </div>
        </details>
      </div>

      <div className="wa-table">
        {filtered.length === 0 ? (
          <p className="wa-empty c-md">{"// no entries match this filter"}</p>
        ) : (
          filtered.map((p) => (
            <Link
              key={p.id}
              href={`/writing/${p.slug}`}
              className="wa-row no-pop"
              prefetch={false}
            >
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

      <div className="wa-foot l-meta">
        <span>{"// end of log"}</span>
        <a href="/rss.xml" className="wa-rss" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <CornerDownRight className="i-sm" aria-hidden /> rss
        </a>
      </div>
    </>
  )
}
