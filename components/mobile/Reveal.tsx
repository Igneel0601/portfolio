"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Scroll-reveal stagger via IntersectionObserver.

   Any descendant carrying `.m-reveal` starts hidden (opacity 0, nudged down —
   set in CSS so SSR paints the hidden state with no first-frame flash) and
   transitions in when it enters the viewport. IO uses the viewport as root,
   so it fires whether the page scrolls or the inner .m-snap-scroller does
   (GSAP ScrollTrigger can't track the inner scroller — that's why this is IO).

   Motion safety: bails under prefers-reduced-motion (the CSS hidden state is
   also scoped to no-preference, so those users see content immediately), and
   a <noscript> in app/m/layout.tsx unhides everything when JS is off.

   `replayKey` re-runs observation when a filtered list changes, so rows shown
   by a filter tap reveal instead of staying hidden. */
export function RevealGroup({
  children,
  replayKey,
}: {
  children: ReactNode;
  replayKey?: unknown;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    root
      .querySelectorAll<HTMLElement>(".m-reveal:not(.in)")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [replayKey]);

  return (
    <div ref={ref} className="m-reveal-group">
      {children}
    </div>
  );
}
