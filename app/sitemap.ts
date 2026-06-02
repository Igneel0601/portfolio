import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { listCaseStudies } from '@/lib/case-studies'
import { SITE_URL as SITE } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, studies] = await Promise.all([
    getAllPosts().catch(() => []),
    listCaseStudies().catch(() => []),
  ])

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

  const studyEntries: MetadataRoute.Sitemap = studies.map((s) => ({
    url: `${SITE}/work/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticEntries, ...postEntries, ...studyEntries]
}
