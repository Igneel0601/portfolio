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
- [ ] Mobile pass — scenes use `100vh` + GSAP pin; verify <768px
- [ ] `/work` table mobile layout (rows stack badly below md)

## Nice-to-have

- [ ] Lighthouse pass — verify `next/image` priority hints
- [ ] Real git log from GH API on `/work` footer (deferred)

## Vibe consistency

- [ ] SceneCTA copy break — "Hiring? Building? Curious?" + "Drop a line — I respond fast." + button "github · linkedin · x" are plain marketing prose; rewrite in terminal grammar (e.g. `$ contact --me`, `# replies within ~24h`, `gh / in / x`)
- [ ] Delete unused `components/scenes/TerminalBar.tsx` (still not imported anywhere) — or wire it in

## Later

- [ ] `/now`, `/uses` routes (currently commented out of nav)
- [ ] Letters bot
- [ ] Terminal v2: tab completion · pipes · real ANSI colour codes · `ollama` quota indicator
