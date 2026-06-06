import "@/app/prose.css";
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAdjacentPosts, getPostBySlug, getPostSlugs } from '@/lib/posts'
import { resolveMediaUrl } from '@/lib/media'
import { Breadcrumb } from '@/components/case-study/Breadcrumb'
import { PostBody } from '@/components/writing/PostBody'
import { ReadingProgress } from '@/components/writing/ReadingProgress'
import { WritingFooter } from '@/components/writing/WritingFooter'
import { JsonLd } from '@/components/JsonLd'
import { postMetadata } from '@/lib/seo/metadata'
import { articleJsonLd } from '@/lib/seo/jsonld'

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
  return postMetadata(post, slug)
}

export async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
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
      <JsonLd data={articleJsonLd(post, slug)} />
      <ReadingProgress />
      <main className="flex-1">
        <section className="page-shell pre-footer-pad pt-[clamp(1.25rem,2.5vw,1.75rem)]">
          <Breadcrumb section="writing" file={filename} />

          <h1 className="t-h1 mt-2 text-balance">{post.title}</h1>

          {post.metaDescription && <p className="t-lead mt-4 text-ink-soft italic">{post.metaDescription}</p>}

          <div className="wp-meta-strip c-xs">
            {post.categories.map((c, i) => (
              <span key={c.slug} className="contents">
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
              className="w-full h-auto rounded-[4px] mt-10"
            />
          )}

          {post.content && (
            <article className={`w-prose wp-prose-wrap${post.dropCap ? ' dropcap' : ''}`}>
              <PostBody value={post.content} />
            </article>
          )}

          {related.length > 0 && (
            <section className="mt-14 pt-[1.75rem] border-t border-[var(--hair)]" aria-label="similar reads">
              <h2 className="t-h4 m-0 mb-5 text-ink">Similar reads</h2>
              <div className="wp-related-grid">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/writing/${r.slug}`}
                    className="wp-rel-card no-pop"
                  >
                    {r.categories[0] && (
                      <div className="l-eyebrow text-accent">
                        {r.categories[0].title.toLowerCase()}
                      </div>
                    )}
                    <h3 className="wp-rel-title t-h5">{r.title}</h3>
                    {r.metaDescription && (
                      <p className="t-body m-0 text-ink-soft line-clamp-2">{r.metaDescription}</p>
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
