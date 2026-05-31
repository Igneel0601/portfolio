# TODO — what's next

Forward-looking only. Shipped work lives in git history; this file is the
roadmap. Roughly ordered: content first (the site needs more of it), then SEO,
then the template effort, then polish.

> Recently shipped (2026-05-29): custom favicon (`app/icon.svg`) + apple-icon,
> WebP image optimization (portrait + wallpaper, 3.4MB → ~104KB), default OG
> share card (`app/opengraph-image.tsx`, Plex Mono), `aria` assistant chat
> (replaced `ollama run`), terminal boot-panel alignment + window-open
> animation, iPad italic-glyph clip fix.

---

## 1. Content (highest impact)

- [ ] **Write more posts.** Only 2 published. A blog with 2 entries reads as
      abandoned, and SEO needs pages to rank. Pipeline + routines work — the gap
      is reviewing drafts and publishing.
- [ ] **More case studies.** Only 3 live (codeflow, taskforge, traveloop). Even
      single-page studies for smaller projects round out `/work`.
- [ ] **`/about`** — bio page. Identity is currently scattered (terminal
      fastfetch + CTA copy). See also the template effort (§3).
- [ ] **`/now`** — what you're working on this month. Already plumbed in nav
      (hidden); just needs a page.
- [ ] **`/uses`** — tools / setup. Fits the terminal vibe; pairs with fastfetch.
- [ ] **`/contact`** or a richer footer card — current CTA is link buttons; no
      form, no canonical contact route.

## 2. SEO

Brand search `igneel portfolio` already lands #1. Goal: rank for own-name
queries (`vaibhav verma developer`) and earn topical traffic for posts.

### Portfolio-wide
- [ ] **Per-page metadata** — every route needs its own `generateMetadata`:
      templated `title` (`<page> — Vaibhav Verma`), `description`,
      `alternates.canonical`. Posts have it; `/work/<slug>`, `/experiments`,
      `/terminal`, `/about`, `/now`, `/uses` need it.
- [ ] **`alternates.canonical` site-wide** — the UA-routed `/d` and `/m` shells
      must canonical to the unprefixed URL or Google indexes both as duplicates.
- [ ] **JSON-LD `Person` schema** on home (`name`, `url`,
      `sameAs: [github, linkedin, x]`, `jobTitle`). Feeds the knowledge panel.
- [ ] **Per-route OG images** — `app/opengraph-image.tsx` default now exists;
      add per-route variants (e.g. work/writing) using next/og if worth it.
- [ ] **Verify `sitemap.xml`** lists every post, case study, and experiment
      subroute with `lastmod` + `changefreq` (robots.txt already served).

### Writing posts
- [ ] **JSON-LD `Article` schema** on `/writing/<slug>` — `headline`,
      `datePublished`, `dateModified`, `author`, `image`, `wordCount`.
- [ ] **`article:published_time` + `article:author`** in `openGraph`.
- [ ] **Internal linking** — every post should link to ≥2 posts and ≥1 case
      study (only "Similar reads" does this today).
- [ ] **Image alt-text audit** — verify Lexical media nodes carry `alt` from
      Bloggz; empty alt is invisible to search.
- [ ] **Heading hierarchy** — one `<h1>` (title), descending `<h2>`/`<h3>`.

### Distribution
- [ ] **Backlinks** — submit posts to Hacker News, lobste.rs, dev.to mirrors
      (canonical pointing back to the site). Biggest ranking lever.
- [ ] **Name authority** — link from GitHub README + Twitter/LinkedIn bio to
      the site with "Vaibhav Verma" as anchor text.

## 3. Template effort

Goal: change taglines easily now, and clone this into a reusable template later.

- [ ] **Centralize identity copy into `lib/site.ts`** (already holds `SITE_URL`):
      name, role, tagline (as structured tokens so the hero can still highlight
      the accent span), bio, socials, accent colour. Today it's duplicated in
      `app/layout.tsx`, `app/opengraph-image.tsx`,
      `components/scenes/SceneBoot.tsx`, `components/mobile/parts.tsx` — change
      one and the others drift (e.g. OG card vs hero).
      - Projects are **already** centralized (`lib/content.ts` `PROJECTS` +
        `content/case-studies/*.mdx`) — no work needed there.
- [ ] **Derive terminal/aria flavor from `PROJECTS`** (optional) — Aria's
      persona (`app/api/aria/route.ts`) and the fake `git log`
      (`lib/terminal/commands.ts`) + virtual fs (`lib/terminal/fs.ts`) re-type
      project facts as prose. Fine as flavor; for a clean template, source them.
- [ ] **`/experiments` → make it real** — replace the layout/animation sandboxes
      (case-study-v2, projects-showcase, projects-showcase-cinematic) with
      genuine content, or fold the cinematic showcase into the home page.
- [ ] **Template README** — top-level setup + "edit your content here" guide
      once `lib/site.ts` is the single source.

## 4. Infra / hardening

- [ ] **Persistent rate limit on `/api/aria`** — Upstash free tier; the current
      in-memory map resets per edge instance.
- [ ] Delete unused `components/scenes/TerminalBar.tsx` — or wire it in.
- [ ] Lighthouse pass on `/d` and `/m` — `next/image` priority hints, CWV.
- [ ] Dynamic-import `lib/terminal/groq.ts` (lazy-load the chat client).

## 5. Nice-to-have

- [ ] Real git log from the GitHub API on the `/work` footer.
- [ ] `resolveMediaUrl` — handle protocol-relative URLs (`//host/x.png`) if
      Bloggz ever emits one.
- [ ] Fullscreen "not supported" feedback in the terminal (silent success today
      on browsers without either API).
- [ ] Rewrite SceneCTA copy in terminal grammar (e.g. `$ contact --me`,
      `# replies within ~24h`, `gh / in / x`).

## 6. Later

- [ ] **Breadcrumbs** — shared path-style component across `/work/[slug]` and
      `/writing/[slug]` (replaces the removed back-links).
- [ ] Letters bot.
- [ ] **Terminal v2** — tab completion · pipes · real ANSI colour codes · aria
      session quota indicator.
- [ ] `.md` URLs for posts (deferred) — more memorable, slightly distinctive in
      SERPs.
