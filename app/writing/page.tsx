import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const revalidate = 60

export const metadata = {
  title: 'Writing — Vaibhav Verma',
  description: 'Notes, essays, build logs.',
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toISOString().slice(0, 10).replace(/-/g, ' · ')
}

export default async function WritingPage() {
  const posts = await getAllPosts()

  return (
    <main className="flex-1 pb-24">
      <section className="w-shell pt-24">
        <div className="l-eyebrow" style={{ color: 'var(--ink-dim)' }}>
          archive · {new Date().getFullYear()}
        </div>

        <h1
          className="t-display"
          style={{
            marginTop: '0.75rem',
            letterSpacing: '0.025em',
            lineHeight: 1.05,
          }}
        >
          writing
          <span style={{ color: 'var(--accent)' }}>.</span>
        </h1>

        <p
          className="t-lead"
          style={{
            marginTop: '1rem',
            color: 'var(--ink-soft)',
            fontStyle: 'italic',
            maxWidth: '40ch',
          }}
        >
          Notes, essays, build logs.
        </p>

        <div className="cs-crumb-line" style={{ marginTop: '3rem' }}>
          <span>$ ls writing/</span>
          <span className="cs-sep">·</span>
          <span>
            {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {posts.length === 0 ? (
          <p className="c-md" style={{ marginTop: '2rem', color: 'var(--ink-dim)' }}>
            # no posts yet
          </p>
        ) : (
          <ul
            style={{
              marginTop: '2rem',
              listStyle: 'none',
              padding: 0,
              borderTop: '1px solid var(--hair)',
            }}
          >
            {posts.map((p, i) => (
              <li key={p.id} className="w-row">
                <div className="l-meta" style={{ color: 'var(--ink-dim)', lineHeight: 1.7 }}>
                  <span style={{ display: 'block', color: 'var(--ink-dim)', opacity: 0.55 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ display: 'block', marginTop: '0.5rem', color: 'var(--ink-soft)' }}>
                    {formatDate(p.publishedAt)}
                  </span>
                  {p.categories.length > 0 && (
                    <span style={{ display: 'block', marginTop: '0.35rem' }}>
                      {p.categories.map((c) => c.title).join(' · ')}
                    </span>
                  )}
                </div>

                <Link
                  href={`/writing/${p.slug}`}
                  className="no-pop"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <h2 className="t-h3 w-row-title">{p.title}</h2>
                  {p.metaDescription && (
                    <p
                      className="t-body"
                      style={{
                        marginTop: '0.5rem',
                        color: 'var(--ink-soft)',
                        maxWidth: '62ch',
                      }}
                    >
                      {p.metaDescription}
                    </p>
                  )}
                  <span
                    className="l-eyebrow w-row-cta"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'baseline',
                      gap: '0.5rem',
                      marginTop: '0.85rem',
                      color: 'var(--ink-dim)',
                    }}
                  >
                    read →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
