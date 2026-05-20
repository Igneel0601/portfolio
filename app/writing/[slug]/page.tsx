import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { getPostBySlug, getPostSlugs } from '@/lib/posts'
import { PostBody } from '@/components/writing/PostBody'

export const revalidate = 60
export const dynamicParams = true

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
  return new Date(iso).toISOString().slice(0, 10).replace(/-/g, ' · ')
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

  const heroUrl = resolveMediaUrl(post.heroImage?.url)

  return (
    <main className="flex-1 pb-24">
      <section className="w-post-shell pt-24">
        <aside className="w-aside l-meta" aria-label="post metadata">
          <span className="w-label">filed</span>
          <span className="w-val">{formatDate(post.publishedAt)}</span>

          {post.categories.length > 0 && (
            <>
              <span className="w-label">under</span>
              {post.categories.map((c) => (
                <span key={c.id} className="w-val">
                  {c.title}
                </span>
              ))}
            </>
          )}

          <span className="w-label">file</span>
          <span className="w-val">{slug}.md</span>
        </aside>

        <div className="cs-crumb-line">
          <Link href="/writing" className="cs-back-link no-pop">
            <ArrowLeft size={12} aria-hidden /> / writing
          </Link>
          <span className="cs-sep">·</span>
          <span>{slug}.md</span>
        </div>

        <h1
          className="t-display"
          style={{
            marginTop: '1.25rem',
            maxWidth: '18ch',
            letterSpacing: '0.025em',
            lineHeight: 1.05,
          }}
        >
          {post.title}
        </h1>

        {post.metaDescription && (
          <p
            className="t-lead"
            style={{
              marginTop: '1rem',
              color: 'var(--ink-soft)',
              fontStyle: 'italic',
              maxWidth: '52ch',
            }}
          >
            {post.metaDescription}
          </p>
        )}

        {heroUrl && (
          <Image
            src={heroUrl}
            alt={post.heroImage?.alt ?? ''}
            width={post.heroImage?.width ?? 1600}
            height={post.heroImage?.height ?? 900}
            priority
            unoptimized
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '4px',
              margin: '2.5rem 0',
            }}
          />
        )}

        {post.content && (
          <div
            className="w-prose t-lead"
            style={{ marginTop: '3rem', maxWidth: '72ch', color: 'var(--ink)' }}
          >
            <PostBody value={post.content} />
          </div>
        )}

        <div className="w-post-footer">
          <Link href="/writing" className="l-meta no-pop">
            ← back to writing
          </Link>
          <span className="l-meta">// fin</span>
        </div>
      </section>
    </main>
  )
}
