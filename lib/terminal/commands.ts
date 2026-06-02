import { FsDir, FsNode, normalizePath, readFile, resolve } from './fs'
import { COFFEE, COW, FORTUNES } from './ascii'

export type HistoryEntry =
  | { kind: 'boot' }
  | { kind: 'input'; cwd: string; value: string; promptLabel?: string }
  | { kind: 'output'; text: string }
  | { kind: 'ok'; text: string }
  | { kind: 'error'; text: string }
  | { kind: 'mute'; text: string }
  | { kind: 'progress'; id: string; label: string; pct: number; done?: boolean }

export type Theme = 'mint' | 'cyber' | 'paper'
export const THEMES: Theme[] = ['mint', 'cyber', 'paper']
export const THEME_VARS: Record<Theme, { accent: string }> = {
  mint: { accent: '#6ee7a7' },
  cyber: { accent: '#79c0ff' },
  paper: { accent: '#f0b73a' },
}

export type DispatchCtx = {
  fs: FsDir
  cwd: string
  setCwd: (next: string) => void
  push: (...entries: HistoryEntry[]) => void
  patchProgress: (id: string, label: string, pct: number, done?: boolean) => void
  clear: () => void
  router: { push: (href: string) => void }
  inputHistory: string[]
  setTheme: (t: Theme) => void
  theme: Theme
  vim: { open: (file: string) => void; close: () => void; isOpen: boolean }
  aria: {
    isOpen: boolean
    start: () => void
    send: (text: string) => Promise<void>
    quit: () => void
  }
}

const HELP = `available commands:

  help                    you are here
  ls [path]               list directory
  cd <path>               change directory
  pwd                     print working directory
  cat <file>              print file contents
  open <route>            navigate to a site route
  whoami                  one-line bio
  date                    current date/time
  uname -a                fake system info
  echo <text>             echo text
  history                 input history
  clear                   clear screen
  fastfetch               re-render the boot panel (alias: neofetch)
  git log                 recent commits
  theme                   swap accent colour
  fullscreen              toggle browser fullscreen (alias: fs)
  exit                    leave terminal (route to /)

assistant:

  aria                    chat with aria — vaibhav's assistant (ctrl+c to quit)

easter eggs hidden. happy hunting.`

function fmtLs(node: FsDir): string {
  const rows = Object.values(node.entries).map((n) => {
    if (n.kind === 'dir') return `${n.name}/`
    return n.name
  })
  return rows.join('  ')
}

function fmtLsLong(node: FsDir): string {
  return Object.values(node.entries)
    .map((n) => {
      const kindMark = n.kind === 'dir' ? 'd' : '-'
      const size = n.kind === 'file' && typeof n.content === 'string' ? `${n.content.length}b` : '—'
      const name = n.kind === 'dir' ? `${n.name}/` : n.name
      return `${kindMark}rw-r--r--  ${size.padStart(6)}  ${name}`
    })
    .join('\n')
}

function parseCommand(raw: string): { name: string; args: string[]; rest: string } {
  const trimmed = raw.trim()
  if (!trimmed) return { name: '', args: [], rest: '' }
  const matches = trimmed.match(/("[^"]*"|'[^']*'|[^\s]+)/g) ?? []
  const toks = matches.map((t) => (t.startsWith('"') || t.startsWith("'") ? t.slice(1, -1) : t))
  const name = toks[0] ?? ''
  const args = toks.slice(1)
  const rest = trimmed.slice(name.length).trim()
  return { name, args, rest }
}

export async function dispatch(input: string, ctx: DispatchCtx): Promise<void> {
  const { name, args, rest } = parseCommand(input)

  // vim modal hijacks input
  if (ctx.vim.isOpen) {
    if (input.trim() === ':wq' || input.trim() === ':q' || input.trim() === ':q!') {
      ctx.vim.close()
      ctx.push({ kind: 'mute', text: '(left vim. you are free.)' })
      return
    }
    ctx.push({ kind: 'mute', text: `vim: unknown command. try :wq` })
    return
  }

  // aria chat modal hijacks input — every line is a chat turn until you quit
  if (ctx.aria.isOpen) {
    const t = input.trim()
    if (t === 'exit' || t === 'quit' || t === ':q') {
      ctx.aria.quit()
      return
    }
    if (!t) return
    await ctx.aria.send(input)
    return
  }

  if (!name) return

  switch (name) {
    case 'help':
      ctx.push({ kind: 'output', text: HELP })
      return

    case 'pwd':
      ctx.push({ kind: 'output', text: ctx.cwd })
      return

    case 'whoami':
      ctx.push({ kind: 'output', text: 'vaibhav verma · software engineer · noida.' })
      return

    case 'date':
      ctx.push({ kind: 'output', text: new Date().toString() })
      return

    case 'uname': {
      if (args[0] === '-a') {
        ctx.push({ kind: 'output', text: 'portfolio 6.13.4-arch1-1 #1 SMP PREEMPT x86_64 GNU/Browser' })
      } else {
        ctx.push({ kind: 'output', text: 'portfolio' })
      }
      return
    }

    case 'echo':
      ctx.push({ kind: 'output', text: rest.replace(/^echo\s+/, '') })
      return

    case 'clear':
      ctx.clear()
      return

    case 'history':
      ctx.push({
        kind: 'output',
        text: ctx.inputHistory.length === 0
          ? '(empty)'
          : ctx.inputHistory.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`).join('\n'),
      })
      return

    case 'exit':
      ctx.push({ kind: 'mute', text: 'logout. ` ↗ /`' })
      setTimeout(() => ctx.router.push('/'), 400)
      return

    case 'ls': {
      const target = args[0] ? normalizePath(ctx.cwd, args[0].replace(/^-\w+\s*/, '')) : ctx.cwd
      const long = args.includes('-l') || args[0] === '-l'
      const node = resolve(ctx.fs, target)
      if (!node) {
        ctx.push({ kind: 'error', text: `ls: ${target}: no such file or directory` })
        return
      }
      if (node.kind === 'file') {
        ctx.push({ kind: 'output', text: node.name })
        return
      }
      ctx.push({ kind: 'output', text: long ? fmtLsLong(node) : fmtLs(node) })
      return
    }

    case 'cd': {
      const target = args[0] ?? '/'
      if (target === '-') {
        ctx.push({ kind: 'mute', text: 'cd -: not supported. nice try.' })
        return
      }
      const next = normalizePath(ctx.cwd, target)
      const node = resolve(ctx.fs, next)
      if (!node) {
        ctx.push({ kind: 'error', text: `cd: ${target}: no such file or directory` })
        return
      }
      if (node.kind !== 'dir') {
        ctx.push({ kind: 'error', text: `cd: ${target}: not a directory` })
        return
      }
      ctx.setCwd(next)
      return
    }

    case 'cat': {
      if (!args[0]) {
        ctx.push({ kind: 'error', text: 'cat: missing file argument' })
        return
      }
      for (const a of args) {
        const target = normalizePath(ctx.cwd, a)
        const node = resolve(ctx.fs, target)
        if (!node) {
          ctx.push({ kind: 'error', text: `cat: ${a}: no such file or directory` })
          continue
        }
        if (node.kind === 'dir') {
          ctx.push({ kind: 'error', text: `cat: ${a}: is a directory` })
          continue
        }
        ctx.push({ kind: 'mute', text: '(reading...)' })
        const body = await readFile(node)
        ctx.push({ kind: 'output', text: body })
      }
      return
    }

    case 'open': {
      const route = args[0]
      if (!route) {
        ctx.push({ kind: 'error', text: 'open: missing route. try `open /work`' })
        return
      }
      const dest = route.startsWith('/') ? route : `/${route}`
      ctx.push({ kind: 'mute', text: `opening ${dest} ...` })
      setTimeout(() => ctx.router.push(dest), 250)
      return
    }

    case 'fastfetch':
    case 'neofetch': {
      ctx.push({ kind: 'boot' })
      return
    }

    case 'fullscreen':
    case 'fs': {
      if (typeof document === 'undefined') return
      // Safari (desktop + iPadOS) only exposes the webkit-prefixed API.
      type FsDoc = Document & {
        webkitFullscreenElement?: Element | null
        webkitExitFullscreen?: () => Promise<void> | void
      }
      type FsEl = HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void> | void
      }
      const doc = document as FsDoc
      const root = document.documentElement as FsEl
      const active = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
      try {
        if (active) {
          await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())
          ctx.push({ kind: 'mute', text: '(exited fullscreen)' })
        } else {
          await (root.requestFullscreen?.() ?? root.webkitRequestFullscreen?.())
          ctx.push({ kind: 'mute', text: '(fullscreen on. press Esc or run `fullscreen` again to exit.)' })
        }
      } catch (err) {
        ctx.push({
          kind: 'error',
          text: `fullscreen: ${err instanceof Error ? err.message : 'not available'}`,
        })
      }
      return
    }

    case 'git': {
      if (args[0] === 'log') {
        const lines = [
          'a3f01b · feat(codeflow): agent retry loops',
          'b2e8c4 · fix(codeflow): e2b sandbox timeout',
          '4f12aa · feat(taskforge): presence avatars',
          '7e3b9c · fix(taskforge): liveblocks reconnect',
          '1b8c2d · feat(traveloop): collaborative edits',
          'c1d9f7 · chore(portfolio): wired /terminal',
        ]
        ctx.push({ kind: 'output', text: lines.join('\n') })
        return
      }
      ctx.push({ kind: 'error', text: `git: unknown subcommand "${args[0] ?? ''}"` })
      return
    }

    case 'theme': {
      if (!args[0]) {
        ctx.push({ kind: 'output', text: `current: ${ctx.theme}\navailable: ${THEMES.join(', ')}` })
        return
      }
      const t = args[0] as Theme
      if (!THEMES.includes(t)) {
        ctx.push({ kind: 'error', text: `theme: unknown "${args[0]}". try ${THEMES.join(', ')}` })
        return
      }
      ctx.setTheme(t)
      ctx.push({ kind: 'ok', text: `theme set to ${t}` })
      return
    }

    case 'aria': {
      ctx.aria.start()
      return
    }

    case 'ollama': {
      ctx.push({ kind: 'mute', text: "(this box runs `aria` now — vaibhav's assistant. just type `aria`.)" })
      return
    }

    // ─── easter eggs ─────────────────────────────────
    case 'sudo':
      ctx.push({ kind: 'error', text: 'vaibhav is not in the sudoers file. this incident will be reported.' })
      return

    case 'vim':
    case 'nvim':
    case 'nano':
    case 'emacs': {
      const f = args[0] ?? 'untitled'
      ctx.vim.open(f)
      ctx.push({
        kind: 'output',
        text: `~~~ vim · ${f} ~~~\n\nyou are now inside a fake vim.\nthere is no escape... except :wq\n\n~\n~\n~\n~\n\n-- INSERT --                                 ${f} [+]`,
      })
      return
    }

    case 'cowsay':
      ctx.push({ kind: 'output', text: COW(rest.replace(/^cowsay\s*/, '') || 'moo.') })
      return

    case 'fortune':
      ctx.push({ kind: 'output', text: FORTUNES[Math.floor(Math.random() * FORTUNES.length)] })
      return

    case 'coffee':
      ctx.push({ kind: 'output', text: COFFEE })
      ctx.push({ kind: 'mute', text: '(brewing... ☕)' })
      return

    case 'rm': {
      if (args[0] === '-rf' && (args[1] === '/' || args[1] === '/*')) {
        ctx.push({ kind: 'error', text: 'rm: cannot remove `/`: operation reserved for the brave' })
        ctx.push({ kind: 'mute', text: '(deleting everything...)' })
        ctx.push({ kind: 'mute', text: '...' })
        ctx.push({ kind: 'mute', text: '...' })
        ctx.push({ kind: 'ok', text: '(jk. nothing happened.)' })
        return
      }
      ctx.push({ kind: 'error', text: `rm: this is a virtual fs. files are immutable. (try ${args[0] ? `cat ${args[0]}` : 'cat'} instead.)` })
      return
    }

    case 'hire-me':
    case 'hire':
      ctx.push({ kind: 'output', text: `email   hi@vergnyx.dev\ngithub  igneel0601\nresume  /vaibhav_resume.pdf\n\nlooking: full-time SWE + interesting freelance.` })
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.href = 'mailto:hi@vergnyx.dev'
      }, 300)
      return

    case ':q':
    case ':wq':
    case ':q!':
      ctx.push({ kind: 'mute', text: '(not in vim. nothing to quit.)' })
      return

    case 'man':
      ctx.push({ kind: 'mute', text: `man: no manual entry for ${args[0] ?? '(nothing)'}. try \`help\`.` })
      return

    default:
      ctx.push({ kind: 'error', text: `${name}: command not found. try \`help\`.` })
  }
}
