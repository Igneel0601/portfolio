# TODO — roadmap

Forward-looking only. Shipped work lives in git history; this file is just
what's left. Roughly ordered by leverage: distribution + content first, then
SEO polish, template, infra, testing, and the long tail.

Context: live on **vergnyx.dev** (fresh domain, ~zero authority). Homepage is
indexed; the bottleneck is **authority — backlinks (§2c) are the #1 lever.**

---

## 1. Content (highest on-site impact)

1. **Keep publishing posts.** ~10 live via Bloggz; SEO rewards cadence. The gap is
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
1. **Canonical for `/experiments`, `/terminal`** — low priority (sandbox/utility).

### 2b. Writing posts
1. **`article:published_time` + `article:author`** in `openGraph` — not set.
2. **Internal linking** — every post should link to ≥2 posts and ≥1 case study
   (only "Similar reads" does this today).
3. **Image alt-text audit** — verify Lexical media nodes carry `alt` from Bloggz.

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

## 5. Testing

The suite (Vitest + `pnpm check` + husky; Playwright smoke/visual; CI
`ci.yml`/`e2e.yml`) is live and **green** — e2e reaches the protected
Vercel previews via the automation-bypass header, and visual is now
**blocking** (no more `continue-on-error`). Open follow-ups:

1. **(optional) Add `GH_READ_TOKEN` repo secret** — `DATABASE_URI` is set (CI
   `build` now static-gens `/writing/[slug]`); the token only enriches the
   `/work` git-log footer with live GitHub commits (falls back without it).
2. **Broaden coverage as features land** — new `lib/*` logic gets a Vitest test;
   new routes get a smoke check + visual baseline.

## 6. Nice-to-have

1. `resolveMediaUrl` — handle protocol-relative URLs (`//host/x.png`) if Bloggz
   ever emits one (a Vitest case is already stubbed for it).
2. Fullscreen "not supported" feedback in the terminal (silent success today).
3. Rewrite SceneCTA copy in terminal grammar (`$ contact --me`, `# replies within
   ~24h`, `gh / in / x`).

## 7. Later

1. **`ProjectImage` — use or delete.** Dead component (no consumers); a 16:9
   `next/image` wrapper. Projects have `image` assets (`public/projects/*.png`)
   shown only in the `/experiments` sandbox. Either wire thumbnails into the
   live `/work`/home (a tonal shift from the text-forward design — needs intent
   + new visual baselines) or delete the component. Deferred.
2. Letters bot.
3. **Terminal v2** — tab completion · pipes · ANSI colour · aria session quota.
4. `.md` URLs for posts — more memorable, distinctive in SERPs.
