"use client";

import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { Btn } from "@/components/Btn";

type Project = {
  id: string;
  kind: string;
  color: string;
  num: string;
  meta: string;
  date: string;
  badgeLabel: string;
  badgeDot: "a" | "s" | "e";
  title: string;
  tagline: string;
  insight: React.ReactNode;
  stack: string[];
  href: string;
  img: string;
};

const PROJECTS: Project[] = [
  {
    id: "codeflow",
    kind: "ai",
    color: "#6ee7a7",
    num: "01",
    meta: "product · solo",
    date: "Feb → May 2026",
    badgeLabel: "live · v0.4",
    badgeDot: "a",
    title: "CODEFLOW",
    tagline:
      "Chat with agents, get a working Next.js app running inside a real E2B sandbox.",
    insight: (
      <>
        <em className="hl">Inngest</em> runs each agent step as a durable background job —
        <br />
        long chains never freeze the UI or time out mid-stream.
        <br />
        <em className="hl">E2B sandboxes</em> run the output.
      </>
    ),
    stack: ["next.js", "trpc", "prisma", "inngest", "e2b", "openai", "clerk"],
    href: "/d/codeflow",
    img: "/projects/codeflow.png",
  },
  {
    id: "taskforge",
    kind: "realtime",
    color: "#5eead4",
    num: "02",
    meta: "product · duo",
    date: "Sep → Nov 2025",
    badgeLabel: "shipped · live",
    badgeDot: "s",
    title: "TASKFORGE",
    tagline:
      "Real-time collaborative kanban — live cursors, live drags, comments landing now, not eventually.",
    insight: (
      <>
        <em className="hl">Liveblocks</em> runs the entire real-time layer:
        <br />
        presence, shared storage, conflict resolution — zero websocket code.
        <br />
        Drag a card — your collaborator sees it move <em className="hl">before you let go</em>.
      </>
    ),
    stack: ["next.js", "liveblocks", "mongodb", "tailwind", "nextauth"],
    href: "/d/taskforge",
    img: "/projects/taskforge.png",
  },
  {
    id: "traveloop",
    kind: "hackathon",
    color: "var(--status-wip)",
    num: "03",
    meta: "event · team of 4",
    date: "Odoo Hackathon",
    badgeLabel: "2nd place",
    badgeDot: "e",
    title: "TRAVELOOP",
    tagline:
      "Multi-city itineraries, budgets, packing — shipped at 4am, demoed at 9. We got second.",
    insight: (
      <>
        Trips → stops → days → activities → budgets:
        <br />
        the <em className="hl">nested document model</em> maps the domain perfectly.
        <br />
        Four people. One weekend. One real, working, demoed app.
      </>
    ),
    stack: ["next.js", "prisma", "postgres", "tailwind", "neondb"],
    href: "/d/traveloop",
    img: "/projects/traveloop.png",
  },
];

export function ProjectsShowcaseCinematic() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarCmdRef = useRef<HTMLSpanElement>(null);
  const seamBarRef = useRef<HTMLDivElement>(null);
  const seamCmdRef = useRef<HTMLSpanElement>(null);
  const introTitleRef = useRef<HTMLHeadingElement>(null);
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
      const prevIntroT = introTitle!.style.transform;
      const prevBarT = topBar!.style.transform;
      const prevBarO = topBar!.style.opacity;
      introTitle!.style.transform = "";
      topBar!.style.transform = "";
      topBar!.style.opacity = "1";

      const fromRect = introTitle!.getBoundingClientRect();
      const toEl = topBarCmd!;
      const toRect = toEl.getBoundingClientRect();
      const fromFs = parseFloat(getComputedStyle(introTitle!).fontSize);
      const toFs = parseFloat(getComputedStyle(toEl).fontSize);

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
      seamBar!.style.color = incoming.color;
      seamCmd!.textContent = `$ cat ~/projects/${incoming.id}/README.md  # ${incoming.kind}`;
    }

    function applyTopBar(seg: number, local: number) {
      const idx = local >= 0.999 ? Math.min(seg + 1, N - 1) : seg;
      const p = PROJECTS[idx];
      topBarCmd!.textContent = `$ cat ~/projects/${p.id}/README.md  # ${p.kind}`;
      topBar!.style.color = p.color;
    }

    function applyIntroChrome(e: number) {
      topBar!.style.opacity = e.toString();
      topBar!.style.transform = `translateY(${((1 - e) * 100).toFixed(2)}vh)`;
    }

    function applyIntroTitle(e: number) {
      const tx = titleTx * e;
      const ty = titleTy * e;
      const s = 1 + (titleScale - 1) * e;
      introTitle!.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${s.toFixed(4)})`;
      introTitle!.style.opacity = "1";
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
          <div id="psc-top-bar" className="c-md" ref={topBarRef} style={{ color: "var(--accent)" }}>
            <span id="psc-top-bar-cmd" ref={topBarCmdRef}>
              $ cat ~/projects/codeflow/README.md &nbsp; # ai
            </span>
          </div>

          <div ref={panelsContainerRef} style={{ position: "absolute", inset: 0 }}>
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                className="psc-panel"
                data-panel={i}
                style={{ zIndex: i + 1, ["--ca" as string]: p.color }}
              >
                <div className="psc-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt="" aria-hidden loading={i === 0 ? "eager" : "lazy"} />
                </div>
                <div className="psc-body">
                  <div
                    className="l-meta flex items-center gap-5 flex-wrap"
                    style={{ color: "var(--ink-dim)" }}
                  >
                    <span style={{ color: "var(--ca, var(--accent))" }}>{p.num}</span>
                    <span style={{ opacity: 0.3 }}>/</span>
                    <span>{p.meta}</span>
                    <span style={{ opacity: 0.3 }}>·</span>
                    <span>{p.date}</span>
                    <span
                      className="cs-pill"
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.625rem",
                        padding: "0.22rem 0.65rem",
                        gap: "0.35rem",
                      }}
                    >
                      <span className={`bdot bdot-${p.badgeDot}`} />
                      <span style={{ color: p.color }}>{p.badgeLabel}</span>
                    </span>
                  </div>
                  <div className="psc-title-wrap">
                    <h2 className="t-display psc-title">{p.title}</h2>
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
                    {p.insight}
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
                      href={p.href}
                      variant="term"
                      style={{
                        color: p.color,
                        borderColor: p.color,
                        ["--btn-shadow" as string]: p.color,
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
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

// PSC_CSS — preserved for reference; rules now live in app/desktop.css under
// the "projects-showcase-cinematic" section. Re-enable by uncommenting the
// `<style>{PSC_CSS}</style>` line in the JSX above.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const _PSC_CSS_DISABLED = `
// .psc-root {
//   --psc-paper:    #0e1116;
//   --psc-paper-2:  #161b22;
//   --psc-paper-3:  #1c2330;
//   --psc-bar-bg:   #0a0d12;
//   --psc-ink:      #e6edf3;
//   --psc-ink-soft: #8b949e;
//   --psc-ink-dim:  #5b6573;
//   --psc-hair:     rgba(230,237,243,.10);
//   --psc-hair-2:   rgba(230,237,243,.18);
//   --psc-accent:   #6ee7a7;
//   --psc-accent-2: #5eead4;
//   --psc-mono: var(--mono);
//   --psc-serif: var(--font-serif), ui-serif, Georgia, serif;
//   background: var(--psc-paper);
//   color: var(--psc-ink);
//   font-family: var(--psc-serif);
//   display: block;
// }
// .psc-root img { display: block; }
// .psc-root a { color: inherit; text-decoration: none; }

// #psc-outer {
//   height: 500vh;
//   position: relative;
// }
// #psc-stage {
//   position: sticky; top: 0;
//   height: 100vh; width: 100%;
//   overflow: hidden;
//   isolation: isolate;
//   background: var(--psc-paper);
// }

// #psc-top-bar {
//   position: absolute; top: 0; left: 0; right: 0; z-index: 50;
//   height: 2.25rem;
//   display: flex; align-items: center;
//   padding: 0 clamp(2rem, 6vw, 6rem);
//   background: var(--psc-bar-bg);
//   border-bottom: 1px solid color-mix(in oklab, var(--psc-accent) 22%, transparent);
//   font-family: var(--psc-mono); font-size: 0.9rem; line-height: 1.45; letter-spacing: .04em;
//   will-change: transform, opacity;
// }
// #psc-top-bar-cmd { flex: 1; }

// .psc-panel {
//   position: absolute; inset: 0;
//   padding-top: 2.25rem;
//   will-change: clip-path, transform;
// }
// .psc-bg {
//   position: absolute; right: 0; top: 2.25rem; bottom: 0; width: 52%;
//   pointer-events: none; z-index: 0;
// }
// .psc-bg::before {
//   content: ''; position: absolute; inset: 0; z-index: 1;
//   background: linear-gradient(to right, var(--psc-paper) 0%, color-mix(in oklab, var(--psc-paper) 55%, transparent) 48%, transparent 75%);
// }
// .psc-bg::after {
//   content: ''; position: absolute; inset: 0; z-index: 2;
//   background: linear-gradient(to bottom, var(--psc-paper) 0%, transparent 12%, transparent 88%, var(--psc-paper) 100%);
// }
// .psc-bg img {
//   width: 100%; height: 100%;
//   object-fit: cover; object-position: top center;
//   filter: saturate(.1) brightness(.18) blur(1px);
// }

// .psc-body {
//   position: relative; z-index: 1;
//   height: 100%;
//   padding: clamp(2.5rem, 5vh, 4.5rem) clamp(2.5rem, 6vw, 6rem);
//   display: flex; flex-direction: column; justify-content: center;
//   gap: clamp(.9rem, 2vh, 1.75rem);
// }

// .psc-meta {
//   display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;
//   font-family: var(--psc-mono); font-size: .62rem;
//   letter-spacing: .15em; text-transform: uppercase; color: var(--psc-ink-dim);
// }
// .psc-meta .ni { color: var(--ca, var(--psc-accent)); }
// .psc-meta .sep { opacity: .3; }
// .psc-badge {
//   margin-left: auto; display: inline-flex; align-items: center; gap: .35rem;
//   padding: .22rem .65rem; border-radius: 999px;
//   border: 1px solid var(--psc-hair-2); background: var(--psc-paper-2);
//   font-size: .58rem;
// }
// .psc-root .bdot { width: 0.25rem; height: 0.25rem; border-radius: 50%; }
// .psc-root .bdot-a { background: var(--psc-accent); animation: psc-pdot 2s ease-in-out infinite; }
// .psc-root .bdot-s { background: var(--psc-accent-2); }
// .psc-root .bdot-e { background: #f5a524; }
// @keyframes psc-pdot {
//   0%,100% { box-shadow: 0 0 0.125rem var(--psc-accent); }
//   50% { box-shadow: 0 0 0.5rem var(--psc-accent), 0 0 1.125rem color-mix(in oklab, var(--psc-accent) 40%, transparent); }
// }

// .psc-title-wrap { overflow: hidden; max-width: 70%; }
// .psc-title {
//   display: block;
//   font-family: var(--psc-serif); font-weight: 900;
//   letter-spacing: -.035em; line-height: .87;
//   color: var(--psc-ink); white-space: nowrap;
//   margin: 0;
// }

// .psc-line {
//   height: 1.5px;
//   background: linear-gradient(to right, var(--ca, var(--psc-accent)), color-mix(in oklab, var(--ca, var(--psc-accent)) 35%, transparent));
//   max-width: 70%;
// }

// .psc-tagline {
//   font-family: var(--psc-serif); font-style: italic;
//   font-size: clamp(.95rem, 1.65vw, 1.3rem); line-height: 1.55;
//   color: var(--psc-ink); max-width: 52ch;
//   margin: 0;
// }

// .psc-insight {
//   font-family: var(--psc-mono); font-size: .7rem; line-height: 1.85;
//   color: var(--psc-ink-soft); max-width: 52ch;
//   padding-left: .875rem; border-left: 1.5px solid var(--psc-hair-2);
// }
// .psc-insight .hl { color: var(--ca, var(--psc-accent-2)); font-style: italic; }

// .psc-foot { display: flex; flex-direction: column; align-items: flex-start; gap: 1.25rem; }
// .psc-stack { display: flex; flex-wrap: wrap; gap: .35rem; }
// .psc-stag {
//   font-family: var(--psc-mono); font-size: .58rem; letter-spacing: .08em;
//   padding: .28rem .65rem; border-radius: 0.25rem;
//   border: 1px solid var(--psc-hair-2); color: var(--psc-ink-dim); background: var(--psc-paper-2);
// }
// .psc-cta {
//   display: inline-flex; align-items: center; gap: .5rem; flex-shrink: 0;
//   font-family: var(--psc-mono); font-size: .72rem;
//   text-transform: none;
//   color: var(--ca, var(--psc-accent-2));
//   padding: .625rem 1rem;
//   border: 1.5px solid var(--ca, var(--psc-accent-2));
//   border-radius: .5rem;
//   background: var(--psc-paper);
//   box-shadow: 3px 3px 0 var(--ca, var(--psc-accent-2));
//   transition: transform .15s ease, box-shadow .15s ease;
// }
// .psc-cta:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 var(--ca, var(--psc-accent-2)); }
// .psc-cta:active { transform: translate(3px,3px); box-shadow: 0 0 0 var(--ca, var(--psc-accent-2)); }

// #psc-seam-bar {
//   position: absolute; left: 0; right: 0; top: 100%;
//   z-index: 60;
//   height: 2.25rem;
//   display: flex; align-items: center;
//   padding: 0 clamp(2rem, 6vw, 6rem);
//   background: var(--psc-bar-bg);
//   border-top:    1px solid color-mix(in oklab, var(--psc-accent) 28%, transparent);
//   border-bottom: 1px solid color-mix(in oklab, var(--psc-accent) 28%, transparent);
//   font-family: var(--psc-mono); font-size: .9rem; line-height: 1.45; letter-spacing: .04em;
//   opacity: 0;
//   pointer-events: none;
//   will-change: top, opacity;
// }

// #psc-intro-overlay {
//   position: absolute; inset: 0; z-index: 90;
//   display: flex; align-items: center; justify-content: center;
//   pointer-events: none;
//   container-type: inline-size;
// }
// #psc-intro-title {
//   margin: 0;
//   font-family: var(--psc-mono); font-weight: 500;
//   font-size: min(20.83cqw, 16rem);
//   line-height: .9; letter-spacing: -.01em;
//   color: var(--psc-ink);
//   transform-origin: 100% 50%;
//   will-change: transform, opacity;
//   white-space: nowrap;
//   position: relative;
// }
// `;
