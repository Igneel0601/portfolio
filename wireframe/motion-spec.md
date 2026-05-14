# Motion Spec — `igneel.dev`

> **Source of truth: this document supersedes the wireframe (`wireframes.jsx`) where they conflict.**
> The wireframe is a visual sketch. This spec is the implementation contract. If a scene's
> shape, copy, or motion contradicts the wireframe, follow this document. Engineering implements
> from one document, not two that disagree.

**Build target:** Next.js 16 · React 19 · TypeScript · Tailwind v4
**Motion:** GSAP 3 + ScrollTrigger + SplitText + TextPlugin · Lenis (already wired)
**Vibe:** precise · deliberate · weighty
**Reference vocabulary:** [thedigitalpanda.com](https://www.thedigitalpanda.com/), [igloo.inc](https://igloo.inc/), [cosmos.so/c/scrollytelling](https://cosmos.so/c/scrollytelling)

**Scope (v1):** the homepage (`/`, Scenes 01–05) plus the `/work` subpage (§W1 below). Case-study routes `/work/[slug]` are v2.

**Scenes lock list (resolved 14 May 2026):**
- Scene 01 — Terminal boot intro. **LOCKED.** Identity hook, do not touch.
- Scene 02 — Pinned 3-slide canvas with side-rail (CodeFlow → TaskForge → Traveloop). **LOCKED.** Editorial 4-card grid is dropped; full project index lives on `/work`.
- Scene 03 — 9-stop timeline + 2 stack-boxes + "when I'm not coding" aside. **LOCKED.** The old `~/about.ts` code-block component is deleted; do not reintroduce.
- Scene 04 — 4 future-module cards. **LOCKED.**
- Scene 05 — CTA + footer. **LOCKED.**
- Hybrid nav (§N below) — **NEW**, was missing from v1 of this spec.

---

## NAV — Hybrid scroll/route bar   *(§N · sits above Scene 01, sticky on scroll)*

```
viewport: full-width row, h-14, sticky top-0, z-50
┌────────────────────────────────────────────────────────────────────────────┐
│ [terminal tab bar — non-sticky, scrolls away above the nav]                │
├────────────────────────────────────────────────────────────────────────────┤
│ igneel.dev   work · writing · experiments · about · /now · /uses  hi@…    │ ← sticky nav
│              ↓        →          →          ↓        →       →     mailto │
│              data-nav-link  data-nav-kind="scroll"|"route"                 │
└────────────────────────────────────────────────────────────────────────────┘
```

**Placement:**
- Sits **below** the terminal tab bar.
- Tab bar scrolls **away** with the page (it's decorative chrome, not navigation).
- Nav becomes `position: sticky, top: 0` only **after** the tab bar leaves the viewport. Use `ScrollTrigger.create({ trigger: tabbar, start: "bottom top", onEnter: () => navEl.dataset.stuck = "true", onLeaveBack: () => delete navEl.dataset.stuck })`.
- Background: `backdrop-filter: blur(12px)` + `bg-paper-2/80` only when `[data-stuck]`. Default: transparent, no border.
- Adds a hairline `border-b border-ink/15` when stuck.

**Selector contract:**

```html
<nav data-nav>
  <a data-nav-link data-nav-kind="scroll" href="#work">work</a>
  <a data-nav-link data-nav-kind="route"  href="/writing">writing</a>
  <a data-nav-link data-nav-kind="route"  href="/experiments">experiments</a>
  <a data-nav-link data-nav-kind="scroll" href="#about">about</a>
  <a data-nav-link data-nav-kind="route"  href="/now">/now</a>
  <a data-nav-link data-nav-kind="route"  href="/uses">/uses</a>
  <a data-nav-link data-nav-kind="mailto" href="mailto:hi@igneel.dev">hi@igneel.dev</a>
</nav>
```

`data-nav-kind` is the contract. Scroll links use Lenis (`lenis.scrollTo(target, { offset: -56, lerp: 0.08 })`). Route links use Next's `<Link>`. Mailto is native.

**Enter animation** *(plays on mount, after Scene 01 boot finishes)*

| beat | target | trigger | from → to | duration | ease | overlap |
|---|---|---|---|---|---|---|
| N1 | `[data-nav]` container | after Scene 01 B5 completes | `autoAlpha: 0, y: -12` → `1, 0` | 0.45 | `power3.out` | mount + 1.8s delay |
| N2 | `[data-nav-link]` (×7) | parallel N1 | `autoAlpha: 0, y: -8` → `1, 0` | 0.35 | `power3.out` | `-=0.30`, stagger `0.04 from: "start"` |

**Active-section highlight (scroll-anchor links only):**

```ts
// For each scroll-kind link, observe its target section.
ScrollTrigger.create({
  trigger: "#work",
  start: "top center",
  end: "bottom center",
  onToggle: (self) => {
    document.querySelector('[data-nav-link][href="#work"]')
      ?.toggleAttribute("data-active", self.isActive);
  },
});
```

CSS: `[data-nav-link][data-active] { color: var(--accent); }`. **No underline draw, no box, no scale.** Color shift only. Route links never get `[data-active]` (you're not on that route — you're on `/`).

**Mobile collapse (< 768px):**
- Replace nav row with a single `[data-nav-toggle]` button (☰, right-aligned).
- On tap → full-screen overlay: `position: fixed, inset: 0, bg-paper, z-100`.
- Overlay open animation: container `autoAlpha 0→1` 0.25s `power2.out`, then links `y: 16 → 0, autoAlpha 0→1` 0.40s `power3.out` stagger 0.05.
- Overlay close: reverse, half-speed.
- Hijack body scroll while open: `overflow: hidden` on `<html>`, restore on close.
- Active-section highlight still works inside the overlay.

**Reduced-motion:** kill N1/N2 → `gsap.set` final state. Mobile overlay opens with `autoAlpha 0→1` only, no `y` transform.

---

## Global tokens

```ts
// motion/tokens.ts
export const D = {
  xs: 0.18,   // micro (cursor, hover)
  sm: 0.32,   // labels, pills
  md: 0.55,   // headlines, cards
  lg: 0.85,   // hero, scene transitions
  xl: 1.20,   // pinned slide swaps
} as const;

export const E = {
  // Use these names verbatim. No CSS easing.
  precise:   "power3.out",   // default settle
  weighty:   "expo.out",     // entrances that need authority
  deliberate:"power2.inOut", // scrubbed transitions
  release:   "power4.out",   // ctas, reveals
  mech:      "steps(1)",     // terminal type-on per char
} as const;
```

**Default scene height:** `100vh`. Pinned scenes declare their `pinDuration` multiplier.
**ScrollTrigger config:** `markers: false`, `anticipatePin: 1`, `fastScrollEnd: 3000`.
**Lenis:** `lerp: 0.08, smoothTouch: false, syncTouch: true`. ScrollTrigger reads from `lenis.on('scroll', ScrollTrigger.update)`.

**Selector contract:** every animated element carries `data-*`. **Never select by `className`** — Tailwind tokens are not stable.

**`prefers-reduced-motion: reduce`:** wrap every timeline in `gsap.matchMedia()`. The `reduce` branch sets final state with `gsap.set()` and skips all `from`/`to` calls. Atomic CSS keyframe loops (cursor blink) get `animation: none`.

---

## SCENE 01 — TERMINAL BOOT   *(static, 100vh, play-on-mount)*

```
viewport: 100vh, single column, max-w-5xl
┌─────────────────────────────────────────────────────────────┐
│  [terminal tab bar]                       data-tabbar       │
│  ──────────────────────────────────────────────────────────  │
│  $ ./hello.sh                         ① data-boot-prompt    │
│    [boot] mounting portfolio…         ② data-boot-line="0"  │
│    [boot] loading vaibhav.profile…    ② data-boot-line="1"  │
│    [ok ] ready in 0.42s               ② data-boot-line="2"  │
│                                                              │
│  I'm Vaibhav.                         ③ data-headline       │
│  I build software                        each <span data-   │
│  that teaches itself                     headline-word>      │
│  to write more software.                                     │
│                                                              │
│  B.Tech CSE · GBU · Noida · open      ④ data-subhead        │
│                                                              │
│  [↓ scroll the story] [résumé] [hi@]  ⑤ data-cta            │
│  █                                       data-cursor (CSS)   │
└─────────────────────────────────────────────────────────────┘
```

**Beats** *(timeline runs on mount, no scroll trigger)*

| beat | target | trigger | from → to | duration | ease | overlap |
|---|---|---|---|---|---|---|
| B1 | `[data-boot-prompt]` | mount | `text: ""` → `"$ ./hello.sh"` (TextPlugin, per char) | 0.40 | `steps(14)` | `0` |
| B2 | `[data-boot-line]` (3 nodes) | after B1 | `autoAlpha: 0, x: -8` → `autoAlpha: 1, x: 0` | 0.32 | `power3.out` | `+=0.10`, stagger `0.18` |
| B3 | `[data-headline-word]` (split) | after B2 | `yPercent: 100, autoAlpha: 0` → `yPercent: 0, autoAlpha: 1` | 0.65 | `expo.out` | `-=0.20`, stagger `0.06 from: "start"` |
| B4 | `[data-subhead]` | parallel B3 | `autoAlpha: 0, y: 12` → `autoAlpha: 1, y: 0` | 0.55 | `power3.out` | `-=0.30` |
| B5 | `[data-cta]` (3 buttons) | after B3 | `autoAlpha: 0, y: 14` → `autoAlpha: 1, y: 0` | 0.45 | `power3.out` | `-=0.15`, stagger `0.08` |
| B6 | `[data-cursor]` | mount, always | CSS keyframe `opacity 1→0→1`, `1.06s infinite steps(2)` | — | — | — |

**Total timeline:** ~1.9s. The cursor blink is the only CSS keyframe in the entire site (atomic loop, allowed by your spec).

**Reduced-motion:** kill B1 → set `[data-boot-prompt]` text to final string. Kill B2/B3/B4/B5 → `gsap.set` autoAlpha: 1, x/y: 0. Keep B6 cursor blink (it's identity, not motion).

**Handoff → Scene 02:** none. Scene 01 sits at top of page, Scene 02 begins fresh on scroll.

---

## SCENE 02 — PINNED WORK   *(pinned, `3× innerHeight`)*

```
viewport: pinned 100vh, grid 1.1fr / 0.9fr, gap-6
┌──────────────────────────────┬──────────────────────────────┐
│ SCENE 02 — SELECTED WORK     │ data-section-label           │
│ Three things I shipped.      │ data-section-title           │
│                              │ data-counter "01/03"         │
│ ┌──────────────────────────┐ │  ┌─────────────────────────┐ │
│ │                          │ │  │ UP NEXT — KEEPS SCROLL  │ │
│ │   project hero shot      │ │  └─────────────────────────┘ │
│ │   (next/image, 880×520)  │ │                              │
│ │                          │ │  ┌─ side card 02 ──────────┐ │
│ │ ① data-slide="0"         │ │  │ thumb · TaskForge       │ │
│ │   data-slide-state=active│ │  │ data-side="1"           │ │
│ └──────────────────────────┘ │  └─────────────────────────┘ │
│                              │  ┌─ side card 03 ──────────┐ │
│ NOW SHOWING · 01/03          │  │ thumb · Traveloop       │ │
│ CodeFlow                     │  │ data-side="2"           │ │
│ blurb · stack · case-study →│  └─────────────────────────┘ │
│                              │                              │
│ ② data-slide="1" (hidden)    │                              │
│ ② data-slide="2" (hidden)    │                              │
└──────────────────────────────┴──────────────────────────────┘
              [progress dots ●○○]  data-progress
```

**Pin config**

```ts
ScrollTrigger.create({
  trigger: "[data-scene='work']",
  pin: true,
  start: "top top",
  end: "+=300%",        // 3× innerHeight
  scrub: 0.6,           // weighty smoothing
  anticipatePin: 1,
});
```

**Timeline** *(scrubbed, total progress 0 → 1, 3 segments)*

| beat | window | target | from → to | ease |
|---|---|---|---|---|
| B1 | 0.00 → 0.33 | `[data-slide='0']` | active hold (no motion) | — |
| B2 | 0.30 → 0.42 | `[data-slide='0']` | `xPercent: 0, autoAlpha: 1` → `xPercent: -12, autoAlpha: 0` | `power2.in` |
| B3 | 0.32 → 0.44 | `[data-slide='1']` | `xPercent: 12, autoAlpha: 0` → `xPercent: 0, autoAlpha: 1` | `power2.out` |
| B4 | 0.30 → 0.42 | `[data-counter]` | `text: "01"` → `text: "02"` (TextPlugin) | `steps(1)` at 0.36 |
| B5 | 0.30 → 0.42 | `[data-side='1']` | `scale: 1, opacity: 0.55` → `scale: 0.92, opacity: 0.3` | `power2.inOut` |
| B6 | 0.30 → 0.42 | `[data-side='2']` | `y: 0, opacity: 0.55` → `y: -88, opacity: 0.85` | `power2.inOut` |
| B7 | 0.42 → 0.66 | hold on slide 1 | — | — |
| B8 | 0.63 → 0.75 | repeat B2/B3 with `data-slide='1'` → `'2'`, counter `02`→`03` | — | — |
| B9 | 0.75 → 1.00 | hold on slide 2, then unpin | — | — |
| B10 | scrub | `[data-progress] > span` | `width: 0%` → `width: 100%` on each segment | linear |

**Critical rule:** every slide is stacked in the same grid cell (`position: absolute, inset: 0` inside a relative parent). The `xPercent` swap looks like a horizontal slide; nothing reflows. This is the weighty part of the spec — `scrub: 0.6` adds 600ms of inertia, so the user feels resistance.

**Reduced-motion:** kill the pin entirely. `matchMedia` `reduce` branch:
- Render all three project cards in a vertical stack (CSS `flex-direction: column`, no JS class toggle).
- No ScrollTrigger; each card gets `gsap.set` final state.
- Section becomes a regular `100vh × 3` flow.

**Handoff → Scene 03:** at progress 1.0, slide 2 is at its rest position. ScrollTrigger releases the pin. Scene 03's enter trigger fires immediately on the next scroll tick — no gap, no jump. Verify with `Flip.from(state)` if there's any layout shift.

**Refs for the swap feel:** [thedigitalpanda.com](https://www.thedigitalpanda.com/) section transitions, [vercel.com/templates](https://vercel.com/templates) card pinning.

---

## SCENE 03 — TIMELINE / ABOUT   *(static, ~120vh, scrub-enter)*

> Vibe note: "feel like reading, not animating." All motion is sub-threshold — a hint that the element arrived, then disappears. No flourish.

```
viewport: ~120vh, grid 1.5fr / 1fr
┌────────────────────────────────────┬──────────────────────────┐
│ SCENE 03 — ABOUT, BY WAY OF        │ ┌─ STACK · DAILY ──────┐ │
│ The long way around.               │ │ ts · next · python … │ │
│                                    │ │ data-pill (×9)        │ │
│ ┃ NOW    just shipped a degree.   │ └────────────────────────┘ │
│ ┃        GBU · B.Tech CSE …        │ ┌─ STACK · POKING AT ──┐ │
│ ┃ 2026   Odoo Hackathon — Trav…    │ │ rust · duckdb · hypr │ │
│ ┃        group build, weekend …    │ └────────────────────────┘ │
│ ┃ 2026   CodeFlow goes live        │ ┌─ WHEN I'M NOT CODING ┐ │
│ ┃        AI app builder · 61 …     │ │ Ricing my Arch …      │ │
│ ┃ … 6 more stops                   │ └────────────────────────┘ │
│ ┃                                                                │
│   data-track (the dashed line)                                  │
│   data-stop (×9)                                                │
│   data-stop-dot (×9, child)                                     │
└────────────────────────────────────────────────────────────────┘
```

**Timeline** *(NOT pinned. Standard scroll, single ScrollTrigger per element.)*

| beat | target | trigger | from → to | duration | ease |
|---|---|---|---|---|---|
| B1 | `[data-section-title]` of S03 | `start: "top 80%"` | `autoAlpha: 0, y: 24` → `0` | 0.55 | `power3.out` |
| B2 | `[data-track]` | `start: "top 75%"`, `scrub: true`, `end: "bottom 30%"` | `scaleY: 0` → `1`, `transform-origin: top` | — | linear scrub |
| B3 | `[data-stop]` (each) | `start: "top 85%"` each | `autoAlpha: 0, x: -16` → `0`, dot `scale: 0.4` → `1` | 0.45 | `power3.out`, no stagger (per-element trigger) |
| B4 | `[data-stop-dot='0']` (NOW) | mount, always | accent color pulse: `boxShadow: 0 0 0 0 var(--accent)` → `0 0 0 12px transparent` | 1.6s loop | `power2.out`, `repeat: -1`, `repeatDelay: 1.4` |
| B5 | `[data-pill]` (×9, both stacks) | `start: "top 80%"` on parent | `autoAlpha: 0, y: 8, scale: 0.96` → `1` | 0.40 | `power3.out`, stagger `0.04 from: "start"` |
| B6 | `.when-not-coding` (`[data-aside='hobby']`) | `start: "top 80%"` | `autoAlpha: 0, y: 12` → `1, 0` | 0.50 | `power3.out` |

**Critical rule:** the track draws while the user scrolls. Stops appear individually as they enter the viewport — NOT in a batch stagger. This produces "reading rhythm": you see a date, register it, scroll, see the next.

**Reduced-motion:** kill B2/B3/B4. `gsap.set` everything to final state. Keep B1 (gentle) as instant set. Track is rendered drawn at full height by default; CSS handles it.

**Handoff → Scene 04:** Scene 03 ends with a `min-h-screen` spacer that lets the timeline complete before the next scene's trigger fires. No bleed.

---

## SCENE 04 — COMING SOON   *(static, 100vh, play-on-enter-once)*

```
viewport: 100vh, grid 4 cols equal, gap-3.5
┌────────────────────────────────────────────────────────────┐
│ SCENE 04 — ALSO ON THIS SITE        data-section-label     │
│                                                              │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                          │
│ │ exp  │ │write │ │ /now │ │/lett │  data-future (×4)        │
│ │ ...  │ │ ...  │ │ ...  │ │ ...  │  each → real route       │
│ └──────┘ └──────┘ └──────┘ └──────┘                          │
└────────────────────────────────────────────────────────────┘
```

**Beats**

| beat | target | trigger | from → to | duration | ease | overlap |
|---|---|---|---|---|---|---|
| B1 | `[data-section-label]` of S04 | `start: "top 75%"`, `once: true` | `autoAlpha: 0` → `1` | 0.35 | `power2.out` | `0` |
| B2 | `[data-future]` (4 cards) | same trigger | `autoAlpha: 0, y: 16` → `1, 0` | 0.50 | `power3.out` | `-=0.20`, stagger `0.07 from: "start"` |

That's the entire scene. Simple stagger only. No card hover gimmicks beyond the existing CSS-less default (subtle `outline` change handled by base styles, not GSAP).

**Reduced-motion:** kill both beats → `gsap.set` final state.

**Handoff → Scene 05:** none. Scene 04 closes with default block flow.

---

## SCENE 05 — CTA + FOOTER   *(static, 100vh, play-on-enter-once)*

> Vibe note: "must settle quietly, no bouncy magnetic gimmicks." This is the bow on the package — restrained.

```
viewport: 100vh, single column
┌────────────────────────────────────────────────────────────┐
│   END OF STORY · YOUR MOVE        data-cta-eyebrow         │
│   Hiring? Building? Curious?      data-cta-headline        │
│   Drop a line — I respond fast.   data-cta-sub             │
│                                                              │
│   [ hi@igneel.dev ]               data-cta-button           │
│   [ github · linkedin · x ]                                  │
│                                                              │
│   ──────────────────────────────────────────────────────    │
│   $ exit 0 · built with too much GSAP & coffee              │
│   © Vaibhav Verma · 2026                                     │
└────────────────────────────────────────────────────────────┘
```

**Beats**

| beat | target | trigger | from → to | duration | ease | overlap |
|---|---|---|---|---|---|---|
| B1 | `[data-cta-eyebrow]` | `start: "top 80%"`, `once: true` | `autoAlpha: 0` → `1` | 0.30 | `power2.out` | `0` |
| B2 | `[data-cta-headline]` | same trigger | `autoAlpha: 0, y: 16` → `1, 0` | 0.60 | `expo.out` | `-=0.10` |
| B3 | `[data-cta-sub]` | same trigger | `autoAlpha: 0, y: 8` → `1, 0` | 0.45 | `power3.out` | `-=0.30` |
| B4 | `[data-cta-button]` (2) | same trigger | `autoAlpha: 0, y: 10` → `1, 0` | 0.45 | `power3.out` | `-=0.20`, stagger `0.08` |
| B5 | `footer > *` | `start: "top 90%"`, `once: true` | `autoAlpha: 0` → `1` | 0.40 | `power2.out` | stagger `0.05` |

**Explicit non-features** *(things you might be tempted to add — don't):*
- ❌ no magnetic cursor on button
- ❌ no scale pop on hover
- ❌ no underline draw-on
- ❌ no parallax on footer text

**Reduced-motion:** kill all 5 beats → `gsap.set` final state.

---

## SUBPAGE — `/work` build-log index   *(§W1)*

> Distinct from the homepage Scene 02. This is the full project list — what users land on when they click "see all projects → /work" or type the URL directly. Visual layout matches the `WFWorkIndex` wireframe artboard.

```
viewport: 100vh+, single column, max-w-5xl
┌────────────────────────────────────────────────────────────┐
│ [terminal tab bar]                  data-tabbar             │
│ [hybrid nav, sticky]                data-nav                │
│                                                              │
│ ↩ / back home                       data-back-link          │
│ All projects.                       data-page-title         │
│ Everything I've shipped, in build-log form.                 │
│                                                              │
│ FILTER — [all] [flagship] [oss] [hackathon] …               │
│                                     data-filter (×7)        │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ STATUS  TAG  NAME  BLURB  STACK  YEAR  NOTES           │ │
│ │ ──────────────────────────────────────────────────────  │ │
│ │ [ok ]  flagship  codeflow   …                          │ │  data-row="0"
│ │ [ok ]  collab    taskforge  …                          │ │  data-row="1"
│ │ [ok ]  hackathon traveloop  …                          │ │  data-row="2"
│ │ [ok ]  oss       wall-engine …                         │ │  data-row="3"
│ │ [ok ]  dotfiles  arch-install …                        │ │  data-row="4"
│ │ [wip]  next      …           …                         │ │  data-row="5"
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ $ git log --oneline | head -3       data-git-log            │
│   a3f01b2 · docs(traveloop): wrote case study draft         │
│   7c01d8a · feat(codeflow): add gemini provider             │
│   1e7f9d4 · chore(arch-install): split out wm setup         │
│   → FULL LOG ON GITHUB.COM/IGNEEL0601                       │
└────────────────────────────────────────────────────────────┘
```

**Beats**

| beat | target | trigger | from → to | duration | ease | overlap |
|---|---|---|---|---|---|---|
| W1.0 | `[data-back-link]` | mount | `autoAlpha: 0, x: -8` → `1, 0` | 0.32 | `power3.out` | `0` |
| W1.1 | `[data-page-title]` (SplitText words) | mount | `yPercent: 100, autoAlpha: 0` → `0, 1` | 0.55 | `expo.out` | `-=0.10`, stagger `0.05 from: "start"` |
| W1.2 | `[data-filter]` (×7 pills) | mount | `autoAlpha: 0, y: 8, scale: 0.96` → `1, 0, 1` | 0.35 | `power3.out` | `-=0.20`, stagger `0.04 from: "start"` |
| W1.3 | `[data-row]` (each) | per-element, `start: "top 88%"`, `once: true` | `autoAlpha: 0, x: -12` → `1, 0` | 0.40 | `power3.out` | no stagger — natural reading rhythm |
| W1.4 | `[data-git-log] > div` (×4 lines) | `start: "top 85%"`, `once: true` | text typed on with TextPlugin, per-char `steps(N)` where N = line length | line-length × 0.025s, max 0.60s | `steps(N)` | stagger `+=0.15` between lines |

**Filter behavior**

```ts
// Click a [data-filter] pill → filter rows.
// Use GSAP's Flip plugin for the reorder, NOT CSS transitions.

const state = Flip.getState("[data-row]");
rows.forEach(r => r.dataset.hidden = !matchesFilter(r) ? "true" : "false");
Flip.from(state, {
  duration: 0.55,
  ease: "expo.out",
  absolute: true,
  onEnter: el => gsap.fromTo(el, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35 }),
  onLeave: el => gsap.to(el,    { autoAlpha: 0, y: -8, duration: 0.25, onComplete: () => el.style.display = "none" }),
});
```

CSS controls visibility via `[data-row][data-hidden="true"] { display: none }`. Flip handles the rearrange of the surviving rows. **No `height: 0` transitions** — Flip animates `transform`, which is what we want.

**Row hover (desktop only)** — pure CSS, no JS. `[data-row]:hover { background: color-mix(in oklab, var(--ink) 4%, transparent) }`. No GSAP. Don't over-engineer a build log.

**Row click → `/work/[slug]`** routes via Next `<Link>`. No interstitial animation. (Page transitions are v2.)

**Mobile (< 768px):**
- Filter pills wrap to 2 rows, horizontal scroll if more.
- Table collapses to card layout: each row becomes a stacked `<article>` with the same `data-row` attribute. Beats W1.3 / W1.4 unchanged — they target the same selector.
- Hide STACK and NOTES columns content (it's all visible inside the card layout instead).

**Reduced-motion:** kill W1.0/W1.1/W1.2/W1.3/W1.4 → `gsap.set` final state. Filter still works but rearranges via `Flip` with `duration: 0` (instant rearrange, no animation).

---

## Inter-scene handoff matrix

| from | to | handoff | risk |
|---|---|---|---|
| 01 | 02 | none — scene 01 sits static, scene 02 triggers fresh on scroll | low |
| 02 | 03 | pin releases at progress 1.0, scene 03 triggers at `top 80%` of viewport | check for 1-frame layout shift when pin un-fixes |
| 03 | 04 | track-draw finishes before scene 04's `top 75%` trigger fires (verify with refresh after layout) | low |
| 04 | 05 | none | low |

**`anticipatePin: 1`** on scene 02 + a 2nd `ScrollTrigger.refresh()` on font-load complete handles 90% of handoff jank. If the pin still flickers, wrap the page in `<ScrollSmoother>` (Lenis-compatible).

---

## Reduced-motion summary

```ts
gsap.matchMedia().add({
  isMotion: "(prefers-reduced-motion: no-preference)",
  isReduce: "(prefers-reduced-motion: reduce)",
}, (ctx) => {
  const { isMotion, isReduce } = ctx.conditions;
  if (isMotion) {
    // full timelines as specced above
  }
  if (isReduce) {
    // every animated element: gsap.set(el, finalState)
    // every pin: kill the ScrollTrigger before creation
    // every scrub: set element to its end-state
  }
});
```

**Atomic loops** kept under reduce:
- `[data-cursor]` blink — identity, not motion.

**Everything else** is killed and replaced with `gsap.set` to final state.

---

## Implementation checklist

- [ ] Add `data-*` attributes per the wireframe in JSX. No `className`-based selectors.
- [ ] Wrap motion in `gsap.matchMedia()` with `isMotion` / `isReduce` branches.
- [ ] Register plugins once in a top-level `MotionProvider` client component:
      `gsap.registerPlugin(ScrollTrigger, SplitText, TextPlugin)`.
- [ ] Lenis → ScrollTrigger sync:
      ```ts
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      ```
- [ ] After font load: `document.fonts.ready.then(() => ScrollTrigger.refresh())`.
- [ ] On route change (App Router): `ScrollTrigger.killAll()` in cleanup.
- [ ] SplitText on `[data-headline]` only — do NOT split body copy (a11y + SEO).
- [ ] Test with `prefers-reduced-motion: reduce` set in DevTools rendering panel.

---

## Locked decisions

> Answered 14 May 2026 — moved out of "open questions" into the contract.

### 1. SplitText — keep

License is in place. Register at top-level `MotionProvider` client component:

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, TextPlugin);
```

SplitText runs **only** on `[data-headline]`. Re-split on resize via `SplitText.revert()` + re-instantiate inside a `ScrollTrigger.refresh()` debounced handler. Never split body copy.

### 2. Mobile pin — vertical stack below 768px

Hard cut. `gsap.matchMedia()` gets a third branch:

```ts
gsap.matchMedia().add({
  isMotion:  "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
  isMobile:  "(prefers-reduced-motion: no-preference) and (max-width: 767.98px)",
  isReduce:  "(prefers-reduced-motion: reduce)",
}, (ctx) => {
  const { isMotion, isMobile, isReduce } = ctx.conditions;

  if (isMotion) { /* full pinned 3× timeline as specced */ }

  if (isMobile) {
    // Scene 02: NO pin. NO scrub. Three full-bleed cards in a vertical column.
    // Each card plays B3-style enter on its own ScrollTrigger:
    //   start: "top 80%", once: true, autoAlpha 0→1, y 24→0, 0.55s power3.out
    // Side-rail "up next" is hidden on mobile (display: none below md:).
  }

  if (isReduce) { /* gsap.set final state, no triggers */ }
});
```

**Stacked layout must feel intentional, not consolation.** Concrete rules:
- Cards are full-bleed (`-mx-6` to break out of page padding), image fills `100vw` width.
- Blurbs scale up: body `text-lg` → `text-xl` on mobile only. Project title `text-3xl` → `text-4xl`.
- Counter (`01/03`) is **removed** on mobile — it referenced a pin that doesn't exist; leaving it is a tell.
- "NOW PLAYING" eyebrow stays; it reads as a label, not a state.
- No `↔ swipe` or "scroll horizontally" hint anywhere. The mobile experience must not gesture at the missing desktop interaction.

### 3. Aspect ratio — locked at 16:10, no exceptions

```tsx
// components/ProjectImage.tsx
<div className="relative w-full aspect-[16/10] overflow-hidden rounded-md">
  <Image
    src={src}
    alt={alt}
    fill
    sizes="(max-width: 768px) 100vw, 60vw"
    className="object-cover"
    priority={index === 0}
  />
</div>
```

Rules:
- Large hero image and side-card thumbnails **both** use `aspect-[16/10]`. No `1/1`, no `4/3`, no per-project override.
- All source images must be exported at min `1760 × 1100` (2× the largest CSS render width).
- `object-cover` is non-negotiable — `object-contain` introduces letterboxing that breaks the locked ratio.
- If a project's hero shot doesn't crop cleanly at 16:10, **reshoot or recompose the image, not the spec.**

---

