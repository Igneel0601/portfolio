// Per-page SEO config — single source of truth for static route metadata.
// Both the /d and /m shells read the same entry, so the two can't drift.
// `home` intentionally omits a title so it keeps inheriting the root layout's.
// `titleLabel` is composed as `${titleLabel} — ${PROFILE.name}` in the builder.
// ISR `revalidate` stays a per-page segment export (Next reads it directly).

export type PageSeo = {
  path: string;
  titleLabel?: string;
  description?: string;
  rss?: boolean;
};

export const PAGE_SEO = {
  home: { path: "/", rss: true },
  work: {
    path: "/work",
    titleLabel: "All projects",
    description: "Full build log of every project I've shipped.",
  },
  writing: {
    path: "/writing",
    titleLabel: "Writing",
    description: "Notes, essays, build logs.",
    rss: true,
  },
  terminal: {
    path: "/terminal",
    titleLabel: "terminal",
    description: "A real shell in your browser. Try `help`.",
  },
  experiments: {
    path: "/experiments",
    titleLabel: "Experiments",
    description: "Lab notebook. Fuckups and discoveries.",
  },
  about: {
    path: "/about",
    titleLabel: "about",
    description:
      "Vaibhav Verma — SWE and CS undergrad in Noida. The long version of the one-line bio.",
  },
  now: {
    path: "/now",
    titleLabel: "now",
    description: "What I'm working on, learning, and reading right now.",
  },
  uses: {
    path: "/uses",
    titleLabel: "uses",
    description: "The hardware, editor, and software I actually reach for.",
  },
  contact: {
    path: "/contact",
    titleLabel: "contact",
    description: "The fastest ways to reach Vaibhav Verma — email and socials.",
  },
} satisfies Record<string, PageSeo>;

export type PageKey = keyof typeof PAGE_SEO;
