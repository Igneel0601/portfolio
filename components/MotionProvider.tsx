"use client";

import { useEffect } from "react";
import { LenisProvider } from "@/lib/lenis";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Dynamic import so GSAP doesn't land in the initial bundle.
    import("@/lib/gsap").then(({ registerGsap, ScrollTrigger }) => {
      registerGsap();
      if (typeof document !== "undefined" && document.fonts) {
        // refresh() walks every trigger reading geometry — a ~100ms+ forced
        // reflow. Run it on idle (not inline on fonts.ready) so it lands after
        // the page is interactive instead of inflating Total Blocking Time.
        document.fonts.ready.then(() => {
          const refresh = () => ScrollTrigger.refresh();
          if ("requestIdleCallback" in window) {
            requestIdleCallback(refresh, { timeout: 500 });
          } else {
            setTimeout(refresh, 0);
          }
        });
      }
    });
  }, []);

  return <LenisProvider>{children}</LenisProvider>;
}
