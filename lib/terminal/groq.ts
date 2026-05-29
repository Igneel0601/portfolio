// Browser-side client for /api/aria.
// Streams tokens from Groq via our serverless route (key stays server-side).

export type ChatMsg = { role: 'user' | 'assistant'; content: string }

export function modelLabel(): string {
  return 'llama-3.1-8b'
}

// Streams Aria's reply for a full conversation (multi-turn). Pass the running
// message history; the server prepends Aria's system persona.
export async function* streamChat(messages: ChatMsg[]): AsyncGenerator<string, void, void> {
  const res = await fetch('/api/aria', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    let msg = `request failed (${res.status})`
    try {
      const j = JSON.parse(body)
      if (j?.error) msg = j.error
    } catch {}
    throw new Error(msg)
  }

  if (!res.body) throw new Error('empty response')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })

    let idx: number
    while ((idx = buf.indexOf('\n')) !== -1) {
      const line = buf.slice(0, idx).trim()
      buf = buf.slice(idx + 1)
      if (!line || !line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (payload === '[DONE]') return
      try {
        const json = JSON.parse(payload)
        const delta = json?.choices?.[0]?.delta?.content
        if (typeof delta === 'string' && delta) yield delta
      } catch {
        // ignore malformed chunks
      }
    }
  }
}
