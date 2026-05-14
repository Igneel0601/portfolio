"use client";

import { useEffect, useRef } from "react";
import { CONTACT } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { motionMM, MOTION_BREAKPOINTS } from "@/lib/match-media";
import { D, E } from "@/lib/motion-tokens";

export function SceneCTA() {
  const rootRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const footer = footerRef.current;
    const mm = motionMM();

    mm.add(MOTION_BREAKPOINTS, (ctx) => {
      const { isReduce } = ctx.conditions as { isReduce: boolean };
      const eyebrow = root.querySelector<HTMLElement>("[data-cta-eyebrow]");
      const headline = root.querySelector<HTMLElement>("[data-cta-headline]");
      const sub = root.querySelector<HTMLElement>("[data-cta-sub]");
      const buttons = gsap.utils.toArray<HTMLElement>("[data-cta-button]", root);
      const footerLines = footer ? gsap.utils.toArray<HTMLElement>("[data-footer-line]", footer) : [];

      if (isReduce) {
        gsap.set([eyebrow, headline, sub, ...buttons, ...footerLines], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(eyebrow, { autoAlpha: 0 });
      gsap.set(headline, { autoAlpha: 0, y: 16 });
      gsap.set(sub, { autoAlpha: 0, y: 8 });
      gsap.set(buttons, { autoAlpha: 0, y: 10 });
      gsap.set(footerLines, { autoAlpha: 0 });

      gsap.timeline({ scrollTrigger: { trigger: root, start: "top 80%", once: true } })
        .to(eyebrow, { autoAlpha: 1, duration: 0.30, ease: "power2.out" })
        .to(headline, { autoAlpha: 1, y: 0, duration: 0.60, ease: E.weighty }, "-=0.10")
        .to(sub, { autoAlpha: 1, y: 0, duration: 0.45, ease: E.precise }, "-=0.30")
        .to(buttons, { autoAlpha: 1, y: 0, duration: 0.45, ease: E.precise, stagger: 0.08 }, "-=0.20");

      if (footer && footerLines.length > 0) {
        gsap.to(footerLines, {
          autoAlpha: 1,
          duration: 0.40,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: { trigger: footer, start: "top 90%", once: true },
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <section
        ref={rootRef}
        data-scene="cta"
        id="contact"
        className="mx-6 md:mx-10 my-12 p-5 md:p-7 box grid gap-6 md:grid-cols-[1.4fr_1fr] items-center"
        style={{ background: "var(--paper-2)" }}
      >
        <div>
          <div data-cta-eyebrow className="mono text-[11px] tracking-[0.18em]" style={{ color: "var(--accent)" }}>
            END OF STORY · YOUR MOVE
          </div>
          <div data-cta-headline className="serif text-2xl md:text-3xl font-extrabold mt-1.5 mb-1">
            Hiring? Building? Curious?
          </div>
          <div data-cta-sub className="mute text-sm md:text-base">Drop a line — I respond fast.</div>
        </div>
        <div className="flex flex-col gap-2">
          <a data-cta-button href={`mailto:${CONTACT.email}`} className="btn solid justify-center">
            {CONTACT.email}
          </a>
          <a data-cta-button href={CONTACT.github} target="_blank" rel="noreferrer" className="btn justify-center">
            github · linkedin · x
          </a>
        </div>
      </section>

      <footer ref={footerRef} className="px-6 md:px-10 py-5 mono text-xs flex justify-between mute">
        <span data-footer-line>$ exit 0 · built with too much GSAP &amp; coffee</span>
        <span data-footer-line>© Vaibhav Verma · 2026</span>
      </footer>
    </>
  );
}
