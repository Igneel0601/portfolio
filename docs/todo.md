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
2. **Delete unused `components/scenes/TerminalBar.tsx`** — or wire it in.
3. **Unify section spacing** — inter-scene gaps live in three idioms with no
   shared token: Tailwind padding (`SceneBoot` `pt-8 pb-12`, `SceneTimeline`
   `py-10`), Tailwind margin (`SceneCTA` wrapper `my-12`), and inline
   (`SceneTimeline` `marginTop: -100dvh`). The timeline↔contact gap alone is
   split across two files (`py-10` + `my-12`). Desktop uses Tailwind utils;
   mobile uses hand-written rem padding in `.m-*` classes — two unrelated
   systems. Pick one rhythm token. NOTE: timeline is pinned, so changing its
   margins risks the scroll choreography — verify after.
4. **Lighthouse pass on `/d` and `/m`** — `next/image` priority hints, CWV.
5. **Dynamic-import `lib/terminal/groq.ts`** (lazy-load the chat client).

## 5. Nice-to-have

1. Real git log from the GitHub API on the `/work` footer.
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
