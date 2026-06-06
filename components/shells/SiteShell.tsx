"use client";

import dynamic from "next/dynamic";
import CustomCursor from "@/components/CustomCursor";
import { MotionProvider } from "@/components/MotionProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/mobile/MobileNav";
import { SiteFooter } from "@/components/mobile/parts";

// Background is desktop-only parallax and not in document flow — safe to
// defer with ssr:false. Nav is static so it SSRs and avoids CLS from the
// nav bar shifting content down when it hydrates.
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
