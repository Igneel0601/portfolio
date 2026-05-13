"use client";

import { useEffect, useRef } from "react";
import { BOOT_LINES } from "@/lib/content";
import { registerGsap, gsap, SplitText } from "@/lib/gsap";

export function SceneBoot() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const bootLines = gsap.utils.toArray<HTMLElement>("[data-boot-line]");
      const headline = rootRef.current!.querySelector<HTMLElement>("[data-headline]");
      const sub = rootRef.current!.querySelector<HTMLElement>("[data-sub]");
      const ctas = rootRef.current!.querySelector<HTMLElement>("[data-ctas]");

      const tl = gsap.timeline();

      bootLines.forEach((el) => {
        const full = el.dataset.text || "";
        el.textContent = "";
        tl.to(el, { duration: 0.45, text: { value: full }, ease: "none" }, "+=0.05");
      });

      if (headline) {
        const split = new SplitText(headline, { type: "words,chars" });
        gsap.set(headline, { autoAlpha: 1 });
        tl.from(split.words, {
          yPercent: 60,
          autoAlpha: 0,
          stagger: 0.04,
          duration: 0.55,
          ease: "power3.out",
        }, "+=0.1");
      }

      if (sub) tl.from(sub, { y: 12, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");
      if (ctas) tl.from(ctas.children, {
        y: 16,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.45,
        ease: "power2.out",
      }, "-=0.15");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative px-6 md:px-10 pt-10 pb-6">
      <div className="mono text-[13px] leading-7 space-y-0.5">
        {BOOT_LINES.map((l, i) => (
          <div key={i}>
            {l.prompt && <span style={{ color: "var(--accent)" }}>{l.prompt} </span>}
            <span data-boot-line data-text={l.text} className={l.prompt ? "" : "pl-4 mute"}>
              {l.text}
            </span>
          </div>
        ))}
      </div>

      <h1
        data-headline
        className="serif font-extrabold tracking-tight mt-6 mb-2"
        style={{ fontSize: "clamp(40px, 7.5vw, 84px)", lineHeight: 0.95, opacity: 1 }}
      >
        I&apos;m <span className="hilite">Vaibhav.</span><br />
        I build software<br />
        that <em className="italic" style={{ color: "var(--accent)" }}>teaches itself</em><br />
        to write more software.
      </h1>

      <p data-sub className="mute text-base md:text-lg max-w-xl mt-4" style={{ fontFamily: "var(--font-mono)" }}>
        B.Tech CSE · Gautam Buddha University · Noida · open to full-time + freelance · I ship
        AI-powered web apps and the tooling around them.
      </p>

      <div data-ctas className="flex flex-wrap gap-3 mt-7">
        <a href="#work" className="btn solid">$ cat work →</a>
        <a href="/resume.pdf" className="btn">$ download résumé.pdf</a>
        <a href="#contact" className="btn">$ contact</a>
      </div>
    </section>
  );
}
