# TODO — what's next

Forward-looking only. Shipped work lives in git history; this file is the
roadmap. Roughly ordered: content first (the site needs more of it), then SEO,
then the template effort, then polish.

> 🚀 Domain launch (2026-06-02): migrated `portfolio.igneel.cloud` →
> **`vergnyx.dev`** (Verma + igneel + Nyx) — Cloudflare DNS (grey-cloud) → Vercel,
> apex-primary + www 308, valid TLS. Full `igneel → vergnyx` rebrand across the
> codebase. SEO shipped: canonical tags (`/`, `/work`, `/writing`, slugs, both
> shells), sitemap incl. case studies, JSON-LD `Person`. Homepage **indexed** in
> GSC; key pages Request-Indexed. New `\/|/` logo (`app/icon.svg` + apple-icon).
> Email `hi@vergnyx.dev` → Gmail via Cloudflare Email Routing. See
> `docs/domain-search.md`.
>
> On `feature/templating` (2026-06-02/03, **not yet merged → `dev`**): centralized
> SEO/metadata into `lib/seo/*` + Article (`BlogPosting`) JSON-LD; identity copy
> into `lib/profile.ts`; home work-showcase data into `lib/content.ts` `PROJECTS`
> (no more local copy; `→` in `date` renders as a lucide `MoveRight`); mobile nav
> links now in the initial DOM for crawlability (§2a.6); `docs/TEMPLATE.md`. Then
> a code-review pass cleared 6 findings: mobile `PANEL_EXTRAS` drift removed (both
> shells now read `content.ts` via a shared `components/Insight.tsx`); OG card +
> `writingFeed.title` no longer hardcode brand/name; tint→accent single-sourced in
> CSS (`[data-tint]`→`--ca`, `TINT` map deleted); dead PSC_CSS block removed;
> internal `/work` CTA uses `MoveRight` not `ExternalLink`.
> 14 commits ahead of `dev` — pending action: merge down.
>
> Recently shipped (2026-06-02): mobile UI polish — full-bleed filter→list
> divider, dropped the work git-log dashed border, writing end-of-log gap now
> matches desktop (3rem); iOS hero italic-ascender clip fix; desktop phantom
> horizontal-overflow clip; timeline blurb single-line on narrow phones;
> stopped tracking `wireframe/` (gitignored).
>
> Earlier (2026-05-29): custom favicon (`app/icon.svg`) + apple-icon, WebP
> image optimization (3.4MB → ~104KB), default OG share card
> (`app/opengraph-image.tsx`), `aria` assistant chat (replaced `ollama run`),
> terminal boot-panel alignment + window-open animation, iPad italic-glyph fix.
>
> SEO baseline: `generateMetadata` now live on `/work`, `/work/<slug>`,
> `/writing`, `/writing/<slug>`, `/experiments`, `/terminal`. `sitemap.ts` +
> `robots.ts` served. `lib/site.ts` holds `SITE_URL` (canonical origin).

---

## 1. Content (highest impact)

1. **Keep publishing posts.** ~9 live (Bloggz `_status = 'published'`, fetched
   at runtime) — the blog reads as active now, but SEO rewards cadence. Pipeline
   + routines work; the gap is reviewing drafts and shipping them regularly.
2. **More case studies.** Only 3 live (codeflow, taskforge, traveloop). Even
   single-page studies for smaller projects round out `/work`.
3. **`/about`** — bio page. Identity is currently scattered (terminal fastfetch +
   CTA copy). See also the template effort (§3).
4. **`/now`** — what you're working on this month. Already plumbed in nav
   (hidden); just needs a page.
5. **`/uses`** — tools / setup. Fits the terminal vibe; pairs with fastfetch.
6. **`/contact`** or a richer footer card — current CTA is link buttons; no form,
   no canonical contact route.

## 2. SEO

Now on **`vergnyx.dev`** (fresh domain, ~zero authority — the old "igneel
portfolio #1" was a honeymoon on a different host, gone with the move). Homepage
is **indexed**; key pages Request-Indexed and propagating. The on-page work
(2a/2b) is largely done — **the bottleneck now is authority: backlinks (§2c) are
the #1 lever.** Goal: own `vergnyx`, then own-name (`vaibhav verma`) queries +
topical traffic for posts.

### 2a. Portfolio-wide

1. **Per-page metadata — finish the gaps.** ✅ Done: `/work`, `/work/<slug>`,
   `/writing`, `/writing/<slug>`, `/experiments`, `/terminal` all emit
   `generateMetadata` (templated `title`, `description`). Remaining: the new
   content routes (`/about`, `/now`, `/uses`) need their own once they exist
   (§1).
2. **`alternates.canonical`.** ✅ Done — `/`, `/work`, `/writing`,
   `/work/<slug>`, `/writing/<slug>` (both `/d` + `/m` shells) emit a canonical
   to the unprefixed URL via `metadataBase`. Remaining: `/experiments`,
   `/terminal` (low priority, sandbox/utility).
3. **Sitemap omits case studies.** ✅ Done — `app/sitemap.ts` now maps
   `listCaseStudies()` into `/work/<slug>` entries alongside posts.
4. **JSON-LD `Person` schema** on home. ✅ Done — `components/PersonJsonLd.tsx`
   rendered on both home shells (`name`, `url`, `jobTitle`, `email`,
   `sameAs: [github]`). Add LinkedIn/X to `sameAs` once those profiles exist
   (CONTACT placeholders today).
5. **Per-route OG images** — `app/opengraph-image.tsx` default exists; add
   per-route variants (e.g. work/writing) via next/og if worth it.
6. **Mobile internal links not in initial DOM.** ✅ Done (partial) —
   `MobileNav.tsx` no longer gates the overlay on `{open && …}`; the nav links
   (`/work`, `/writing`, `/experiments`, `/terminal`) are now always in the
   server-rendered DOM, hidden via `display:none` when closed, so
   Googlebot-Smartphone can crawl them. NOTE: hidden links are still
   **discounted** by Google (discovery/crawl, not full equity). For full equity
   a *visible* home link is needed (e.g. wrap the `$ ls ~/projects` eyebrow in
   `<Link href="/work">`) — deferred; sitemap already indexes both indexes.

### 2b. Writing posts

1. **JSON-LD `Article` schema** on `/writing/<slug>`. ✅ Done —
   `lib/seo/jsonld.ts:articleJsonLd()` emits `BlogPosting` (`headline`,
   `datePublished`, `dateModified`, `author`, `image`, `wordCount`), rendered
   via `<JsonLd>` from `app/_impl/post.tsx`.
2. **`article:published_time` + `article:author`** in `openGraph`. Not set.
3. **Internal linking** — every post should link to ≥2 posts and ≥1 case study
   (only "Similar reads" does this today).
4. **Image alt-text audit** — verify Lexical media nodes carry `alt` from Bloggz;
   empty alt is invisible to search.
5. **Heading hierarchy** — one `<h1>` (title), descending `<h2>`/`<h3>`.

### 2c. Distribution  ← **TOP PRIORITY now (the bottleneck)**

1. **Bio backlinks (do first).** Put `vergnyx.dev` in the **GitHub profile bio +
   README** and **X bio**. These are pages Google already trusts → fastest way to
   give the fresh domain authority so indexed pages *stick* and rank. (Also
   builds the `vergnyx`/`Vaibhav Verma` ↔ you entity association.)
2. **Backlinks** — submit posts to Hacker News, lobste.rs, dev.to mirrors
   (canonical pointing back to the site). Biggest long-term ranking lever.
3. **`sameAs` in JSON-LD** — once LinkedIn/X profiles exist, add them to
   `PersonJsonLd` + `CONTACT` (today: GitHub only).

## 3. Template effort

Goal: change taglines easily now, and clone this into a reusable template later.

> Centralization done so far: **identity** → `lib/profile.ts` (§3.1), **SEO/metadata**
> → `lib/seo/*` (`pages.ts` config + `metadata.ts`/`jsonld.ts` builders, documented
> in AGENTS.md), **work data** → `lib/content.ts` `PROJECTS` (home showcase no longer
> keeps its own copy). Edit surface for a cloner: `lib/profile.ts` + `lib/content.ts`
> + résumé PDF + `SITE_URL` + icons. Remaining centralization is Tier B (§3.2).

1. **Centralize identity copy.** ✅ Done — `lib/profile.ts` (`PROFILE`) is the
   single source for name/role/jobTitle/brand/tagline + structured hero
   `headlineDesktop/Mobile` tokens/subhead/résumé path/RSS. Consumed by
   `layout`, OG card, `lib/seo/*`, `SceneBoot`/`MobileBoot`, footers, nav, rss.
   Socials stay in `lib/content.ts:CONTACT`; projects/timeline already in
   `content.ts`. (OG accent also fixed `#00FF41 → #6ee7a7`.)
2. **Derive terminal/aria flavor from a config** (Tier B, optional) — Aria's
   persona (`app/api/aria/route.ts`), terminal fastfetch rows
   (`components/terminal/Terminal.tsx`), `whoami`/`uname`/`hire-me`
   (`lib/terminal/commands.ts`), and the `/about`/`/now`/`/uses` markdown +
   vCard (`lib/terminal/fs.ts`) are still hand-written persona prose. Left
   deliberately (a cloner rewrites them anyway); documented in `docs/TEMPLATE.md`.
3. **`/experiments` → make it real** — replace the layout/animation sandboxes
   (case-study-v2, projects-showcase, projects-showcase-cinematic) with genuine
   content. NOTE: the cinematic showcase is already the home work section
   (`SceneExperiments`), and its data is now centralized — it reads `PROJECTS`
   from `lib/content.ts` (extended with `tagline`/`insight`/`status`/`tint`;
   `→` in `date` renders as a lucide `MoveRight`), no local hardcoded copy. User
   plans to delete `/experiments` routes entirely later.
4. **Template README.** ✅ Done — `docs/TEMPLATE.md` ("make this portfolio
   yours": edit `lib/profile.ts` + `lib/content.ts`, swap résumé PDF, set
   `SITE_URL`, replace icons, optional terminal/Aria flavor files).

## 4. Infra / hardening

1. **Persistent rate limit on `/api/aria`** — Upstash free tier; the current
   in-memory map resets per edge instance.
2. **Delete unused `components/scenes/TerminalBar.tsx`.** ✅ Done — confirmed zero
   imports, removed.
3. **Unify section spacing.** ✅ Done — added a `--scene-gap` rhythm token
   (`tokens.css`) and pointed the genuine inter-scene gaps at it (`SceneBoot`
   bottom, `SceneCTA` margin), pixel-identical (3rem → 3rem, verified via
   computed styles). Investigation found `SceneTimeline`'s `py-10` is NOT
   inter-scene rhythm — it's pin-internal padding inside the fixed `height:100dvh`
   parallax box (`marginTop:-100dvh`); folding it in would break the
   choreography, so it's annotated "do not fold into rhythm" instead. Mobile
   `.m-*` left as its own system (separate concern). FOLLOW-UP: the viewport-only
   visual tests don't cover these below-the-fold gaps — a spacing-contract check
   (assert computed `--scene-gap`/paddings) would close that.
4. **Lighthouse pass on `/d` and `/m`** — `next/image` priority hints, CWV.
5. ~~Dynamic-import `lib/terminal/groq.ts`~~ — **decided against.** It's a
   55-line plain-`fetch` client with zero deps, and `modelLabel()` is used
   eagerly in the terminal welcome text. Nothing heavy to defer; lazy-loading
   would add complexity for ~0 bundle savings.

## 5. Nice-to-have

1. **Real git log from the GitHub API on the `/work` footer.** ✅ Done —
   `lib/github.ts:getRecentCommits()` auto-discovers recently-pushed repos from
   the public events feed, pulls real messages via the commits API, merges by
   recency (merge commits filtered, max 2/repo), hourly ISR, `GIT_LOG_PREVIEW`
   fallback. Wired into both `/work` shells. Optional `GITHUB_TOKEN` for headroom.
2. `resolveMediaUrl` — handle protocol-relative URLs (`//host/x.png`) if Bloggz
   ever emits one.
3. Fullscreen "not supported" feedback in the terminal (silent success today on
   browsers without either API).
4. Rewrite SceneCTA copy in terminal grammar (e.g. `$ contact --me`,
   `# replies within ~24h`, `gh / in / x`).

## 6. Later

1. **Breadcrumbs** — shared path-style component across `/work/[slug]` and
   `/writing/[slug]` (replaces the removed back-links).
2. Letters bot.
3. **Terminal v2** — tab completion · pipes · real ANSI colour codes · aria
   session quota indicator.
4. `.md` URLs for posts (deferred) — more memorable, slightly distinctive in
   SERPs.

## 7. Testing

Shipped (2026-06-03): regression suite so new features can't silently break old
behavior. **Vitest** unit/contract/snapshot (`pnpm test`, 45 tests: SEO builders,
JSON-LD, `getRecentCommits`, `Insight`/`DateRange`, `resolveMediaUrl`, data
invariants, `listWorkRows`) + **`pnpm check`** gate (tsc + stylelint + vitest),
run by a **husky** pre-push hook. **Playwright** smoke (`pnpm test:e2e`) + visual
(`pnpm test:visual`) across both shells. CI: `.github/workflows/ci.yml` (unit gate
+ build on PRs) and `e2e.yml` (against the Vercel preview). Follow-ups:

1. **Add the `DATABASE_URI` repo secret** (+ optional `GH_READ_TOKEN`) so the CI
   `build` job runs — static generation of `/writing/[slug]` reads Postgres.
2. **Make CI visual blocking.** Baselines are committed from a local Linux run;
   font rendering differs per environment. Regenerate them in the CI runner
   (`playwright test --grep @visual --update-snapshots`), commit, then drop
   `continue-on-error` from the `visual` step in `e2e.yml`.
3. **ESLint debt → fold lint back into the gate.** `pnpm lint` has ~30
   pre-existing errors (mostly React-19 `set-state-in-effect` in `lib/lenis.tsx`,
   `MobileNav`, effect-init code, plus a few `jsx-no-comment-textnodes` /
   `no-explicit-any`). CI runs eslint non-blocking today; clear the debt, then add
   `eslint` to `pnpm check`. NOTE: the set-state-in-effect fixes touch animation
   init — verify scroll/GSAP behavior after.
4. **Broaden coverage as features land** — new `lib/*` logic gets a Vitest test;
   new routes get a smoke check; `/about`/`/now`/`/uses` (§1) get visual baselines.
