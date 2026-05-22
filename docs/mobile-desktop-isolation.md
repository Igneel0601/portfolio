# Mobile/desktop isolation

This site ships **two separate trees** — one for mobile, one for desktop — and picks between them at the edge via User-Agent. After the switch:

- Mobile bundles never load `desktop.css`, `Nav.tsx`, `CustomCursor.tsx`, `Background.tsx`, `MotionProvider.tsx`, `lib/lenis.ts`, or `lib/gsap.ts`.
- Desktop bundles never load mobile components.
- Editing a CSS rule in `desktop.css` cannot affect mobile, and vice-versa. Same for component edits.

This document explains how that's wired so a contributor can find the right file when adding or fixing something.

## Architecture

```
┌─────────────────────── request ────────────────────────┐
│                                                        │
│  middleware.ts                                         │
│    └─ reads User-Agent                                 │
│        ├─ mobile UA  →  rewrite path to /m/...         │
│        └─ desktop UA →  rewrite path to /d/...         │
│                                                        │
│  Next routes to the rewritten path:                    │
│                                                        │
│   app/                                                 │
│   ├─ layout.tsx       ← root: html, fonts, tokens.css  │
│   │                     NO shell, NO chrome            │
│   │                                                    │
│   ├─ d/               ← desktop subtree                │
│   │  ├─ layout.tsx    ← imports DesktopShell + desktop.css
│   │  ├─ page.tsx      (scenes)                         │
│   │  ├─ work/page.tsx                                  │
│   │  ├─ work/[slug]/page.tsx  ← re-exports _impl       │
│   │  ├─ writing/page.tsx                               │
│   │  ├─ writing/[slug]/page.tsx ← re-exports _impl     │
│   │  ├─ experiments/page.tsx                           │
│   │  └─ terminal/page.tsx                              │
│   │                                                    │
│   ├─ m/               ← mobile subtree                 │
│   │  ├─ layout.tsx    ← imports MobileShell + mobile.css
│   │  └─ ...same routes, mobile components...           │
│   │                                                    │
│   ├─ _impl/           ← non-route shared modules       │
│   │  ├─ case-study.tsx  (work/[slug] body)             │
│   │  └─ post.tsx        (writing/[slug] body)          │
│   │                                                    │
│   ├─ api/, rss.xml/, sitemap.xml/, robots.txt          │
│   │   └─ no rewrite, served direct                     │
│   │                                                    │
│   └─ not-found.tsx    ← root-level 404 fallback        │
│                                                        │
│  URL bar shows /work, /writing/foo — middleware        │
│  rewrites are transparent to the browser.              │
└────────────────────────────────────────────────────────┘
```

## Why two trees instead of one with `md:hidden`?

Before this refactor both trees lived in the same JSX, gated by Tailwind responsive classes (`hidden md:block` / `md:hidden`). Two problems:

1. **CSS bleed.** Every rule in `globals.css` applied to both trees regardless of which one was visible. A global `a:hover { transform: scale(1.08) }` block for desktop fired on Android taps (sticky hover), making mobile cards jump.
2. **JS bloat.** GSAP, Lenis, the custom cursor, the parallax background — all of it shipped to phones even though they never ran. ~25 KB gzipped of dead client code per mobile pageload.

Pure shell-switching at the layout level fixed (1) for *most* selectors but not for the CSS bundling itself — Next.js's CSS bundler statically follows every `import` chain at build time, so as long as both shells were statically imported, both shells' CSS files ended up in the same chunk. Path-prefix subtrees genuinely fork the import graph: `app/d/*` files never import anything from `app/m/*` and vice-versa, so the build emits two separate CSS and JS chunks.

## Adding a new route

Two cases:

**Content differs between mobile and desktop** (different layouts, different copy, etc.):

1. Add the page under both subtrees: `app/d/<route>/page.tsx` and `app/m/<route>/page.tsx`.
2. Each renders the appropriate component.

**Content is identical** (article reader, machine-readable endpoint, etc.):

1. Put the shared logic in `app/_impl/<route>.tsx`. The leading underscore makes Next ignore it for routing — it's a private folder.
2. In each subtree, create a one-liner `page.tsx`:
   ```ts
   export { default, generateStaticParams, generateMetadata } from "@/app/_impl/<route>";
   ```
3. **Route-segment config (`dynamicParams`, `revalidate`, `dynamic`, etc.) must be inlined in the route file** — Next 16 refuses to follow re-exports for those. Example:
   ```ts
   export const dynamicParams = false;

   export {
     default,
     generateStaticParams,
     generateMetadata,
   } from "@/app/_impl/case-study";
   ```

## Adding a new CSS rule

1. **Shared content style** (typography, prose, article chrome, anything mobile and desktop both render) → `app/tokens.css`. Loaded once by `app/layout.tsx`.
2. **Desktop-only style** (parallax bg, custom cursor, hover-pop, `[data-nav]`, `.work-*`/`.wa-*` tables) → `app/desktop.css`. Loaded by `app/d/layout.tsx`.
3. **Mobile-only style** (touch-active states, pull-to-refresh keyframes, mobile-specific @media) → `app/mobile.css`. Loaded by `app/m/layout.tsx`.

If you put a desktop rule in `tokens.css` it will ship to mobile and (probably) be inert; if you put a mobile rule in `tokens.css` it will ship to desktop and (probably) be inert. Both work but they're sloppy. Each tree has its own bucket — use it.

## Middleware

`middleware.ts` at the project root. Skip list:

- Already-prefixed paths (`/d/*`, `/m/*`) — these are the rewritten destinations; no further rewrite.
- API + machine-readable routes (`/api/*`, `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/favicon.ico`).
- Anything with a file extension (images, fonts, manifests).

Everything else goes through `isMobileUA()` in `lib/device.ts` and gets rewritten to `/d/...` or `/m/...`.

UA regex deliberately omits `iPad` — modern iPadOS reports a desktop Safari UA, so iPads see the desktop tree. Matches `lib/match-media.ts` behavior.

## Caching

`next.config.ts` pins `Vary: User-Agent` on every response so a CDN serves the right HTML per UA.

## Conventions worth remembering

- **Never** import a desktop-only component from inside `app/m/` or `components/mobile/`, and vice-versa. The lint check is `git grep` — if you see `@/components/Nav` referenced from a mobile file, that's a leak.
- The mobile nav lives at `components/mobile/MobileNav.tsx`, the desktop nav at `components/Nav.tsx`. They share `NAV_LINKS` from `lib/content.ts` but otherwise have nothing in common.
- `components/case-study/*`, `components/writing/Post*`, and `components/NotFoundView` are **shared** — used by both trees. They style themselves with `tokens.css` classes (`.cs-*`, `.wp-*`, `.nf-*`, `.w-prose`) which is why those classes live in tokens, not in desktop/mobile.
- When debugging "why does mobile have desktop styling," check the network tab first. Mobile responses should reference `app/m/...` CSS chunks only.

## Verification

After any structural change:

1. `npm run build` — check the route table. Top-level routes should appear under `/d/*` and `/m/*`. Articles should show `●` (SSG with generateStaticParams) under both trees. Middleware row at the bottom: `ƒ Proxy (Middleware)`.
2. Dev: open `localhost:3000/` with default Chrome UA → scrollytelling + custom cursor + parallax. View source: only `tokens.css` and the `app/d/...` CSS chunk linked.
3. Dev: Chrome DevTools → Network conditions → User agent "iPhone" → reload. `MobileHome` only. `document.querySelector('[data-nav]')` (desktop nav) is null; `[data-mobile-nav]` is present. View source: only `tokens.css` and the `app/m/...` CSS chunk linked. No `desktop.css`.
4. `curl -sI -H 'User-Agent: Mozilla/5.0 (iPhone; ...)' http://localhost:3000/ | grep -i vary` → `Vary: User-Agent`.
5. Edit a hover rule in `desktop.css`, reload mobile session — no visual change. Edit something in `mobile.css`, reload desktop session — no visual change.
