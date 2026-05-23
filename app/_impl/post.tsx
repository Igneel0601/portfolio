import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MoveLeft, MoveRight } from 'lucide-react'
import type { Metadata } from 'next'
import { getAdjacentPosts, getPostBySlug, getPostSlugs } from '@/lib/posts'
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

function resolveMediaUrl(url: string | undefined | null): string | null {
  if (!url) return null
  if (url.startsWith('http')) return url
  const base = process.env.BLOGGZ_URL ?? 'http://localhost:3001'
  return `${base}${url}`
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const { prev, next } = await getAdjacentPosts(slug)
  const heroUrl = resolveMediaUrl(post.heroImage?.url)
  const filename = `${slug}.md`

  return (
    <>
      <ReadingProgress />
      <main className="flex-1">
        <section
          className="wp-shell"
          style={{ paddingTop: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
        >
          <div className="cs-crumb-line c-sm" style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/writing" className="cs-back-link no-pop">
              <MoveLeft size={18} strokeWidth={1.5} aria-hidden /> ../
            </Link>
            <span className="cs-sep">·</span>
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
            <article className="w-prose wp-prose-wrap">
              <PostBody value={post.content} />
            </article>
          )}

          {(prev || next) && (
            <nav className="wp-pager" aria-label="post navigation">
              {prev ? (
                <Link href={`/writing/${prev.slug}`} className="wp-pager-card no-pop">
                  <span className="wp-pager-lbl l-eyebrow">
                    <MoveLeft size={16} strokeWidth={1.5} aria-hidden />
                    <span>previous</span>
                  </span>
                  <span className="wp-pager-ttl t-h5">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/writing/${next.slug}`} className="wp-pager-card next no-pop">
                  <span className="wp-pager-lbl l-eyebrow">
                    <span>next</span>
                    <MoveRight size={16} strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="wp-pager-ttl t-h5">{next.title}</span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}

          <div className="wp-foot l-meta">
            <Link
              href="/writing"
              className="no-pop"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <MoveLeft size={16} strokeWidth={1.5} aria-hidden />
              <span>/writing</span>
            </Link>
            <span>// fin</span>
          </div>
        </section>
      </main>
      <WritingFooter slug={slug} />
    </>
  )
}
