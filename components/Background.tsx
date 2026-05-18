"use client";

import { useEffect } from "react";
import { useLenis } from "@/lib/lenis";

/**
 * Parallax background — tiled wallpaper that scrolls at half the speed of content.
 * That speed differential is the parallax: content races, bg drifts slowly behind.
 * Implemented by translating background-position on Lenis scroll events.
 */
export function Background() {
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!lenis) return;

    let blur = 0;
    let targetBlur = 0;
    let raf = 0;

    const tick = () => {
      blur += (targetBlur - blur) * 0.12;
      targetBlur *= 0.85;
      document.documentElement.style.setProperty("--bg-blur", `${blur.toFixed(2)}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onScroll = ({ scroll, velocity }: { scroll: number; velocity: number }) => {
      const y = (-scroll * 0.1) % 32;
      document.documentElement.style.setProperty("--bg-y", `${y}px`);
      const v = Math.min(Math.abs(velocity ?? 0) * 0.15, 3);
      if (v > targetBlur) targetBlur = v;
    };
    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [lenis]);

  return <div className="parallax-bg" aria-hidden />;
}
