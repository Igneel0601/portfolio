import { getPosts, getCategoryCounts } from '@/lib/posts'
import { WritingArchive } from '@/components/writing/WritingArchive'
import { WritingFooter } from '@/components/writing/WritingFooter'
import { MobileWriting } from '@/components/mobile/MobileWriting'
import { pageMetadata } from '@/lib/seo/metadata'

export const revalidate = 60

export const metadata = pageMetadata('writing')

const PER_PAGE = 10

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>
}) {
  const sp = await searchParams
  const tag = sp.tag ?? null
  const requested = Number.parseInt(sp.page ?? '1', 10)
  const [{ posts, total, page, totalPages }, counts] = await Promise.all([
    getPosts({ page: Number.isFinite(requested) ? requested : 1, perPage: PER_PAGE, tag }),
    getCategoryCounts(),
  ])

  return (
    <>
      {/* Desktop archive */}
      <main className="flex-1 hidden md:block">
        <section className="page-shell pt-[clamp(1.25rem,2.5vw,1.75rem)]">
          <div className="l-eyebrow text-ink-dim">
            archive · {new Date().getFullYear()}
          </div>

          <h1 className="t-display mt-3">
            writing
            <span className="text-accent">.</span>
          </h1>

          <p className="t-lead mt-4 text-ink-soft italic max-w-[42ch]">
            Notes, essays, build logs — work-in-progress thoughts, written in plain text and read in any font.
          </p>

          <WritingArchive
            posts={posts}
            counts={counts}
            total={total}
            tag={tag}
            page={page}
            totalPages={totalPages}
            perPage={PER_PAGE}
          />
        </section>
      </main>
      <WritingFooter slug="index" className="hidden md:block" />

      {/* Mobile archive */}
      <main className="flex-1 md:hidden">
        <MobileWriting
          posts={posts}
          counts={counts}
          total={total}
          tag={tag}
          page={page}
          totalPages={totalPages}
        />
      </main>
    </>
  )
}
