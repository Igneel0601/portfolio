// The shells' stylesheets are normally pulled in by app/(site)'s layout, which
// the root not-found bypasses — so import both here. Without desktop.css the
// custom cursor (#custom-cursor), nav hover-pop, and parallax bg are unstyled;
// without mobile.css the MobileNav (.m-*) is unstyled. 404s are rare, so
// loading both is a fine trade for getting either shell's chrome right.
import "@/app/desktop.css";
import "@/app/mobile.css";
import { MotionProvider } from "@/components/MotionProvider";
import { Background } from "@/components/Background";
import CustomCursor from "@/components/CustomCursor";
import { Nav } from "@/components/Nav";
import { MobileNav } from "@/components/mobile/MobileNav";
import { NotFoundView } from "@/components/NotFoundView";

// Unmatched routes always render the ROOT not-found (segment not-found.tsx only
// catches explicit notFound() calls), so this never goes through app/(site)'s
// SiteShell — that's why a bare 404 had no nav, cursor, or parallax bg. Compose
// the shell chrome here, mirroring SiteShell: render both desktop and mobile
// chrome and let Tailwind's `md` breakpoint pick which is visible. We
// deliberately omit the global <Footer>: NotFoundView ships its own matching
// status-bar footer ($ exit 1 · page not found), so pulling in <Footer> too
// would double it.
export default function NotFound() {
  return (
    <MotionProvider>
      {/* Background is desktop-only (no mobile parallax); CustomCursor
          self-gates on any-pointer:coarse so it needs no toggle. */}
      <Background className="hidden md:block" />
      <CustomCursor />
      <Nav className="hidden md:block" />
      <MobileNav className="md:hidden" />
      <NotFoundView />
    </MotionProvider>
  );
}
