import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const revalidate = 60

export const metadata = {
  title: 'Writing — Vaibhav Verma',
  description: 'Notes, essays, build logs.',
}

function formatDate(iso: string) {
  return new Date(iso).toISOString().slice(0, 10)
}

export default async function WritingPage() {
  const posts = await getAllPosts()

  return (
    <main className="flex-1 pb-12">
      <div className="cs-doc">
        <article className="cs-content">
          <div className="cs-crumb-line">
            <span>$ ls writing/</span>
          </div>

          <h1 className="cs-hero-title">
            writing<span className="acc">.</span>
          </h1>
          <p className="cs-hero-tag">notes, essays, build logs</p>

          {posts.length === 0 ? (
            <p className="opacity-60 mt-8 font-mono text-sm"># no posts yet</p>
          ) : (
            <ul className="mt-8 space-y-6">
              {posts.map((p) => (
                <li key={p.id} className="border-b border-white/10 pb-6">
                  <Link href={`/writing/${p.slug}`} className="group block no-pop">
                    <div className="flex items-baseline gap-3 font-mono text-xs opacity-50">
                      <time dateTime={p.publishedAt ?? undefined}>
                        {p.publishedAt ? formatDate(p.publishedAt) : '—'}
                      </time>
                      {p.categories.length > 0 && (
                        <span>· {p.categories.map((c) => c.title).join(' · ')}</span>
                      )}
                    </div>
                    <h2 className="mt-1 text-xl group-hover:text-[var(--acc,#9eccff)] transition-colors">
                      {p.title}
                    </h2>
                    {p.metaDescription && (
                      <p className="mt-2 opacity-70 text-sm">{p.metaDescription}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </main>
  )
}
