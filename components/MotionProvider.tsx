"use client";

import { useEffect } from "react";
import { LenisProvider } from "@/lib/lenis";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsap();
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  }, []);

  return <LenisProvider>{children}</LenisProvider>;
}
