import 'server-only'
import { Pool } from 'pg'

const globalForPool = globalThis as unknown as { pgPool?: Pool }

const pool =
  globalForPool.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URI,
    max: 5,
    idleTimeoutMillis: 10_000,
  })

if (process.env.NODE_ENV !== 'production') globalForPool.pgPool = pool

export type LexicalNode = {
  type: string
  tag?: string
  text?: string
  format?: number | string
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: string
    doc?: { value?: { slug?: string } }
    [k: string]: unknown
  }
  children?: LexicalNode[]
  listType?: 'bullet' | 'number'
  [k: string]: unknown
}

export type LexicalContent = { root: LexicalNode }

export type Category = { id: number; title: string; slug: string }

export type Media = {
  id: number
  url: string
  alt: string | null
  width: number | null
  height: number | null
}

export type PostListItem = {
  id: number
  title: string
  slug: string
  publishedAt: string | null
  updatedAt: string
  metaDescription: string | null
  categories: Category[]
  wordCount: number
  readMinutes: number
}

function extractText(node: LexicalNode): string {
  if (typeof node.text === 'string') return node.text
  if (!node.children) return ''
  return node.children.map(extractText).join(' ')
}

function countWords(content: LexicalContent | null | undefined): number {
  if (!content?.root) return 0
  const text = extractText(content.root)
  const matches = text.trim().match(/\S+/g)
  return matches ? matches.length : 0
}

export type Post = PostListItem & {
  content: LexicalContent
  heroImage: Media | null
  metaTitle: string | null
  metaImage: Media | null
  dropCap: boolean
}

type PostRow = {
  id: number
  title: string
  slug: string
  published_at: string | null
  updated_at: string
  content: LexicalContent
  meta_title: string | null
  meta_description: string | null
  hero_image_id: number | null
  meta_image_id: number | null
  drop_cap: boolean | null
}

type MediaRow = {
  id: number
  url: string | null
  alt: string | null
  width: string | number | null
  height: string | number | null
}

const PUBLISHED = `_status = 'published'`

function mapMedia(row: MediaRow | undefined): Media | null {
  if (!row || !row.url) return null
  return {
    id: row.id,
    url: row.url,
    alt: row.alt,
    width: row.width != null ? Number(row.width) : null,
    height: row.height != null ? Number(row.height) : null,
  }
}

async function fetchCategoriesForPosts(postIds: number[]): Promise<Map<number, Category[]>> {
  const map = new Map<number, Category[]>()
  if (postIds.length === 0) return map
  const { rows } = await pool.query<{ parent_id: number } & Category>(
    `SELECT pr.parent_id, c.id, c.title, c.slug
     FROM posts_rels pr
     JOIN categories c ON c.id = pr.categories_id
     WHERE pr.path = 'categories' AND pr.parent_id = ANY($1::int[])
     ORDER BY pr.parent_id, pr."order" NULLS LAST, c.title`,
    [postIds],
  )
  for (const r of rows) {
    const list = map.get(r.parent_id) ?? []
    list.push({ id: r.id, title: r.title, slug: r.slug })
    map.set(r.parent_id, list)
  }
  return map
}

// Walks a lexical tree and collects every upload-node's media id. The raw DB
// stores upload nodes as `{type:'upload', value:<id>, relationTo:'media'}` —
// no expansion. We collect ids here, then `expandUploads` mutates the tree to
// inline the resolved media objects so the renderer can access `value.url`.
function collectUploadIds(node: unknown, into: number[]) {
  if (!node || typeof node !== 'object') return
  const n = node as { type?: string; value?: unknown; children?: unknown[] }
  if (n.type === 'upload' && typeof n.value === 'number') into.push(n.value)
  if (Array.isArray(n.children)) for (const c of n.children) collectUploadIds(c, into)
}
function expandUploads(node: unknown, mediaById: Map<number, Media>) {
  if (!node || typeof node !== 'object') return
  const n = node as { type?: string; value?: unknown; children?: unknown[] }
  if (n.type === 'upload' && typeof n.value === 'number') {
    const m = mediaById.get(n.value)
    if (m) n.value = m as unknown as typeof n.value
  }
  if (Array.isArray(n.children)) for (const c of n.children) expandUploads(c, mediaById)
}

async function fetchMediaByIds(ids: number[]): Promise<Map<number, Media>> {
  const map = new Map<number, Media>()
  const uniq = [...new Set(ids.filter((v): v is number => typeof v === 'number'))]
  if (uniq.length === 0) return map
  const { rows } = await pool.query<MediaRow>(
    `SELECT id, url, alt, width, height FROM media WHERE id = ANY($1::int[])`,
    [uniq],
  )
  for (const r of rows) {
    const m = mapMedia(r)
    if (m) map.set(r.id, m)
  }
  return map
}

export async function getAllPosts(): Promise<PostListItem[]> {
  const { rows } = await pool.query<PostRow>(
    `SELECT id, title, slug, published_at, updated_at, content, meta_title, meta_description, hero_image_id, meta_image_id
     FROM posts
     WHERE ${PUBLISHED}
     ORDER BY published_at DESC NULLS LAST, updated_at DESC`,
  )
  if (rows.length === 0) return []
  const cats = await fetchCategoriesForPosts(rows.map((r) => r.id))
  return rows.map((r) => {
    const wordCount = countWords(r.content)
    return {
      id: r.id,
      title: r.title,
      slug: r.slug,
      publishedAt: r.published_at,
      updatedAt: r.updated_at,
      metaDescription: r.meta_description,
      categories: cats.get(r.id) ?? [],
      wordCount,
      readMinutes: Math.max(1, Math.round(wordCount / 220)),
    }
  })
}

export async function getPostSlugs(): Promise<string[]> {
  const { rows } = await pool.query<{ slug: string }>(
    `SELECT slug FROM posts WHERE ${PUBLISHED} AND slug IS NOT NULL`,
  )
  return rows.map((r) => r.slug)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { rows } = await pool.query<PostRow>(
    `SELECT id, title, slug, published_at, updated_at, content, meta_title, meta_description, hero_image_id, meta_image_id, drop_cap
     FROM posts
     WHERE ${PUBLISHED} AND slug = $1
     LIMIT 1`,
    [slug],
  )
  const row = rows[0]
  if (!row) return null
  const uploadIds: number[] = []
  collectUploadIds(row.content?.root, uploadIds)
  const [cats, media] = await Promise.all([
    fetchCategoriesForPosts([row.id]),
    fetchMediaByIds(
      [row.hero_image_id, row.meta_image_id, ...uploadIds].filter(
        (v): v is number => v != null,
      ),
    ),
  ])
  // Mutate the lexical tree in-place: replace each upload node's numeric id
  // value with its resolved Media object so PostBody can read value.url.
  expandUploads(row.content?.root, media)
  const wordCount = countWords(row.content)
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    content: row.content,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    categories: cats.get(row.id) ?? [],
    heroImage: row.hero_image_id ? media.get(row.hero_image_id) ?? null : null,
    metaImage: row.meta_image_id ? media.get(row.meta_image_id) ?? null : null,
    dropCap: row.drop_cap === true,
    wordCount,
    readMinutes: Math.max(1, Math.round(wordCount / 220)),
  }
}

export async function getAdjacentPosts(
  slug: string,
): Promise<{ prev: PostListItem | null; next: PostListItem | null }> {
  const posts = await getAllPosts()
  const idx = posts.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: posts[idx + 1] ?? null,
    next: posts[idx - 1] ?? null,
  }
}
