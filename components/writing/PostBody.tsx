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
  if (fmt & FORMAT_CODE) el = <code className="px-1 py-0.5 rounded bg-white/10 font-mono text-[0.9em]">{el}</code>
  if (fmt & FORMAT_BOLD) el = <strong>{el}</strong>
  if (fmt & FORMAT_ITALIC) el = <em>{el}</em>
  if (fmt & FORMAT_UNDERLINE) el = <u>{el}</u>
  if (fmt & FORMAT_STRIKETHROUGH) el = <s>{el}</s>
  return <span key={key}>{el}</span>
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

    case 'paragraph':
      return (
        <p key={key} className="my-4 leading-7 opacity-90">
          {renderChildren(node.children, key)}
        </p>
      )

    case 'heading': {
      const tag = (node.tag as 'h1' | 'h2' | 'h3' | 'h4') ?? 'h2'
      const sizes: Record<string, string> = {
        h1: 'text-3xl mt-10 mb-4',
        h2: 'text-2xl mt-10 mb-4',
        h3: 'text-xl mt-8 mb-3',
        h4: 'text-lg mt-6 mb-3',
      }
      const Tag = tag
      return (
        <Tag key={key} className={`font-medium ${sizes[tag]}`}>
          {renderChildren(node.children, key)}
        </Tag>
      )
    }

    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      const cls = node.listType === 'number' ? 'list-decimal' : 'list-disc'
      return (
        <Tag key={key} className={`${cls} pl-6 my-4 space-y-1`}>
          {renderChildren(node.children, key)}
        </Tag>
      )
    }

    case 'listitem':
      return <li key={key}>{renderChildren(node.children, key)}</li>

    case 'quote':
      return (
        <blockquote key={key} className="border-l-2 border-white/30 pl-4 my-6 opacity-80 italic">
          {renderChildren(node.children, key)}
        </blockquote>
      )

    case 'horizontalrule':
      return <hr key={key} className="my-8 border-white/10" />

    case 'code':
      return (
        <pre key={key} className="my-6 p-4 rounded bg-black/40 overflow-x-auto text-sm font-mono">
          <code>{renderChildren(node.children, key)}</code>
        </pre>
      )

    case 'link':
    case 'autolink': {
      const fields = node.fields
      const url = fields?.linkType === 'internal' && fields?.doc?.value?.slug
        ? `/writing/${fields.doc.value.slug}`
        : fields?.url ?? '#'
      const external = /^https?:\/\//.test(url)
      return (
        <a
          key={key}
          href={url}
          target={external && fields?.newTab ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="underline decoration-dotted underline-offset-2 hover:opacity-80"
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
          <figure key={key} className="my-8">
            <Image
              src={src}
              alt={media.alt ?? ''}
              width={1600}
              height={900}
              className="w-full h-auto rounded"
              unoptimized
            />
          </figure>
        )
      }

      if (blockType === 'banner') {
        const style = (fields.style as string) ?? 'info'
        const colors: Record<string, string> = {
          info: 'border-blue-400/50 bg-blue-400/10',
          warning: 'border-yellow-400/50 bg-yellow-400/10',
          error: 'border-red-400/50 bg-red-400/10',
          success: 'border-emerald-400/50 bg-emerald-400/10',
        }
        const content = fields.content as LexicalContent | undefined
        return (
          <div key={key} className={`my-6 p-4 border-l-2 rounded-r ${colors[style] ?? colors.info}`}>
            {content && renderChildren(content.root.children, `${key}.banner`)}
          </div>
        )
      }

      if (blockType === 'code') {
        return (
          <pre key={key} className="my-6 p-4 rounded bg-black/40 overflow-x-auto text-sm font-mono">
            {fields.language ? <div className="opacity-50 text-xs mb-2">{String(fields.language)}</div> : null}
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
  return <div className="text-[15px]">{renderNode(value.root, 'root')}</div>
}
