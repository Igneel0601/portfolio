import { headers } from 'next/headers'
import { getAllPosts } from '@/lib/posts'

export const revalidate = 3600

const SITE_TITLE = 'Vaibhav Verma — Writing'
const SITE_DESC = 'Notes, essays, build logs.'

async function resolveSiteUrl(): Promise<string> {
  if (process.env.SITE_URL) return process.env.SITE_URL
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'portfolio.igneel.cloud'
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
  const [posts, siteUrl] = await Promise.all([getAllPosts(), resolveSiteUrl()])
  const lastBuild = posts[0]?.publishedAt ?? posts[0]?.updatedAt ?? new Date().toISOString()

  const items = posts
    .map((p) => {
      const url = `${siteUrl}/writing/${p.slug}`
      const date = new Date(p.publishedAt ?? p.updatedAt).toUTCString()
      const categories = p.categories
        .map((c) => `<category>${escapeXml(c.title)}</category>`)
        .join('')
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escapeXml(p.metaDescription ?? '')}</description>
      ${categories}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
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
