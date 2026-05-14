"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PROJECTS } from "@/lib/content";
import { ProjectCardLarge } from "@/components/ProjectCard";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motionMM, MOTION_BREAKPOINTS } from "@/lib/match-media";
import { D, E } from "@/lib/motion-tokens";

export function ScenePinnedWork() {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardWrapRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const prevIdxRef = useRef(0);

  // entry reveal once on viewport enter
  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const mm = motionMM();

    mm.add(MOTION_BREAKPOINTS, (ctx) => {
      const { isReduce } = ctx.conditions as { isReduce: boolean };
      const label = root.querySelector<HTMLElement>("[data-section-label]");
      const title = root.querySelector<HTMLElement>("[data-section-title]");
      const eyebrow = root.querySelector<HTMLElement>("[data-pin-meta]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-ls-row]", root);
      const foot = gsap.utils.toArray<HTMLElement>("[data-ls-foot]", root);
      const lsBox = root.querySelector<HTMLElement>("[data-ls-box]");
      const card = cardWrapRef.current;

      if (isReduce) {
        gsap.set([label, title, eyebrow, ...rows, ...foot, lsBox, card].filter(Boolean), {
          autoAlpha: 1,
          x: 0,
          y: 0,
        });
        return;
      }

      gsap.set([label, eyebrow], { autoAlpha: 0, y: -8 });
      gsap.set(title, { autoAlpha: 0, y: 16 });
      gsap.set(card, { autoAlpha: 0, y: 16 });
      gsap.set(lsBox, { autoAlpha: 0, y: 16 });
      gsap.set(rows, { autoAlpha: 0, x: -8 });
      gsap.set(foot, { autoAlpha: 0, y: 6 });

      gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
        defaults: { ease: E.precise },
      })
        .to([label, eyebrow], { autoAlpha: 1, y: 0, duration: 0.4 })
        .to(title, { autoAlpha: 1, y: 0, duration: D.md }, "-=0.20")
        .to([card, lsBox], { autoAlpha: 1, y: 0, duration: D.md, stagger: 0.05 }, "-=0.30")
        .to(rows, { autoAlpha: 1, x: 0, duration: D.sm, stagger: 0.05 }, "-=0.20")
        .to(foot, { autoAlpha: 1, y: 0, duration: D.sm, stagger: 0.05 }, "-=0.20");

      // pin the scene so the user has screen time to read/click rows
      ScrollTrigger.create({
        trigger: root,
        pin: true,
        start: "top top",
        end: "+=100%",
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    });

    return () => mm.revert();
  }, []);

  // swap card + details on activeIdx change
  useLayoutEffect(() => {
    if (prevIdxRef.current === activeIdx) return;
    const dir = activeIdx > prevIdxRef.current ? 1 : -1;
    prevIdxRef.current = activeIdx;
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    if (cardWrapRef.current) {
      gsap.fromTo(
        cardWrapRef.current,
        { xPercent: 6 * dir, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 0.45, ease: E.precise },
      );
    }
  }, [activeIdx]);

  const active = PROJECTS[activeIdx];

  return (
    <section
      ref={rootRef}
      data-scene="work"
      id="work"
      className="relative px-6 md:px-10 py-12 min-h-screen"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="mono mute text-[11px] tracking-[0.18em]" data-section-label>
              SCENE 02 — SELECTED WORK
            </div>
            <h2 className="serif text-3xl md:text-4xl font-extrabold mt-1" data-section-title>
              Three things I shipped.
            </h2>
          </div>
          <span className="mono mute text-[11px] tracking-[0.18em]" data-pin-meta>
            CLICK A FILE →
          </span>
        </div>

        <div
          className="grid gap-5 md:gap-8 items-start"
          style={{ gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)" }}
        >
          {/* LEFT — visual project card */}
          <div ref={cardWrapRef} key={active.id}>
            <ProjectCardLarge project={active} priority />
          </div>

          {/* RIGHT — terminal: ls + stats + git log */}
          <div className="hidden md:flex flex-col gap-4">
            <div data-ls-box className="box p-4 mono text-[13px]" style={{ background: "var(--paper-2)" }}>
              <div style={{ color: "var(--accent)" }}>$ ls -la ~/work</div>
              <div className="mute text-[11px] mt-1">total {PROJECTS.length * 8}</div>
              <ul className="mt-2 space-y-0.5">
                {PROJECTS.map((p, i) => {
                  const isActive = i === activeIdx;
                  return (
                    <li key={p.id}>
                      <button
                        data-ls-row
                        data-active={isActive ? "true" : undefined}
                        onClick={() => setActiveIdx(i)}
                        className="ls-row w-full text-left grid items-center gap-3 px-2 py-1 rounded"
                        style={{
                          gridTemplateColumns: "90px 130px 70px 1fr 14px",
                        }}
                      >
                        <span className="mute text-[12px]">drwxr-xr-x</span>
                        <span
                          className="text-[12px]"
                          style={{ color: isActive ? "var(--ink)" : "var(--ink-soft)" }}
                        >
                          {p.kind.toLowerCase()}
                        </span>
                        <span className="mute text-[12px]">{p.date}</span>
                        <span
                          className="truncate"
                          style={{
                            color: isActive ? "var(--ink)" : "var(--ink-soft)",
                            fontWeight: isActive ? 700 : 400,
                          }}
                        >
                          {p.id}/
                        </span>
                        <span style={{ color: isActive ? "var(--accent)" : "transparent" }}>●</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div data-ls-foot className="mute text-[11px] mt-2"># click a folder ↑</div>

              <a
                data-ls-foot
                href="/work"
                className="ls-see-all inline-block mt-6"
                style={{ color: "var(--accent)" }}
              >
                ${" "}
                <span
                  className="underline underline-offset-4"
                  style={{
                    textDecorationColor: "color-mix(in oklab, var(--accent) 50%, transparent)",
                    textDecorationThickness: "1px",
                  }}
                >
                  cd /work
                </span>
              </a>
              <div data-ls-foot className="mute text-[11px] mt-1"># click to see all projects</div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        :global([data-ls-row]) {
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.15s ease;
        }
        :global([data-ls-row]:hover) {
          background-color: color-mix(in oklab, var(--ink) 6%, transparent);
          transform: translateX(2px);
        }
        :global([data-ls-row][data-active]) {
          background-color: color-mix(in oklab, var(--accent) 8%, transparent);
        }
        :global(.ls-see-all) {
          font-size: 13px;
          transition: color 0.15s ease, transform 0.15s ease;
        }
        :global(.ls-see-all:hover) {
          color: var(--accent-2) !important;
          transform: translateX(2px);
        }
      `}</style>
    </section>
  );
}
