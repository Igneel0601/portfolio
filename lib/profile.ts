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

export const PROFILE: Profile = {
  name: "Vaibhav Verma",
  role: "software engineer",
  jobTitle: "Software Engineer",
  brand: "vergnyx.dev",

  tagline: "I build software that teaches itself to write more software.",
  // Split for the OG card's 3-span accented line (the OG JSX adds the spacing).
  taglineParts: {
    pre: "I build software that",
    accent: "teaches itself",
    post: "to write more software.",
  },

  metaDescription:
    "I build software that teaches itself to write more software. CSE grad, Noida. Open to full-time + freelance.",

  headlineDesktop: [
    ["I'm", { hilite: "Vaibhav." }],
    ["I", "build", "software"],
    ["that", { em: "teaches" }, { em: "itself" }],
    ["to", "write", "more", "software."],
  ],
  headlineMobile: [
    ["I'm", { hilite: "Vaibhav." }],
    ["I", "build", "software"],
    ["that", { em: "teaches itself" }],
    ["to", "write", "more"],
    ["software."],
  ],

  subheadDesktop:
    "B.Tech CSE · Gautam Buddha University · Noida · open to full-time + freelance.",
  subheadMobile: ["B.Tech CSE · GBU · Noida", "open to full-time + freelance."],

  resumePath: "/vaibhav_resume.pdf",

  writingFeed: {
    title: "Vaibhav Verma — Writing",
    description: "Notes, essays, build logs.",
  },
};
