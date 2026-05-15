"use client";

import { useEffect, useRef, useState } from "react";
import { TIMELINE, LOGS } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis";
import { motionMM, MOTION_BREAKPOINTS } from "@/lib/match-media";
import { D, E } from "@/lib/motion-tokens";

export function SceneTimeline() {
  const rootRef = useRef<HTMLElement | null>(null);
  const logsRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const lastIdxRef = useRef(0);
  const maxProgressRef = useRef(0);
  const stRef = useRef<ScrollTrigger | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    // once timeline complete: both up + down scrolls accelerate 5× inside pin,
    // tapering to natural speed within 100vh of either pin edge for smooth handoff
    const onWheel = (e: WheelEvent) => {
      if (!lenis) return;
      if (maxProgressRef.current < 0.999) return;
      const st = stRef.current;
      if (!st) return;
      const cur = lenis.scroll;
      if (cur < st.start || cur > st.end) return;
      const vh = window.innerHeight;
      if (e.deltaY < 0) {
        if (cur - st.start <= vh) return;
      } else {
        if (st.end - cur <= vh) return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      lenis.scrollTo(cur + e.deltaY * 8, { duration: 0.3, lock: true, force: true });
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });

    const mm = motionMM();

    mm.add(MOTION_BREAKPOINTS, (ctx) => {
      const { isMotion, isMobile, isReduce } = ctx.conditions as {
        isMotion: boolean;
        isMobile: boolean;
        isReduce: boolean;
      };
      const title = root.querySelector<HTMLElement>("[data-section-title]");
      const track = root.querySelector<HTMLElement>("[data-track]");
      const stops = gsap.utils.toArray<HTMLElement>("[data-stop]", root);
      const dots = gsap.utils.toArray<HTMLElement>("[data-stop-dot]", root);

      if (isReduce || isMobile) {
        gsap.set([title, ...stops], { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        if (track) gsap.set(track, { scaleY: 1 });
        dots.forEach((d) => d.setAttribute("data-passed", "true"));
        setActiveIdx(TIMELINE.length - 1);
        return;
      }

      if (!isMotion || stops.length === 0) return;

      if (title) {
        gsap.set(title, { autoAlpha: 0, y: 24 });
        gsap.to(title, {
          autoAlpha: 1,
          y: 0,
          duration: D.md,
          ease: E.precise,
          scrollTrigger: { trigger: title, start: "top 80%", once: true },
        });
      }

      // years + dots stay visible always; titles/blurbs only appear as dot reaches them
      gsap.set(stops, { autoAlpha: 1 });
      const details = gsap.utils.toArray<HTMLElement>("[data-stop-detail]", root);
      gsap.set(details, { autoAlpha: 0, x: -8 });
      if (details[0]) gsap.set(details[0], { autoAlpha: 1, x: 0 });

      if (!track) return;

      const fitTrack = () => {
        const trackParent = track.parentElement;
        const first = dots[0];
        const last = dots[dots.length - 1];
        if (!trackParent || !first || !last) return;
        const parentRect = trackParent.getBoundingClientRect();
        const firstRect = first.getBoundingClientRect();
        const lastRect = last.getBoundingClientRect();
        const topPx = firstRect.top + firstRect.height / 2 - parentRect.top;
        const bottomPx = parentRect.bottom - (lastRect.top + lastRect.height / 2);
        track.style.top = `${topPx}px`;
        track.style.bottom = `${bottomPx}px`;
      };
      fitTrack();

      gsap.set(track, { scaleY: 0, transformOrigin: "top center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          pin: true,
          start: "top top",
          end: "+=600%",
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => fitTrack(),
          onUpdate: (self) => {
            // timeline scrubs across first half of pin; second half = static buffer
            const raw = self.progress;
            const mapped = Math.min(raw / 0.5, 1);
            const p = Math.max(mapped, maxProgressRef.current);
            maxProgressRef.current = p;
            const idx = Math.min(
              stops.length - 1,
              Math.max(0, Math.floor(p * (stops.length - 1) + 0.0001)),
            );
            track.style.transform = `scaleY(${p})`;
            stops.forEach((stop, i) => {
              const dot = dots[i];
              const detail = stop.querySelector<HTMLElement>("[data-stop-detail]");
              if (i <= idx) {
                stop.setAttribute("data-active", "true");
                if (dot) dot.setAttribute("data-passed", "true");
                if (detail)
                  gsap.to(detail, {
                    autoAlpha: 1,
                    x: 0,
                    duration: i === idx ? 0.35 : 0.3,
                    ease: i === idx ? "power3.out" : "none",
                    overwrite: "auto",
                  });
              }
              if (dot) {
                if (i === idx) dot.setAttribute("data-current", "true");
                else dot.removeAttribute("data-current");
              }
            });
            if (idx > lastIdxRef.current) {
              lastIdxRef.current = idx;
              setActiveIdx(idx);
            }
          },
        },
      });

      stRef.current = tl.scrollTrigger ?? null;

      return () => {
        tl.kill();
        stRef.current = null;
      };
    });

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true } as EventListenerOptions);
      mm.revert();
    };
  }, [lenis]);

  const logTlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);

  // Scene 01 vocabulary: type the $ commands char-by-char; output lines fade in.
  // Erase between eras = block fade-out (not backspace).
  useEffect(() => {
    if (!logsRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = Array.from(
      logsRef.current.querySelectorAll<HTMLElement>("[data-log-line]"),
    );
    if (lines.length === 0) return;

    logTlRef.current?.kill();

    const fullTexts = lines.map((el) => el.dataset.text || "");

    if (reduced) {
      lines.forEach((el, i) => {
        el.textContent = fullTexts[i];
        el.removeAttribute("data-typing");
      });
      gsap.set(lines, { autoAlpha: 1, y: 0 });
      firstRunRef.current = false;
      return;
    }

    const tl = gsap.timeline();
    logTlRef.current = tl;

    const isFirst = firstRunRef.current;
    firstRunRef.current = false;

    // Reset: hide all lines and clear typed content for the next sequence
    lines.forEach((el) => el.removeAttribute("data-typing"));

    // FADE-OUT phase — only if previous era exists (lines currently have visible text)
    if (!isFirst) {
      tl.to(lines, {
        autoAlpha: 0,
        y: -4,
        duration: 0.18,
        ease: "power2.in",
        stagger: 0.02,
      });
    }

    tl.call(() => {
      lines.forEach((el, i) => {
        const text = fullTexts[i];
        const isCommand = text.startsWith("$");
        if (isCommand) {
          el.textContent = "";
        } else {
          el.textContent = text;
        }
      });
      gsap.set(lines, { autoAlpha: 0, y: 6 });
    });

    // small beat
    tl.add(() => {}, "+=0.05");

    // ENTER phase — for each line:
    //   - $ commands: reveal element + type char-by-char with cursor
    //   - output lines: fade-in + y-shift (Scene 01 boot-line vocabulary)
    const lastIdx = lines.length - 1;
    lines.forEach((el, i) => {
      const text = fullTexts[i];
      const isCommand = text.startsWith("$");

      if (isCommand) {
        const typeDuration = Math.max(0.18, Math.min(0.55, text.length * 0.035));
        tl.set(el, { autoAlpha: 1, y: 0 });
        tl.call(() => el.setAttribute("data-typing", "true"));
        tl.to(el, {
          duration: typeDuration,
          text: { value: text, delimiter: "" },
          ease: `steps(${Math.max(4, text.length)})`,
        });
        if (i !== lastIdx) tl.call(() => el.removeAttribute("data-typing"));
      } else {
        tl.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.28,
          ease: "power3.out",
        }, i === 0 ? undefined : "+=0.05");
      }
    });
  }, [activeIdx]);

  const currentStop = TIMELINE[activeIdx];
  const currentLogs = LOGS[activeIdx] || [];

  return (
    <section
      ref={rootRef}
      data-scene="about"
      id="about"
      className="relative px-6 md:px-10 py-16 overflow-hidden min-h-screen"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="mono mute text-[11px] tracking-[0.18em]">SCENE 03 — ABOUT, BY WAY OF</div>
            <h2 data-section-title className="serif text-3xl md:text-4xl font-extrabold mt-1">
              The long way around.
            </h2>
          </div>
          <span className="mono mute text-[11px] tracking-[0.18em]">
            {String(TIMELINE.length).padStart(2, "0")} STOPS
          </span>
        </div>

        <div className="grid gap-6 md:gap-8 mt-8 md:grid-cols-[1.5fr_1fr]">
          {/* timeline */}
          <div className="relative">
            <div
              data-track
              aria-hidden
              className="absolute top-2 bottom-2 border-l-2 border-dashed"
              style={{ left: 97, borderColor: "var(--ink)", zIndex: 0 }}
            />
            {TIMELINE.map((stop, i) => (
              <div
                key={i}
                data-stop
                className="grid gap-0 items-start py-3"
                style={{ gridTemplateColumns: "86px 24px 1fr" }}
              >
                <div className="serif text-base font-bold pr-4 text-right mt-1">{stop.when}</div>
                <div className="flex justify-center relative" style={{ zIndex: 1 }}>
                  <span
                    data-stop-dot
                    data-now={stop.isNow ? "true" : undefined}
                    className="block rounded-full mt-1.5"
                    style={{
                      width: 12,
                      height: 12,
                      border: "2px solid var(--ink)",
                      background: "var(--paper)",
                    }}
                  />
                </div>
                <div data-stop-detail className="pl-3">
                  <div className="serif text-[17px] font-bold leading-tight">{stop.title}</div>
                  <div className="mute text-[13px] mt-1">{stop.blurb}</div>
                </div>
              </div>
            ))}
          </div>

          {/* logs panel — swaps content per active timeline stop */}
          <div className="md:sticky md:top-24 self-start">
            <div
              className="box p-4 font-mono"
              style={{ background: "var(--paper-2)", minHeight: 280 }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <div className="mono text-[11px] tracking-[0.14em]" style={{ color: "var(--accent)" }}>
                  LOGS · {currentStop?.when ?? ""}
                </div>
                <span className="mono mute text-[10px] tracking-[0.12em]">
                  {String(activeIdx + 1).padStart(2, "0")}/{String(TIMELINE.length).padStart(2, "0")}
                </span>
              </div>
              <div className="mono mute text-[11px] tracking-[0.12em] mb-3">
                {currentStop?.title}
              </div>
              <div ref={logsRef} className="space-y-1.5">
                {currentLogs.map((line, i) => (
                  <div
                    key={`${activeIdx}-${i}`}
                    data-log-line
                    data-text={line}
                    className="mono text-[13px] leading-snug log-line"
                    style={{
                      color: line.startsWith("$") ? "var(--accent-2)" : "var(--ink)",
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global([data-log-line][data-typing])::after {
          content: "▍";
          display: inline-block;
          margin-left: 1px;
          color: var(--accent);
          animation: log-cursor 0.8s steps(2) infinite;
        }
        @keyframes log-cursor { 50% { opacity: 0; } }

        :global([data-stop-dot]) {
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }
        :global([data-stop-dot][data-passed]) {
          background: var(--accent) !important;
          border-color: var(--accent) !important;
        }
        :global([data-stop-dot][data-current]) {
          background: var(--accent) !important;
          border-color: var(--accent) !important;
          transform: scale(1.45);
          box-shadow:
            0 0 0 4px color-mix(in oklab, var(--accent) 30%, transparent),
            0 0 14px color-mix(in oklab, var(--accent) 55%, transparent);
        }
      `}</style>
    </section>
  );
}
