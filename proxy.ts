import { NextResponse, type NextRequest } from "next/server";
import { isMobileUA } from "@/lib/device";

// Paths that should NOT be UA-routed (assets, API, RSS, robots).
const SKIP_PREFIXES = [
  "/api",
  "/_next",
  "/_static",
];

const SKIP_EXACT = new Set([
  "/rss.xml",
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.ico",
]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Already-prefixed paths (subtree pages render directly): no rewrite.
  if (pathname.startsWith("/d/") || pathname.startsWith("/m/")) {
    return NextResponse.next();
  }
  if (pathname === "/d" || pathname === "/m") {
    return NextResponse.next();
  }

  if (SKIP_EXACT.has(pathname)) return NextResponse.next();
  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // Skip files with extensions (images, fonts, etc).
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return NextResponse.next();

  const ua = req.headers.get("user-agent") ?? "";
  const prefix = isMobileUA(ua) ? "/m" : "/d";
  const url = req.nextUrl.clone();
  url.pathname = prefix + (pathname === "/" ? "" : pathname);
  return NextResponse.rewrite(url);
}

export const config = {
  // Match every request; the function itself decides what to skip. The matcher
  // here only filters Next's internal static assets to avoid even invoking
  // proxy for them.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
