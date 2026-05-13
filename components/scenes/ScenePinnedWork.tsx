"use client";

import { useEffect, useRef } from "react";
import { PROJECTS } from "@/lib/content";
import { ProjectCardLarge, ProjectCardSide } from "@/components/ProjectCard";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

export function ScenePinnedWork() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !rootRef.current) return;
    if (window.innerWidth < 768) return; // mobile: stacked, no pin

    const ctx = gsap.context(() => {
      const pinTarget = rootRef.current!.querySelector<HTMLElement>("[data-pin]");
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]");
      if (!pinTarget || slides.length === 0) return;

      gsap.set(slides, { autoAlpha: 0, y: 30 });
      gsap.set(slides[0], { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top+=60",
          end: () => `+=${window.innerHeight * (slides.length - 1) * 0.9}`,
          pin: pinTarget,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      slides.forEach((slide, i) => {
        if (i === 0) return;
        const prev = slides[i - 1];
        tl.to(prev, { autoAlpha: 0, y: -30, duration: 0.5 })
          .to(slide, { autoAlpha: 1, y: 0, duration: 0.5 }, "<");
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const rest = PROJECTS.slice(1);

  return (
    <section ref={rootRef} id="work" className="relative px-6 md:px-10 py-12">
      <div className="mono mute text-[11px] tracking-[0.18em] mb-3">
        SCENE 02 — SELECTED WORK · PINNED CANVAS
      </div>
      <div className="grid gap-5 md:gap-6 items-start" style={{ gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)" }}>
        <div data-pin className="md:sticky md:top-24">
          <div className="relative">
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                data-slide
                className={i === 0 ? "" : "absolute inset-0"}
                style={i === 0 ? {} : { pointerEvents: "none" }}
              >
                <ProjectCardLarge project={p} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="mute mono text-[11px] tracking-[0.14em]">
            UP NEXT — KEEPS SCROLLING
          </div>
          {rest.map((p, i) => (
            <ProjectCardSide key={p.id} project={p} dim={i === rest.length - 1} />
          ))}
          <div className="box-dash p-3 opacity-60">
            <div className="mono mute text-[11px] tracking-[0.12em]">
              + experiments · /writing · more soon
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
