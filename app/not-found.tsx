import { headers } from "next/headers";
// The shells' stylesheets are normally pulled in by app/d|m's layouts, which
// the root not-found bypasses — so import both here. Without desktop.css the
// custom cursor (#custom-cursor), nav hover-pop, and parallax bg are unstyled;
// without mobile.css the MobileNav (.m-*) is unstyled. 404s are rare, so
// loading both is a fine trade for getting either shell's chrome right.
import "@/app/desktop.css";
import "@/app/mobile.css";
import { isMobileUA } from "@/lib/device";
import { MotionProvider } from "@/components/MotionProvider";
import { Background } from "@/components/Background";
import CustomCursor from "@/components/CustomCursor";
import { Nav } from "@/components/Nav";
import { MobileNav } from "@/components/mobile/MobileNav";
import { NotFoundView } from "@/components/NotFoundView";

// Unmatched routes always render the ROOT not-found (segment not-found.tsx only
// catches explicit notFound() calls), so this never goes through app/d|m's
// DesktopShell/MobileShell — that's why a bare 404 had no nav, cursor, or
// parallax bg. Compose the shell chrome here, UA-sniffed with the same
// isMobileUA the proxy uses. We deliberately omit the shells' global <Footer>:
// NotFoundView ships its own matching status-bar footer ($ exit 1 · page not
// found), so pulling in <Footer> too would double it.
export default async function NotFound() {
  const ua = (await headers()).get("user-agent") ?? "";
  const mobile = isMobileUA(ua);

  return (
    <MotionProvider>
      {/* Background is desktop-only (MobileShell has no parallax bg) */}
      {!mobile && <Background />}
      {!mobile && <CustomCursor />}
      {mobile ? <MobileNav /> : <Nav />}
      <NotFoundView />
    </MotionProvider>
  );
}
