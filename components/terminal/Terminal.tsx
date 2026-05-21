'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './terminal.module.css'
import { useTerminal } from './useTerminal'
import { TerminalLine } from './TerminalLine'

const PROMPT_PREFIX = 'vaibhav@portfolio'

type Props = {
  postSlugs: { slug: string; title: string }[]
}

const QUOTE = '"i commit too often, people can\'t catch up lmao" — vaxry'

const SYSTEM_ROWS: { icon: string; k: string; v: string }[] = [
  { icon: '⌂', k: 'Chassis',  v: 'human · b.tech cse · noida' },
  { icon: '◊', k: 'OS',       v: 'arch linux (btw)' },
  { icon: '⌬', k: 'Kernel',   v: '6.13.4-arch1-1' },
  { icon: '☷', k: 'WM',       v: 'hyprland' },
  { icon: '➤', k: 'Shell',    v: 'zsh + starship' },
  { icon: '▣', k: 'Terminal', v: 'igneel.dev/terminal' },
]

const HARDWARE_ROWS: { icon: string; k: string; v: string }[] = [
  { icon: '☷', k: 'CPU',      v: 'brainpower · caffeine-boosted' },
  { icon: '◈', k: 'GPU',      v: 'imagination' },
  { icon: '⬢', k: 'Memory',   v: '8gb-ish · leaks sometimes' },
  { icon: '✎', k: 'Editor',   v: 'nvim (lazyvim)' },
  { icon: 'A', k: 'Font',     v: 'ibm plex mono' },
  { icon: '⌛', k: 'Uptime',  v: '~3 years coding' },
]

const PALETTE = [
  'var(--ink-dim)',
  '#ff7b72',
  '#f0b73a',
  'var(--accent)',
  'var(--accent-2)',
  '#79c0ff',
  '#d2a8ff',
  '#ff7b72',
]

export function Terminal({ postSlugs }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (isMobile) return <MobileTerminal />
  return <DesktopTerminal postSlugs={postSlugs} />
}

export function BootBlock() {
  return (
    <div className={styles.stage}>
      <Portrait />
      <div className={styles.column}>
        <div className={styles.quote}>
          <span className={styles.bootIcon} style={{ color: 'var(--accent)' }}>⌂</span>
          <span className={styles.bootSep}>:</span>
          <span className={styles.bootVal}>{QUOTE}</span>
        </div>
        <FastfetchBlock rows={SYSTEM_ROWS} accent="#7ee787" />
        <div className={styles.signature}>
          <span className={styles.bootIcon} style={{ color: 'var(--accent)' }}>★</span>
          <span className={styles.bootSep}>:</span>
          <span className={styles.bootVal}>archVaibhav @ igneel</span>
        </div>
        <FastfetchBlock rows={HARDWARE_ROWS} accent="#ff7b72" />
        <Palette />
      </div>
    </div>
  )
}

function Wallpaper() {
  return (
    <>
      <div
        className={styles.wallpaper}
        style={{ backgroundImage: `url(/term/wallpaper.jpg)` }}
        aria-hidden
      />
      <div className={styles.wallpaperOverlay} aria-hidden />
    </>
  )
}

function FastfetchBlock({
  rows,
  accent,
}: {
  rows: { icon: string; k: string; v: string }[]
  accent: string
}) {
  return (
    <div className={styles.bootRows}>
      <span className={styles.cornerTR} aria-hidden />
      <span className={styles.cornerBL} aria-hidden />
      {rows.map((r) => (
        <div key={r.k} className={styles.bootRow}>
          <span className={styles.bootIcon} style={{ color: accent }}>
            {r.icon}
          </span>
          <span className={styles.bootKey} style={{ color: accent }}>
            {r.k}
          </span>
          <span className={styles.bootSep}>:</span>
          <span className={styles.bootVal}>{r.v}</span>
        </div>
      ))}
    </div>
  )
}

function Portrait() {
  return (
    <img
      src="/term/portrait.png"
      alt="vaibhav verma portrait"
      className={styles.portraitImg}
    />
  )
}

function Palette() {
  return (
    <div className={styles.palette} aria-hidden>
      {PALETTE.map((c, i) => (
        <span key={i} className={styles.paletteDot} style={{ background: c }} />
      ))}
    </div>
  )
}

function MobileTerminal() {
  return (
    <div className={styles.mobileWrap}>
      <div className={styles.mobileCard}>
        <div className={`${styles.mobileEyebrow} l-meta`}>/terminal</div>
        <h1 className={styles.mobileTitle}>needs a real keyboard.</h1>
        <p className={styles.mobileSub}>open this on desktop for the full thing.</p>
        <Link href="/" className={styles.mobileBack}>
          ↗ back to home
        </Link>
      </div>
    </div>
  )
}

function DesktopTerminal({ postSlugs }: Props) {
  const {
    history,
    input,
    setInput,
    cwd,
    submit,
    recallPrev,
    recallNext,
    busy,
    styleVar,
    vimFile,
  } = useTerminal(postSlugs)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  // refocus input whenever busy clears or history grows
  useEffect(() => {
    if (!busy) inputRef.current?.focus({ preventScroll: true })
  }, [busy, history.length])

  // global focus guard: any keypress outside input pulls focus back
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (document.activeElement === inputRef.current) return
      inputRef.current?.focus({ preventScroll: true })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [history])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (busy) return
      submit(input)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      recallPrev()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      recallNext()
      return
    }
    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      submit('clear')
      return
    }
    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault()
      setInput('')
      submit('')
      return
    }
  }

  return (
    <div className={styles.shell} style={styleVar}>
      <Wallpaper />

      <div className={styles.window}>
        <div
          ref={bodyRef}
          className={`${styles.body} c-md`}
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
        >
            {history.map((entry, i) => (
              <TerminalLine key={i} entry={entry} />
            ))}

            <div className={styles.activeLine}>
              <span className={styles.linePrompt}>
                {vimFile ? `:` : `${PROMPT_PREFIX}:${cwd === '/' ? '~' : `~${cwd}`}$`}
              </span>
              <input
                ref={inputRef}
                className={styles.activeInput}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                disabled={busy}
                aria-label="terminal input"
              />
            </div>
        </div>
      </div>
    </div>
  )
}
