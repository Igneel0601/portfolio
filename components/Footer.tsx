"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const rawPathname = usePathname();

  // Direct visits to /d/* or /m/* (deep-links, share URLs, previews) bypass
  // proxy.ts rewrites, so usePathname() can return either shape. Strip the
  // shell prefix before matching so suppression works regardless.
  const pathname = rawPathname?.replace(/^\/[dm](?=\/|$)/, "") ?? "";

  // Suppress global footer on routes that ship their own status-bar style
  // footer (WritingFooter for /writing/*, StudyFooter for case studies under
  // /work/[slug]). Those reinforce the editor/filesystem metaphor.
  const hasOwnFooter =
    pathname === "/writing" ||
    pathname.startsWith("/writing/") ||
    /^\/work\/[^/]+/.test(pathname);

  if (hasOwnFooter) return null;

  return (
    <footer
      className="w-full"
      style={{ borderTop: "1px solid var(--hair)" }}
    >
      <div className="page-shell py-5 c-xs flex justify-between mute">
        <span>$ exit 0 · built with too much GSAP &amp; coffee</span>
        <span>© Vaibhav Verma · 2026</span>
      </div>
    </footer>
  );
}
