const BLOGGZ_URL = process.env.BLOGGZ_URL ?? 'http://localhost:3001'

// Bloggz stores the Payload local-storage url (e.g. `/api/media/file/x.png`)
// in `media.url`. The actual bytes live in the shared `media_blob` table
// (Postgres bytea), populated by Bloggz's afterChange hook. The portfolio
// serves them from its own origin at /api/bloggz-media/[filename] so the
// browser never has to reach Bloggz. Rewrite the url here.
//
// Handles three input shapes:
//   1. absolute bloggz url (`http://localhost:3001/api/media/file/x.png` or
//      a future `https://bloggz.example.com/...`) → extract pathname,
//      rewrite to local proxy
//   2. relative bloggz path (`/api/media/file/x.png`) → rewrite to local proxy
//   3. anything else → null (don't hand a bare relative path to next/image
//      since it throws "src must start with a leading slash or be an absolute
//      URL" at render time)
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null

  // Normalize absolute bloggz-shaped urls into their pathname so we can
  // route them through our own proxy instead of fetching from bloggz.
  let pathname = url
  if (/^https?:\/\//i.test(url)) {
    try {
      pathname = new URL(url).pathname
    } catch {
      return null
    }
  }

  const match = pathname.match(/\/api\/media\/file\/(.+)$/)
  if (match) return `/api/bloggz-media/${match[1]}`

  // Non-bloggz absolute url (e.g. a hand-set cdn link): pass through.
  if (/^https?:\/\//i.test(url)) return url

  // Relative path that isn't a bloggz media url: fall back to BLOGGZ_URL prefix
  // so legacy/non-media bloggz endpoints still work in local dev.
  if (url.startsWith('/')) return `${BLOGGZ_URL}${url}`

  // Bare relative like 'media/x.png' — next/image would throw. Drop it.
  return null
}
