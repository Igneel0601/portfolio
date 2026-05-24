"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Suppress global footer on routes that ship their own status-bar style
  // footer (WritingFooter for /writing/*, StudyFooter for case studies under
  // /work/[slug]). Those reinforce the editor/filesystem metaphor.
  const hasOwnFooter =
    pathname?.startsWith("/writing") ||
    /^\/work\/[^/]+/.test(pathname ?? "");

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
