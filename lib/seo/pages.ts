// Per-page SEO config — single source of truth for static route metadata.
// Both the /d and /m shells read the same entry, so the two can't drift.
// `home` intentionally omits title/description so it keeps inheriting the root
// layout's defaults. ISR `revalidate` stays a per-page segment export (Next
// reads it directly), not here.

export type PageSeo = {
  path: string;
  title?: string;
  description?: string;
  rss?: boolean;
};

export const PAGE_SEO = {
  home: { path: "/", rss: true },
  work: {
    path: "/work",
    title: "All projects — Vaibhav Verma",
    description: "Full build log of every project I've shipped.",
  },
  writing: {
    path: "/writing",
    title: "Writing — Vaibhav Verma",
    description: "Notes, essays, build logs.",
    rss: true,
  },
  terminal: {
    path: "/terminal",
    title: "terminal — Vaibhav Verma",
    description: "A real shell in your browser. Try `help`.",
  },
  experiments: {
    path: "/experiments",
    title: "Experiments — Vaibhav Verma",
    description: "Lab notebook. Fuckups and discoveries.",
  },
} satisfies Record<string, PageSeo>;

export type PageKey = keyof typeof PAGE_SEO;
