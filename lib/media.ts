const BLOGGZ_URL = process.env.BLOGGZ_URL ?? 'http://localhost:3001'

// Bloggz stores the Payload local-storage url (e.g. `/api/media/file/x.png`)
// in `media.url`. The actual bytes live in the shared `media_blob` table
// (Postgres bytea), populated by Bloggz's afterChange hook. The portfolio
// serves them from its own origin at /api/bloggz-media/[filename] so the
// browser never has to reach Bloggz. Rewrite the url here.
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http')) return url
  const match = url.match(/\/api\/media\/file\/(.+)$/)
  if (match) return `/api/bloggz-media/${match[1]}`
  if (url.startsWith('/')) return `${BLOGGZ_URL}${url}`
  return url
}
