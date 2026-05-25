<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Styling units

All spacing, sizing, and font-size values use **rem**. Px is reserved for:
- 1px / 1.5px hairline borders
- `999px` (full pill radius)
- sub-pixel optical offsets (e.g. `bottom: -1px`, `vertical-align: -0.125rem`)
- viewport units / `%` / `dvh` etc. where appropriate

Same rule applies to JSX `style={{ }}` — write `padding: '0.625rem'`, not `padding: 10` or `padding: '10px'`. Stylelint enforces this for `.css` files (`pnpm lint:css`).

# Where things live

The repo has a desktop/mobile shell split plus a shared-implementation
escape hatch. Use this map before touching files.

## Routing & shells
- `app/d/*` — desktop routes. Layout, nav, cursor, scrollytelling.
- `app/m/*` — mobile routes. Layout, hamburger nav, touch-first components.
- `app/_impl/*` — page bodies shared between shells (case-study, post).
  Leading `_` makes the folder private to Next.js routing. If a shared
  page needs a shell-dependent decision, pass a `shell: "d" | "m"` prop
  from each route shim; don't toggle via CSS show/hide.

## Design tokens (single source of truth)
- Colors, `--status-*`, `--accent*`, `--ink*`, `--paper*` → `app/tokens.css`.
- Type scale (`t-*`, `c-*`, `l-*`) → `app/tokens.css`.
- Icon size classes (`.i-xs/sm/md/lg`) → `app/tokens.css`. Apply via
  `className`; do NOT pass `size={}` / `strokeWidth={}` to lucide icons.
- Case-study chrome (`.cs-*`) → `app/tokens.css`.
- Shared button / pill / link / box → `app/tokens.css`.

## Shell-only styles
- Desktop-only: `app/desktop.css` (custom cursor, hover-pop links,
  parallax bg, work table chrome, writing archive).
- Mobile-only: `app/mobile.css` (`.m-*` classes for components in
  `components/mobile/`).

## Components
- Mobile shell components — `components/mobile/*`. Rule: prefer `.m-*`
  classes, token classes, or Tailwind utils over inline `style={{}}`.
  Extract to a class when the same style appears 2+ times, when it
  needs state (hover, `[data-*]`, media query), or when it would be
  dead/redundant. Single-use one-offs may stay inline — extracting
  every one-off adds more noise than it removes. Dynamic state flows
  through `data-*` attrs that CSS selectors target (`data-status`,
  `data-dead`, `data-linked`, `data-now`).
- Desktop shell components — `components/{Nav,scenes,terminal,work,
  writing,case-study}/*`.
- Shared (used by both shells via `_impl`) — `components/case-study/*`,
  `components/writing/*`, `components/NotFoundView.tsx`, `components/
  Background.tsx`, `components/CustomCursor.tsx` (desktop-only render),
  `components/MotionProvider.tsx`.

## Content
- Case studies — `content/case-studies/<slug>.mdx`. Frontmatter, MDX
  components (`Steps`, `Step`, `Figure`, `Bullets`, `Decision`, `Stats`)
  defined in `components/case-study/mdx-components.tsx`.
- Walkthrough image assets — `public/case-studies/<slug>/NN-name.png`,
  16:9 ratio. Wire into a Step's `<Figure src=… />`.

## Enforcement
- `stylelint.config.mjs` + `pnpm lint:css` — rem-only for spacing/sizes.
- TypeScript: `npx tsc --noEmit`.
- ESLint: `pnpm lint` (Next.js defaults).

# Before editing files

For anything non-trivial (more than a one-line typo fix), stop before touching files:
1. State the diagnosis — what's actually wrong and why.
2. State the fix — what you'll change and where.
3. Wait for go-ahead, or proceed only if the user has already said "yes, do it" for this specific change.

Skipping this and going straight to edits wastes the user's time when the diagnosis is wrong.

# Mobile shell

Files under `components/mobile/*` prefer classes from `app/mobile.css` (`.m-*` prefix), token classes from `app/tokens.css` (`t-*`, `c-*`, `l-*`, `i-*`), or Tailwind utilities over inline `style={{}}`. Extract to a class when the same style appears 2+ times, when it needs state (hover, `[data-*]`, media query), or when it would otherwise be dead/redundant. Single-use one-offs may stay inline. Dynamic state flows through `data-*` attributes that CSS selectors target.
