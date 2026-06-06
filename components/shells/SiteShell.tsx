"use client";

import dynamic from "next/dynamic";
import CustomCursor from "@/components/CustomCursor";
import { MotionProvider } from "@/components/MotionProvider";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/mobile/MobileNav";
import { SiteFooter } from "@/components/mobile/parts";

// Nav and Background both statically import lib/gsap (152 KB). Dynamic-importing
// them with ssr:false breaks that chain from the initial bundle — GSAP parses
// only after first paint, which significantly reduces Total Blocking Time.
// Nav is sticky-positioned so it doesn't shift layout when it hydrates.
// Background is desktop-only parallax, never contributes to LCP.
const Nav = dynamic(() => import("@/components/Nav").then((m) => ({ default: m.Nav })), { ssr: false });
const Background = dynamic(
  () => import("@/components/Background").then((m) => ({ default: m.Background })),
  { ssr: false },
);

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
