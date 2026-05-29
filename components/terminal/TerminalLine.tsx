'use client'

import { HistoryEntry } from '@/lib/terminal/commands'
import { BootBlock } from './Terminal'
import styles from './terminal.module.css'

const PROMPT_PREFIX = 'vaibhav@portfolio'

function ProgressBar({ pct, label, done }: { pct: number; label: string; done?: boolean }) {
  const width = 32
  const filled = Math.max(0, Math.min(width, Math.round(pct * width)))
  const bar = '█'.repeat(filled) + '·'.repeat(width - filled)
  const pctStr = `${Math.round(pct * 100)}%`.padStart(4)
  return (
    <div className={done ? styles.bootOk : styles.bootMute}>
      [{bar}] {pctStr}  {label}
    </div>
  )
}

export function TerminalLine({ entry }: { entry: HistoryEntry }) {
  switch (entry.kind) {
    case 'boot':
      return <BootBlock />
    case 'input':
      return (
        <div className={styles.line}>
          <span className={styles.linePrompt}>
            {entry.promptLabel ?? `${PROMPT_PREFIX}:${entry.cwd === '/' ? '~' : `~${entry.cwd}`}$`}
          </span>
          <span className={styles.lineOutput}>{entry.value}</span>
        </div>
      )
    case 'output':
      return <div className={styles.lineOutput} style={{ whiteSpace: 'pre-wrap' }}>{entry.text}</div>
    case 'ok':
      return <div className={styles.bootOk} style={{ whiteSpace: 'pre-wrap' }}>{entry.text}</div>
    case 'error':
      return <div style={{ color: '#ff7b72', whiteSpace: 'pre-wrap' }}>{entry.text}</div>
    case 'mute':
      return <div className={styles.bootMute} style={{ whiteSpace: 'pre-wrap' }}>{entry.text}</div>
    case 'progress':
      return <ProgressBar pct={entry.pct} label={entry.label} done={entry.done} />
  }
}
