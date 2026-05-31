# Mobile project panels — integration

Approved direction **A (pure type)**. Three files of yours change. ~5 min.

## 1. New component
Add `MobileProjects.tsx` → `components/mobile/MobileProjects.tsx`.

## 2. Wire it into the home
In `components/mobile/MobileHome.tsx`, swap the old header + card loop:

```diff
- import { PROJECTS } from "@/lib/content";
  import { MobileTimeline } from "./MobileTimeline";
  import {
    BootBlock,
    CTASection,
    HeroSection,
-   ProjectCard,
-   SectionHeader,
  } from "./parts";
+ import { MobileProjects } from "./MobileProjects";

  export function MobileHome() {
    return (
      <>
        <div style={{ height: "120svh", position: "relative" }}>
          <div style={{ position: "sticky", top: 0 }}>
            <BootBlock />
            <HeroSection />
          </div>
        </div>
-       <SectionHeader eyebrow="$ ls ~/projects" title="three things I shipped." />
-       {PROJECTS.map((p) => (
-         <ProjectCard key={p.id} project={p} />
-       ))}
+       <MobileProjects />
        <MobileTimeline />
        <CTASection />
      </>
    );
  }
```
(`MobileProjects` imports `SectionHeader` from `./parts` itself, so the header still renders.)

## 3. Styles
- Paste `mobile-projects.css` into `app/mobile.css`.
- Delete the old `/* ── project card ── */` block (`.m-project-*` rules) from `app/mobile.css`.
- Delete the now-unused `ProjectCard` export from `components/mobile/parts.tsx` (and its `Image`/`Project` imports if nothing else uses them).

## Notes
- **Accent / insight / badge** live in a `PANEL_EXTRAS` map inside `MobileProjects.tsx`, keyed by project id — `content.ts` stays untouched. Edit copy there.
- **Name is uppercased in CSS** (`text-transform`), so the data stays `"CodeFlow"`.
- **No screenshots** — the case study owns all imagery, as agreed. `project.image` is simply unused on mobile now.
- **Foldables:** `.m-projects` is a capped (`34rem`), centred, `inline-size` container and the name is sized in `cqw`, so a Fold-open scales the name to the column, not the 840px viewport. For full consistency you may want the same cap on the mobile shell.
- **Untouched:** timeline, `/work`, `/writing`, and both `/[slug]` readers — exactly as scoped.

---

# /writing index — integration

Approved: richer header + editorial rows + 2-line dek clamp + category filter.

## 1. Component (now a client component)
Replace `components/mobile/MobileWriting.tsx` with the new version here.
`app/m/writing/page.tsx` stays as-is — it still does `getAllPosts()` on the
server and passes `posts` in; only the filter state moved client-side.

## 2. Styles
- Paste `mobile-writing.css` into `app/mobile.css`.
- Delete the old `/* ── writing row ── */` block (`.m-writing-row`, `.m-writing-date`, `.m-writing-title`, `.m-writing-meta`).
- Remove the now-unused `WritingRow` export from `components/mobile/parts.tsx`. (`PageHeader` is left intact — the new header is inlined to add the subtitle + status line, but `PageHeader` may still be used elsewhere.)

## What it does
- **Category chips derive from `posts`** — new categories appear automatically with correct counts, sorted by frequency, `all` pinned first. Zero upkeep as categories grow.
- **Overflow** scrolls horizontally with a right-edge mask; the active chip scrolls toward centre on tap (no `scrollIntoView`).
- **Dek** = `metaDescription`, clamped to 2 lines, hidden entirely when null.
- **Meta** = `readMinutes` + `wordCount` (already on `PostListItem`).
- **Foldables:** `.m-writing-list` is capped at `34rem`; prefer a single shell-level cap for whole-page consistency.

---

# /work index — integration

Approved: reflow the desktop table into status-led rows + tag filter + readable git log, plus a header that now mirrors `/writing` — eyebrow (`build log · YEAR`) + title + one-line dek + status line. Eyebrow says **"log," not "archive"** (the page tracks live status — some rows are `[active]` — so "archive" would be wrong). The dek, status line, and eyebrow are **intentional parity** — mirror the same copy on desktop `/work` so both trees match.

## 1. Component (now a client component)
Replace `components/mobile/MobileWorkLog.tsx` with the new version. The page passes an optional `lastCommit` string for the status line:

```tsx
const rows = await listWorkRows();
// last commit: newest case-study date, or your last deploy date — your call.
return <MobileWorkLog rows={rows} lastCommit="2026·05·12" />;
```

`entries` count is automatic (`rows.length`); the `· last commit …` segment only renders if you pass `lastCommit`. Leave it off and the line is just `$ ls /work · N entries`.

## 2. Styles
- Paste `mobile-work.css` into `app/mobile.css`.
- Delete the old `/* ── work page row ── */` block (`.m-work-row*`, `.m-work-name`, `.m-work-blurb`, `.m-work-tag`, `.m-work-status`).
- The git-log markup is now class-driven, so the inline-styled `<div>`s in the old `MobileWorkLog` are gone — no stray styles to clean.
- **Filter chips reuse `.m-wfilter` / `.m-chip`** from the `/writing` block — don't redefine them.
- Remove the now-unused `WorkPageRow` export from `components/mobile/parts.tsx`.

## What it does
- **Status-led rows:** mono name (accent if it links to a case study), `[status]` brackets kept (colour by status, `[dead]` struck through), serif blurb, tag eyebrow. `archived` / `dead` rows dimmed so live work pops.
- **Tag filter:** chips derive from `rows` (sorted by count, `all` pinned), active chip centres on tap. You said you'll add the matching filter to desktop later — parity restored upward.
- **Readable git log** with accent commit hashes + "full log on github ↗" (was 9px).
- **Blurb is roman serif** (not the `/writing` italic dek — different role).
- **Foldables:** `.m-worklist` + `.m-wklog` capped at `34rem`.


