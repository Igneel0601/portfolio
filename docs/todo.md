# TODO — roadmap

Forward-looking only. Shipped work lives in git history; this file is just
what's left. Roughly ordered by leverage: distribution + content first, then
SEO polish, template, infra, testing, and the long tail.

Context: live on **vergnyx.dev** (fresh domain, ~zero authority). Homepage is
indexed; the bottleneck is **authority — backlinks (§2c) are the #1 lever.**

---

## 1. Content (highest on-site impact)

1. **Keep publishing posts.** ~9 live via Bloggz; SEO rewards cadence. The gap is
   reviewing drafts and shipping regularly, not the pipeline.
2. **More case studies.** Only 3 live (codeflow, taskforge, traveloop). Even
   single-page studies round out `/work`.
3. **`/about`** — bio page. Identity is currently scattered (terminal fastfetch +
   CTA copy). Pull from `lib/profile.ts`.
4. **`/now`** — what you're working on this month. Already in nav (hidden).
5. **`/uses`** — tools / setup. Fits the terminal vibe.
6. **`/contact`** or a richer footer card — current CTA is link buttons; no form.

New content routes also need metadata (`lib/seo/pages.ts` + both shells) and
visual-test baselines (§5) once they exist.

## 2. SEO

### 2a. On-page (mostly done — remaining)
1. **Per-route OG images** — default exists (`app/opengraph-image.tsx`); add
   work/writing variants via `next/og` if worth it.
2. **Visible, full-equity mobile home link.** The nav links are crawlable but
   hidden (discounted). A *visible* in-content link (e.g. wrap the
   `$ ls ~/projects` eyebrow in `<Link href="/work">`) would carry full equity.
3. **Canonical for `/experiments`, `/terminal`** — low priority (sandbox/utility).

### 2b. Writing posts
1. **`article:published_time` + `article:author`** in `openGraph` — not set.
2. **Internal linking** — every post should link to ≥2 posts and ≥1 case study
   (only "Similar reads" does this today).
3. **Image alt-text audit** — verify Lexical media nodes carry `alt` from Bloggz.
4. **Heading hierarchy — case studies skip a level.** Verified (2026-06-03):
   home, both indexes, and *writing posts* are clean (one `<h1>`, descending
   `<h2>`/`<h3>`). The one violation is **case studies** — they go `h2 → h4`
   with no `h3`. Source: the `Decision` block heading at
   `components/case-study/mdx-components.tsx:173` (`<h4 …>`). Fix: change it to
   `<h3>` — it keeps its `t-h5` sizing class, so **zero visual change**, just the
   correct semantic level. (Writing posts need no change.)

### 2c. Distribution ← TOP PRIORITY (the bottleneck)
1. **Bio backlinks (do first).** Put `vergnyx.dev` in the GitHub profile bio +
   README and X bio — trusted pages that hand the fresh domain authority fast.
2. **Submit posts** to Hacker News, lobste.rs, dev.to mirrors (canonical back to
   the site). Biggest long-term ranking lever.
3. **`sameAs` in JSON-LD** — add LinkedIn/X to `personJsonLd` + `CONTACT` once
   those profiles exist (GitHub only today).

## 3. Template

1. **Derive terminal/Aria flavor from config** (Tier B, optional) — Aria's persona
   (`app/api/aria/route.ts`), fastfetch rows (`components/terminal/Terminal.tsx`),
   `whoami`/`uname`/`hire-me` (`lib/terminal/commands.ts`), and the
   `/about`/`/now`/`/uses` markdown (`lib/terminal/fs.ts`) are still hand-written
   prose. Left deliberately; documented in `docs/TEMPLATE.md`.
2. **`/experiments` → make it real or delete.** The cinematic showcase is already
   the home work section (centralized on `lib/content.ts`); the rest are sandboxes.
   Plan is to delete `/experiments` routes entirely.

## 4. Infra / hardening

1. **Persistent rate limit on `/api/aria`** — Upstash free tier; the current
   in-memory map resets per edge instance. *Needs an Upstash Redis DB +
   `UPSTASH_REDIS_REST_URL`/`_TOKEN`.*
2. **Lighthouse pass on `/d` and `/m`** — `next/image` priority hints, CWV.

## 5. Testing

The suite (Vitest + `pnpm check` + husky; Playwright smoke/visual; CI
`ci.yml`/`e2e.yml`) is live. Open follow-ups:

1. **Add the `DATABASE_URI` repo secret** (+ optional `GH_READ_TOKEN`) so the CI
   `build` job runs — static gen of `/writing/[slug]` reads Postgres.
2. **Make CI visual blocking.** Baselines are committed from a local Linux run;
   regenerate in the CI runner (`playwright test --grep @visual
   --update-snapshots`), commit, then drop `continue-on-error` in `e2e.yml`.
3. **ESLint debt → fold lint back into the gate.** `pnpm lint` has ~30
   pre-existing errors — biggest cluster in `case-study/mdx-components.tsx`
   (`no-unescaped-entities`/`jsx-key`/`no-explicit-any`), plus `next/no-img-element`,
   `jsx-no-comment-textnodes`, and 5 React-19 `set-state-in-effect` in animation
   init (`lib/lenis.tsx`, `Nav`, `MobileNav`, `useTerminal`). Clear them, add
   `eslint` to `pnpm check`, drop CI's `continue-on-error`. NOTE: the
   set-state-in-effect fixes touch GSAP/Lenis init — verify scroll behavior after.
4. **Spacing-contract test.** Visual screenshots are viewport-only and missed the
   below-the-fold `--scene-gap` change; add a check asserting computed
   `--scene-gap` + scene paddings so spacing regressions are actually caught.
5. **Broaden coverage as features land** — new `lib/*` logic gets a Vitest test;
   new routes get a smoke check + visual baseline.

## 6. Nice-to-have

1. `resolveMediaUrl` — handle protocol-relative URLs (`//host/x.png`) if Bloggz
   ever emits one (a Vitest case is already stubbed for it).
2. Fullscreen "not supported" feedback in the terminal (silent success today).
3. Rewrite SceneCTA copy in terminal grammar (`$ contact --me`, `# replies within
   ~24h`, `gh / in / x`).

## 7. Later

1. **Breadcrumbs** — shared path-style component across `/work/[slug]` and
   `/writing/[slug]`.
2. Letters bot.
3. **Terminal v2** — tab completion · pipes · ANSI colour · aria session quota.
4. `.md` URLs for posts — more memorable, distinctive in SERPs.
