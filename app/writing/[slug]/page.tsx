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

function formatDate(iso: string) {
  return new Date(iso).toISOString().slice(0, 10)
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
    <main className="flex-1 pb-12">
      <div className="cs-doc">
        <article className="cs-content">
          <div className="cs-crumb-line">
            <Link href="/writing" className="cs-back-link no-pop">
              <ArrowLeft size={12} aria-hidden /> / writing
            </Link>
            <span className="cs-sep">·</span>
            <span>{slug}.md</span>
          </div>

          <h1 className="cs-hero-title">
            {post.title}
            <span className="acc">.</span>
          </h1>

          <div className="cs-hero-tag flex items-baseline gap-3">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            )}
            {post.categories.length > 0 && (
              <span className="opacity-60">
                · {post.categories.map((c) => c.title).join(' · ')}
              </span>
            )}
          </div>

          {heroUrl && (
            <Image
              src={heroUrl}
              alt={post.heroImage?.alt ?? ''}
              width={post.heroImage?.width ?? 1600}
              height={post.heroImage?.height ?? 900}
              priority
              unoptimized
              className="w-full h-auto rounded my-8"
            />
          )}

          {post.content && <PostBody value={post.content} />}
        </article>
      </div>
    </main>
  )
}
