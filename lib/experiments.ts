export type Experiment = {
  slug: string;
  title: string;
  blurb: string;
  date: string;
  // Optional: point the card at an arbitrary route instead of the default
  // /experiments/<slug>. Used when the experiment lives in another section
  // (e.g. a writing post used as a layout trial).
  href?: string;
};

// Personal lab notebook — fuckups and discoveries.
// Add a new entry here, then drop a page at
// app/(site)/experiments/<slug>/page.tsx. Skip the page file if `href` points
// elsewhere.
export const EXPERIMENTS: Experiment[] = [
  {
    slug: "projects-showcase",
    title: "projects showcase",
    blurb:
      "Scrollytelling project cards with clip-path wipes, a sticky stage, and a title-settle into the nav.",
    date: "2026-05",
  },
  {
    slug: "projects-showcase-cinematic",
    title: "projects showcase — cinematic",
    blurb:
      "Wireframe port: terminal top-bar, atmospheric right-zone background, seam-bar rise between panels, and a title settle into the bar.",
    date: "2026-05",
  },
  {
    slug: "case-study-v2",
    title: "case study v2 — 65ch + breakout figures",
    blurb:
      "Trial layout: narrower reading column (≈65ch) with figures and code blocks breaking out wider, à la Notion / Substack.",
    date: "2026-05",
  },
  {
    slug: "writing-exploration",
    title: "writing exploration",
    blurb:
      "Reading-mode trial on a real post — header constrained to 63ch, scoped classes so tweaks don't leak to /writing.",
    date: "2026-05",
  },
];
