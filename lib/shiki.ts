import 'server-only'
import { createHighlighter, type Highlighter } from 'shiki'
import type { LexicalNode } from '@/lib/posts'
import { codeKey, lexicalCodeText, normalizeLang } from '@/lib/code-utils'

/**
 * Custom Shiki theme mirroring app/tokens.css. Shiki can't read CSS vars (it
 * runs at render, outputs inline hex), so these hexes intentionally duplicate
 * the token palette — keep them in sync with tokens.css if the palette changes.
 *   bg #161b22 = --paper-2   fg #e6edf3 = --ink
 *   mint #6ee7a7 = --accent  teal #5eead4 = --accent-2  yellow #f9e2af = --accent-3
 *   #8b949e = --ink-soft     #5b6573 = --ink-dim        #ef4444 = --status-dead
 */
const THEME = {
  name: 'vergnyx',
  type: 'dark' as const,
  colors: {
    'editor.background': '#161b22',
    'editor.foreground': '#e6edf3',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#5b6573', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression'], settings: { foreground: '#5eead4' } },
    { scope: ['keyword.operator', 'punctuation', 'meta.brace', 'punctuation.separator', 'punctuation.terminator', 'punctuation.accessor'], settings: { foreground: '#8b949e' } },
    { scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string', 'constant.character.escape'], settings: { foreground: '#6ee7a7' } },
    { scope: ['constant.numeric', 'constant.language', 'constant.language.boolean', 'support.constant', 'variable.other.constant', 'string.regexp'], settings: { foreground: '#f9e2af' } },
    { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class', 'entity.other.attribute-name'], settings: { foreground: '#f9e2af' } },
    { scope: ['entity.name.tag', 'support.class.component'], settings: { foreground: '#5eead4' } },
    { scope: ['variable', 'variable.other', 'variable.parameter', 'meta.definition.variable', 'entity.name.function', 'support.function', 'meta.function-call', 'meta.import variable'], settings: { foreground: '#e6edf3' } },
    { scope: ['invalid', 'invalid.illegal'], settings: { foreground: '#ef4444' } },
  ],
}

const LANGS = [
  'typescript', 'tsx', 'javascript', 'jsx', 'json', 'bash',
  'css', 'html', 'sql', 'python', 'yaml', 'markdown', 'diff',
]

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({ themes: [THEME], langs: LANGS })
  }
  return highlighterPromise
}

/** Highlight a source string to Shiki HTML (`<pre class="shiki">…</pre>`). */
export async function highlightCode(code: string, lang?: string | null): Promise<string> {
  const hl = await getHighlighter()
  const resolved = normalizeLang(lang)
  const finalLang = hl.getLoadedLanguages().includes(resolved) ? resolved : 'text'
  return hl.codeToHtml(code, { lang: finalLang, theme: 'vergnyx' })
}

type CodeBlock = { lang: string; code: string }

function collectCodeBlocks(node: LexicalNode, out: CodeBlock[]): void {
  if (node.type === 'code') {
    out.push({ lang: normalizeLang(node.language as string | undefined), code: lexicalCodeText(node) })
  } else if (node.type === 'block' && node.fields?.blockType === 'code') {
    out.push({
      lang: normalizeLang(node.fields.language as string | undefined),
      code: String(node.fields.code ?? ''),
    })
  }
  node.children?.forEach((child) => collectCodeBlocks(child, out))
}

/**
 * Pre-highlight every code block in a Lexical tree. Returns a map keyed by
 * codeKey(lang, code) so the (sync) PostBody renderer can look up the HTML.
 */
export async function buildCodeHighlights(root: LexicalNode): Promise<Map<string, string>> {
  const blocks: CodeBlock[] = []
  collectCodeBlocks(root, blocks)
  const map = new Map<string, string>()
  await Promise.all(
    blocks.map(async ({ lang, code }) => {
      map.set(codeKey(lang, code), await highlightCode(code, lang))
    }),
  )
  return map
}
