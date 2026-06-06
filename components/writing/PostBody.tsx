import type { LexicalContent, LexicalNode } from '@/lib/posts'
import { resolveMediaUrl } from '@/lib/media'
import Image from 'next/image'

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 1 << 1
const FORMAT_STRIKETHROUGH = 1 << 2
const FORMAT_UNDERLINE = 1 << 3

function renderText(node: LexicalNode, key: string) {
  const text = node.text ?? ''
  const fmt = typeof node.format === 'number' ? node.format : 0
  let el: React.ReactNode = text
  // Inline code intentionally NOT rendered as <code> — the green inline spans
  // broke reading flow mid-sentence. Backtick text renders as plain prose; only
  // fenced code BLOCKS (the 'code' node below) keep code styling.
  if (fmt & FORMAT_BOLD) el = <strong>{el}</strong>
  if (fmt & FORMAT_ITALIC) el = <em>{el}</em>
  if (fmt & FORMAT_UNDERLINE) el = <u>{el}</u>
  if (fmt & FORMAT_STRIKETHROUGH) el = <s>{el}</s>
  return <span key={key}>{el}</span>
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

type RenderCtx = { mediaCount: number }

function renderChildren(
  children: LexicalNode[] | undefined,
  parentKey: string,
  ctx: RenderCtx,
): React.ReactNode {
  if (!children) return null
  return children.map((child, i) => renderNode(child, `${parentKey}.${i}`, ctx))
}

function renderNode(node: LexicalNode, key: string, ctx: RenderCtx): React.ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key)

    case 'linebreak':
      return <br key={key} />

    case 'paragraph': {
      // Lexical lets paragraphs contain block-level descendants (uploads,
      // headings nested inside link nodes pasted from rich sources, etc.).
      // None of that is legal HTML inside <p>, and the resulting hydration
      // mismatch drops the offending content. Detect any block descendant
      // and either unwrap a lone block child or fall back to <div>.
      const meaningful = (node.children ?? []).filter(
        (c) => !(c.type === 'text' && (c.text ?? '').trim() === ''),
      )
      const onlyChild = meaningful.length === 1 ? meaningful[0] : null
      if (onlyChild && (onlyChild.type === 'upload' || onlyChild.type === 'block')) {
        return renderNode(onlyChild, key, ctx)
      }
      if (hasBlockDescendant(node.children)) {
        return <div key={key} className="t-lead">{renderChildren(node.children, key, ctx)}</div>
      }
      return <p key={key} className="t-lead">{renderChildren(node.children, key, ctx)}</p>
    }

    case 'heading': {
      const tag = (node.tag as 'h1' | 'h2' | 'h3' | 'h4') ?? 'h2'
      const cls = tag === 'h1' ? 't-h2' : tag === 'h2' ? 't-h3' : tag === 'h3' ? 't-h4' : 't-h5'
      const Tag = tag
      return (
        <Tag key={key} className={cls}>
          {renderChildren(node.children, key, ctx)}
        </Tag>
      )
    }

    case 'list': {
      const listType = node.listType as string | undefined
      const isCheck = listType === 'check'
      const Tag = listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag
          key={key}
          className="t-lead"
          style={{
            paddingLeft: isCheck ? '0' : '1.5rem',
            margin: '1rem 0 1.4rem',
            listStyleType: isCheck ? 'none' : listType === 'number' ? 'decimal' : 'disc',
          }}
        >
          {renderChildren(node.children, key, ctx)}
        </Tag>
      )
    }

    case 'listitem': {
      const checked = (node as { checked?: boolean }).checked
      if (typeof checked === 'boolean') {
        return (
          <li
            key={key}
            style={{ marginBottom: '0.35rem', listStyle: 'none', display: 'flex', gap: '0.55rem', alignItems: 'baseline' }}
          >
            <span
              aria-hidden
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '0 0 auto',
                width: '1em',
                height: '1em',
                marginTop: '0.2rem',
                border: '1.5px solid var(--ink-soft, rgba(125,125,125,0.6))',
                borderRadius: '3px',
                background: checked ? 'var(--accent, #3ba776)' : 'transparent',
                color: '#fff',
                fontSize: '0.75em',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {checked ? '✓' : ''}
            </span>
            <span style={checked ? { opacity: 0.6, textDecoration: 'line-through' } : undefined}>
              {renderChildren(node.children, key, ctx)}
            </span>
          </li>
        )
      }
      return (
        <li key={key} style={{ marginBottom: '0.35rem' }}>
          {renderChildren(node.children, key, ctx)}
        </li>
      )
    }

    case 'quote':
      return (
        <blockquote
          key={key}
          className="t-lead"
          style={{
            borderLeft: '2px solid var(--accent)',
            paddingLeft: '1rem',
            margin: '2rem 0',
            color: 'var(--ink-soft)',
            fontStyle: 'italic',
          }}
        >
          {renderChildren(node.children, key, ctx)}
        </blockquote>
      )

    case 'horizontalrule':
      return (
        <hr
          key={key}
          style={{
            border: 'none',
            borderTop: '1px solid var(--ink-soft, rgba(125,125,125,0.3))',
            margin: '2rem 0',
          }}
        />
      )

    case 'table':
      return (
        <div key={key} style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.95em' }}>
            <tbody>{renderChildren(node.children, key, ctx)}</tbody>
          </table>
        </div>
      )

    case 'tablerow':
      return <tr key={key}>{renderChildren(node.children, key, ctx)}</tr>

    case 'tablecell': {
      const isHeader = ((node as { headerState?: number }).headerState ?? 0) !== 0
      const Tag = isHeader ? 'th' : 'td'
      return (
        <Tag
          key={key}
          style={{
            border: '1px solid var(--ink-soft, rgba(125,125,125,0.3))',
            padding: '0.45rem 0.75rem',
            textAlign: 'left',
            fontWeight: isHeader ? 600 : 400,
            background: isHeader
              ? 'color-mix(in oklab, var(--accent) 12%, transparent)'
              : 'transparent',
            verticalAlign: 'top',
          }}
        >
          {renderChildren(node.children, key, ctx)}
        </Tag>
      )
    }

    case 'code':
      return (
        <pre
          key={key}
          className="c-md"
          style={{
            padding: '1rem',
            borderRadius: '4px',
            background: 'var(--paper-2)',
            overflow: 'auto',
            margin: '1.5rem 0',
          }}
        >
          <code>{renderChildren(node.children, key, ctx)}</code>
        </pre>
      )

    case 'link':
    case 'autolink': {
      const fields = node.fields
      const url =
        fields?.linkType === 'internal' && fields?.doc?.value?.slug
          ? `/writing/${fields.doc.value.slug}`
          : fields?.url ?? '#'
      const external = /^https?:\/\//.test(url)
      return (
        <a
          key={key}
          href={url}
          target={external && fields?.newTab ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="no-pop"
        >
          {renderChildren(node.children, key, ctx)}
        </a>
      )
    }

    case 'upload':
    case 'block': {
      const fields = (node as { fields?: Record<string, unknown> }).fields ?? {}
      const blockType = fields.blockType as string | undefined

      if (blockType === 'mediaBlock' || node.type === 'upload') {
        const media = (fields.media ?? (node as { value?: { url?: string; alt?: string } }).value) as
          | { url?: string; alt?: string }
          | undefined
        if (!media) return null
        const src = resolveMediaUrl(media.url)
        if (!src) return null
        const isFirstMedia = ctx.mediaCount === 0
        ctx.mediaCount++
        return (
          <figure key={key} style={{ margin: '2.5rem 0' }}>
            <Image
              src={src}
              alt={media.alt ?? ''}
              width={1600}
              height={900}
              style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              unoptimized
              priority={isFirstMedia}
              loading={isFirstMedia ? 'eager' : 'lazy'}
            />
          </figure>
        )
      }

      if (blockType === 'banner') {
        const style = (fields.style as string) ?? 'info'
        const tones: Record<string, { border: string; bg: string }> = {
          info: { border: 'var(--accent)', bg: 'color-mix(in oklab, var(--accent) 8%, transparent)' },
          warning: { border: '#facc15', bg: 'rgba(250, 204, 21, 0.08)' },
          error: { border: '#f87171', bg: 'rgba(248, 113, 113, 0.08)' },
          success: { border: 'var(--accent-2)', bg: 'color-mix(in oklab, var(--accent-2) 8%, transparent)' },
        }
        const t = tones[style] ?? tones.info
        const content = fields.content as LexicalContent | undefined
        return (
          <div
            key={key}
            style={{
              margin: '1.5rem 0',
              padding: '1rem',
              borderLeft: `2px solid ${t.border}`,
              background: t.bg,
              borderRadius: '0 4px 4px 0',
            }}
          >
            {content && renderChildren(content.root.children, `${key}.banner`, ctx)}
          </div>
        )
      }

      if (blockType === 'code') {
        return (
          <pre
            key={key}
            className="c-md"
            style={{
              padding: '1rem',
              borderRadius: '4px',
              background: 'var(--paper-2)',
              overflow: 'auto',
              margin: '1.5rem 0',
            }}
          >
            {fields.language ? (
              <div
                className="l-meta"
                style={{ color: 'var(--ink-dim)', marginBottom: '0.5rem' }}
              >
                {String(fields.language)}
              </div>
            ) : null}
            <code>{String(fields.code ?? '')}</code>
          </pre>
        )
      }

      return null
    }

    case 'root':
      return <>{renderChildren(node.children, key, ctx)}</>

    default:
      if (node.children) return <>{renderChildren(node.children, key, ctx)}</>
      return null
  }
}

export function PostBody({ value }: { value: LexicalContent }) {
  const ctx: RenderCtx = { mediaCount: 0 }
  return <>{renderNode(value.root, 'root', ctx)}</>
}
