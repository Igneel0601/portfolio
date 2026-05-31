"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { BOOT_LINES, BOOT_PROMPT_FULL, CONTACT } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { D, E } from "@/lib/motion-tokens";

/* Mobile home intro — the same GSAP timeline SceneBoot runs on desktop
   (which explicitly skips it on mobile), retargeted to the mobile boot/hero
   markup: typewriter prompt → boot lines slide in → headline words rise out
   of their clipped lines → subhead → CTAs stagger. Reduced-motion users get
   the resting state immediately. */

type Token = string | { hilite: string } | { em: string };

const HEADLINE_LINES: readonly (readonly Token[])[] = [
  ["I'm", { hilite: "Vaibhav." }],
  ["I", "build", "software"],
  ["that", { em: "teaches itself" }],
  ["to", "write", "more"],
  ["software."],
];

function Word({ children }: { children: React.ReactNode }) {
  return (
    <span data-headline-word className="inline-block will-change-transform">
      {children}
    </span>
  );
}

function HeadlineLine({ tokens }: { tokens: readonly Token[] }) {
  return (
    <span className="block overflow-hidden">
      {tokens.map((t, i) => {
        const space = i < tokens.length - 1 ? " " : "";
        if (typeof t === "string") return <Word key={i}>{t}{space}</Word>;
        if ("hilite" in t)
          return (
            <Word key={i}>
              <span className="m-hero-highlight">{t.hilite}</span>
              {space}
            </Word>
          );
        return (
          <Word key={i}>
            <em className="m-hero-em">{t.em}</em>
            {space}
          </Word>
        );
      })}
    </span>
  );
}

export function MobileBoot() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Home-only scroll-snap paging (one swipe per section). Toggled here because
  // MobileBoot renders only on the home route; removed on unmount so other
  // /m pages scroll normally.
  useEffect(() => {
    document.documentElement.classList.add("m-snap-root");
    return () => document.documentElement.classList.remove("m-snap-root");
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prompt = root.querySelector<HTMLElement>("[data-boot-prompt]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-boot-line]", root);
    const words = gsap.utils.toArray<HTMLElement>("[data-headline-word]", root);
    const sub = root.querySelector<HTMLElement>("[data-subhead]");
    const ctas = gsap.utils.toArray<HTMLElement>("[data-cta]", root);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (prompt) prompt.textContent = BOOT_PROMPT_FULL;
      gsap.set([...lines, sub, ...ctas], { autoAlpha: 1, x: 0, y: 0 });
      gsap.set(words, { yPercent: 0, autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(lines, { autoAlpha: 0, x: -8 });
      gsap.set(words, { yPercent: 100, autoAlpha: 0 });
      gsap.set(sub, { autoAlpha: 0, y: 12 });
      gsap.set(ctas, { autoAlpha: 0, y: 14 });
      if (prompt) prompt.textContent = "";

      const tl = gsap.timeline();
      if (prompt) {
        tl.to(prompt, {
          duration: 0.4,
          text: { value: BOOT_PROMPT_FULL, delimiter: "" },
          ease: "steps(14)",
        });
      }
      tl.to(
        lines,
        { autoAlpha: 1, x: 0, duration: D.sm, ease: E.precise, stagger: 0.18 },
        "+=0.10",
      )
        .to(
          words,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.65,
            ease: E.weighty,
            stagger: { each: 0.06, from: "start" },
          },
          "-=0.20",
        )
        .to(
          sub,
          { autoAlpha: 1, y: 0, duration: D.md, ease: E.precise },
          "-=0.30",
        )
        .to(
          ctas,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: E.precise,
            stagger: 0.08,
            // Clear inline transform so .btn:active can take over afterwards.
            clearProps: "transform",
          },
          "-=0.15",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="m-boot-scene">
      <div className="c-xs m-boot">
        <div>
          <span className="m-boot-prompt" data-boot-prompt>
            {BOOT_PROMPT_FULL}
          </span>
        </div>
        {BOOT_LINES.slice(1).map((l, i) => (
          <div key={i} data-boot-line className="m-boot-line">
            {l.text}
          </div>
        ))}
      </div>

      <div className="m-hero">
        <h1 className="t-display m-hero-title">
          {HEADLINE_LINES.map((line, i) => (
            <HeadlineLine key={i} tokens={line} />
          ))}
        </h1>
        <p data-subhead className="c-xs m-hero-meta">
          B.Tech CSE · GBU · Noida
          <br />
          open to full-time + freelance.
        </p>
        <div className="m-hero-ctas">
          <Link data-cta href="/work" className="btn solid m-btn">
            $ cat work <MoveRight className="i-lg" aria-hidden />
          </Link>
          <a data-cta href="/vaibhav_resume.pdf" download className="btn m-btn">
            $ download résumé.pdf
          </a>
          <a data-cta href={`mailto:${CONTACT.email}`} className="btn m-btn">
            {CONTACT.email}
          </a>
        </div>
      </div>
    </div>
  );
}
