<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Screenshots: the floating green dot is the cursor

Desktop screenshots show a small green circle floating somewhere on the
page (often mid-canvas, detached from any element). That is the **custom
cursor** (`components/CustomCursor.tsx`, desktop-only render) parked at the
mouse position — NOT a stray UI element, misplaced timeline dot, or layout
bug. Do not "fix" it.

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
- Combined shell file: `app/shell.css`. Desktop section: custom cursor,
  hover-pop links, parallax bg, cinematic showcase chrome. Mobile section:
  `.m-*` classes for components in `components/mobile/`.

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

## SEO & metadata (single source of truth → `lib/seo/`)
All page SEO lives in `lib/seo/` — do NOT hand-write `metadata` objects in route
files. Add/edit there:
- `lib/seo/pages.ts` — per-page static config (`PAGE_SEO`: path, title,
  description, rss). Add a route here, then in BOTH `app/d/<route>/page.tsx`
  and `app/m/<route>/page.tsx` do `export const metadata = pageMetadata('<key>')`.
  The two shells MUST share one key (that's the point — no drift).
- `lib/seo/metadata.ts` — builders: `pageMetadata(key)`, and the dynamic
  `caseStudyMetadata(data, slug)` / `postMetadata(post, slug)` used by
  `app/_impl/case-study.tsx` and `app/_impl/post.tsx` `generateMetadata`.
- `lib/seo/jsonld.ts` — structured data: `personJsonLd()` (home),
  `articleJsonLd(post, slug)` (posts). Render via `<JsonLd data={…} />`
  (`components/JsonLd.tsx`).
- `lib/site.ts` — `SITE_URL` only (the canonical origin; used by sitemap/robots/
  rss too, so it stays here, not under `seo/`). `lib/seo/*` imports it.

## Identity copy (single source of truth → `lib/profile.ts`)
All personal/brand strings — name, role, jobTitle, brand/domain label, tagline,
the hero `headlineDesktop/Mobile` tokens, bio/subhead, `resumePath`, RSS feed
title — live in `lib/profile.ts` (`PROFILE`). Do NOT hardcode these in
components; import `PROFILE`. It drives `app/layout.tsx`, `app/opengraph-image.tsx`,
`lib/seo/*`, the hero (`SceneBoot`/`MobileBoot`), all footers, the nav brand, and
`rss`. Socials/email stay in `lib/content.ts:CONTACT`. The terminal/Aria
"fastfetch" flavor is intentionally NOT centralized — edit those files directly
(`components/terminal/Terminal.tsx`, `lib/terminal/{fs,commands}.ts`,
`app/api/aria/route.ts`). Full clone-and-rebrand guide: `docs/TEMPLATE.md`.

## Enforcement
- `stylelint.config.mjs` + `pnpm lint:css` — rem-only for spacing/sizes.
- TypeScript: `npx tsc --noEmit`.
- ESLint: `pnpm lint` (Next.js defaults).
- Full gate: `pnpm check` (tsc + stylelint + eslint + vitest); husky runs it
  pre-commit, CI runs it on PRs. E2E (Playwright smoke + visual) runs in
  `e2e.yml` against the Vercel preview; visual is blocking.

## Testing — what to add (and what not to)
Grow coverage *with* the code, but only where it pays off — don't test-everything:
- **New pure logic in `lib/*`** → add a Vitest unit test (cheap to test, easy
  to break silently). Metadata builders use snapshot tests (`-u` to update on
  intentional changes).
- **New page/route** → add a Playwright smoke check (loads, 2xx, has a
  `<title>`) + a committed visual baseline.
- **UI changes** (styling, a filter, a component tweak) → NO dedicated unit
  test. The **visual baselines** + manual review cover these; unit-testing React
  UI is high-effort, low-value. Inline component logic stays uncovered unless
  extracted to `lib/`.
- **Spacing/computed-style contracts** the viewport-only visual snapshots can't
  see → assert computed values in `tests/e2e/spacing.spec.ts` (`@spacing`).

# Before editing files

For anything non-trivial (more than a one-line typo fix), stop before touching files:
1. State the diagnosis — what's actually wrong and why.
2. State the fix — what you'll change and where.
3. Wait for go-ahead, or proceed only if the user has already said "yes, do it" for this specific change.

Skipping this and going straight to edits wastes the user's time when the diagnosis is wrong.

# Mobile shell

Files under `components/mobile/*` prefer classes from `app/shell.css` (`.m-*` prefix), token classes from `app/tokens.css` (`t-*`, `c-*`, `l-*`, `i-*`), or Tailwind utilities over inline `style={{}}`. Extract to a class when the same style appears 2+ times, when it needs state (hover, `[data-*]`, media query), or when it would otherwise be dead/redundant. Single-use one-offs may stay inline. Dynamic state flows through `data-*` attributes that CSS selectors target.
