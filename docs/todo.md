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

## Blockers (broken UX)

- [ ] Nav stubs — `/now`, `/uses` still 404 (`/writing` now live; remove these two from nav or scaffold stubs)

## Should-do before shipping

- [x] Decide `SceneFuture` — deleted (file + FUTURE export); already off homepage flow
- [x] Delete `components/scenes/ScenePinnedWork.tsx.bak` and `components/ProjectCard.tsx.bak`
- [ ] Real favicon + OG image in `app/layout.tsx` metadata (title/desc done)
- [ ] Mobile pass — scenes use `100vh` + GSAP pin; verify <768px
- [x] `prefers-reduced-motion` audit — global CSS kill-switch + all GSAP scenes guarded via `motionMM`/`isReduce`
- [ ] `/work` table mobile layout (rows stack badly below md)

## Nice-to-have

- [ ] Lighthouse pass — verify `next/image` priority hints
- [ ] Real git log from GH API on `/work` footer (deferred)

## Vibe consistency

- [ ] SceneCTA copy break — "Hiring? Building? Curious?" + "Drop a line — I respond fast." + button "github · linkedin · x" are plain marketing prose; rewrite in terminal grammar (e.g. `$ contact --me`, `# replies within ~24h`, `gh / in / x`)
- [ ] Delete unused `components/scenes/TerminalBar.tsx` (still not imported anywhere) — or wire it in

## Later

- [ ] Terminal as `/terminal` route (separate from 404)
- [ ] Letters bot
