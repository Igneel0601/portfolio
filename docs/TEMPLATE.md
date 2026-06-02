# Make this portfolio yours

Cloned this repo? Here's everything to change — in rough order. You shouldn't
need to touch layout/components for a basic rebrand.

## 1. Identity → `lib/profile.ts`
The single source of truth for *who you are*. Edit:
- `name`, `role`, `jobTitle`, `brand` (the domain label shown in the nav/footer)
- `tagline` + `taglineParts` (the OG share card's accented line)
- `metaDescription` (the `<meta description>`)
- `headlineDesktop` / `headlineMobile` — the hero headline. Tokens: a plain
  word, `{ hilite: "…" }` (accent-highlighted), or `{ em: "…" }` (italic accent).
- `subheadDesktop` / `subheadMobile`, `resumePath`, `writingFeed`

This drives the layout metadata, OG card, hero, footers, nav brand, JSON-LD,
RSS, and page titles automatically.

## 2. Your work → `lib/content.ts`
- `PROJECTS` — your projects (also feeds `/work/<slug>` case studies)
- `TIMELINE` + `LOGS` — the scrollytelling timeline (LOGS index-matched to TIMELINE)
- `NAV_LINKS` — nav items
- `CONTACT` — `email`, `github`, `linkedin`, `x`
- `GIT_LOG_PREVIEW`, `BOOT_LINES` — terminal/boot flavor

## 3. Case studies → `content/case-studies/<slug>.mdx`
One MDX file per case study (frontmatter: `title`, `tagline`, `order`).
Walkthrough images: `public/case-studies/<slug>/NN-name.png` (16:9).

## 4. Posts (blog) → external Bloggz CMS
Posts come from the Bloggz API at runtime (`lib/posts.ts`), not files.

## 5. Assets
- **Résumé:** drop your PDF in `public/`, set `profile.resumePath`.
- **Logo/favicon:** replace `app/icon.svg` + `app/apple-icon.png`.
- **Brand colour:** `--accent` (and `--accent-2/3`) in `app/tokens.css`.

## 6. Domain
Set `SITE_URL` env in Vercel (and `.env` locally) to your URL. Everything
canonical/sitemap/OG/RSS reads from it. Update `profile.brand` to match.

## 7. Terminal & AI flavor (optional — hand-edit, it's prose)
Intentionally NOT in `profile.ts` (it's joke-laden personality you'll rewrite):
- `components/terminal/Terminal.tsx` — the fastfetch rows (CPU "caffeine-boosted", etc.)
- `lib/terminal/fs.ts` — the `/about`, `/now`, `/uses` markdown + vCard
- `lib/terminal/commands.ts` — `whoami`, `uname`, `hire-me`
- `app/api/aria/route.ts` — the Aria assistant's persona/system prompt

## Verify
`npx tsc --noEmit`, `pnpm lint`, then `pnpm dev` and click around. The OG card
renders at `/opengraph-image`.
