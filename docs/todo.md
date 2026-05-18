# TODO

## Blockers (broken UX)
- [ ] `/work/[id]` dynamic route — CTA from Experiments scene currently 404s
- [ ] Nav stubs — `/writing`, `/now`, `/uses`, `/about` (placeholder pages so nav doesn't 404)

## Should-do before shipping
- [ ] Decide `SceneFuture` — mount in `app/page.tsx` or delete
- [ ] Delete `components/scenes/ScenePinnedWork.tsx.bak` (or restore)
- [ ] `app/layout.tsx` metadata — title, description, OG image, real favicon
- [ ] Mobile pass — scenes use `100vh` + GSAP pin; verify <768px
- [ ] `prefers-reduced-motion` audit in Timeline / CTA / Future (Experiments already has it)

## Nice-to-have
- [ ] Type check + production build green
- [ ] Lighthouse pass — verify `next/image` priority hints

## Vibe consistency
- [ ] SceneCTA copy break — "Hiring? Building? Curious?" + "Drop a line — I respond fast." + button "github · linkedin · x" are plain marketing prose; rewrite in terminal grammar (e.g. `$ contact --me`, `# replies within ~24h`, `gh / in / x`)
- [ ] Delete unused `components/scenes/TerminalBar.tsx` (not imported anywhere) — or wire it in

## Later
- [ ] Letters bot
