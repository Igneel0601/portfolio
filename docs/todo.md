# TODO

## Done

- [x] `/work/[id]` dynamic route — 3 case studies live (codeflow, taskforge, traveloop) with TOC + pager + frontmatter card + zoomable arch diagrams
- [x] Custom `not-found.tsx` 404 page — absorbs unbuilt nav stubs gracefully
- [x] `/work` index rebuilt — reads frontmatter, 4-col build log, Peter-Parker blurbs
- [x] rem-based typography with `clamp()` root — scales across screen sizes
- [x] Type check + production build green
- [x] Dim parallax background dots (3% → 5%)
- [x] `/writing` archive + `/writing/[slug]` post live, backed by bloggz CMS (Neon/Payload)
- [x] RSS feed at `/rss.xml` with dynamic site URL
- [x] Route-aware nav active state (green text on current route)
- [x] Typography unified via tokens (t-*, l-*, c-*); IBM Plex Sans dropped; two-family rule (Fraunces + Plex Mono)
- [x] Reading column narrowed to `--w-reading: 63ch` for /writing
- [x] `app/layout.tsx` metadata — title, description, OG title/description, RSS alternate
- [x] Custom CMS — replaced Sanity plan with standalone bloggz repo (Payload + Neon)
- [x] `prefers-reduced-motion` audit — global CSS kill-switch + all GSAP scenes guarded
- [x] `/terminal` route — full interactive shell (virtual fs, commands, easter eggs, vim/cowsay/fortune/coffee, themes, history persistence)
- [x] `ollama run` wired to Groq (llama-3.1-8b-instant) via `/api/ollama/run` with IP rate-limit + 500-char cap
- [x] Terminal visual refit — full-bleed wallpaper, kitty-window frame with gradient accent border, fastfetch-style boot panel (portrait + system/hardware), palette dots
- [x] `fastfetch` command re-renders the boot panel (alias: `neofetch`)
- [x] Terminal mobile fallback — single "open on desktop" card
- [x] Terminal auto-refocus input (incl. `preventScroll`) — no clicking needed between commands
- [x] Terminal inside-window scroll (page itself doesn't scroll on long output)
- [x] Drop dead `SceneFuture` + `FUTURE` export
- [x] Delete `ProjectCard.tsx.bak` + `ScenePinnedWork.tsx.bak`
- [x] `/now`, `/uses` hidden from nav until routes exist
- [x] UA-routed desktop/mobile shell isolation via `proxy.ts` (`/d`, `/m`); bots and link-unfurlers handled separately
- [x] `Vary: User-Agent` scoped via shared asset-extension list (`lib/static-extensions.ts`)
- [x] Bloggz media proxy — `/api/bloggz-media/[filename]` serves bytes from `media_blob` (Postgres bytea) with year-long immutable cache
- [x] Lexical content walker — recurses into block-node fields, expands uploads, resolves URLs through local proxy
- [x] Safari fullscreen toggle — webkit-prefixed API detection
- [x] Compressed `public/term/wallpaper.jpg` (13MB → 614KB)
- [x] FOUC guard on Nav via `data-nav-revealed` attribute
- [x] ResizeObserver feedback loop fix in experiments
- [x] Dedup dual footers on mobile — `MobileShell` now renders `SiteFooter` instead of global `Footer`; `SiteFooter` is pathname-aware (suppresses on `/writing/*`, `/work/[slug]`, `/experiments/writing-exploration`)
- [x] `SiteFooter` font 9px → 11px + extra vertical padding for legibility
- [x] Hide Next.js dev indicator (`devIndicators: false` in `next.config.ts`) — was overlapping mobile footer

## Critical (ship-blockers)

- [ ] **Favicon** — `public/` has no `favicon.ico` / `icon.*` / `apple-touch-icon`. Browser shows the default globe. Add a full set (16/32/180/512) and an `icons:` block in `app/layout.tsx` metadata.
- [ ] **OG image** — `openGraph` block in `app/layout.tsx` is missing `images:`. Link previews on Slack/Twitter/iMessage render empty. Generate a 1200×630 PNG and wire it.
- [ ] **Compress `public/term/portrait.png`** — still 2.7MB (wallpaper was compressed in the last pass, portrait wasn't). Convert to WebP, target <500KB.

## Content / new sections

- [ ] **`/about`** — bio page. Currently identity is scattered between terminal `fastfetch` and CTA copy.
- [ ] **`/now`** — what you're working on this month. Plumbed in nav (hidden); just needs a page.
- [ ] **`/uses`** — tools / setup. Genre-appropriate for the terminal vibe; pairs with `fastfetch`.
- [ ] **`/contact`** or richer footer card — current CTA is "drop a line" + link buttons; no form, no canonical contact route.
- [ ] **More case studies** — only 3 live (codeflow, taskforge, traveloop). Even single-page studies for smaller projects would round out `/work`.

## Should-do before shipping

- [ ] Persistent rate limit on `/api/ollama/run` (Upstash free tier; current in-memory map resets per edge instance)
- [ ] Delete unused `components/scenes/TerminalBar.tsx` — or wire it in
- [ ] Lighthouse pass on `/d` and `/m` — verify `next/image` priority hints, CWV scores

## Nice-to-have

- [ ] Real git log from GH API on `/work` footer (deferred)
- [ ] Dynamic import for `lib/terminal/groq.ts` (lazy-load LLM client)
- [ ] `resolveMediaUrl` dev-warn dedupe already added; consider also handling protocol-relative URLs (`//host/x.png`) if Bloggz ever emits one
- [ ] Fullscreen "not supported" feedback in terminal command (silent success today on browsers without either API)
- [ ] SceneCTA copy break — "Hiring? Building? Curious?" + "Drop a line — I respond fast." + button "github · linkedin · x" are plain marketing prose; rewrite in terminal grammar (e.g. `$ contact --me`, `# replies within ~24h`, `gh / in / x`)

## Later

- [ ] Breadcrumbs — replace removed back-links with a proper path-style breadcrumb component shared across `/work/[slug]` and `/writing/[slug]`. Decide back-link icon size + label at that point.
- [ ] Letters bot
- [ ] Terminal v2: tab completion · pipes · real ANSI colour codes · `ollama` quota indicator

---

## Design audit (verified open 2026-05-25)

### P0 — visible breaks / fragile

- [x] `MobileHome` 120dvh + sticky child — swapped `dvh` → `svh` so container height is stable when Android Chrome URL bar collapses
- [x] Layout jump `/work` → `/work/[slug]` — resolved by the page-shell gutters refactor; both routes now share the same outer container, so nav/max-width no longer jump on navigation
- [x] Desktop `* { cursor: none }` leaks to iPad-with-trackpad — gate switched from `(hover: none), (pointer: coarse)` to `(any-pointer: coarse)`, which matches any device with touch capability
- [x] `a::after` icon-pop on link hover — verified all icon-in-Link sites under `desktop.css` already carry `.no-pop` (Pager, WorkLog row, NotFoundView). Post breadcrumb is a `<span>`, terminal mobile back is `/m`-only. No new edits required.

### P1 — cross-shell inconsistency

- [x] Back-link icon size — obsolete. Back-links have been removed; breadcrumbs planned as a future replacement.
- [x] Pager glyph size — outdated. Writing posts no longer have a pager (replaced by "Similar reads" cards). Case-study Pager is consistently `i-sm`.
- [x] Status pill shape — unified on brackets-everywhere. Mobile `.m-work-status` lost the padding/border/border-radius chrome; renders `[active]/[wip]/[archived]/[dead]` as colored mono text matching desktop.
- [x] `ChevronRight` in `WorkLog.tsx:209` — kept as-is. `ChevronRight` is the row-drill-in affordance; `Move*` is for directional flow. Different semantics, not an outlier.
- [x] Post breadcrumb — verified: it's a `<span>` containing the filename, not a `<Link>`. No pop to suppress.

### P1 — mobile shell inline styles

- [x] Dropped dead `background: var(--paper)` wrappers — body already paints `--paper`. Removed from MobileWriting, MobileHome, MobileWorkLog, MobileTimeline.
- [x] Remaining ~23 inline blocks (MobileTimeline 11, MobileWorkLog 5, MobileNav 5, MobileHome 2) — won't-fix. Each block is single-use; extracting per-block classes adds more noise than it removes. AGENTS.md rule still applies for new code; existing one-offs stay.

### P1 — token coverage gaps

- [x] Added `.i-bold` modifier (stroke 2) in `app/tokens.css` for UI-control icons
- [x] Swept all 8 lucide `size={}` props: ZoomableImage (Maximize2/ZoomIn/ZoomOut/RotateCcw/X → `i-sm i-bold`), SceneExperimentsStatic (ExternalLink → `i-xs i-bold`), ExperimentsClient (ExternalLink → `i-sm i-bold`), WritingArchive (CornerDownRight → `i-sm`). Zero `size={N}` props remain on lucide icons.
- [x] `_impl/post.tsx` inline `style={{}}` on the `.wp-shell` section — moved `padding-top: clamp(1.25rem, 2.5vw, 1.75rem)` into the `.wp-shell` rule in `app/tokens.css`
- [x] `cs-toc-inline` summary triangle — swapped `▸` text glyph for a mask-image'd lucide ChevronRight that inherits `--accent` and rotates 90° on `[open]`

### P2 — UX polish

- [x] `/work` sort affordance — decided against. The colored status next to each row makes the clustering self-evident; a sort-order eyebrow would explain what's already visible.
- [x] `ProjectCard` kind chip wrap — added `flex-wrap: wrap` to `.m-project-head`. Short names keep one row (kind right-aligned via existing `margin-left: auto`); long names push the kind to its own line, still right-aligned.
- [x] Mobile typography sweep — full token migration. Every `.m-*` rule that re-implemented typography (15 `font-family`, 16 `font-size`, plus letter-spacing/uppercase eyebrow rules) stripped from `mobile.css`. Elements now apply token classes (`l-meta`, `l-tag`, `c-xs`, `c-sm`, `t-sm`) directly via JSX. 9px values gone; all readable meta is 11px (`c-xs`), chrome is 10px (`l-meta`). `mobile.css` is now layout/color only — single source of truth for typography is `tokens.css`.
- [x] `SiteFooter` 9px under legible minimum — bumped to 11px (`0.6875rem`)

### P2 — infra

- [ ] JSX `style={{}}` not lint-enforced — stylelint only sees CSS files. Optional ESLint rule on `JSXAttribute[name.name='style']` with px / unitless number detection
- [ ] `/d` at <1024px loses TOC (resized desktop browser edge case) — acceptable, or fall back to a `# contents` disclosure on `/d` narrow viewports
