import 'server-only'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const globalForPool = globalThis as unknown as { pgPool?: Pool }

const pool =
  globalForPool.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URI,
    max: 5,
    idleTimeoutMillis: 10_000,
  })

if (process.env.NODE_ENV !== 'production') globalForPool.pgPool = pool

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params
  const { rows } = await pool.query<{ data: Buffer; mime_type: string }>(
    'SELECT data, mime_type FROM media_blob WHERE filename = $1',
    [filename],
  )
  const row = rows[0]
  if (!row) return new NextResponse('Not found', { status: 404 })

  return new NextResponse(new Uint8Array(row.data), {
    headers: {
      'Content-Type': row.mime_type,
      'Content-Length': String(row.data.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
