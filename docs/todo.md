# TODO

## Done

- [x] `/work/[id]` dynamic route — 3 case studies live (codeflow, taskforge, traveloop) with TOC + pager + frontmatter card + zoomable arch diagrams
- [x] Custom `not-found.tsx` 404 page — absorbs unbuilt nav stubs gracefully
- [x] `/work` index rebuilt — reads frontmatter, 4-col build log, Peter-Parker blurbs
- [x] rem-based typography with `clamp()` root — scales across screen sizes
- [x] Type check + production build green
- [x] Dim parallax background dots (3% → 5%)

## Blockers (broken UX)

- [ ] Nav stubs — `/writing`, `/now`, `/uses` (404 absorbs; remove from nav or build stubs)

## Should-do before shipping

- [ ] Decide `SceneFuture` — mount in `app/page.tsx` or delete
- [ ] Delete `components/scenes/ScenePinnedWork.tsx.bak` (or restore)
- [ ] `app/layout.tsx` metadata — title, description, OG image, real favicon
- [ ] Mobile pass — scenes use `100vh` + GSAP pin; verify <768px
- [ ] `prefers-reduced-motion` audit in Timeline / CTA / Future (Experiments already has it)
- [ ] `/work` table mobile layout (rows stack badly below md)

## Nice-to-have

- [ ] Lighthouse pass — verify `next/image` priority hints
- [ ] Real git log from GH API on `/work` footer (deferred)

## Vibe consistency

- [ ] SceneCTA copy break — "Hiring? Building? Curious?" + "Drop a line — I respond fast." + button "github · linkedin · x" are plain marketing prose; rewrite in terminal grammar (e.g. `$ contact --me`, `# replies within ~24h`, `gh / in / x`)
- [ ] Delete unused `components/scenes/TerminalBar.tsx` (not imported anywhere) — or wire it in

## Later

- [ ] Terminal as `/terminal` route (separate from 404)
- [ ] Letters bot
