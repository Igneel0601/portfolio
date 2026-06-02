"use client";

import { Fragment, useEffect, useRef } from "react";
import { ExternalLink, MoveRight } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { Btn } from "@/components/Btn";
import { Insight } from "@/components/Insight";
import { PROJECTS } from "@/lib/content";

// Render a date `range`: `→` in the string becomes a lucide MoveRight icon.
function DateRange({ text }: { text: string }) {
  const parts = text.split("→");
  if (parts.length === 1) return <>{text}</>;
  return (
    <span className="inline-flex items-center gap-1.5">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <MoveRight className="i-xs" aria-hidden />}
          {part.trim()}
        </Fragment>
      ))}
    </span>
  );
}

export function ProjectsShowcaseCinematic() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarCmdRef = useRef<HTMLSpanElement>(null);
  const seamBarRef = useRef<HTMLDivElement>(null);
  const seamCmdRef = useRef<HTMLSpanElement>(null);
  const introTitleRef = useRef<HTMLHeadingElement>(null);
  const introIconRef = useRef<HTMLSpanElement>(null);
  const panelsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    const topBar = topBarRef.current;
    const topBarCmd = topBarCmdRef.current;
    const seamBar = seamBarRef.current;
    const seamCmd = seamCmdRef.current;
    const introTitle = introTitleRef.current;
    const panelsContainer = panelsContainerRef.current;
    if (!outer || !stage || !topBar || !topBarCmd || !seamBar || !seamCmd || !introTitle || !panelsContainer)
      return;

    const panels = Array.from(
      panelsContainer.querySelectorAll<HTMLDivElement>(".psc-panel"),
    ).sort((a, b) => Number(a.dataset.panel) - Number(b.dataset.panel));

    const N = PROJECTS.length;
    const transitions = N - 1;
    const totalPhases = transitions + 2;
    const introFrac = 1 / totalPhases;
    const restFrac = (transitions + 1) / totalPhases;

    let titleTx = 0,
      titleTy = 0,
      titleScale = 0.04;

    function fitTitles() {
      panelsContainer!.querySelectorAll<HTMLDivElement>(".psc-title-wrap").forEach((wrap) => {
        const el = wrap.querySelector<HTMLHeadingElement>(".psc-title");
        if (!el) return;
        const avail = wrap.clientWidth;
        let lo = 12,
          hi = 900,
          mid = 0;
        el.style.whiteSpace = "nowrap";
        for (let i = 0; i < 24; i++) {
          mid = (lo + hi) / 2;
          el.style.fontSize = mid + "px";
          if (el.scrollWidth <= avail) lo = mid;
          else hi = mid;
        }
        el.style.fontSize = lo * 0.975 + "px";
      });
    }

    function measureTitle() {
      const target = topBar!.querySelector<HTMLElement>("[data-projects-target]");
      if (!target) return;
      const prevIntroT = introTitle!.style.transform;
      const prevBarT = topBar!.style.transform;
      const prevBarO = topBar!.style.opacity;
      introTitle!.style.transform = "";
      topBar!.style.transform = "";
      topBar!.style.opacity = "1";

      const fromRect = introTitle!.getBoundingClientRect();
      const toRect = target.getBoundingClientRect();
      const fromFs = parseFloat(getComputedStyle(introTitle!).fontSize);
      const toFs = parseFloat(getComputedStyle(target).fontSize);

      titleScale = toFs / fromFs;
      titleTx = toRect.right - fromRect.right;
      titleTy = toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2);

      introTitle!.style.transform = prevIntroT;
      topBar!.style.transform = prevBarT;
      topBar!.style.opacity = prevBarO;
    }

    function applyPanels(seg: number, local: number) {
      panels.forEach((p, j) => {
        let clip: string;
        if (j < seg) clip = "inset(100% 0 0 0)";
        else if (j === seg) clip = `inset(0 0 ${(local * 100).toFixed(2)}% 0)`;
        else if (j === seg + 1) clip = `inset(${((1 - local) * 100).toFixed(2)}% 0 0 0)`;
        else clip = "inset(100% 0 0 0)";
        p.style.clipPath = clip;
        p.style.transform = "";
      });
    }

    function applySeam(seg: number, local: number) {
      if (local <= 0 || local >= 1 || seg >= N - 1) {
        seamBar!.style.opacity = "0";
        return;
      }
      const incoming = PROJECTS[seg + 1];
      seamBar!.style.opacity = "1";
      seamBar!.style.top = `${((1 - local) * 100).toFixed(2)}%`;
      seamBar!.dataset.tint = incoming.tint;
      seamCmd!.textContent = `$ cat ~/projects/${incoming.id}/README.md  # ${incoming.kind}`;
    }

    function applyTopBar(seg: number, local: number) {
      const idx = local >= 0.999 ? Math.min(seg + 1, N - 1) : seg;
      const p = PROJECTS[idx];
      topBarCmd!.textContent = `$ cat ~/projects/${p.id}/README.md  # ${p.kind}`;
      topBar!.dataset.tint = p.tint;
    }

    function applyIntroChrome(e: number) {
      topBar!.style.opacity = e.toString();
      topBar!.style.transform = `translateY(${((1 - e) * 100).toFixed(2)}vh)`;
      // Link stays invisible — the intro overlay h2 is the visible "projects"
      // label sitting on top. Anchor underneath remains clickable.
      const link = topBar!.querySelector<HTMLElement>("[data-bar-projects]");
      if (link) link.style.opacity = "0";
    }

    function applyIntroTitle(e: number) {
      const tx = titleTx * e;
      const ty = titleTy * e;
      const s = 1 + (titleScale - 1) * e;
      introTitle!.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${s.toFixed(4)})`;
      introTitle!.style.opacity = "1";
      const icon = introIconRef.current;
      if (icon) icon.style.opacity = String(Math.max(0, Math.min(1, (e - 0.85) / 0.15)));
    }

    function initState() {
      panels.forEach((p, j) => {
        if (j === 0) {
          p.style.clipPath = "inset(0 0 0 0)";
          p.style.transform = "translateY(100%)";
        } else {
          p.style.clipPath = "inset(100% 0 0 0)";
          p.style.transform = "";
        }
      });
      applySeam(0, 0);
      applyTopBar(0, 0);
      applyIntroTitle(0);
      applyIntroChrome(0);
    }

    function update(p: number) {
      if (p < introFrac) {
        const e = p / introFrac;
        applyIntroTitle(e);
        applyIntroChrome(e);
        panels.forEach((panel, j) => {
          if (j === 0) {
            panel.style.clipPath = "inset(0 0 0 0)";
            panel.style.transform = `translateY(${((1 - e) * 100).toFixed(2)}%)`;
          } else {
            panel.style.clipPath = "inset(100% 0 0 0)";
            panel.style.transform = "";
          }
        });
        applySeam(0, 0);
        applyTopBar(0, 0);
        stage!.style.transform = "";
      } else {
        applyIntroTitle(1);
        applyIntroChrome(1);
        panels.forEach((panel) => {
          panel.style.transform = "";
        });

        if (p > restFrac) {
          const rp = (p - restFrac) / (1 - restFrac);
          stage!.style.transform = `translateY(${(-rp * 65).toFixed(2)}vh)`;
        } else {
          stage!.style.transform = "";
        }

        const clampedP = Math.min(p, restFrac);
        const np = (clampedP - introFrac) / (restFrac - introFrac);
        const f = np * transitions;
        const seg = Math.min(transitions - 1, Math.floor(f * 0.9999));
        const local = Math.max(0, Math.min(1, f - seg));

        applyPanels(seg, local);
        applySeam(seg, local);
        applyTopBar(seg, local);
      }
    }

    fitTitles();
    initState();
    measureTitle();

    const st = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: () => {
        fitTitles();
        measureTitle();
      },
      onUpdate: (self) => update(self.progress),
    });

    if (document.fonts) {
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

  return (
    <div className="psc-root">
      <div id="psc-outer" ref={outerRef}>
        <div id="psc-stage" ref={stageRef}>
          <div id="psc-top-bar" className="c-md" ref={topBarRef} data-tint="a">
            <span id="psc-top-bar-cmd" ref={topBarCmdRef}>
              $ cat ~/projects/codeflow/README.md &nbsp; # ai
            </span>
            <a
              href="/work"
              data-bar-projects
              className="c-md no-pop"
              style={{
                marginLeft: "auto",
                color: "var(--accent-2)",
                textDecoration: "none",
              }}
            >
              <span data-projects-target>projects</span>
            </a>
          </div>

          <div ref={panelsContainerRef} style={{ position: "absolute", inset: 0 }}>
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                className="psc-panel"
                data-panel={i}
                data-tint={p.tint}
                style={{ zIndex: i + 1 }}
              >
                <div className="psc-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" aria-hidden loading={i === 0 ? "eager" : "lazy"} />
                </div>
                <div className="psc-body">
                  <div
                    className="l-meta flex items-center gap-5 flex-wrap"
                    style={{ color: "var(--ink-dim)" }}
                  >
                    <span style={{ color: "var(--ca, var(--accent))" }}>{p.index}</span>
                    <span style={{ opacity: 0.3 }}>/</span>
                    <span>{p.meta}</span>
                    <span style={{ opacity: 0.3 }}>·</span>
                    <DateRange text={p.date} />
                    <span
                      className="cs-pill"
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.625rem",
                        padding: "0.22rem 0.65rem",
                        gap: "0.35rem",
                      }}
                    >
                      <span className={`bdot bdot-${p.tint}`} />
                      <span style={{ color: "var(--ca)" }}>{p.status}</span>
                    </span>
                  </div>
                  <div className="psc-title-wrap">
                    <h2 className="t-display psc-title">{p.name.toUpperCase()}</h2>
                  </div>
                  <div className="psc-line" />
                  <p
                    className="t-lead"
                    style={{ fontStyle: "italic", maxWidth: "52ch", margin: 0 }}
                  >
                    {p.tagline}
                  </p>
                  <div
                    className="c-xs"
                    style={{
                      color: "var(--ink-soft)",
                      maxWidth: "52ch",
                      lineHeight: 1.85,
                      paddingLeft: "0.875rem",
                      borderLeft: "1.5px solid var(--hair-2)",
                    }}
                  >
                    <Insight text={p.insight} />
                  </div>
                  <div className="flex flex-col items-start gap-5">
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span key={s} className="pill sm">
                          {s}
                        </span>
                      ))}
                    </div>
                    <Btn
                      href={`/work/${p.id}`}
                      variant="term"
                      style={{
                        color: "var(--ca)",
                        borderColor: "var(--ca)",
                        ["--btn-shadow" as string]: "var(--ca)",
                      }}
                    >
                      cat {p.id}.mdx
                      <ExternalLink className="i-sm i-bold" aria-hidden />
                    </Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div id="psc-seam-bar" className="c-md" ref={seamBarRef}>
            <span id="psc-seam-cmd" ref={seamCmdRef} />
          </div>

          <div id="psc-intro-overlay">
            <h2 id="psc-intro-title" className="mono" ref={introTitleRef}>
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
    </div>
  );
}
