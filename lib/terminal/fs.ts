import { PROJECTS, TIMELINE, CONTACT, GIT_LOG_PREVIEW, USES, NOW } from '@/lib/content'
import { FACTS, DEGREE_GRAD, PROFILE } from '@/lib/profile'

// "open to work" → "Open to work" for sentence-start use
const AVAIL_CAP = `${FACTS.availability[0].toUpperCase()}${FACTS.availability.slice(1)}`

export type FsFile = {
  kind: 'file'
  name: string
  ext: string
  content: string | (() => Promise<string>)
}

export type FsDir = {
  kind: 'dir'
  name: string
  entries: Record<string, FsNode>
}

export type FsNode = FsFile | FsDir

function file(name: string, content: string | (() => Promise<string>)): FsFile {
  const dot = name.lastIndexOf('.')
  const ext = dot >= 0 ? name.slice(dot + 1) : ''
  return { kind: 'file', name, ext, content }
}

function dir(name: string, entries: Record<string, FsNode>): FsDir {
  return { kind: 'dir', name, entries }
}

const ABOUT_MD = `# vaibhav verma

I'm Vaibhav. ${PROFILE.tagline}

${DEGREE_GRAD}, based in ${FACTS.location}. ${AVAIL_CAP}.

## stack right now
${FACTS.stack.join(' · ').toLowerCase()}

## currently
${FACTS.focus}.
writing build logs at /writing.

## off-keyboard
arch ricing · sci-fi · filter coffee.
`

// Generated from the canonical /now data (NOW) so the terminal mirrors the page.
const NOW_MD = `# /now · ${NOW.updated.slice(0, 7)}

${NOW.lede}

${NOW.log
  .map(
    (c) =>
      `## ${c.cat}\n${c.entries
        .map((e) => `- ${e.line}${e.meta ? ` (${e.meta})` : ''}`)
        .join('\n')}`,
  )
  .join('\n\n')}

last updated: ${NOW.updated}
`

// Generated from the canonical /uses data (USES) so the terminal can't drift
// from the page. Name · meta per row, grouped by category.
const USES_MD = `# /uses

${USES.lede}

${USES.cats
  .map(
    (c) =>
      `## ${c.label}\n${c.rows
        .map((r) => (r.meta ? `${r.name} · ${r.meta}` : r.name))
        .join('\n')}`,
  )
  .join('\n\n')}
`

const CONTACT_VCARD = `BEGIN:VCARD
VERSION:3.0
FN:Vaibhav Verma
EMAIL:${CONTACT.email}
URL;TYPE=github:${CONTACT.github}
URL;TYPE=linkedin:${CONTACT.linkedin}
URL;TYPE=x:${CONTACT.x}
END:VCARD`

const TIMELINE_TXT = TIMELINE
  .map(s => `${s.when.padEnd(6)} · ${s.title}\n         ${s.blurb}`)
  .join('\n\n')

function projectStatsTxt(p: typeof PROJECTS[number]): string {
  const { stats } = p
  return [
    `${p.name.toUpperCase()}`,
    `─────────────────`,
    `commits      ${stats.commits}`,
    `branches     ${stats.branches}`,
    `langs        ${stats.langs}`,
    `team         ${stats.team}`,
    `deployed     ${stats.deployed}`,
    stats.url ? `url          https://${stats.url}` : null,
    `last push    ${stats.lastPush}`,
  ].filter(Boolean).join('\n')
}

function projectGitLog(p: typeof PROJECTS[number]): string {
  return p.gitLog.join('\n')
}

function projectMd(field: 'what' | 'why' | 'how', p: typeof PROJECTS[number]): string {
  const title = field === 'what' ? 'what it is' : field === 'why' ? 'why I built it' : 'how it works'
  const body = p.details?.[field] ?? `(${field} not documented)`
  return `# ${p.name} · ${title}\n\n${body}`
}

type LexicalNode = { text?: string; type?: string; children?: LexicalNode[] }

function lexicalToText(node: LexicalNode | null | undefined): string {
  if (node == null) return ''
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) {
    const inner = node.children.map(lexicalToText).join('')
    if (node.type === 'paragraph' || node.type === 'heading') return inner + '\n\n'
    if (node.type === 'listitem') return '· ' + inner + '\n'
    if (node.type === 'list') return inner + '\n'
    return inner
  }
  return ''
}

async function fetchPostBody(slug: string): Promise<string> {
  try {
    const res = await fetch(`/api/posts/${slug}`, { cache: 'no-store' })
    if (!res.ok) return `cat: ${slug}: no such file`
    const { post } = await res.json()
    if (!post) return `cat: ${slug}: empty`
    const header = `# ${post.title}\n${post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 10) : 'draft'} · ${post.readMinutes} min · ${post.wordCount} words\n\n`
    const body = post.content?.root ? lexicalToText(post.content.root).trim() : '(no body)'
    return header + body
  } catch {
    return `cat: ${slug}: fetch failed`
  }
}

export function buildFs(postSlugs: { slug: string; title: string }[]): FsDir {
  const workEntries: Record<string, FsNode> = {}
  for (const p of PROJECTS) {
    workEntries[p.id] = dir(p.id, {
      'readme.md': file('readme.md', projectMd('what', p)),
      'why.md': file('why.md', projectMd('why', p)),
      'how.md': file('how.md', projectMd('how', p)),
      'stats.txt': file('stats.txt', projectStatsTxt(p)),
      'git.log': file('git.log', projectGitLog(p)),
    })
  }

  const writingEntries: Record<string, FsNode> = {}
  for (const { slug, title } of postSlugs) {
    writingEntries[`${slug}.md`] = file(`${slug}.md`, () => fetchPostBody(slug))
    void title
  }

  const root: FsDir = dir('/', {
    'about.md': file('about.md', ABOUT_MD),
    'now.md': file('now.md', NOW_MD),
    'uses.md': file('uses.md', USES_MD),
    'contact.vcard': file('contact.vcard', CONTACT_VCARD),
    'timeline.txt': file('timeline.txt', TIMELINE_TXT),
    'gitlog.txt': file('gitlog.txt', GIT_LOG_PREVIEW.join('\n')),
    'work': dir('work', workEntries),
    'writing': dir('writing', writingEntries),
  })
  return root
}

export function normalizePath(cwd: string, target: string): string {
  if (!target) return cwd
  const abs = target.startsWith('/') ? target : cwd === '/' ? `/${target}` : `${cwd}/${target}`
  const parts: string[] = []
  for (const seg of abs.split('/')) {
    if (!seg || seg === '.') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  return '/' + parts.join('/')
}

export function resolve(root: FsDir, path: string): FsNode | null {
  if (path === '/' || path === '') return root
  const parts = path.split('/').filter(Boolean)
  let node: FsNode = root
  for (const p of parts) {
    if (node.kind !== 'dir') return null
    const next: FsNode | undefined = node.entries[p]
    if (!next) return null
    node = next
  }
  return node
}

export async function readFile(node: FsFile): Promise<string> {
  if (typeof node.content === 'function') return node.content()
  return node.content
}
