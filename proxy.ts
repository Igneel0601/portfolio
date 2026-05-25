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

  // Skip known static-asset extensions only. Bare `\.[a-z0-9]+$` would also
  // skip legitimate slugs like /writing/lessons-from-v1.0 or /work/api-v2.0.
  if (/\.(png|jpe?g|webp|avif|gif|svg|ico|bmp|tiff?|css|js|mjs|map|woff2?|ttf|otf|eot|txt|xml|json|pdf|mp4|webm|mov|mp3|ogg|wav|zip)$/i.test(pathname)) {
    return NextResponse.next();
  }

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
