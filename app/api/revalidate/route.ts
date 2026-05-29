import { revalidatePath } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

// On-demand cache purge. Called by bloggz's Posts afterChange hook (or a manual
// curl) when a post is published, so the new post shows on the next visit
// instead of waiting for ISR's stale-while-revalidate.
//
// The site serves /writing via proxy.ts rewrites to /d/writing and /m/writing,
// so both internal paths must be revalidated (plus the per-slug post pages).
//
//   POST /api/revalidate?secret=XXX&slug=<optional-post-slug>
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'invalid secret' }, { status: 401 })
  }

  const slug = req.nextUrl.searchParams.get('slug')?.trim()
  const paths = ['/d/writing', '/m/writing']
  if (slug) paths.push(`/d/writing/${slug}`, `/m/writing/${slug}`)

  for (const p of paths) revalidatePath(p)

  return NextResponse.json({ revalidated: true, paths, now: Date.now() })
}
