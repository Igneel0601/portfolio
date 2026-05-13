"use client";

import { useEffect, useRef } from "react";
import { FUTURE } from "@/lib/content";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

export function SceneFuture() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-future-card]");
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 75%",
        onEnter: () => {
          gsap.from(cards, {
            y: 60,
            autoAlpha: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
          });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative px-6 md:px-10 py-12">
      <div className="mono mute text-[11px] tracking-[0.18em]">SCENE 04 — COMING SOON</div>
      <div className="grid gap-4 mt-3 md:grid-cols-3">
        {FUTURE.map(({ h, s }) => (
          <div key={h} data-future-card className="box p-4 relative"
               style={{ background: "var(--paper-2)" }}>
            <span className="stamp absolute -top-3 right-3">future</span>
            <div className="serif text-2xl font-extrabold">{h}</div>
            <div className="mute mono text-[12px] mt-2">{s}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
