"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "./gsap";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Leave touch scrolling native (syncTouch off): hijacking it breaks the
      // browser's pull-to-refresh and URL-bar collapse. The scroll-reveal
      // triggers ride native touch scroll fine via ScrollTrigger.
    });
    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Lenis caches max-scroll at init. On pages with lazy-loaded images
    // (writing posts, case studies), the document grows taller after init
    // and Lenis's cached value goes stale — wheel events past the stale
    // max get silently eaten (trackpad/keyboard bypass via native scroll,
    // which is why they keep working). Resize on every body height change.
    const ro = new ResizeObserver(() => instance.resize());
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
