"use client";

import { useEffect, useRef } from "react";
import { ABOUT, SKILLS } from "@/lib/content";
import { SkillPill } from "@/components/SkillPill";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

export function SceneAbout() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const codeLines = gsap.utils.toArray<HTMLElement>("[data-code-line]");
      const pills = gsap.utils.toArray<HTMLElement>("[data-skill]");

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.from(codeLines, {
            autoAlpha: 0,
            x: -8,
            stagger: 0.06,
            duration: 0.35,
            ease: "none",
          });
          gsap.from(pills, {
            autoAlpha: 0,
            y: 10,
            stagger: 0.03,
            duration: 0.4,
            ease: "power2.out",
            delay: 0.4,
          });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="about" className="relative px-6 md:px-10 py-12 grid gap-6 md:gap-10 md:grid-cols-[1.1fr_1fr]">
      <div>
        <div className="mono mute text-[11px] tracking-[0.18em]">SCENE 03 — ABOUT</div>
        <h2 className="serif text-3xl md:text-4xl font-extrabold mt-2 mb-3">{ABOUT.heading}</h2>
        <p className="text-base md:text-lg max-w-xl" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-soft)" }}>
          {ABOUT.body}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-5">
          {SKILLS.map((s) => <SkillPill key={s}>{s}</SkillPill>)}
        </div>
      </div>

      <div className="box p-4 self-start"
           style={{ background: "var(--paper-2)", fontFamily: "var(--font-mono)", fontSize: 14, lineHeight: 1.65 }}>
        <div className="mute text-[11px] tracking-[0.14em] mb-2">~/about.ts</div>
        {ABOUT.code.map(([k, v], i) => (
          <div key={i} data-code-line>
            {k && <span style={{ color: "var(--accent)" }}>{k}</span>}
            {k ? " " : ""}
            <span style={{ color: i === 0 || i === ABOUT.code.length - 1 ? "var(--ink)" : "var(--accent-2)" }}>{v}</span>
          </div>
        ))}
        <div className="mute mt-2">// hover any value to see how it got there</div>
      </div>
    </section>
  );
}
