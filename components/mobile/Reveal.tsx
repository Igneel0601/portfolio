"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/* Scroll-reveal stagger built on GSAP ScrollTrigger — the same engine as the
   desktop scenes, riding the Lenis-smoothed scroll mounted by MobileShell.

   Any descendant carrying `.m-reveal` starts hidden (opacity 0, nudged down —
   the hidden state is set in CSS so SSR paints it with no first-frame flash)
   and animates into place as it scrolls in. ScrollTrigger.batch groups
   elements that enter together and staggers them; items that enter one at a
   time each form their own batch — so it reads well for both the 3 home
   panels and the longer row lists.

   Motion safety: bails under prefers-reduced-motion (the CSS hidden state is
   also scoped to no-preference, so those users see content immediately), and
   a <noscript> in app/m/layout.tsx unhides everything when JS is off.

   `replayKey` rebuilds the triggers when a filtered list changes, so rows
   shown by a filter tap re-stagger instead of staying hidden. */
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

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll<HTMLElement>(".m-reveal"),
      );
      if (!els.length) return;
      ScrollTrigger.batch(els, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.08,
            overwrite: true,
          }),
      });
      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [replayKey]);

  return (
    <div ref={ref} className="m-reveal-group">
      {children}
    </div>
  );
}
