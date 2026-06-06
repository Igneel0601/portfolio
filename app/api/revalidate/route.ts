import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

// On-demand cache purge. Called by bloggz's Posts afterChange hook (or a manual
// curl) when a post is published, so the new post shows on the next visit
// instead of waiting for ISR's stale-while-revalidate.
//
//   POST /api/revalidate?secret=XXX&slug=<optional-post-slug>
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'invalid secret' }, { status: 401 })
  }

  const slug = req.nextUrl.searchParams.get('slug')?.trim()
  const paths = ['/writing']
  if (slug) paths.push(`/writing/${slug}`)

  for (const p of paths) revalidatePath(p)
  // Busts the unstable_cache entries behind getPosts/getCategoryCounts so the
  // archive's cached DB reads refresh on the next visit (see lib/posts.ts).
  revalidateTag('writing', 'max')

  return NextResponse.json({ revalidated: true, paths, tags: ['writing'], now: Date.now() })
}
