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

The identity/personal pages (`/about`, `/now`, `/uses`, `/contact`) are now
built — both shells, metadata in `lib/seo/pages.ts`, and committed visual
baselines — all sourced from `lib/profile.ts`. Any *future* content route still
needs the same: metadata (both shells) + visual baselines (§5).

## 2. SEO

### 2a. On-page (mostly done — remaining)
1. **Canonical for `/experiments`, `/terminal`** — low priority (sandbox/utility).

### 2b. Writing posts
1. **Internal linking** — every post should link to ≥2 posts and ≥1 case study
   (only "Similar reads" does this today).
2. **Fill image alt in Bloggz (content).** Audited 2026-06-03: the render path
   carries `alt` correctly (DB → `mapMedia` → `expandUploads` → `<Image>`), but
   all 3 media rows have empty/null `alt`, so they render `alt=""`. Add
   descriptive alt to media #3/#4/#5 in the Bloggz admin — no code change.

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

1. **Verify `/contact` email delivery end-to-end.** The form POSTs to
   `app/api/contact` → Resend (`from` = `RESEND_EMAIL`, `to` = `CONTACT.email`
   → routes to Gmail). Not yet confirmed to actually land. To verify: ensure
   `RESEND_API_KEY` + `RESEND_EMAIL` have real values in `.env.local`, **restart
   the dev server** (env loads at boot), submit a test message, confirm it
   arrives. Then add both to **Vercel env** for production and test the live form.
2. **Persistent rate limit on `/api/aria`** — Upstash free tier; the current
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

The broaden-coverage policy lives in AGENTS.md now.

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
