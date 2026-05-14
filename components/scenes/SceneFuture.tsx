"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FUTURE } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { motionMM, MOTION_BREAKPOINTS } from "@/lib/match-media";
import { D, E } from "@/lib/motion-tokens";

export function SceneFuture() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const mm = motionMM();

    mm.add(MOTION_BREAKPOINTS, (ctx) => {
      const { isReduce } = ctx.conditions as { isReduce: boolean };
      const label = root.querySelector<HTMLElement>("[data-section-label]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-future]", root);

      if (isReduce) {
        gsap.set([label, ...cards], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(label, { autoAlpha: 0 });
      gsap.set(cards, { autoAlpha: 0, y: 16 });

      gsap.timeline({ scrollTrigger: { trigger: root, start: "top 75%", once: true } })
        .to(label, { autoAlpha: 1, duration: 0.35, ease: "power2.out" })
        .to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: D.md,
          ease: E.precise,
          stagger: { each: 0.07, from: "start" },
        }, "-=0.20");
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-scene="future"
      className="relative px-6 md:px-10 py-16 min-h-screen overflow-hidden"
    >
      <div data-section-label className="mono mute text-[11px] tracking-[0.18em]">SCENE 04 — ALSO ON THIS SITE</div>
      <div className="grid gap-4 mt-4 md:grid-cols-4">
        {FUTURE.map(({ label, blurb, route }) => (
          <Link
            key={route}
            href={route}
            data-future
            className="box p-4 relative block hover:border-accent"
            style={{ background: "var(--paper-2)" }}
          >
            <span className="stamp absolute -top-3 right-3">future</span>
            <div className="serif text-xl font-extrabold">{label}</div>
            <div className="mute mono text-[11px] mt-2">{blurb}</div>
            <div className="mono text-[10px] tracking-[0.14em] mt-3" style={{ color: "var(--accent-2)" }}>→ {route}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
