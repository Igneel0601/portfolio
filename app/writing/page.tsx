import { getAllPosts } from '@/lib/posts'
import { WritingArchive } from '@/components/writing/WritingArchive'
import { WritingFooter } from '@/components/writing/WritingFooter'
import { MobileWriting } from '@/components/mobile/MobileWriting'
import { getDevice } from '@/lib/device'

export const revalidate = 60

export const metadata = {
  title: 'Writing — Vaibhav Verma',
  description: 'Notes, essays, build logs.',
}

export default async function WritingPage() {
  const [posts, device] = await Promise.all([getAllPosts(), getDevice()])

  if (device === 'mobile') {
    return (
      <main className="flex-1">
        <MobileWriting posts={posts} />
      </main>
    )
  }

  return (
    <>
      <main className="flex-1">
        <section
          className="w-shell"
          style={{ paddingTop: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
        >
          <div className="l-eyebrow" style={{ color: 'var(--ink-dim)' }}>
            archive · {new Date().getFullYear()}
          </div>

          <h1 className="t-display" style={{ marginTop: '0.75rem' }}>
            writing
            <span style={{ color: 'var(--accent)' }}>.</span>
          </h1>

          <p
            className="t-lead"
            style={{
              marginTop: '1rem',
              color: 'var(--ink-soft)',
              fontStyle: 'italic',
              maxWidth: '42ch',
            }}
          >
            Notes, essays, build logs — work-in-progress thoughts, written in plain text and read in any font.
          </p>

          <WritingArchive posts={posts} />
        </section>
      </main>
      <WritingFooter slug="index" />
    </>
  )
}
