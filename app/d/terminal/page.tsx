import type { Metadata } from 'next'
import { Terminal } from '@/components/terminal/Terminal'
import { getAllPosts } from '@/lib/posts'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'terminal — Vaibhav Verma',
  description: 'A real shell in your browser. Try `help`.',
}

export default async function TerminalPage() {
  let postSlugs: { slug: string; title: string }[] = []
  try {
    const posts = await getAllPosts()
    postSlugs = posts.map((p) => ({ slug: p.slug, title: p.title }))
  } catch {
    // graceful: terminal still works without /writing entries
  }
  return (
    <main className="flex-1 flex">
      <Terminal postSlugs={postSlugs} />
    </main>
  )
}
