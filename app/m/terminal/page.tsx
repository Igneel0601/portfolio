import { Terminal } from '@/components/terminal/Terminal'
import { getAllPosts } from '@/lib/posts'
import { pageMetadata } from '@/lib/seo/metadata'

export const revalidate = 300

export const metadata = pageMetadata('terminal')

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
