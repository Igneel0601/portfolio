'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { buildFs } from '@/lib/terminal/fs'
import { dispatch, HistoryEntry, Theme, THEME_VARS } from '@/lib/terminal/commands'
import { modelLabel, streamChat } from '@/lib/terminal/groq'
import { MOTD } from '@/lib/terminal/ascii'

const LS = {
  history: 'term:history',
  cwd: 'term:cwd',
  theme: 'term:theme',
  visited: 'term:visited',
}

const MAX_INPUT_HISTORY = 100

const BOOT_LINES: HistoryEntry[] = [
  { kind: 'boot' },
  ...MOTD.map((text) => ({ kind: 'mute' as const, text })),
]

export type UseTerminalReturn = ReturnType<typeof useTerminal>

export function useTerminal(postSlugs: { slug: string; title: string }[]) {
  const router = useRouter()
  const fs = useMemo(() => buildFs(postSlugs), [postSlugs])

  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState('/')
  const [inputHistory, setInputHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState<number>(-1)
  const [theme, setThemeState] = useState<Theme>('mint')
  const [vimOpen, setVimOpen] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // load persisted state
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const h = JSON.parse(localStorage.getItem(LS.history) ?? '[]')
      if (Array.isArray(h)) setInputHistory(h.slice(-MAX_INPUT_HISTORY))
      const c = localStorage.getItem(LS.cwd)
      if (c) setCwd(c)
      const t = localStorage.getItem(LS.theme) as Theme | null
      if (t === 'mint' || t === 'cyber' || t === 'paper') setThemeState(t)
    } catch {}

    setHistory(BOOT_LINES)
    localStorage.setItem(LS.visited, '1')
  }, [])

  // persist on change
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(LS.cwd, cwd)
  }, [cwd])
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(LS.theme, theme)
  }, [theme])
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(LS.history, JSON.stringify(inputHistory.slice(-MAX_INPUT_HISTORY)))
  }, [inputHistory])

  const push = useCallback((...entries: HistoryEntry[]) => {
    setHistory((prev) => [...prev, ...entries])
  }, [])

  const patchProgress = useCallback((id: string, label: string, pct: number, done?: boolean) => {
    setHistory((prev) => {
      const idx = prev.findIndex((e) => e.kind === 'progress' && e.id === id)
      const entry: HistoryEntry = { kind: 'progress', id, label, pct, done }
      if (idx === -1) return [...prev, entry]
      const next = prev.slice()
      next[idx] = entry
      return next
    })
  }, [])

  const clearScreen = useCallback(() => setHistory([]), [])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])

  const vim = useMemo(() => ({
    isOpen: vimOpen !== null,
    open: (file: string) => setVimOpen(file),
    close: () => setVimOpen(null),
  }), [vimOpen])

  const llmStatusText = useCallback(() => `ready · ${modelLabel()} via groq`, [])

  const llm = useMemo(() => ({
    available: true,
    status: llmStatusText,
    pull: async () => {
      push({ kind: 'ok', text: `${modelLabel()} hosted on groq · no download needed. just run.` })
    },
    run: async (prompt: string) => {
      let acc = ''
      setHistory((prev) => [...prev, { kind: 'output', text: '> ' }])
      const updateLast = (text: string) => {
        setHistory((prev) => {
          const copy = prev.slice()
          copy[copy.length - 1] = { kind: 'output', text }
          return copy
        })
      }
      try {
        for await (const chunk of streamChat(prompt)) {
          acc += chunk
          updateLast(`> ${acc}`)
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        push({ kind: 'error', text: `ollama run: ${msg}` })
      }
    },
  }), [llmStatusText, push])

  const submit = useCallback(async (raw: string) => {
    const value = raw
    setInput('')
    setHistIdx(-1)
    push({ kind: 'input', cwd, value })
    if (value.trim()) {
      setInputHistory((prev) => [...prev.filter((v) => v !== value), value].slice(-MAX_INPUT_HISTORY))
    }
    setBusy(true)
    try {
      await dispatch(value, {
        fs,
        cwd,
        setCwd,
        push,
        patchProgress,
        clear: clearScreen,
        router,
        inputHistory,
        setTheme,
        theme,
        vim,
        llm,
      })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      push({ kind: 'error', text: `runtime error: ${msg}` })
    } finally {
      setBusy(false)
    }
  }, [cwd, fs, push, patchProgress, clearScreen, router, inputHistory, setTheme, theme, vim, llm])

  const recallPrev = useCallback(() => {
    if (inputHistory.length === 0) return
    const nextIdx = histIdx === -1 ? inputHistory.length - 1 : Math.max(0, histIdx - 1)
    setHistIdx(nextIdx)
    setInput(inputHistory[nextIdx] ?? '')
  }, [inputHistory, histIdx])

  const recallNext = useCallback(() => {
    if (inputHistory.length === 0 || histIdx === -1) return
    const nextIdx = histIdx + 1
    if (nextIdx >= inputHistory.length) {
      setHistIdx(-1)
      setInput('')
    } else {
      setHistIdx(nextIdx)
      setInput(inputHistory[nextIdx] ?? '')
    }
  }, [inputHistory, histIdx])

  const styleVar = useMemo(() => ({ '--accent': THEME_VARS[theme].accent } as React.CSSProperties), [theme])

  return {
    history,
    input,
    setInput,
    cwd,
    submit,
    recallPrev,
    recallNext,
    busy,
    styleVar,
    theme,
    vimFile: vimOpen,
  }
}
