import { ImageResponse } from "next/og";
import { PROFILE } from "@/lib/profile";
import { OG_SIZE, OG_BG, OG_GREEN, OG_INK, OG_MUTED, OG_FONTS, OG_MARK } from "@/lib/og";

// Dynamic per-route OG card: /api/og?title=…&subtitle=…&eyebrow=…
// Renders a 1200x630 title card in the site's terminal aesthetic. Routes point
// their openGraph.images here with their own values (see lib/seo/metadata.ts),
// so each page unfurls with its own card instead of the shared brand default.

export const runtime = "nodejs"; // lib/og reads font + icon files

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? PROFILE.name).slice(0, 100);
  const subtitle = (searchParams.get("subtitle") ?? "").slice(0, 180);
  const eyebrow = (searchParams.get("eyebrow") ?? "").slice(0, 40).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: OG_BG,
          padding: "72px 80px",
          fontFamily: "Plex Mono",
          color: OG_INK,
        }}
      >
        {/* top: mark + brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={OG_MARK} width={84} height={84} alt="" />
          <span style={{ fontSize: 30, color: OG_GREEN }}>{PROFILE.brand}</span>
        </div>

        {/* middle: eyebrow + title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow ? (
            <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: OG_GREEN, marginBottom: 20 }}>
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1040,
            }}
          >
            <span>{title}</span>
            <span style={{ color: OG_GREEN }}>.</span>
          </div>
          {subtitle ? (
            <div style={{ display: "flex", fontSize: 34, color: OG_MUTED, lineHeight: 1.3, maxWidth: 980, marginTop: 24 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* bottom: brand url + name·role */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: OG_MUTED,
          }}
        >
          <span style={{ color: OG_GREEN }}>{PROFILE.brand}</span>
          <span>
            {PROFILE.name} · {PROFILE.role}
          </span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: OG_FONTS,
      headers: { "cache-control": "public, max-age=3600, s-maxage=86400" },
    },
  );
}
