import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAdjacentPosts, getPostBySlug } from '@/lib/posts'
import { resolveMediaUrl } from '@/lib/media'
import { PostBody } from '@/components/writing/PostBody'
import { ReadingProgress } from '@/components/writing/ReadingProgress'
import { WritingFooter } from '@/components/writing/WritingFooter'

// Experiment sandbox — copy of /writing/[slug] layout with .xp-* scoped
// classes so CSS tweaks here don't bleed into the canonical post route.
// Content is fetched live from the same Bloggz post so iteration tracks
// real prose. To diverge layout, edit this file + .xp-* rules in
// app/desktop.css; canonical layout stays in app/_impl/post.tsx.

const SLUG = 'i-used-git-wrong-for-years'

export const metadata = {
  title: 'Writing exploration — Experiments',
  description: 'Reading-mode layout trial on a real post.',
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toISOString().slice(0, 10).replace(/-/g, '·')
}

export default async function WritingExplorationPage() {
  const post = await getPostBySlug(SLUG)
  if (!post) notFound()

  const { prev, next } = await getAdjacentPosts(SLUG)
  const related = [prev, next].filter(Boolean) as NonNullable<typeof prev>[]
  const heroUrl = resolveMediaUrl(post.heroImage?.url)
  const filename = `${SLUG}.md`

  return (
    <>
      <ReadingProgress />
      <main className="flex-1">
        <section
          className="xp-shell"
          style={{ paddingTop: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
        >
          <header className="xp-head">
            <div className="cs-crumb-line c-sm">
              <span>{filename}</span>
            </div>

            <h1 className="xp-title t-h1">{post.title}</h1>

            {post.metaDescription && <p className="xp-lead t-lead">{post.metaDescription}</p>}

            <div className="xp-meta-strip c-xs">
              {post.categories.map((c, i) => (
                <span key={c.slug} style={{ display: 'contents' }}>
                  {i > 0 && <span className="xp-sep">·</span>}
                  <span className="xp-tag">{c.title.toLowerCase()}</span>
                </span>
              ))}
              {post.categories.length > 0 && <span className="xp-sep">·</span>}
              <span>
                <b>{post.readMinutes}</b> min read
              </span>
              <span className="xp-sep">·</span>
              <span>{post.wordCount.toLocaleString()} words</span>
              <span className="xp-sep">·</span>
              <span>{formatDate(post.publishedAt)}</span>
              <span className="xp-file">{filename}</span>
            </div>
          </header>

          {heroUrl && (
            <Image
              src={heroUrl}
              alt={post.heroImage?.alt ?? ''}
              width={post.heroImage?.width ?? 1600}
              height={post.heroImage?.height ?? 900}
              priority
              unoptimized
              className="xp-hero"
            />
          )}

          {post.content && (
            <article className={`w-prose xp-prose-wrap${post.dropCap ? ' dropcap' : ''}`}>
              <PostBody value={post.content} />
            </article>
          )}

          {related.length > 0 && (
            <section className="xp-related" aria-label="similar reads">
              <h2 className="xp-related-h t-h4">Similar reads</h2>
              <div className="xp-related-grid">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/writing/${r.slug}`}
                    className="xp-rel-card no-pop"
                  >
                    {r.categories[0] && (
                      <div className="xp-rel-cat l-eyebrow">
                        {r.categories[0].title.toLowerCase()}
                      </div>
                    )}
                    <h3 className="xp-rel-title t-h5">{r.title}</h3>
                    {r.metaDescription && (
                      <p className="xp-rel-dek t-body">{r.metaDescription}</p>
                    )}
                    <div className="xp-rel-meta c-xs">
                      <b>{r.readMinutes}</b> min · {r.wordCount.toLocaleString()} words
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </section>
      </main>
      <WritingFooter slug={SLUG} />
    </>
  )
}
