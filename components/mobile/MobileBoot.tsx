"use client";

import { Fragment, useEffect, useRef } from "react";
import { MoveDown } from "lucide-react";
import Link from "next/link";
import { BOOT_LINES, BOOT_PROMPT_FULL } from "@/lib/content";
import { PROFILE, type HeadlineToken } from "@/lib/profile";
import { gsap } from "@/lib/gsap";
import { D, E } from "@/lib/motion-tokens";

/* Mobile home intro — the same GSAP timeline SceneBoot runs on desktop
   (which explicitly skips it on mobile), retargeted to the mobile boot/hero
   markup: typewriter prompt → boot lines slide in → headline words rise out
   of their clipped lines → subhead → CTAs stagger. Reduced-motion users get
   the resting state immediately. */

// No will-change on the word: on iOS/WebKit it promotes the word to a
// compositing layer that CLIPS overflowing glyph ink to the box, slicing the
// italic f's overhang. The GSAP rise animates fine without the hint.
function Word({ children }: { children: React.ReactNode }) {
  return (
    <span data-headline-word className="inline-block m-hero-word">
      {children}
    </span>
  );
}

function HeadlineLine({ tokens }: { tokens: readonly HeadlineToken[] }) {
  return (
    <span className="block m-hero-line">
      {tokens.map((t, i) => {
        const inner =
          typeof t === "string" ? (
            t
          ) : "hilite" in t ? (
            <span className="m-hero-highlight">{t.hilite}</span>
          ) : (
            <em className="italic text-accent">{t.em}</em>
          );
        return (
          // The space sits BETWEEN word spans as its own text node — a trailing
          // space inside an inline-block gets trimmed at its edge, which is why
          // the words ran together ("I'mVaibhav").
          <Fragment key={i}>
            <Word>{inner}</Word>
            {i < tokens.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </span>
  );
}

export function MobileBoot() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prompt = root.querySelector<HTMLElement>("[data-boot-prompt]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-boot-line]", root);
    const words = gsap.utils.toArray<HTMLElement>("[data-headline-word]", root);
    const sub = root.querySelector<HTMLElement>("[data-subhead]");
    const ctas = gsap.utils.toArray<HTMLElement>("[data-cta]", root);

    // Real boot time: swap the placeholder for the actual page-ready time
    // (DOMContentLoaded, falling back to hydration time).
    const readyLine = root.querySelector<HTMLElement>("[data-boot-ready]");
    if (readyLine) {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      const ms = nav?.domContentLoadedEventEnd || performance.now();
      readyLine.textContent = `[ ok ] ready in ${(ms / 1000).toFixed(2)}s`;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (prompt) prompt.textContent = BOOT_PROMPT_FULL;
      gsap.set([...lines, sub, ...ctas], { autoAlpha: 1, x: 0, y: 0 });
      // No leftover transform (would clip the italic f on iOS — see below).
      gsap.set(words, { autoAlpha: 1, clearProps: "transform" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(lines, { autoAlpha: 0, x: -8 });
      gsap.set(words, { yPercent: 100, autoAlpha: 0 });
      gsap.set(sub, { autoAlpha: 0, y: 12 });
      gsap.set(ctas, { autoAlpha: 0, y: 14 });
      if (prompt) {
        prompt.textContent = "";
        // Reveal it: the mobile FOUC guard hides it (visibility:hidden) and the
        // typewriter below only fills text, not visibility — without this the
        // prompt ($ ./hello.sh) stays hidden.
        gsap.set(prompt, { autoAlpha: 1 });
      }

      const tl = gsap.timeline();
      if (prompt) {
        tl.to(prompt, {
          duration: 0.25,
          text: { value: BOOT_PROMPT_FULL, delimiter: "" },
          ease: "steps(14)",
        });
      }
      // Intro tightened (~35%, matching SceneBoot) so the hero headline — the LCP
      // element, revealed via this timeline — paints sooner under mobile CPU
      // throttle, where the old pacing pushed LCP to ~4.5s.
      tl.to(
        lines,
        { autoAlpha: 1, x: 0, duration: D.sm, ease: E.precise, stagger: 0.10 },
        "+=0.05",
      )
        .to(
          words,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.45,
            ease: E.weighty,
            stagger: { each: 0.04, from: "start" },
            // Drop the inline transform once risen: on iOS a leftover transform
            // keeps the word on a compositing layer that clips the italic f's
            // ink (the "swipe down+up fixes it" repaint). clearProps removes it.
            clearProps: "transform",
          },
          "-=0.15",
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
    <div ref={rootRef} data-m-boot className="min-h-[100dvh] flex flex-col justify-center">
      <div className="c-xs px-[1.375rem] pb-[0.5625rem] leading-[1.75]">
        <div>
          <span className="text-accent" data-boot-prompt>
            {BOOT_PROMPT_FULL}
          </span>
        </div>
        {BOOT_LINES.slice(1).map((l, i) => (
          <div
            key={i}
            data-boot-line
            data-boot-ready={l.text.includes("ready in") || undefined}
            className="pl-[0.625rem] text-ink-soft"
          >
            {l.text}
          </div>
        ))}
      </div>

      <div className="pt-[1.125rem] px-[1.375rem] pb-[1.375rem]">
        <h1 className="t-display m-hero-title">
          {PROFILE.headlineMobile.map((line, i) => (
            <HeadlineLine key={i} tokens={line} />
          ))}
        </h1>
        <p data-subhead className="c-xs m-0 mb-4 leading-[1.65] text-ink-dim">
          {PROFILE.subheadMobile.map((line, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>
        <div className="flex flex-col gap-[0.4375rem]">
          <button
            type="button"
            data-cta
            className="btn solid w-full justify-center no-underline"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("m-pager-go", { detail: 1 }))
            }
          >
            scroll the story <MoveDown className="i-lg" aria-hidden />
          </button>
          <a data-cta href={PROFILE.resumePath} download className="btn w-full justify-center no-underline">
            $ download résumé.pdf
          </a>
          <Link data-cta href="/contact" className="btn w-full justify-center no-underline">
            say hi to me
          </Link>
        </div>
      </div>
    </div>
  );
}
