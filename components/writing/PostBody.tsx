import type { LexicalContent, LexicalNode } from '@/lib/posts'
import Image from 'next/image'

const BLOGGZ_URL = process.env.BLOGGZ_URL ?? 'http://localhost:3001'

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 1 << 1
const FORMAT_STRIKETHROUGH = 1 << 2
const FORMAT_UNDERLINE = 1 << 3
const FORMAT_CODE = 1 << 4

function renderText(node: LexicalNode, key: string) {
  const text = node.text ?? ''
  const fmt = typeof node.format === 'number' ? node.format : 0
  let el: React.ReactNode = text
  if (fmt & FORMAT_CODE) el = <code>{el}</code>
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

function renderChildren(children: LexicalNode[] | undefined, parentKey: string): React.ReactNode {
  if (!children) return null
  return children.map((child, i) => renderNode(child, `${parentKey}.${i}`))
}

function renderNode(node: LexicalNode, key: string): React.ReactNode {
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
        return renderNode(onlyChild, key)
      }
      if (hasBlockDescendant(node.children)) {
        return <div key={key} className="t-lead">{renderChildren(node.children, key)}</div>
      }
      return <p key={key} className="t-lead">{renderChildren(node.children, key)}</p>
    }

    case 'heading': {
      const tag = (node.tag as 'h1' | 'h2' | 'h3' | 'h4') ?? 'h2'
      const cls = tag === 'h1' ? 't-h2' : tag === 'h2' ? 't-h3' : tag === 'h3' ? 't-h4' : 't-h5'
      const Tag = tag
      return (
        <Tag key={key} className={cls}>
          {renderChildren(node.children, key)}
        </Tag>
      )
    }

    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag
          key={key}
          className="t-lead"
          style={{
            paddingLeft: '1.5rem',
            margin: '1rem 0 1.4rem',
            listStyleType: node.listType === 'number' ? 'decimal' : 'disc',
          }}
        >
          {renderChildren(node.children, key)}
        </Tag>
      )
    }

    case 'listitem':
      return (
        <li key={key} style={{ marginBottom: '0.35rem' }}>
          {renderChildren(node.children, key)}
        </li>
      )

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
          {renderChildren(node.children, key)}
        </blockquote>
      )

    case 'horizontalrule':
      return (
        <div key={key} className="w-ornament" aria-hidden>
          · · ·
        </div>
      )

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
          <code>{renderChildren(node.children, key)}</code>
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
          {renderChildren(node.children, key)}
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
        if (!media?.url) return null
        const src = media.url.startsWith('http') ? media.url : `${BLOGGZ_URL}${media.url}`
        return (
          <figure key={key} style={{ margin: '2.5rem 0' }}>
            <Image
              src={src}
              alt={media.alt ?? ''}
              width={1600}
              height={900}
              style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              unoptimized
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
            {content && renderChildren(content.root.children, `${key}.banner`)}
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
      return <>{renderChildren(node.children, key)}</>

    default:
      if (node.children) return <>{renderChildren(node.children, key)}</>
      return null
  }
}

export function PostBody({ value }: { value: LexicalContent }) {
  return <>{renderNode(value.root, 'root')}</>
}
