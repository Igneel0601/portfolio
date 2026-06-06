import "@/app/desktop.css";
import "@/app/mobile.css";
import { SiteShell } from "@/components/shells/SiteShell";

// Single shell for every device — no UA routing. Both desktop-only and
// mobile-only CSS load here (PR 2 will consolidate them); SiteShell renders both
// chrome variants and Tailwind's `md` breakpoint picks which is visible.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Scroll-reveal hides .m-reveal until JS animates it in; without JS,
          unhide everything so content is never stuck invisible. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: ".m-reveal{opacity:1!important;transform:none!important}",
          }}
        />
      </noscript>
      <SiteShell>{children}</SiteShell>
    </>
  );
}
