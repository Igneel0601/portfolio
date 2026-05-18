"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/content";
import { ScrollTrigger } from "@/lib/gsap";

// Terminal vibe — dark bar bg, green text. Different green tones per project.
const BAR_BG = "#0a0d12"; // slightly darker than --paper for contrast
const TEXT_TINTS = [
  "#6ee7a7", // accent: mint green
  "#5eead4", // accent-2: teal
  "#a3e7c4", // softer green
];

// Shrinks its body font-size until the rendered text fits inside the row's
// visible height. Watches the parent for size changes and re-fits. Children
// can include the SectionLabel + the body text — the label keeps its own size
// (since the .t-h5 class wins) and only the inherited body font-size changes.
function FittingParagraph({
  children,
  maxSize = 18,
  minSize = 12,
}: {
  children: ReactNode;
  maxSize?: number;
  minSize?: number;
}) {
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const fit = () => {
      let size = maxSize;
      el.style.fontSize = `${size}px`;
      // shrink in 0.5px steps; cap at ~14 iterations (maxSize 18 → minSize 11)
      while (el.scrollHeight > el.clientHeight + 0.5 && size > minSize) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };
    schedule();
    // Observe the PARENT (the row), not the paragraph itself — observing the
    // paragraph would loop because fontSize changes trigger its own resize.
    const parent = el.parentElement;
    const ro = new ResizeObserver(schedule);
    if (parent) ro.observe(parent);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [maxSize, minSize, children]);

  return (
    <p
      ref={ref}
      style={{
        minHeight: 0,
        overflow: "hidden",
        lineHeight: 1.45,
        fontFamily: "var(--font-body), system-ui, sans-serif",
        textAlign: "justify",
      }}
    >
      {children}
    </p>
  );
}

// Inline label — hidden anchor that reserves space. A sibling overlay reads
// its bounding rect and paints the visible label at that position, so labels
// stay on top of clip-path wipes without manual layout mirroring.
function SectionLabel({ children }: { children: ReactNode }) {
  const id = String(children);
  return (
    <span
      data-label-anchor={id}
      className="t-h5 block mb-2"
      style={{ visibility: "hidden" }}
    >
      {children}
    </span>
  );
}

// Inner content of a project panel — NO bar (bar is rendered separately as seam).
function ProjectBody({ project, priority = false }: { project: Project; priority?: boolean }) {
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  // Match the right column's height to the left column's intrinsic content
  // (image + gap + tech-stack). Paragraphs on the right clip via their own
  // overflow:hidden + minmax(0,1fr) rows. Re-measures on resize.
  useEffect(() => {
    const left = leftColRef.current;
    const right = rightColRef.current;
    if (!left || !right) return;
    const sync = () => {
      right.style.height = `${left.offsetHeight}px`;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(left);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="w-full flex flex-col px-6 md:px-10 py-4 md:py-6 gap-4 flex-1 min-h-0">
        <h2
          className="t-h1 m-0"
          style={{ fontSize: "clamp(36px, 5vh, 56px)" }}
        >
          {project.name}
        </h2>
        <div
          className="grid gap-10 md:gap-14"
          style={{
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
            alignItems: "start",
          }}
        >
          {/* LEFT — image keeps 16:9, intrinsic-sized; tech-stack right
              below. The grid uses align-items: start so the left column
              doesn't get stretched — the right column then matches the left's
              height via ResizeObserver. */}
          <div ref={leftColRef} className="flex flex-col gap-5 min-h-0">
            <div
              className="relative w-full overflow-hidden rounded-md"
              style={{ background: "var(--paper-2)", aspectRatio: "16 / 9" }}
            >
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover"
                priority={priority}
              />
            </div>
            <div className="box p-4" style={{ background: "var(--paper-2)" }}>
              <div className="l-eyebrow mb-2" style={{ color: "var(--accent)" }}>
                TECH STACK
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((t) => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — height is JS-synced to match the left column's intrinsic
              (image + stack). Three rows of equal height clip any overflowing
              paragraph so the column never extends past the stack's bottom. */}
          <div
            ref={rightColRef}
            className="grid gap-4"
            style={{
              position: "relative",
              zIndex: 70,
              gridTemplateRows: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) auto",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <FittingParagraph>
              <SectionLabel>WHAT?</SectionLabel>
              {project.details?.what ?? project.blurb}
            </FittingParagraph>
            <FittingParagraph>
              <SectionLabel>WHY?</SectionLabel>
              {project.details?.why ?? project.meta ?? "—"}
            </FittingParagraph>
            <FittingParagraph>
              <SectionLabel>HOW?</SectionLabel>
              {project.details?.how ??
                `${project.stats.langs}. Deployed on ${project.stats.deployed}. Last push ${project.stats.lastPush}.`}
            </FittingParagraph>
            <a
              href={`/work/${project.id}`}
              className="btn term justify-self-start"
            >
              cat ~/projects/{project.id}/CASE_STUDY.md
              <ExternalLink size={14} strokeWidth={2} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


export function ExperimentsClient() {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const seamRef = useRef<HTMLDivElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLHeadingElement | null>(null);
  const introIconRef = useRef<HTMLSpanElement | null>(null);

  // Position floating labels by measuring hidden inline anchors in panel 0
  // (all panels share layout). Re-measure on resize / font-load so the overlay
  // tracks any layout change with zero manual mirroring.
  useEffect(() => {
    const stage = stageRef.current;
    const overlay = overlayRef.current;
    if (!stage || !overlay) return;

    const sync = () => {
      const panel = stage.querySelector<HTMLElement>('[data-exp-panel="0"]');
      if (!panel) return;
      // Clear panel 0's transient transform (intro phase pushes it below the
      // stage) so we measure anchors at their resting positions.
      const prev = panel.style.transform;
      panel.style.transform = "";
      const stageRect = stage.getBoundingClientRect();
      panel.querySelectorAll<HTMLElement>("[data-label-anchor]").forEach((a) => {
        const id = a.dataset.labelAnchor;
        if (!id) return;
        const el = overlay.querySelector<HTMLElement>(`[data-label-float="${id}"]`);
        if (!el) return;
        const r = a.getBoundingClientRect();
        el.style.top = `${r.top - stageRect.top}px`;
        el.style.left = `${r.left - stageRect.left}px`;
        el.style.visibility = "visible";
      });
      panel.style.transform = prev;
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(stage);
    // Also observe each anchor — FittingParagraph mutates the parent <p>'s
    // font-size after mount, which can shift the anchor's bounding rect.
    const anchorRo = new ResizeObserver(sync);
    stage
      .querySelectorAll<HTMLElement>('[data-exp-panel="0"] [data-label-anchor]')
      .forEach((a) => anchorRo.observe(a));
    window.addEventListener("resize", sync);
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(sync).catch(() => {});
    }
    return () => {
      ro.disconnect();
      anchorRo.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  // Measure nav height and expose it as --nav-h on the root, so the stage can
  // stick just beneath the navbar instead of being hidden under it.
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("[data-nav]");
    if (!nav) return;
    const update = () => {
      document.documentElement.style.setProperty("--nav-h", `${nav.offsetHeight}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    const seam = seamRef.current;
    const topBar = topBarRef.current;
    if (!outer || !stage || !seam || !topBar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const transitions = Math.max(1, PROJECTS.length - 1);

    const queryPanels = () =>
      Array.from(stage.querySelectorAll<HTMLElement>("[data-exp-panel]")).sort(
        (a, b) => Number(a.dataset.expPanel) - Number(b.dataset.expPanel),
      );

    const applyTranslate = (panels: HTMLElement[], seg: number, local: number) => {
      for (let j = 0; j < panels.length; j++) {
        let clip: string;
        if (j < seg) clip = "inset(100% 0 0 0)";
        else if (j === seg) clip = `inset(0 0 ${(local * 100).toFixed(2)}% 0)`;
        else if (j === seg + 1) clip = `inset(${((1 - local) * 100).toFixed(2)}% 0 0 0)`;
        else clip = "inset(100% 0 0 0)";
        panels[j].style.clipPath = clip;
        panels[j].style.transform = "";
      }
    };

    const setBarContent = (el: HTMLElement, project: Project, textColor: string) => {
      el.style.color = textColor;
      const left = el.querySelector<HTMLElement>("[data-seam-left]");
      const right = el.querySelector<HTMLElement>("[data-seam-right]");
      const cmd = `$ cat ~/projects/${project.id}/README.md  # ${project.kind}`;
      if (left) left.textContent = cmd;
      else el.textContent = cmd;
      if (right) right.textContent = "";
    };

    const applySeam = (seg: number, local: number) => {
      const incoming = PROJECTS[seg + 1];
      if (!incoming || local <= 0 || local >= 1) {
        seam.style.opacity = "0";
        return;
      }
      seam.style.opacity = "1";
      seam.style.top = `${((1 - local) * 100).toFixed(2)}%`;
      const tint = TEXT_TINTS[(seg + 1) % TEXT_TINTS.length];
      seam.style.color = tint;
      const left = seam.querySelector<HTMLElement>("[data-seam-left]");
      const right = seam.querySelector<HTMLElement>("[data-seam-right]");
      if (left) left.textContent = `$ cat ~/projects/${incoming.id}/README.md  # ${incoming.kind}`;
      if (right) right.textContent = "";
    };

    const applyTopBar = (seg: number, local: number) => {
      const idx = local >= 0.999 ? Math.min(seg + 1, PROJECTS.length - 1) : seg;
      setBarContent(topBar, PROJECTS[idx], TEXT_TINTS[idx % TEXT_TINTS.length]);
    };

    // Title-settle measurement: figure out the transform that lands the giant
    // intro PROJECTS exactly on the bar's "PROJECTS →" link.
    let titleTx = 0;
    let titleTy = 0;
    let titleScale = 0.06;
    const measureTitle = () => {
      const intro = introRef.current;
      const target = topBar.querySelector<HTMLElement>("[data-projects-target]");
      if (!intro || !target) return;
      // Reset both the intro title's transform AND the top bar's transform so
      // we measure their natural resting positions, not their mid-animation
      // positions (otherwise the target reads as off-stage and PROJECTS would
      // animate toward the bottom right).
      const prevIntro = intro.style.transform;
      const prevBar = topBar.style.transform;
      const prevBarOpacity = topBar.style.opacity;
      intro.style.transform = "";
      topBar.style.transform = "";
      topBar.style.opacity = "1";
      const fromRect = intro.getBoundingClientRect();
      const toRect = target.getBoundingClientRect();
      // Scale by computed font-size ratio so character heights match, not box
      // heights (intro has line-height 0.9, c-md has 1.6 — same font-size
      // gives different box heights).
      const fromFs = parseFloat(getComputedStyle(intro).fontSize);
      const toFs = parseFloat(getComputedStyle(target).fontSize);
      intro.style.transform = prevIntro;
      topBar.style.transform = prevBar;
      topBar.style.opacity = prevBarOpacity;
      titleScale = toFs / fromFs;
      // Align RIGHT edge horizontally and VERTICAL CENTER vertically. The
      // intro has line-height 0.9 (tight box) while c-md has line-height 1.6
      // (loose box) — top-edge alignment leaves the intro glyph above the
      // link's glyph. Center alignment + transform-origin: 100% 50% keeps the
      // glyph centered in the bar.
      titleTx = toRect.right - fromRect.right;
      titleTy =
        toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2);
    };

    const applyTitle = (e: number) => {
      const intro = introRef.current;
      if (!intro) return;
      // Simultaneous translate + shrink, both linear with the same progress.
      // transform-origin is top-right (100% 0%), so the box's top-right corner
      // tracks the straight line to the target while the box shrinks around
      // that corner — moves and shrinks together.
      const tx = titleTx * e;
      const ty = titleTy * e;
      const s = 1 + (titleScale - 1) * e;
      intro.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
      intro.style.opacity = "1";
      // Only the icon fades in at the very end — the text stays visible
      // throughout, so nothing "vanishes".
      const icon = introIconRef.current;
      if (icon) icon.style.opacity = String(Math.max(0, Math.min(1, (e - 0.85) / 0.15)));
    };

    measureTitle();

    const setIntroChrome = (e: number) => {
      // top bar slides UP from below its position as the panel reveals, plus
      // fades in. At e=0 it sits 100% below its resting place, invisible.
      topBar.style.opacity = String(e);
      topBar.style.transform = `translateY(${((1 - e) * 100).toFixed(2)}vh)`;
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.opacity = String(e);
        // travel with panel 0 so labels stay glued to their paragraphs as the
        // panel rises from below — no floating in empty space.
        overlay.style.transform = `translateY(${((1 - e) * 100).toFixed(2)}%)`;
      }
      // bar's "PROJECTS →" link only appears at the very end so it cleanly
      // takes over from the shrinking title.
      // bar link (the whole <a>, text + icon) stays permanently invisible —
      // the intro overlay sits on top as the visible label.
      const link = topBar.querySelector<HTMLElement>("[data-bar-projects]");
      if (link) link.style.opacity = "0";
    };

    // initial state — intro phase at 0: panel 0 fully translated below stage,
    // others hidden via clip-path. Big title visible, bar link invisible.
    const initPanels = queryPanels();
    for (let j = 0; j < initPanels.length; j++) {
      if (j === 0) {
        initPanels[j].style.clipPath = "inset(0 0 0 0)";
        initPanels[j].style.transform = "translateY(100%)";
      } else {
        initPanels[j].style.clipPath = "inset(100% 0 0 0)";
        initPanels[j].style.transform = "";
      }
    }
    applySeam(0, 0);
    applyTopBar(0, 0);
    applyTitle(0);
    setIntroChrome(0);

    // Scroll is split into two phases: an intro "title settle" phase (first
    // 1/(transitions+1) of the runway) where panel 0 stays fully visible and
    // PROJECTS shrinks into the bar; then panel transitions over the rest.
    // Phases on the 0..1 scroll progress:
    //   [0, introFrac)            : title-settle intro (1 viewport)
    //   [introFrac, restFrac)     : panel transitions (transitions viewports)
    //   [restFrac, 1.0]           : rest — last project static (1 viewport)
    // Total runway = (transitions + 2) viewports of scroll on a
    // (transitions + 3) viewport outer (sticky stage occupies 1 viewport).
    const totalPhases = transitions + 2;
    const introFrac = 1 / totalPhases;
    const restFrac = (transitions + 1) / totalPhases;

    const st = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: measureTitle,
      onUpdate: (self) => {
        const p = self.progress;
        if (p < introFrac) {
          const ip = p / introFrac;
          const e = ip; // linear — straight diagonal path with no curvature
          stage.style.transform = "";
          applyTitle(e);
          // Panel 0 slides up from below the stage; others hidden. Stage's
          // overflow:hidden clips the off-stage portion. Happly-style.
          const panels = queryPanels();
          for (let j = 0; j < panels.length; j++) {
            if (j === 0) {
              panels[j].style.clipPath = "inset(0 0 0 0)";
              panels[j].style.transform = `translateY(${((1 - e) * 100).toFixed(2)}%)`;
            } else {
              panels[j].style.clipPath = "inset(100% 0 0 0)";
              panels[j].style.transform = "";
            }
          }
          applySeam(0, 0);
          applyTopBar(0, 0);
          setIntroChrome(e);
        } else {
          applyTitle(1);
          setIntroChrome(1);
          // clear any intro translate before normal panel transitions resume
          const panels = queryPanels();
          for (let j = 0; j < panels.length; j++) panels[j].style.transform = "";
          // Rest phase: last project translates UP faster than scene 03
          // rises, giving the happly-style "outgoing scene scrolls away while
          // incoming scene comes in" parallax.
          if (p > restFrac) {
            const rp = Math.min(1, (p - restFrac) / (1 - restFrac));
            stage.style.transform = `translateY(${(-rp * 70).toFixed(2)}vh)`;
          } else {
            stage.style.transform = "";
          }
          const clampedP = Math.min(p, restFrac);
          const np = (clampedP - introFrac) / (restFrac - introFrac);
          const f = np * transitions;
          const seg = Math.min(transitions - 1, Math.floor(f * 0.9999));
          const local = Math.min(1, Math.max(0, f - seg));
          applyTranslate(panels, seg, local);
          applySeam(seg, local);
          applyTopBar(seg, local);
        }
      },
    });

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready
        .then(() => {
          measureTitle();
          ScrollTrigger.refresh();
        })
        .catch(() => {});
    }

    return () => {
      st.kill();
    };
  }, []);

  const transitions = Math.max(1, PROJECTS.length - 1);
  // (transitions + 1) for panel viewing + 1 for title-settle intro + 1 for
  // post-transition rest (lets the last project sit fully visible before
  // scene 03 rises into view via its negative margin).
  const outerHeight = `${(transitions + 3) * 100}vh`;

  return (
    <div ref={outerRef} data-scene="experiments" id="work" className="relative w-full" style={{ height: outerHeight }}>
      <div
        ref={stageRef}
        style={{
          position: "sticky",
          top: "var(--nav-h, 52px)",
          height: "calc(100vh - var(--nav-h, 52px))",
          width: "100%",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        {/* persistent top bar — shows current project's command */}
        <div
          ref={topBarRef}
          className="c-md px-6 md:px-10 py-3"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            color: TEXT_TINTS[0],
            fontWeight: 500,
            background: BAR_BG,
            borderBottom: "1px solid color-mix(in oklab, var(--accent) 25%, transparent)",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
            gap: "40px 56px",
            alignItems: "center",
          }}
        >
          <span data-seam-left>$ cat ~/projects/{PROJECTS[0].id}/README.md  # {PROJECTS[0].kind}</span>
          <a
            href="/work"
            data-bar-projects
            className="c-md"
            style={{
              justifySelf: "end",
              color: "var(--accent-2)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4em",
            }}
          >
            <span data-projects-target>projects</span>
            <ExternalLink size="0.9em" strokeWidth={2} aria-hidden />
          </a>
        </div>

        {/* project panels — all overlap, clip-path wipes between them */}
        {PROJECTS.map((p, i) => (
          <div
            key={p.id}
            data-exp-panel={i}
            style={{
              position: "absolute",
              inset: 0,
              paddingTop: 44, // leave room for the top bar
              zIndex: i + 1,
              willChange: "clip-path",
            }}
          >
            <ProjectBody project={p} priority={i === 0} />
          </div>
        ))}

        {/* floating seam — rises from bottom to top of stage, shows incoming project's command */}
        <div
          ref={seamRef}
          aria-hidden
          className="c-md px-6 md:px-10 py-3"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "100%",
            zIndex: 60,
            color: TEXT_TINTS[0],
            fontWeight: 500,
            opacity: 0,
            pointerEvents: "none",
            willChange: "top, opacity",
            borderTop: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
            borderBottom: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
            background: BAR_BG,
          }}
        >
          <span data-seam-left />
          <span data-seam-right style={{ display: "none" }} />
        </div>

        {/* Floating labels — positioned via measurement of hidden inline
            anchors in panel 0. Outside all clipped panels so clip-path can't
            hide them. */}
        <div
          ref={overlayRef}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 80,
          }}
        >
          {["WHAT?", "WHY?", "HOW?"].map((label) => (
            <span
              key={label}
              data-label-float={label}
              className="t-h5"
              style={{
                position: "absolute",
                visibility: "hidden",
                color: "var(--accent)",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Title-settle overlay — huge PROJECTS centered, shrinks into the
            top bar's "PROJECTS →" link during the intro phase of the scroll.
            The wrapper centers via flex so the inner <h2>'s transform is
            purely the settle delta — measureTitle resets transform to "" and
            still gets a correctly-centered rect. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 90,
            pointerEvents: "none",
          }}
        >
          <h2
            ref={introRef}
            className="mono"
            style={{
              position: "relative",
              margin: 0,
              fontSize: "min(22vw, 280px)",
              lineHeight: 0.9,
              fontWeight: 500,
              transformOrigin: "100% 50%",
              willChange: "transform, opacity",
              whiteSpace: "nowrap",
            }}
          >
            projects
            <span
              ref={introIconRef}
              aria-hidden
              style={{
                position: "absolute",
                left: "calc(100% + 0.4em)",
                top: "50%",
                transform: "translateY(-50%)",
                display: "inline-flex",
                opacity: 0,
                willChange: "opacity",
              }}
            >
              <ExternalLink size="0.9em" strokeWidth={2} />
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}
