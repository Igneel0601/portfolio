import { headers } from "next/headers";

export type Device = "mobile" | "desktop";

// iPad is treated as desktop — iPadOS reports a desktop Safari UA, mirroring
// the breakpoint-based split already used by lib/match-media.ts.
const MOBILE_UA_RE = /Android|iPhone|iPod|Mobi|Opera Mini/i;

// Link unfurlers / social preview scrapers. These have no meaningful
// mobile/desktop signal and should always render one canonical body so the
// preview matches whatever the user later sees. Pin to desktop.
//
// NOT included: search crawlers (Googlebot, Bingbot, Applebot, etc.) and
// audit tools (Lighthouse, HeadlessChrome). Those honour real mobile/desktop
// UAs — Googlebot Smartphone carries `Mobile` and should hit /m so Google's
// mobile-first indexing measures the mobile shell. Letting them fall through
// to MOBILE_UA_RE preserves that.
const UNFURLER_UA_RE = /facebookexternalhit|embedly|outbrain|whatsapp|telegrambot|discordbot|slackbot|twitterbot|linkedinbot|bingpreview|skypeuripreview|redditbot|vkshare|w3c_validator/i;

export function isUnfurlerUA(ua: string): boolean {
  if (!ua) return false;
  return UNFURLER_UA_RE.test(ua);
}

export function isMobileUA(ua: string): boolean {
  if (!ua) return false;
  if (isUnfurlerUA(ua)) return false;
  return MOBILE_UA_RE.test(ua);
}

export async function getDevice(): Promise<Device> {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  return isMobileUA(ua) ? "mobile" : "desktop";
}
