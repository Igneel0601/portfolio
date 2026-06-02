# TODO — what's next

Forward-looking only. Shipped work lives in git history; this file is the
roadmap. Roughly ordered: content first (the site needs more of it), then SEO,
then the template effort, then polish.

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

Brand search `igneel portfolio` already lands #1. Goal: rank for own-name
queries (`vaibhav verma developer`) and earn topical traffic for posts.

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
6. **Mobile internal links not in initial DOM.** `MobileNav.tsx` renders the
   `/work` + `/writing` index links only inside the `{open && …}` hamburger
   overlay, so Googlebot-Smartphone (which gets `/m`) sees no crawlable link to
   the section indexes from the home (only `/work/<slug>` CTAs via
   `MobileProjects.tsx`). Add crawlable `<a href>` to the mobile site footer so
   link equity flows from the indexed home to the inner pages. (Desktop nav is
   already crawlable.)

### 2b. Writing posts

1. **JSON-LD `Article` schema** on `/writing/<slug>` — `headline`,
   `datePublished`, `dateModified`, `author`, `image`, `wordCount`. None today.
2. **`article:published_time` + `article:author`** in `openGraph`. Not set.
3. **Internal linking** — every post should link to ≥2 posts and ≥1 case study
   (only "Similar reads" does this today).
4. **Image alt-text audit** — verify Lexical media nodes carry `alt` from Bloggz;
   empty alt is invisible to search.
5. **Heading hierarchy** — one `<h1>` (title), descending `<h2>`/`<h3>`.

### 2c. Distribution

1. **Backlinks** — submit posts to Hacker News, lobste.rs, dev.to mirrors
   (canonical pointing back to the site). Biggest ranking lever.
2. **Name authority** — link from GitHub README + Twitter/LinkedIn bio to the
   site with "Vaibhav Verma" as anchor text.

## 3. Template effort

Goal: change taglines easily now, and clone this into a reusable template later.

1. **Centralize identity copy into `lib/site.ts`** (today holds only `SITE_URL`):
   name, role, tagline (as structured tokens so the hero can still highlight the
   accent span), bio, socials, accent colour. Currently duplicated across
   `app/layout.tsx`, `app/opengraph-image.tsx`,
   `components/scenes/SceneBoot.tsx`, `components/mobile/parts.tsx` — change one
   and the others drift (e.g. OG card vs hero). Projects are **already**
   centralized (`lib/content.ts` `PROJECTS` + `content/case-studies/*.mdx`).
2. **Derive terminal/aria flavor from `PROJECTS`** (optional) — Aria's persona
   (`app/api/aria/route.ts`) and the fake `git log` (`lib/terminal/commands.ts`)
   + virtual fs (`lib/terminal/fs.ts`) re-type project facts as prose. Fine as
   flavor; for a clean template, source them.
3. **`/experiments` → make it real** — replace the layout/animation sandboxes
   (case-study-v2, projects-showcase, projects-showcase-cinematic) with genuine
   content, or fold the cinematic showcase into the home page.
4. **Template README** — top-level setup + "edit your content here" guide once
   `lib/site.ts` is the single source.

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
