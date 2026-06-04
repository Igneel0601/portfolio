// ── EDIT-ME ─────────────────────────────────────────────────────────────────
// Single source of truth for IDENTITY copy. Clone this site → change everything
// here (+ lib/content.ts for projects/timeline, + swap public/<resume>.pdf, +
// set SITE_URL, + replace app/icon.svg). See docs/TEMPLATE.md.
//
// Socials/email live in lib/content.ts:CONTACT (not duplicated here).
// Terminal/Aria "fastfetch" flavor is intentionally NOT here — edit those files
// directly (see docs/TEMPLATE.md).

// Hero headline tokens: a plain word, an accent-highlighted word ({hilite}),
// or an italic-accent word ({em}). Consumed by SceneBoot + MobileBoot.
export type HeadlineToken = string | { hilite: string } | { em: string };
type HeadlineLines = readonly (readonly HeadlineToken[])[];

type Profile = {
  name: string;
  role: string; // display, lowercase (page titles, OG card)
  jobTitle: string; // schema.org Person.jobTitle (Title Case)
  brand: string; // nav / footer / OG display label (usually the domain)
  tagline: string; // plain one-liner
  taglineParts: { pre: string; accent: string; post: string }; // OG card 3-span line
  metaDescription: string; // <meta name="description"> / OG / twitter
  headlineDesktop: HeadlineLines;
  headlineMobile: HeadlineLines;
  subheadDesktop: string;
  subheadMobile: readonly string[]; // mobile splits across <br/>
  resumePath: string;
  writingFeed: { title: string; description: string }; // RSS channel
};

const NAME = "Vaibhav Verma";

// ── SINGLE SOURCE OF TRUTH for atomic personal facts ────────────────────────
// Every surface that states these (hero subhead, /about rail, /contact, SEO,
// terminal) derives from here — edit once, everything updates. Voice/prose
// (bio paragraphs, timeline blurbs, terminal flavor jokes) stays hand-written;
// this only holds the facts those surfaces must agree on.
export const FACTS = {
  age: "22",
  gradYear: "2026",
  gradYearShort: "26", // for "'26"
  degree: "B.Tech CSE",
  uni: "GBU",
  uniLong: "Gautam Buddha University",
  location: "Noida",
  tz: "UTC+5:30",
  editor: "VS Code",
  // primary languages/tools (the /about rail). Per-surface "stack" lists that
  // mean something different (e.g. "this site runs on") stay local.
  stack: ["Next.js", "Python", "Postgres", "Express"],
  focus: "DSA", // the current "now"
  availability: "open to work",
} as const;

// Composed display strings built from FACTS (so formats stay in sync too).
export const DEGREE_GRAD = `${FACTS.gradYear} ${FACTS.degree} grad`; // "2026 B.Tech CSE grad"
export const STUDY_LINE = `${FACTS.degree} '${FACTS.gradYearShort} · ${FACTS.uni}`; // "B.Tech CSE '26 · GBU"

export const PROFILE: Profile = {
  name: NAME,
  role: "software engineer",
  jobTitle: "Software Engineer",
  brand: "vergnyx.dev",

  tagline: "Still early. Still figuring it out. Shipping anyway.",
  // Split for the OG card's 3-span accented line (the OG JSX adds the spacing).
  taglineParts: {
    pre: "Still early. Still figuring it out.",
    accent: "Shipping anyway.",
    post: "",
  },

  metaDescription: `I build things and write about what I learn. ${DEGREE_GRAD}, ${FACTS.location}. ${FACTS.availability[0].toUpperCase()}${FACTS.availability.slice(1)}.`,

  headlineDesktop: [
    ["I'm", { hilite: "Vaibhav." }],
    ["Still", "early."],
    ["Still", "figuring", "it", "out."],
    [{ em: "Shipping" }, { em: "anyway." }],
  ],
  headlineMobile: [
    ["I'm", { hilite: "Vaibhav." }],
    ["Still", "early."],
    ["Still", "figuring", "it", "out."],
    [{ em: "Shipping" }, { em: "anyway." }],
  ],

  subheadDesktop: `${FACTS.degree} · ${FACTS.uniLong} · ${FACTS.location} · ${FACTS.availability}.`,
  subheadMobile: [`${FACTS.degree} · ${FACTS.uni} · ${FACTS.location}`, `${FACTS.availability}.`],

  resumePath: "/vaibhav_resume.pdf",

  writingFeed: {
    title: `${NAME} — Writing`,
    description: "Notes, essays, build logs.",
  },
};
