import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { SITE_URL as SITE } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts().catch(() => [])

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE}/work`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/writing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE}/experiments`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/writing/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticEntries, ...postEntries]
}
