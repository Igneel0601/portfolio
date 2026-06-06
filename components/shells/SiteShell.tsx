import { Background } from "@/components/Background";
import CustomCursor from "@/components/CustomCursor";
import { MotionProvider } from "@/components/MotionProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/mobile/MobileNav";
import { SiteFooter } from "@/components/mobile/parts";

// Single responsive shell (replaces DesktopShell + MobileShell). Both desktop
// and mobile chrome render server-side; Tailwind's `md` breakpoint (768px)
// picks which is visible — matching the gsap.matchMedia min-width:768px contract
// so CSS visibility and JS-driven behavior flip at the same line.
//
// CustomCursor self-gates internally (any-pointer: coarse → no-op) and renders
// no markup, so it needs no toggle. Background is parallax chrome with no mobile
// analogue, so it's desktop-only.
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <Background className="hidden md:block" />
      <CustomCursor />
      <Nav className="hidden md:block" />
      <MobileNav className="md:hidden" />
      {children}
      <Footer className="hidden md:block" />
      <SiteFooter className="md:hidden" />
    </MotionProvider>
  );
}
