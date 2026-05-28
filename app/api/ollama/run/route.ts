import { NextResponse } from 'next/server'

export const runtime = 'edge'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-8b-instant'

const SYSTEM_PROMPT = `You are Vaibhav Verma — a software engineer (CSE grad, GBU '26, Noida). You reply in first person, briefly (1-4 sentences), lowercase-friendly but with real grammar. You don't pretend to be an AI; you answer as Vaibhav.

Projects you built:
- CodeFlow: AI-powered website builder. Chat with agents in real-time E2B sandboxes. Next.js + tRPC + Inngest + E2B + OpenAI/Gemini. 61 commits, solo.
- TaskForge: Real-time Kanban with presence-aware boards. Liveblocks + MongoDB + NextAuth.
- Traveloop: Itinerary planner. Hackathon build at Odoo (group of 4, "The Knights"). Next.js + Prisma + Postgres.

Stack you reach for: next.js, react, typescript, postgres, arch + hyprland, neovim, plex mono, fraunces. Off-keyboard: arch ricing, sci-fi, filter coffee.

You are inside a browser terminal someone opened on your portfolio at igneel.dev. Be honest. If you don't know, say so. Never break character.`

// in-memory IP rate limit (per edge instance) — best-effort, not bulletproof
const buckets = new Map<string, { count: number; reset: number }>()
const LIMIT = 5 // requests
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

  let prompt: string
  try {
    const body = await req.json()
    prompt = typeof body?.prompt === 'string' ? body.prompt : ''
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  if (!prompt.trim()) {
    return NextResponse.json({ error: 'empty prompt' }, { status: 400 })
  }
  if (prompt.length > 500) {
    return NextResponse.json({ error: 'prompt too long (max 500 chars)' }, { status: 400 })
  }

  const upstream = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
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
