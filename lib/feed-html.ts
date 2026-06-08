import type { LexicalContent, LexicalNode } from '@/lib/posts'
import { resolveMediaUrl } from '@/lib/media'
import { lexicalCodeText } from '@/lib/code-utils'

// Serialize a post's Lexical content tree to a clean, semantic HTML string for
// RSS <content:encoded>. Unlike PostBody (which renders React with token classes
// + Shiki-highlighted code for the site), feed readers strip classes/styles and
// restyle code themselves — so this emits plain tags only: p, h*, ul/ol/li,
// blockquote, pre/code, a, img, table. URLs are absolutized against siteUrl so
// internal links and proxied images resolve from any reader.

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 1 << 1
const FORMAT_STRIKETHROUGH = 1 << 2
const FORMAT_UNDERLINE = 1 << 3
const FORMAT_CODE = 1 << 4

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const BLOCK_TYPES = new Set([
  'paragraph',
  'heading',
  'quote',
  'list',
  'listitem',
  'upload',
  'block',
])

function hasBlockDescendant(children: LexicalNode[] | undefined): boolean {
  if (!children) return false
  for (const c of children) {
    if (BLOCK_TYPES.has(c.type)) return true
    if (hasBlockDescendant(c.children)) return true
  }
  return false
}

// Make a site-relative href/src absolute so it resolves in an external reader.
function absolutize(url: string, siteUrl: string): string {
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return `${siteUrl}${url}`
  return url
}

function renderText(node: LexicalNode): string {
  const fmt = typeof node.format === 'number' ? node.format : 0
  let html = esc(node.text ?? '')
  if (fmt & FORMAT_CODE) html = `<code>${html}</code>`
  if (fmt & FORMAT_BOLD) html = `<strong>${html}</strong>`
  if (fmt & FORMAT_ITALIC) html = `<em>${html}</em>`
  if (fmt & FORMAT_UNDERLINE) html = `<u>${html}</u>`
  if (fmt & FORMAT_STRIKETHROUGH) html = `<s>${html}</s>`
  return html
}

function renderChildren(children: LexicalNode[] | undefined, siteUrl: string): string {
  if (!children) return ''
  return children.map((c) => renderNode(c, siteUrl)).join('')
}

function renderNode(node: LexicalNode, siteUrl: string): string {
  switch (node.type) {
    case 'text':
      return renderText(node)

    case 'linebreak':
      return '<br />'

    case 'paragraph': {
      const meaningful = (node.children ?? []).filter(
        (c) => !(c.type === 'text' && (c.text ?? '').trim() === ''),
      )
      const onlyChild = meaningful.length === 1 ? meaningful[0] : null
      if (onlyChild && (onlyChild.type === 'upload' || onlyChild.type === 'block')) {
        return renderNode(onlyChild, siteUrl)
      }
      const inner = renderChildren(node.children, siteUrl)
      // Block descendants can't live inside <p> — emit the children bare.
      if (hasBlockDescendant(node.children)) return inner
      return inner.trim() ? `<p>${inner}</p>` : ''
    }

    case 'heading': {
      const tag = (node.tag as string) ?? 'h2'
      return `<${tag}>${renderChildren(node.children, siteUrl)}</${tag}>`
    }

    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      return `<${tag}>${renderChildren(node.children, siteUrl)}</${tag}>`
    }

    case 'listitem':
      return `<li>${renderChildren(node.children, siteUrl)}</li>`

    case 'quote':
      return `<blockquote>${renderChildren(node.children, siteUrl)}</blockquote>`

    case 'horizontalrule':
      return '<hr />'

    case 'table':
      return `<table><tbody>${renderChildren(node.children, siteUrl)}</tbody></table>`

    case 'tablerow':
      return `<tr>${renderChildren(node.children, siteUrl)}</tr>`

    case 'tablecell': {
      const isHeader = ((node as { headerState?: number }).headerState ?? 0) !== 0
      const tag = isHeader ? 'th' : 'td'
      return `<${tag}>${renderChildren(node.children, siteUrl)}</${tag}>`
    }

    case 'code': {
      const lang = (node.language as string | undefined) ?? ''
      const cls = lang ? ` class="language-${esc(lang)}"` : ''
      return `<pre><code${cls}>${esc(lexicalCodeText(node))}</code></pre>`
    }

    case 'link':
    case 'autolink': {
      const fields = node.fields
      const raw =
        fields?.linkType === 'internal' && fields?.doc?.value?.slug
          ? `/writing/${fields.doc.value.slug}`
          : fields?.url ?? '#'
      const href = absolutize(raw, siteUrl)
      return `<a href="${esc(href)}">${renderChildren(node.children, siteUrl)}</a>`
    }

    case 'upload':
    case 'block': {
      const fields = (node as { fields?: Record<string, unknown> }).fields ?? {}
      const blockType = fields.blockType as string | undefined

      if (blockType === 'mediaBlock' || node.type === 'upload') {
        const media = (fields.media ?? (node as { value?: { url?: string; alt?: string } }).value) as
          | { url?: string; alt?: string }
          | undefined
        const resolved = resolveMediaUrl(media?.url)
        if (!resolved) return ''
        const src = absolutize(resolved, siteUrl)
        const alt = esc(media?.alt ?? '')
        return `<figure><img src="${esc(src)}" alt="${alt}" /></figure>`
      }

      if (blockType === 'banner') {
        const content = fields.content as LexicalContent | undefined
        if (!content?.root) return ''
        return `<blockquote>${renderChildren(content.root.children, siteUrl)}</blockquote>`
      }

      if (blockType === 'code') {
        const lang = String(fields.language ?? '')
        const cls = lang ? ` class="language-${esc(lang)}"` : ''
        return `<pre><code${cls}>${esc(String(fields.code ?? ''))}</code></pre>`
      }

      return ''
    }

    case 'root':
      return renderChildren(node.children, siteUrl)

    default:
      return node.children ? renderChildren(node.children, siteUrl) : ''
  }
}

export function lexicalToHtml(content: LexicalContent | null | undefined, siteUrl: string): string {
  if (!content?.root) return ''
  return renderNode(content.root, siteUrl)
}
