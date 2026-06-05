import { headers } from "next/headers";
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
      <Background />
      {!mobile && <CustomCursor />}
      {mobile ? <MobileNav /> : <Nav />}
      <NotFoundView />
    </MotionProvider>
  );
}
