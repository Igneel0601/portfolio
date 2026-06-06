"use client";

import { useEffect, useRef } from "react";
import { MobileTimeline } from "./MobileTimeline";
import { CTASection } from "./parts";
import { MobileProjects } from "./MobileProjects";
import { MobileBoot } from "./MobileBoot";
import { gsap, Observer } from "@/lib/gsap";

/* Home as a GSAP-driven pager (not scroll-snap). Observer turns wheel/touch/
   pointer into one swipe; gsap.to translates the track to the next stop. No
   native scroll, so the iOS address bar can't peek/jump the way it did snap.

   Stops are computed from the DOM, not a fixed page count: every full-screen
   child contributes a stop at its top. The final "tail" section is taller than
   one screen (timeline centred in the first viewport, then CTA + footer below)
   and contributes TWO stops — its top (timeline alone) and its bottom (timeline
   tail + CTA + footer in full view, footer flush). So one swipe past the
   timeline scrolls it up into the contact close, like the desktop page end. */
export function MobileHome() {
  const deckRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Render-both keeps MobileHome mounted in the desktop DOM (hidden by the
  // page's md:hidden wrapper), but effects still run while hidden — so gate the
  // scroll-lock + pager to <768px. Otherwise they hijack desktop scrolling:
  // m-snap-root locks html/body overflow and the Observer swallows wheel events
  // with preventDefault. Mirrors the desktop scenes' gsap.matchMedia gate. Pure
  // width match (not MOTION_BREAKPOINTS.isMobile) so reduced-motion mobile users
  // keep the pager exactly as before.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(max-width: 767.98px)", () => {
      document.documentElement.classList.add("m-snap-root");

      const deck = deckRef.current;
      const track = trackRef.current;
      if (!deck || !track) {
        return () => document.documentElement.classList.remove("m-snap-root");
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let stops: number[] = [];
      let index = 0;
      let animating = false;

      // Each child contributes a stop at its top; a child taller than the
      // viewport also contributes a stop at its bottom edge.
      const buildStops = () => {
        const vh = deck.clientHeight;
        const next: number[] = [];
        for (const child of Array.from(track.children) as HTMLElement[]) {
          const top = child.offsetTop;
          next.push(top);
          if (child.offsetHeight > vh + 1) next.push(top + child.offsetHeight - vh);
        }
        stops = next;
      };

      const apply = (animate: boolean) => {
        index = Math.max(0, Math.min(stops.length - 1, index));
        deck.dataset.stop = String(index);
        gsap.to(track, {
          y: -stops[index],
          duration: animate && !reduce ? 0.7 : 0,
          ease: "power2.inOut",
          overwrite: true,
          onComplete: () => {
            animating = false;
          },
        });
      };

      const go = (dir: number) => {
        if (animating) return;
        const target = Math.max(0, Math.min(stops.length - 1, index + dir));
        if (target === index) return;
        animating = true;
        index = target;
        apply(true);
      };

      buildStops();
      apply(false);

      const observer = Observer.create({
        target: deck,
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        tolerance: 10,
        preventDefault: true,
        onUp: () => go(1),
        onDown: () => go(-1),
      });

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === "PageDown") go(1);
        else if (e.key === "ArrowUp" || e.key === "PageUp") go(-1);
      };
      window.addEventListener("keydown", onKey);

      // Hero "scroll the story" button advances the pager one stop (to projects).
      const onGo = (e: Event) => go((e as CustomEvent<number>).detail ?? 1);
      window.addEventListener("m-pager-go", onGo as EventListener);

      // Recompute stops when the viewport changes (rotation / address bar) and
      // keep the current stop aligned.
      const onResize = () => {
        buildStops();
        apply(false);
      };
      window.addEventListener("resize", onResize);

      return () => {
        observer.kill();
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("m-pager-go", onGo as EventListener);
        window.removeEventListener("resize", onResize);
        document.documentElement.classList.remove("m-snap-root");
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={deckRef} className="m-deck" data-stop={0}>
      <div ref={trackRef} className="m-deck-track">
        <MobileBoot />
        <MobileProjects />
        {/* Tall tail: timeline centred in the first viewport, then CTA +
            footer below. Two stops — timeline alone, then the contact close. */}
        <section className="m-deck-tail">
          <div className="m-deck-tail-timeline">
            <MobileTimeline />
          </div>
          <CTASection />
          <footer className="c-xs m-site-footer">
            <span>$ exit 0 · too much coffee</span>
            <span>© {new Date().getFullYear()}</span>
          </footer>
        </section>
      </div>
    </div>
  );
}
