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

// Cache 404s for a minute so a retry storm doesn't hammer the DB, but short
// enough that fixing a broken URL (republish in Bloggz) takes effect quickly.
const NOT_FOUND_CACHE = 'public, max-age=60, must-revalidate'
const ERROR_CACHE = 'no-store'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params

  let rows: { data: Buffer; mime_type: string }[]
  try {
    const result = await pool.query<{ data: Buffer; mime_type: string }>(
      'SELECT data, mime_type FROM media_blob WHERE filename = $1',
      [filename],
    )
    rows = result.rows
  } catch (err) {
    console.error('[bloggz-media] db query failed', { filename, err })
    return new NextResponse('Upstream error', {
      status: 502,
      headers: { 'Cache-Control': ERROR_CACHE },
    })
  }

  const row = rows[0]
  if (!row) {
    return new NextResponse('Not found', {
      status: 404,
      headers: { 'Cache-Control': NOT_FOUND_CACHE },
    })
  }

  // Schema is NOT NULL on both columns, but a manual repair or hand-insert
  // could leave them empty. Don't pass null bytes to Uint8Array (throws) or
  // ship Content-Type: 'null' (browser treats as octet-stream, refuses
  // <img>). Treat as corruption: log, return 500.
  if (!row.data || !row.mime_type) {
    console.error('[bloggz-media] row missing data/mime_type', { filename })
    return new NextResponse('Corrupt asset', {
      status: 500,
      headers: { 'Cache-Control': ERROR_CACHE },
    })
  }

  return new NextResponse(new Uint8Array(row.data), {
    headers: {
      'Content-Type': row.mime_type,
      'Content-Length': String(row.data.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
