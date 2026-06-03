"use client";

import { useEffect, useRef } from "react";
import { CONTACT } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { motionMM, MOTION_BREAKPOINTS } from "@/lib/match-media";
import { E } from "@/lib/motion-tokens";
import { Btn } from "@/components/Btn";

export function SceneCTA() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const mm = motionMM();

    mm.add(MOTION_BREAKPOINTS, (ctx) => {
      const { isReduce, isMobile } = ctx.conditions as { isReduce: boolean; isMobile: boolean };
      const eyebrow = root.querySelector<HTMLElement>("[data-cta-eyebrow]");
      const headline = root.querySelector<HTMLElement>("[data-cta-headline]");
      const sub = root.querySelector<HTMLElement>("[data-cta-sub]");
      const buttons = gsap.utils.toArray<HTMLElement>("[data-cta-button]", root);

      if (isReduce || isMobile) {
        gsap.set([eyebrow, headline, sub, ...buttons], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(eyebrow, { autoAlpha: 0 });
      gsap.set(headline, { autoAlpha: 0, y: 16 });
      gsap.set(sub, { autoAlpha: 0, y: 8 });
      gsap.set(buttons, { autoAlpha: 0, y: 10 });

      gsap.timeline({ scrollTrigger: { trigger: root, start: "top 80%", once: true } })
        .to(eyebrow, { autoAlpha: 1, duration: 0.30, ease: "power2.out" })
        .to(headline, { autoAlpha: 1, y: 0, duration: 0.60, ease: E.weighty }, "-=0.10")
        .to(sub, { autoAlpha: 1, y: 0, duration: 0.45, ease: E.precise }, "-=0.30")
        .to(buttons, { autoAlpha: 1, y: 0, duration: 0.45, ease: E.precise, stagger: 0.08, clearProps: "transform" }, "-=0.20");
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="page-shell my-[var(--scene-gap)]">
    <section
      ref={rootRef}
      data-scene="cta"
      id="contact"
      className="p-5 md:p-7 box grid gap-6 md:grid-cols-[1.4fr_1fr] items-center"
      style={{ background: "var(--paper-2)" }}
    >
      <div>
        <div data-cta-eyebrow className="l-eyebrow" style={{ color: "var(--accent)" }}>
          END OF STORY · YOUR MOVE
        </div>
        <div data-cta-headline className="t-h3 mt-1.5 mb-1">
          Hiring? Building? Curious?
        </div>
        <div data-cta-sub className="t-body mute">Drop a line — I respond fast.</div>
      </div>
      <div className="flex flex-col gap-2">
        <Btn data-cta-button href={`mailto:${CONTACT.email}`} variant="solid" className="justify-center">
          {CONTACT.email}
        </Btn>
        <Btn data-cta-button href={CONTACT.github} target="_blank" rel="noreferrer" className="justify-center">
          github · linkedin · x
        </Btn>
      </div>
    </section>
    </div>
  );
}
