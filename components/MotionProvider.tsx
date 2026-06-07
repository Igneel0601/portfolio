"use client";

import { useEffect } from "react";
import { LenisProvider } from "@/lib/lenis";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Dynamic import so GSAP doesn't land in the initial bundle.
    import("@/lib/gsap").then(({ registerGsap, ScrollTrigger }) => {
      registerGsap();
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    });
  }, []);

  return <LenisProvider>{children}</LenisProvider>;
}
