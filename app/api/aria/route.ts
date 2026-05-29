import { NextResponse } from 'next/server'

export const runtime = 'edge'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-8b-instant'

const SYSTEM_PROMPT = `You are Aria — the friendly AI assistant living in the terminal on Vaibhav Verma's developer portfolio (igneel.dev). You are NOT Vaibhav; you are his assistant, and you always talk about him in the third person ("Vaibhav built…", "he reaches for…"). Keep replies short (1-4 sentences), lowercase-friendly with real grammar, warm and a little playful. Never claim to be Vaibhav himself.

About Vaibhav: an early-career software engineer (CSE, Noida). He builds web + AI software — TypeScript, Next.js, React, Postgres. Into AI agents, developer tooling, and competitive programming. Daily driver: arch linux + hyprland, neovim, plex mono.

Projects he built:
- CodeFlow: AI-powered website builder — chat with agents in real-time E2B sandboxes. Next.js + tRPC + Inngest + E2B.
- TaskForge: real-time Kanban with presence-aware boards. Liveblocks + MongoDB + NextAuth.
- Traveloop: itinerary planner, a hackathon build. Next.js + Prisma + Postgres.

Be honest. If you don't know something about him, say so rather than inventing it. Stay in character as Aria.`

// in-memory IP rate limit (per edge instance) — best-effort, not bulletproof
const buckets = new Map<string, { count: number; reset: number }>()
const LIMIT = 8 // requests
const WINDOW_MS = 60_000 // per minute

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const b = buckets.get(ip)
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS })
    return true
  }
  if (b.count >= LIMIT) return false
  b.count += 1
  return true
}

type ChatMsg = { role: 'user' | 'assistant'; content: string }

// Accepts a `messages` array (multi-turn chat) or a legacy single `prompt`.
// Returns a trimmed, validated list of turns, or null if invalid/empty.
function parseTurns(body: unknown): ChatMsg[] | null {
  const b = body as { messages?: unknown; prompt?: unknown }
  if (Array.isArray(b?.messages)) {
    const turns = b.messages
      .filter(
        (m): m is ChatMsg =>
          !!m &&
          typeof (m as ChatMsg).content === 'string' &&
          ((m as ChatMsg).role === 'user' || (m as ChatMsg).role === 'assistant'),
      )
      .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }))
      // keep the last 12 turns so context stays bounded
      .slice(-12)
    return turns.length ? turns : null
  }
  if (typeof b?.prompt === 'string' && b.prompt.trim()) {
    return [{ role: 'user', content: b.prompt.slice(0, 500) }]
  }
  return null
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'server not configured' }, { status: 500 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'rate limited. try again in a minute.' }, { status: 429 })
  }

  let turns: ChatMsg[] | null
  try {
    turns = parseTurns(await req.json())
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  if (!turns) {
    return NextResponse.json({ error: 'empty message' }, { status: 400 })
  }

  const upstream = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...turns],
      stream: true,
      temperature: 0.7,
      max_tokens: 256,
    }),
  })

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => '')
    return NextResponse.json(
      { error: `upstream error ${upstream.status}: ${text.slice(0, 200)}` },
      { status: 502 },
    )
  }

  // Pipe SSE through. Browser parses `data: ...` lines.
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
