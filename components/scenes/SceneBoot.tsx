"use client";

import { useEffect, useRef } from "react";
import { MoveDown } from "lucide-react";
import { BOOT_LINES, BOOT_PROMPT_FULL, CONTACT } from "@/lib/content";
import { PROFILE, type HeadlineToken } from "@/lib/profile";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis";
import { motionMM, MOTION_BREAKPOINTS } from "@/lib/match-media";
import { D, E } from "@/lib/motion-tokens";
import { Btn } from "@/components/Btn";

function HeadlineLine({ tokens }: { tokens: readonly HeadlineToken[] }) {
  return (
    <span className="block overflow-hidden">
      {tokens.map((t, i) => {
        if (typeof t === "string") {
          return (
            <span key={i} data-headline-word className="inline-block will-change-transform">
              {t}
              {i < tokens.length - 1 ? " " : ""}
            </span>
          );
        }
        if ("hilite" in t) {
          return (
            <span key={i} data-headline-word className="inline-block will-change-transform">
              <span className="hilite">{t.hilite}</span>
              {i < tokens.length - 1 ? " " : ""}
            </span>
          );
        }
        return (
          <span key={i} data-headline-word className="inline-block will-change-transform">
            {/* padding-right: italic glyphs (e.g. Fraunces "f") overhang their
                box; the per-word composited layer (will-change) clips that ink
                on iPad WebKit. The pad keeps the swash inside the layer. */}
            <em className="italic" style={{ color: "var(--accent)", paddingRight: "0.22em" }}>{t.em}</em>
            {i < tokens.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

export function SceneBoot() {
  const lenis = useLenis();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const mm = motionMM();

    mm.add(MOTION_BREAKPOINTS, (ctx) => {
      const { isReduce, isMobile } = ctx.conditions as { isReduce: boolean; isMobile: boolean };
      const prompt = root.querySelector<HTMLElement>("[data-boot-prompt]");
      const lines = gsap.utils.toArray<HTMLElement>("[data-boot-line]", root);
      const words = gsap.utils.toArray<HTMLElement>("[data-headline-word]", root);
      const sub = root.querySelector<HTMLElement>("[data-subhead]");
      const ctas = gsap.utils.toArray<HTMLElement>("[data-cta]", root);

      if (isReduce || isMobile) {
        if (prompt) prompt.textContent = BOOT_PROMPT_FULL;
        gsap.set([...lines, sub, ...ctas], { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(words, { yPercent: 0, autoAlpha: 1 });
        return;
      }

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
      tl.to(lines, {
        autoAlpha: 1,
        x: 0,
        duration: D.sm,
        ease: E.precise,
        stagger: 0.18,
      }, "+=0.10")
        .to(words, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.65,
          ease: E.weighty,
          stagger: { each: 0.06, from: "start" },
        }, "-=0.20")
        .to(sub, {
          autoAlpha: 1,
          y: 0,
          duration: D.md,
          ease: E.precise,
        }, "-=0.30")
        .to(ctas, {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: E.precise,
          stagger: 0.08,
          // Clear inline transform after intro so .btn:active can take over —
          // otherwise GSAP's `translate(0,0)` wins via inline > class.
          clearProps: "transform",
        }, "-=0.15");

      const stickyEl = root.querySelector<HTMLElement>("[data-boot-sticky]");
      if (stickyEl) {
        gsap.to(stickyEl, {
          autoAlpha: 0,
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-scene="boot"
      id="hero"
      className="relative min-h-screen page-shell"
    >
      <div data-boot-sticky className="sticky top-0 pt-8 pb-[var(--scene-gap)]">
      <div className="c-md space-y-0.5">
        <div>
          <span style={{ color: "var(--accent)" }} data-boot-prompt>
            {BOOT_PROMPT_FULL}
          </span>
        </div>
        {BOOT_LINES.slice(1).map((l, i) => (
          <div key={i} data-boot-line className="pl-4 mute">
            {l.text}
          </div>
        ))}
      </div>

      <h1
        data-headline
        className="t-display mt-6 mb-2"
        /* 4-line hero: lower the vw term vs t-display's 8vw so it scales down on
           laptops instead of locking at the 4.5rem (81px) cap above ~1012px;
           big monitors still cap at 4.5rem. */
        style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", lineHeight: 1.15 }}
      >
        {PROFILE.headlineDesktop.map((line, i) => (
          <HeadlineLine key={i} tokens={line} />
        ))}
      </h1>

      <p data-subhead className="c-md mute max-w-xl mt-4">
        {PROFILE.subheadDesktop}
      </p>

      <div className="flex flex-wrap gap-3 mt-7">
        <Btn
          data-cta
          href="#work"
          variant="solid"
          onClick={(e) => {
            // Lenis owns the scroll; a native hash jump bypasses it (instant,
            // and desyncs Lenis's virtual position). Smooth-scroll the story to
            // the projects scene instead. No Lenis (reduced-motion) → native jump.
            if (!lenis) return;
            e.preventDefault();
            lenis.scrollTo("#work", { duration: 1.4 });
          }}
        >
          <MoveDown className="i-md" aria-hidden /> scroll the story
        </Btn>
        <Btn data-cta href={PROFILE.resumePath} download>$ download résumé.pdf</Btn>
        <Btn data-cta href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Btn>
      </div>

      </div>
    </section>
  );
}
