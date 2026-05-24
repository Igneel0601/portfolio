export type Experiment = {
  slug: string;
  title: string;
  blurb: string;
  date: string;
};

// Personal lab notebook — fuckups and discoveries.
// Add a new entry here, then drop a page at app/d/experiments/<slug>/page.tsx
// (and mirror it under app/m/experiments/<slug>/).
export const EXPERIMENTS: Experiment[] = [
  {
    slug: "projects-showcase",
    title: "projects showcase",
    blurb:
      "Scrollytelling project cards with clip-path wipes, a sticky stage, and a title-settle into the nav.",
    date: "2026-05",
  },
  {
    slug: "case-study-v2",
    title: "case study v2 — 65ch + breakout figures",
    blurb:
      "Trial layout: narrower reading column (≈65ch) with figures and code blocks breaking out wider, à la Notion / Substack.",
    date: "2026-05",
  },
];
