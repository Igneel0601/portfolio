import 'server-only'
import { unstable_cache } from 'next/cache'
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
  // Present only on list queries (LIST_COLS); the single-post query omits it.
  word_count?: number | null
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
//
// Three shapes hold media references:
//   1. top-level upload nodes (`type:'upload'`, `value:<id>`)
//   2. mediaBlock custom blocks (`type:'block'`, `fields.blockType:'mediaBlock'`,
//      `fields.media:<id>`) — Payload stores the ref as a numeric id in the
//      raw content JSONB
//   3. nested rich text inside any other `block` (banner callouts etc.) where
//      `fields.content.root.children` holds another lexical tree
// We walk all three plus the standard `children` array.
type BlockNode = {
  type?: string
  value?: unknown
  children?: unknown[]
  fields?: {
    blockType?: string
    media?: unknown
    content?: { root?: { children?: unknown[] } }
    [k: string]: unknown
  }
}

function walkLexical(node: unknown, visit: (n: BlockNode) => void) {
  if (!node || typeof node !== 'object') return
  const n = node as BlockNode
  visit(n)
  if (n.type === 'block' && n.fields?.content?.root?.children) {
    for (const c of n.fields.content.root.children) walkLexical(c, visit)
  }
  if (Array.isArray(n.children)) for (const c of n.children) walkLexical(c, visit)
}

function collectUploadIds(node: unknown, into: number[]) {
  walkLexical(node, (n) => {
    if (n.type === 'upload' && typeof n.value === 'number') into.push(n.value)
    if (
      n.type === 'block' &&
      n.fields?.blockType === 'mediaBlock' &&
      typeof n.fields.media === 'number'
    ) {
      into.push(n.fields.media)
    }
  })
}

function expandUploads(node: unknown, mediaById: Map<number, Media>) {
  walkLexical(node, (n) => {
    if (n.type === 'upload' && typeof n.value === 'number') {
      const m = mediaById.get(n.value)
      if (m) n.value = m as unknown as typeof n.value
    }
    const f = n.fields
    if (n.type === 'block' && f?.blockType === 'mediaBlock' && typeof f.media === 'number') {
      const m = mediaById.get(f.media)
      if (m) f.media = m as unknown as typeof f.media
    }
  })
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

// Note: no `content` here. The archive only needs word_count (denormalized in
// bloggz at write time), so we read the integer instead of pulling + walking
// the full Lexical JSONB of every row. ::int because pg returns numeric as a
// string. The single-post path (getPostBySlug) still selects `content`.
const LIST_COLS = `id, title, slug, published_at, updated_at, word_count::int, meta_title, meta_description, hero_image_id, meta_image_id`
const LIST_ORDER = `published_at DESC NULLS LAST, updated_at DESC`

async function toListItems(rows: PostRow[]): Promise<PostListItem[]> {
  if (rows.length === 0) return []
  const cats = await fetchCategoriesForPosts(rows.map((r) => r.id))
  return rows.map((r) => {
    const wordCount = r.word_count ?? 0
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

async function getAllPostsImpl(): Promise<PostListItem[]> {
  const { rows } = await pool.query<PostRow>(
    `SELECT ${LIST_COLS} FROM posts WHERE ${PUBLISHED} ORDER BY ${LIST_ORDER}`,
  )
  return toListItems(rows)
}

export type CategoryCount = { slug: string; title: string; count: number }

/** Per-category counts across all published posts (for the filter pills) +
 *  the total. Independent of the current page/filter. */
async function getCategoryCountsImpl(): Promise<{ all: number; latest: string | null; tags: CategoryCount[] }> {
  const [totalRes, tagRes] = await Promise.all([
    pool.query<{ all: number; latest: string | null }>(
      `SELECT count(*)::int AS all, max(published_at) AS latest FROM posts WHERE ${PUBLISHED}`,
    ),
    pool.query<CategoryCount>(
      `SELECT c.slug, c.title, count(*)::int AS count
       FROM posts_rels pr
       JOIN categories c ON c.id = pr.categories_id
       JOIN posts p ON p.id = pr.parent_id
       WHERE pr.path = 'categories' AND p.${PUBLISHED}
       GROUP BY c.slug, c.title
       ORDER BY count DESC, c.title`,
    ),
  ])
  return {
    all: totalRes.rows[0]?.all ?? 0,
    latest: totalRes.rows[0]?.latest ?? null,
    tags: tagRes.rows,
  }
}

/** A page of published posts, optionally filtered by category slug. Filtering
 *  and paging both happen in SQL so it scales past a full in-memory fetch. */
async function getPostsImpl(opts: {
  page: number
  perPage: number
  tag?: string | null
}): Promise<{ posts: PostListItem[]; total: number; page: number; totalPages: number }> {
  const perPage = Math.max(1, opts.perPage)
  const tag = opts.tag || null
  // $1 = tag (null → no category filter)
  const filter = `${PUBLISHED} AND ($1::text IS NULL OR id IN (
     SELECT pr.parent_id FROM posts_rels pr
     JOIN categories c ON c.id = pr.categories_id
     WHERE pr.path = 'categories' AND c.slug = $1))`

  const { rows: countRows } = await pool.query<{ total: number }>(
    `SELECT count(*)::int AS total FROM posts WHERE ${filter}`,
    [tag],
  )
  const total = countRows[0]?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const page = Math.min(Math.max(1, opts.page), totalPages)
  const offset = (page - 1) * perPage

  const { rows } = await pool.query<PostRow>(
    `SELECT ${LIST_COLS} FROM posts WHERE ${filter}
     ORDER BY ${LIST_ORDER} LIMIT $2 OFFSET $3`,
    [tag, perPage, offset],
  )
  return { posts: await toListItems(rows), total, page, totalPages }
}

// The archive is identical for every visitor and only changes when a post is
// published/edited/deleted — which pings /api/revalidate. So cache the DB reads
// in the Next data cache (keyed on page+tag via the serialized args) and bust
// them with the `writing` tag. On a cache hit /writing renders with zero Neon
// roundtrips. revalidate is a safety-net TTL in case a webhook is ever missed.
const CACHE_OPTS = { tags: ['writing'], revalidate: 3600 }

export const getPosts = unstable_cache(getPostsImpl, ['writing:posts'], CACHE_OPTS)
export const getCategoryCounts = unstable_cache(
  getCategoryCountsImpl,
  ['writing:category-counts'],
  CACHE_OPTS,
)
// Used by getAdjacentPosts (prev/next) and the sitemap. Cached so the post
// page's adjacent-posts lookup is a data-cache hit instead of a fresh all-posts
// scan on every (uncacheable) render.
export const getAllPosts = unstable_cache(getAllPostsImpl, ['writing:all-posts'], CACHE_OPTS)

export async function getPostSlugs(): Promise<string[]> {
  const { rows } = await pool.query<{ slug: string }>(
    `SELECT slug FROM posts WHERE ${PUBLISHED} AND slug IS NOT NULL`,
  )
  return rows.map((r) => r.slug)
}

async function getPostBySlugImpl(slug: string): Promise<Post | null> {
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

// Cached per slug. Dedupes the generateMetadata + page double-call within one
// render, and reuses the read across requests — the post route can't be
// CDN-cached under the d/m UA split, so this is where the win lives. Busted on
// publish/edit via the `writing` tag (app/api/revalidate).
export const getPostBySlug = unstable_cache(getPostBySlugImpl, ['writing:post'], CACHE_OPTS)

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
