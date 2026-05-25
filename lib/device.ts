import { headers } from "next/headers";

export type Device = "mobile" | "desktop";

// iPad is treated as desktop — iPadOS reports a desktop Safari UA, mirroring
// the breakpoint-based split already used by lib/match-media.ts.
const MOBILE_UA_RE = /Android|iPhone|iPod|Mobi|Opera Mini/i;

// Crawlers and link unfurlers. We pin these to the desktop shell so the same
// canonical URL doesn't serve two different bodies to search/social indexers
// based on whichever UA variant happens to crawl first.
const BOT_UA_RE = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|outbrain|pinterest|developers\.google\.com|whatsapp|telegrambot|discordbot|slackbot|twitterbot|linkedinbot|applebot|duckduckbot|baiduspider|yandex|sogou|exabot|ia_archiver|lighthouse|chrome-lighthouse|headlesschrome/i;

export function isBotUA(ua: string): boolean {
  if (!ua) return false;
  return BOT_UA_RE.test(ua);
}

export function isMobileUA(ua: string): boolean {
  if (!ua) return false;
  if (isBotUA(ua)) return false;
  return MOBILE_UA_RE.test(ua);
}

export async function getDevice(): Promise<Device> {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  return isMobileUA(ua) ? "mobile" : "desktop";
}
