# Mobile UI redesign — `fix/mobile-ui`

Log of the mobile (`/m/*`) makeover. Source design: the Claude-generated
`wireframe/mobile-portfolio-makeover/` (approved direction "A — pure type").
Desktop (`/d/*`) is untouched by this work.

## What shipped

### Index pages (editorial rebuild)
- **`MobileProjects`** — project "panels" (no screenshots): mono meta row, giant
  per-project serif name, italic tagline, mono "insight" aside, stack chips, and
  a `cat <id>.mdx` CTA. Per-project accent via `data-accent="1|2|3"` →
  `--accent / -2 / -3` (no inline style). `PANEL_EXTRAS` (in the component, keyed
  by project id) holds accent/badge/insight so `lib/content.ts` stays the source
  of truth for everything else.
- **`MobileWriting`** / **`MobileWorkLog`** — now client components with a
  horizontal **category/tag filter** (chips derived from the data, scroll the
  active chip toward centre on tap), 2-line dek clamp, status-led rows, and a
  readable git-log block. `/writing` also gained a `// end of log` + RSS footer
  mirroring desktop `.wa-foot`.
- Typography routed through token classes in JSX (`l-meta`, `t-lead`, `c-xs`,
  `t-h4`, …); `.m-*` rules own **layout + colour only**. Bespoke kept only where
  no token fits (giant `cqw` panel name, the `0.92rem` work-row name).
- Dead `ProjectCard` / `WritingRow` / `WorkPageRow` removed from `parts.tsx`.

### Home (`/m`) — animated, paged
- **Intro** (`MobileBoot`) — ports desktop `SceneBoot`'s GSAP timeline (which
  was explicitly skipped on mobile): typewriter prompt → boot lines slide in →
  headline words rise out of clipped lines → subhead → CTA stagger. Reduced-motion
  shows the resting state immediately.
- **Scroll-reveal** (`RevealGroup`) — panels (and `/work`·`/writing` rows) fade +
  rise as they enter. Uses **IntersectionObserver (viewport root)**, not GSAP
  ScrollTrigger, because the home scrolls inside an inner container that
  ScrollTrigger can't track (see iOS note). Hidden state is SSR-painted + gated
  to `prefers-reduced-motion: no-preference`; `<noscript>` in `app/m/layout.tsx`
  unhides for no-JS.
- **Paging** — the home is a one-swipe-per-section deck: hero / CodeFlow /
  TaskForge / Traveloop / timeline / CTA. Each is a full-screen slide
  (`scroll-snap-align: start; scroll-snap-stop: always`) with content centred.
  The `$ ls ~/projects / three things I shipped` header rides on the CodeFlow
  slide. Scoped to home via `html.m-snap-root` (toggled by `MobileBoot` on mount,
  removed on unmount → other `/m` pages scroll normally).
- **Nav pinned on home** — the scroll-down auto-hide is disabled on the home
  route so the nav stays put while paging; it still auto-hides elsewhere.

## The iOS scroll-snap problem (and the fix)

Mandatory full-page snap fights iOS Safari's dynamic address bar, because the bar
shows/hides on **page** scroll and resizes the viewport. Tried, in order:

| Slide height | Symptom |
| --- | --- |
| `100svh` | bar-hidden viewport is taller → slide too short → **next section peeks** |
| `100lvh` | bar-shown viewport is shorter → slide taller than viewport → internal scroll → **next section peeks** |
| `100dvh` | tracks viewport, no peek, but **resizes on bar toggle** → slide settles then jumps |

No CSS unit wins while the **page** is the scroller. Fix: **lock the body and
scroll an inner container** (`.m-snap-scroller`). iOS only collapses the bar on
document scroll, so an inner scroller keeps the toolbar (and viewport) stable →
snap is exact. Details:
- `html.m-snap-root, html.m-snap-root body { height:100%; overflow:hidden; overscroll-behavior:none }`.
- `.m-snap-scroller { height:100dvh; overflow-y:auto; scroll-snap-type:y mandatory }` — owns the snap.
- Nav `position: fixed` on home (overlays slides instead of consuming a slide's height).
- `SiteFooter` suppressed on home (clipped by the locked body; the CTA slide closes the deck).

## Lenis on mobile
`MobileShell` mounts `MotionProvider` (Lenis), but **`syncTouch` is off** — touch
stays native so pull-to-refresh / URL-bar still work, and Lenis only smooths
wheel. On the home, the locked body makes window-scroll Lenis inert anyway
(the inner scroller does the scrolling). Reveals/intro don't depend on Lenis.

## Key files
- `components/mobile/MobileBoot.tsx` — home hero + intro timeline + `m-snap-root` toggle.
- `components/mobile/Reveal.tsx` — `RevealGroup` (IntersectionObserver).
- `components/mobile/MobileProjects.tsx`, `MobileWriting.tsx`, `MobileWorkLog.tsx` — index/panels.
- `components/mobile/MobileHome.tsx` — wraps home in `.m-snap-scroller`.
- `components/mobile/parts.tsx` — `SiteFooter` suppression, `TimelineSection`/`CTASection`.
- `app/mobile.css` — `.m-*` layout/colour, snap + reveal rules.
- `app/m/layout.tsx` — `<noscript>` reveal unhide.

## Still to verify / open
- **Real-device pass** (emulator can't reproduce the iOS toolbar): confirm the
  fixed-scroller kills the peek (scroll up from timeline) and the settle-jump.
- Snap is **mandatory**; switching `.m-snap-scroller` to `proximity` is a
  one-word change if it ever feels too rigid.
- Timeline/CTA slides snap in without a fade (only panels carry `.m-reveal`).
- Intro has a brief pre-hydration flash (content paints before GSAP hides it),
  same as desktop `SceneBoot`.
