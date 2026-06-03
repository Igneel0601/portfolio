import { readFileSync } from "node:fs";
import { join } from "node:path";

// Shared primitives for every Open Graph card (the default brand card in
// app/opengraph-image.tsx and the dynamic per-route cards in app/api/og). One
// source so the cards can't drift in palette, type, or mark.

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_BG = "#0D1117";
export const OG_GREEN = "#6ee7a7";
export const OG_INK = "#e6edf3";
export const OG_MUTED = "#8b949e";

// IBM Plex Mono (the site's typeface) bundled so cards match the terminal vibe.
const fontRegular = readFileSync(join(process.cwd(), "app/_fonts/PlexMono-Regular.ttf"));
const fontBold = readFileSync(join(process.cwd(), "app/_fonts/PlexMono-Bold.ttf"));

export const OG_FONTS = [
  { name: "Plex Mono", data: fontRegular, weight: 400 as const, style: "normal" as const },
  { name: "Plex Mono", data: fontBold, weight: 700 as const, style: "normal" as const },
];

// The `\/|/` mark, read from app/icon.svg so OG can never drift from the favicon.
export const OG_MARK = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), "app/icon.svg"),
).toString("base64")}`;
