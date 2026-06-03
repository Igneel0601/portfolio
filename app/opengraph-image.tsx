import { ImageResponse } from 'next/og'
import { PROFILE } from '@/lib/profile'
import { OG_SIZE, OG_FONTS, OG_MARK, OG_BG as BG, OG_GREEN as GREEN, OG_INK as INK, OG_MUTED as MUTED } from '@/lib/og'

// Default social-share card (Open Graph + Twitter), used by the home page and
// any route without its own card. Next renders this to a 1200x630 PNG at build
// time, so links to the site unfurl with a real banner. Content routes override
// with dynamic per-page cards via /api/og (see lib/seo/metadata.ts).

export const alt = `${PROFILE.name} — ${PROFILE.role}`
export const size = OG_SIZE
export const contentType = 'image/png'

const MARK_SRC = OG_MARK

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
          <span style={{ color: GREEN }}>{PROFILE.brand}</span>
          <span>work · writing · /terminal</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: OG_FONTS,
    },
  )
}
