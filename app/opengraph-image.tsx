import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PROFILE } from '@/lib/profile'

// Default social-share card (Open Graph + Twitter). Next renders this to a
// 1200x630 PNG at build time, so links to the site unfurl with a real banner
// instead of a blank card. Per-post pages still override with their own image.

export const alt = `${PROFILE.name} — ${PROFILE.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// IBM Plex Mono (the site's typeface) bundled so the card matches the terminal
// aesthetic. Read at module scope; this route renders on the Node runtime.
const fontRegular = readFileSync(join(process.cwd(), 'app/_fonts/PlexMono-Regular.ttf'))
const fontBold = readFileSync(join(process.cwd(), 'app/_fonts/PlexMono-Bold.ttf'))

const BG = '#0D1117'
const GREEN = '#6ee7a7'
const INK = '#e6edf3'
const MUTED = '#8b949e'

// Same mark as the favicon (app/icon.svg), embedded so it renders crisp.
const MARK = `<svg width="200" height="200" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 10L14 16L8 22" stroke="${GREEN}" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"/><path d="M22 10L16 22" stroke="${GREEN}" stroke-width="3" stroke-linecap="square"/></svg>`
const MARK_SRC = `data:image/svg+xml;base64,${Buffer.from(MARK).toString('base64')}`

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          padding: '72px 80px',
          fontFamily: 'Plex Mono',
          color: INK,
        }}
      >
        {/* top: mark + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK_SRC} width={132} height={132} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: -1 }}>{PROFILE.name}</div>
            <div style={{ fontSize: 28, color: GREEN }}>{PROFILE.role}</div>
          </div>
        </div>

        {/* middle: tagline. Satori needs display:flex on any multi-child node,
            so the line is three flex items (text · accent · text) that wrap. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 56, lineHeight: 1.2, maxWidth: 1000 }}>
          <span>{PROFILE.taglineParts.pre}&nbsp;</span>
          <span style={{ color: GREEN }}>{PROFILE.taglineParts.accent}&nbsp;</span>
          <span>{PROFILE.taglineParts.post}</span>
        </div>

        {/* bottom: url + sections */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 26,
            color: MUTED,
          }}
        >
          <span style={{ color: GREEN }}>vergnyx.dev</span>
          <span>work · writing · /terminal</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Plex Mono', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Plex Mono', data: fontBold, weight: 700, style: 'normal' },
      ],
    },
  )
}
