import { headers } from 'next/headers'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { lexicalToHtml } from '@/lib/feed-html'
import { PROFILE } from '@/lib/profile'

export const revalidate = 3600

const SITE_TITLE = PROFILE.writingFeed.title
const SITE_DESC = PROFILE.writingFeed.description

async function resolveSiteUrl(): Promise<string> {
  if (process.env.SITE_URL) return process.env.SITE_URL
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'vergnyx.dev'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const [list, siteUrl] = await Promise.all([getAllPosts(), resolveSiteUrl()])
  const lastBuild = list[0]?.publishedAt ?? list[0]?.updatedAt ?? new Date().toISOString()

  // Full post bodies for <content:encoded> (getPostBySlug expands media uploads
  // + is per-slug cached). getAllPosts only carries metadata, so we hydrate here.
  const posts = await Promise.all(list.map((p) => getPostBySlug(p.slug)))

  const items = posts
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map((p) => {
      const url = `${siteUrl}/writing/${p.slug}`
      const date = new Date(p.publishedAt ?? p.updatedAt).toUTCString()
      const categories = p.categories
        .map((c) => `<category>${escapeXml(c.title)}</category>`)
        .join('')
      // Split any literal ]]> so it can't terminate the CDATA section early.
      const body = lexicalToHtml(p.content, siteUrl).replace(/]]>/g, ']]]]><![CDATA[>')
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escapeXml(p.metaDescription ?? '')}</description>
      <content:encoded><![CDATA[${body}]]></content:encoded>
      ${categories}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${siteUrl}/writing</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE_DESC)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=600, s-maxage=3600',
    },
  })
}
