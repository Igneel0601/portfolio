"use client";

import { useEffect } from "react";

export function TocHighlight({ ids }: { ids: string[] }) {
  useEffect(() => {
    if (ids.length === 0) return;
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    if (sections.length === 0) return;

    let currentId: string | null = null;
    const setActive = (id: string) => {
      if (id === currentId) return;
      currentId = id;
      ids.forEach((sid) => {
        const link = document.querySelector<HTMLAnchorElement>(
          `[data-toc-link="${sid}"]`,
        );
        if (!link) return;
        if (sid === id) link.setAttribute("data-active", "true");
        else link.removeAttribute("data-active");
      });
    };

    // Active = section whose virtual range (h2 top → next h2 top, or page end)
    // overlaps the viewport the most. Works regardless of which scroll
    // mechanism (native, Lenis) is driving the page.
    const recompute = () => {
      const scrollY = window.scrollY;
      const vpTop = scrollY;
      const vpBottom = scrollY + window.innerHeight;
      const docEnd = document.documentElement.scrollHeight;

      // Bottom snap: at page bottom, only force the last section once the
      // reader has actually scrolled its heading near the top of the viewport.
      // Otherwise clicking an earlier short section would jump to last.
      if (vpBottom >= docEnd - 4) {
        const lastTop =
          sections[sections.length - 1].getBoundingClientRect().top + scrollY;
        if (lastTop <= scrollY + window.innerHeight * 0.3) {
          setActive(sections[sections.length - 1].id);
          return;
        }
      }

      let bestId = ids[0];
      let bestOverlap = -1;
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].getBoundingClientRect().top + scrollY;
        const bottom =
          i + 1 < sections.length
            ? sections[i + 1].getBoundingClientRect().top + scrollY
            : docEnd;
        const overlap = Math.max(0, Math.min(bottom, vpBottom) - Math.max(top, vpTop));
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestId = sections[i].id;
        }
      }
      setActive(bestId);
    };

    let rafId = 0;
    let lastScroll = -1;
    const tick = () => {
      const y = window.scrollY;
      if (y !== lastScroll) {
        lastScroll = y;
        recompute();
      }
      rafId = requestAnimationFrame(tick);
    };
    recompute();
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [ids]);

  return null;
}
