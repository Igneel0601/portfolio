import { headers } from "next/headers";

export type Device = "mobile" | "desktop";

// iPad is treated as desktop — iPadOS reports a desktop Safari UA, mirroring
// the breakpoint-based split already used by lib/match-media.ts.
const MOBILE_UA_RE = /Android|iPhone|iPod|Mobi|Opera Mini/i;

export function isMobileUA(ua: string): boolean {
  if (!ua) return false;
  return MOBILE_UA_RE.test(ua);
}

export async function getDevice(): Promise<Device> {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  return isMobileUA(ua) ? "mobile" : "desktop";
}
