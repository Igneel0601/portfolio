import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAdjacentPosts, getPostBySlug, getPostSlugs } from '@/lib/posts'
import { resolveMediaUrl } from '@/lib/media'
import { PostBody } from '@/components/writing/PostBody'
import { ReadingProgress } from '@/components/writing/ReadingProgress'
import { WritingFooter } from '@/components/writing/WritingFooter'

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toISOString().slice(0, 10).replace(/-/g, '·')
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Not found' }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || undefined
  const ogUrl = resolveMediaUrl(post.metaImage?.url ?? post.heroImage?.url) ?? undefined

  return {
    title,
    description,
    openGraph: { title, description, images: ogUrl ? [{ url: ogUrl }] : undefined },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogUrl ? [ogUrl] : undefined,
    },
  }
}

export async function PostPage({
  params,
  shell,
}: {
  params: Promise<{ slug: string }>
  shell: 'd' | 'm'
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const { prev, next } = await getAdjacentPosts(slug)
  const related = [prev, next].filter(Boolean) as NonNullable<typeof prev>[]
  const heroUrl = resolveMediaUrl(post.heroImage?.url)
  const filename = `${slug}.md`

  return (
    <>
      {shell === 'd' && <ReadingProgress />}
      <main className="flex-1">
        <section className="wp-shell">
          <div className="cs-crumb-line c-sm">
            <span>{filename}</span>
          </div>

          <h1 className="wp-title t-h1">{post.title}</h1>

          {post.metaDescription && <p className="wp-lead t-lead">{post.metaDescription}</p>}

          <div className="wp-meta-strip c-xs">
            {post.categories.map((c, i) => (
              <span key={c.slug} style={{ display: 'contents' }}>
                {i > 0 && <span className="wp-sep">·</span>}
                <span className="wp-tag">{c.title.toLowerCase()}</span>
              </span>
            ))}
            {post.categories.length > 0 && <span className="wp-sep">·</span>}
            <span>
              <b>{post.readMinutes}</b> min read
            </span>
            <span className="wp-sep">·</span>
            <span>{post.wordCount.toLocaleString()} words</span>
            <span className="wp-sep">·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span className="wp-file">{filename}</span>
          </div>

          {heroUrl && (
            <Image
              src={heroUrl}
              alt={post.heroImage?.alt ?? ''}
              width={post.heroImage?.width ?? 1600}
              height={post.heroImage?.height ?? 900}
              priority
              unoptimized
              className="wp-hero"
            />
          )}

          {post.content && (
            <article className={`w-prose wp-prose-wrap${post.dropCap ? ' dropcap' : ''}`}>
              <PostBody value={post.content} />
            </article>
          )}

          {related.length > 0 && (
            <section className="wp-related" aria-label="similar reads">
              <h2 className="wp-related-h t-h4">Similar reads</h2>
              <div className="wp-related-grid">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/writing/${r.slug}`}
                    className="wp-rel-card no-pop"
                  >
                    {r.categories[0] && (
                      <div className="wp-rel-cat l-eyebrow">
                        {r.categories[0].title.toLowerCase()}
                      </div>
                    )}
                    <h3 className="wp-rel-title t-h5">{r.title}</h3>
                    {r.metaDescription && (
                      <p className="wp-rel-dek t-body">{r.metaDescription}</p>
                    )}
                    <div className="wp-rel-meta c-xs">
                      <b>{r.readMinutes}</b> min · {r.wordCount.toLocaleString()} words
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </section>
      </main>
      <WritingFooter slug={slug} />
    </>
  )
}
