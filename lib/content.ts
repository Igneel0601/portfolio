export type ProjectStats = {
  commits: number;
  branches: number;
  langs: string;
  team: string;
  deployed: string;
  url?: string;
  lastPush: string;
};

export type Project = {
  id: string;
  index: string;
  kind: string;
  name: string;
  blurb: string;
  stack: string[];
  url?: string;
  meta?: string;
  image: string;
  date: string;
  stats: ProjectStats;
  gitLog: string[];
};

export const PROJECTS: Project[] = [
  {
    id: "codeflow",
    index: "01",
    kind: "ai",
    name: "CodeFlow",
    blurb:
      "AI-powered website builder. Chat with agents in real-time E2B sandboxes and get a working Next.js app out the other side.",
    stack: ["next.js 16", "react 19", "tRPC", "prisma", "inngest", "e2b", "openai/gemini"],
    url: "code-flow-hazel.vercel.app",
    meta: "61 commits · solo",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1760&q=80",
    date: "2026-05",
    stats: {
      commits: 61,
      branches: 3,
      langs: "ts 78% · tsx 18% · sql 4%",
      team: "solo",
      deployed: "vercel",
      url: "code-flow-hazel.vercel.app",
      lastPush: "2026-05-12",
    },
    gitLog: [
      "a3f01b  feat: agent retry loops",
      "b2e8c4  fix: e2b sandbox timeout",
      "c1d9f7  chore: prisma migrate",
    ],
  },
  {
    id: "taskforge",
    index: "02",
    kind: "realtime",
    name: "TaskForge",
    blurb:
      "Real-time Kanban with AI task elaboration. Liveblocks + Mongo, presence-aware boards that feel like Figma for tickets.",
    stack: ["next.js", "liveblocks", "mongodb", "tailwind", "openai"],
    meta: "shipped · live",
    image:
      "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=1760&q=80",
    date: "2025-11",
    stats: {
      commits: 21,
      branches: 2,
      langs: "ts 82% · tsx 14% · css 4%",
      team: "duo",
      deployed: "vercel",
      lastPush: "2025-11-03",
    },
    gitLog: [
      "4f12aa  feat: presence avatars",
      "7e3b9c  fix: liveblocks reconnect",
      "9d6e1f  chore: bump next 16",
    ],
  },
  {
    id: "traveloop",
    index: "03",
    kind: "experiments",
    name: "Traveloop",
    blurb:
      "Odoo Hackathon · The Knights · group build, shipped on the clock. Itinerary planner with collaborative edits.",
    stack: ["react", "node", "postgres", "tailwind"],
    meta: "hackathon · group of 4",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1760&q=80",
    date: "2026-02",
    stats: {
      commits: 38,
      branches: 4,
      langs: "js 64% · jsx 26% · css 10%",
      team: "group · 4",
      deployed: "firebase",
      lastPush: "2026-02-14",
    },
    gitLog: [
      "1b8c2d  feat: collaborative edits",
      "2a4f73  fix: itinerary diff merge",
      "6e9012  chore: ship-it readme",
    ],
  },
];

export type NavLink = {
  label: string;
  href: string;
  kind: "scroll" | "route" | "mailto";
};

export const NAV_LINKS: NavLink[] = [
  { label: "work", href: "#work", kind: "scroll" },
  { label: "writing", href: "/writing", kind: "route" },
  { label: "experiments", href: "/experiments", kind: "route" },
  { label: "about", href: "#about", kind: "scroll" },
  { label: "/now", href: "/now", kind: "route" },
  { label: "/uses", href: "/uses", kind: "route" },
  { label: "hi@igneel.dev", href: "mailto:hi@igneel.dev", kind: "mailto" },
];

export type TimelineStop = {
  when: string;
  title: string;
  blurb: string;
  isNow?: boolean;
};

export const TIMELINE: TimelineStop[] = [
  { when: "2022", title: "started at GBU", blurb: "First lecture, first 'wait, I love this' moment." },
  { when: "2023", title: "exploring options", blurb: "Half-finished side projects, late-night tutorials." },
  { when: "2024", title: "Web Developer Bootcamp", blurb: "HTML → JS → React. Built the muscle memory." },
  { when: "2024", title: "switched to Arch full-time", blurb: "arch-install scripts · ricing era · broke X11 a lot." },
  { when: "2025", title: "wall-engine on Hyprland", blurb: "First OSS project to land stars (3★ / 1 fork)." },
  { when: "2025", title: "TaskForge ships", blurb: "Real-time kanban · Liveblocks + Mongo." },
  { when: "2026", title: "CodeFlow goes live", blurb: "AI app builder · E2B sandboxes · 61 commits." },
  { when: "2026", title: "Odoo Hackathon — Traveloop", blurb: "Group build, weekend deadline, shipped." },
  { when: "NOW", title: "just shipped a degree.", blurb: "GBU · B.Tech CSE · looking for what's next.", isNow: true },
];

// per-timeline-stop log entries — swap into the right rail as scroll progresses.
// keys match TIMELINE index (0..N-1). 3-5 short lines per era, dev-journal vibe.
export const LOGS: string[][] = [
  // 0 · 2022 · started at GBU
  [
    "$ git init ~/career",
    "stack: html · css · vanilla-js",
    "wm: vscode default theme",
    "vibe: first lecture clicked",
  ],
  // 1 · 2023 · exploring options
  [
    "$ ls side-projects/ | wc -l",
    "11",
    "stack: react (badly) · firebase",
    "tabs open: 47",
  ],
  // 2 · 2024 · Web Developer Bootcamp
  [
    "$ tail -f bootcamp.log",
    "stack: html → js → react",
    "tutorials watched: too many",
    "muscle memory: forming",
  ],
  // 3 · 2024 · switched to Arch full-time
  [
    "$ pacman -Syu",
    "os: ubuntu → arch",
    "wm: gnome → hyprland",
    "broken: X11, twice",
  ],
  // 4 · 2025 · wall-engine on Hyprland
  [
    "$ touch wall-engine/README.md",
    "stack: shell · sddm hooks",
    "stars: 3 · forks: 1",
    "obsessing: wallpaper transitions",
  ],
  // 5 · 2025 · TaskForge ships
  [
    "$ vercel deploy --prod",
    "stack: next.js · liveblocks · mongo",
    "presence: real-time",
    "users: a handful, but real",
  ],
  // 6 · 2026 · CodeFlow goes live
  [
    "$ git log --oneline | wc -l",
    "61",
    "stack: next 16 · trpc · inngest · e2b",
    "agent loops: too many to count",
  ],
  // 7 · 2026 · Odoo Hackathon — Traveloop
  [
    "$ npm run build  # 3am",
    "team: The Knights · 4 devs",
    "stack: react · firebase",
    "shipped: under the deadline",
  ],
  // 8 · NOW · just shipped a degree
  [
    "$ whoami",
    "vaibhav · gbu · b.tech cse",
    "looking: full-time · freelance",
    "off-keyboard: arch ricing, sci-fi, filter coffee",
  ],
];

export type FutureModule = {
  label: string;
  blurb: string;
  route: string;
};

export const FUTURE: FutureModule[] = [
  { label: "experiments", blurb: "tiny demos, shaders, half-finished ideas", route: "/experiments" },
  { label: "writing", blurb: "notes from building in public", route: "/writing" },
  { label: "/now", blurb: "what I'm doing this month", route: "/now" },
  { label: "/dev/letters", blurb: "one email a month, no spam", route: "/letters" },
];

export type WorkLogRow = {
  status: "ok" | "wip";
  tag: string;
  name: string;
  blurb: string;
  stack: string;
  year: string;
  notes: string;
};

export const WORK_LOG_ROWS: WorkLogRow[] = [
  { status: "ok",  tag: "flagship",  name: "codeflow",     blurb: "An AI-powered website builder.",          stack: "TS · Next 16 · tRPC · Inngest",      year: "2026", notes: "61" },
  { status: "ok",  tag: "collab",    name: "taskforge",    blurb: "Real-time kanban + AI task elaboration.", stack: "TS · Next · Liveblocks · Mongo",     year: "2025", notes: "21" },
  { status: "ok",  tag: "hackathon", name: "traveloop",    blurb: "Trip planner — Odoo Hackathon.",          stack: "React · Firebase",                    year: "2026", notes: "group" },
  { status: "ok",  tag: "oss",       name: "wall-engine",  blurb: "Dynamic wallpaper switcher for Hyprland.",stack: "Shell · SDDM",                        year: "2025", notes: "3★ 1 fork" },
  { status: "ok",  tag: "dotfiles",  name: "arch-install", blurb: "My Arch setup, scripted top-to-bottom.",  stack: "Shell · Linux",                       year: "2024", notes: "—" },
  { status: "wip", tag: "next",      name: "…",            blurb: "writing the README first.",                stack: "tbd",                                 year: "2026", notes: "early" },
];

export const WORK_FILTERS = ["all", "flagship", "oss", "hackathon", "collab", "dotfiles", "wip"] as const;

export const GIT_LOG_PREVIEW: string[] = [
  "a3f01b2 · docs(traveloop): wrote case study draft",
  "7c01d8a · feat(codeflow): add gemini provider",
  "1e7f9d4 · chore(arch-install): split out wm setup",
];

export const CONTACT = {
  email: "hi@igneel.dev",
  github: "https://github.com/Igneel0601",
  linkedin: "https://www.linkedin.com/in/",
  x: "https://x.com/",
};

export const BOOT_LINES: { prompt: string; text: string }[] = [
  { prompt: "$", text: "./hello.sh" },
  { prompt: "",  text: "[boot] mounting portfolio…" },
  { prompt: "",  text: "[boot] loading vaibhav.profile…" },
  { prompt: "",  text: "[ ok ] ready in 0.42s" },
];

export const BOOT_PROMPT_FULL = "$ ./hello.sh";
