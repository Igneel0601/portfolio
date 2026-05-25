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

## Should-do before shipping

- [ ] Real favicon + OG image in `app/layout.tsx` metadata (title/desc done)
- [x] Mobile pass — resolved by `/m` shell isolation (desktop scenes no longer render on phones; `/m` has its own touch-first components)
- [x] `/work` table mobile layout — `MobileWorkLog` + `WorkPageRow` (stacked cards, status pills, press feedback) on the `/m` shell
- [ ] Compress `public/term/wallpaper.jpg` (13MB) + `public/term/portrait.png` (6MB) → WebP
- [ ] Persistent rate limit on `/api/ollama/run` (Upstash free tier; current in-memory map resets per edge instance)

## Nice-to-have

- [ ] Lighthouse pass — verify `next/image` priority hints
- [ ] Real git log from GH API on `/work` footer (deferred)
- [ ] Dynamic import for `lib/terminal/groq.ts` (lazy-load LLM client)

## Vibe consistency

- [ ] SceneCTA copy break — "Hiring? Building? Curious?" + "Drop a line — I respond fast." + button "github · linkedin · x" are plain marketing prose; rewrite in terminal grammar (e.g. `$ contact --me`, `# replies within ~24h`, `gh / in / x`)
- [ ] Delete unused `components/scenes/TerminalBar.tsx` (still not imported anywhere) — or wire it in

## Later

- [ ] `/now`, `/uses` routes (currently commented out of nav)
- [ ] Letters bot
- [ ] Terminal v2: tab completion · pipes · real ANSI colour codes · `ollama` quota indicator

---

## Design audit (2026-05-23)

### P0 — visible breaks / fragile

- [x] `MobileHome` 120dvh + sticky child — swapped `dvh` → `svh` so container height is stable when Android Chrome URL bar collapses (`components/mobile/MobileHome.tsx`)
- [ ] Layout jump `/work` → `/work/[slug]` (max-widths, nav anchor, empty sidebar) — anchor both to same outer container, collapse empty sidebar when TOC absent
- [ ] Desktop `* { cursor: none }` leaks to iPad-with-trackpad (fine + hover) — gate properly or confirm `desktop.css` isn't loaded on `/m` (`app/desktop.css`)
- [ ] `a::after { transform: scale(1.08) }` link hover scales lucide icons inside unwrapped links — add `.no-pop` to pager/back-link call sites (`app/desktop.css`)

### P1 — cross-shell inconsistency

- [ ] Back-link icon size differs — desktop `i-lg`, mobile `i-sm`. Pick one
- [ ] Pager glyph size differs — case-study Pager `i-sm`, post pager `i-md`. Pick one
- [ ] Status pill shape differs — desktop text-only, mobile bordered. Pick one
- [ ] `ChevronRight` outlier in `WorkLog.tsx` while rest is `Move*`. Swap or drop
- [ ] Post breadcrumb may not pass `no-pop` through `<Link>` — verify (`app/_impl/post.tsx`)

### P1 — mobile shell inline styles (same treatment as `parts.tsx`)

- [ ] `MobileTimeline.tsx` — 11 inline blocks
- [ ] `MobileWorkLog.tsx` — 6
- [ ] `MobileNav.tsx` — 5
- [ ] `MobileHome.tsx` — 3 (includes dead `background: var(--paper)` wrapper)
- [ ] `MobileWriting.tsx` — 1

### P1 — token coverage gaps

- [ ] Non-`Move*` lucide icons still pass `size={}` — `Maximize2`, `ZoomIn`, `ZoomOut`, `X`, `RotateCcw`, `ExternalLink`, `CornerDownRight`. Add `.i-bold` modifier (stroke 2) and sweep
- [ ] `_impl/post.tsx` has one inline `style={{}}` on the breadcrumb wrapper — extract to class
- [ ] `cs-toc-inline` summary triangle uses `▸` character — swap for a lucide chevron

### P2 — UX polish

- [ ] `/work` sort affordance — add eyebrow "sorted: active → wip → archived → dead" so readers understand the order (`components/work/WorkLog.tsx`)
- [ ] `ProjectCard` kind chip wraps awkwardly with long names — cap name to 1 line, or move chip below (`components/mobile/parts.tsx`)
- [ ] Mobile micro-type sizes inconsistent — 9px / 10px / 11px scattered. Settle on two roles
- [ ] `SiteFooter` 9px under legible minimum — bump to 10–11px (`app/mobile.css`)

### P2 — infra

- [ ] JSX `style={{}}` not lint-enforced — stylelint only sees CSS files. Optional ESLint rule on `JSXAttribute[name.name='style']` with px / unitless number detection
- [ ] `/d` at <1024px loses TOC (resized desktop browser edge case) — acceptable, or fall back to a `# contents` disclosure on `/d` narrow viewports
