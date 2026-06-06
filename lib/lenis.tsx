"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Dynamic import keeps GSAP out of the initial JS bundle — it only parses
    // after first paint, which reduces Total Blocking Time on slow devices.
    let cleanupFn: (() => void) | undefined;

    import("./gsap").then(({ registerGsap, gsap, ScrollTrigger }) => {
      registerGsap();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const instance = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Leave touch scrolling native (syncTouch off): hijacking it breaks the
        // browser's pull-to-refresh and URL-bar collapse.
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLenis(instance);

      instance.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Lenis caches max-scroll at init. Resize on body height change to keep
      // it accurate on pages with lazy-loaded images.
      const ro = new ResizeObserver(() => instance.resize());
      ro.observe(document.body);

      cleanupFn = () => {
        ro.disconnect();
        gsap.ticker.remove(tick);
        instance.destroy();
        setLenis(null);
      };
    });

    return () => cleanupFn?.();
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
