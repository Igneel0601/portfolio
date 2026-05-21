export type ProjectStats = {
  commits: number;
  branches: number;
  langs: string;
  team: string;
  deployed: string;
  url?: string;
  lastPush: string;
};

export type ProjectDetails = {
  what: string;
  why: string;
  how: string;
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
  details?: ProjectDetails;
};

export const PROJECTS: Project[] = [
  {
    id: "codeflow",
    index: "01",
    kind: "ai",
    name: "CodeFlow",
    blurb:
      "AI-powered website builder. Chat with agents in real-time E2B sandboxes and get a working Next.js app out the other side.",
    stack: ["next.js", "react", "tRPC", "prisma", "inngest", "e2b", "openai/gemini"],
    url: "code-flow-hazel.vercel.app",
    meta: "61 commits · solo",
    image: "/projects/codeflow.png",
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
    details: {
      what:
        "CodeFlow is an AI-powered development platform where you build a working web app by chatting with agents. You describe what you want, the agents generate and execute Next.js code inside a real E2B sandbox, and the result shows up in a split-pane live preview you can keep iterating on — file tree, message history, the works.",
      why:
        "Most AI builders either spit out static mockups or hand you a zip and wish you luck. Neither survives contact with real engineering. CodeFlow runs actual code in an actual sandbox, so the thing you see is the thing that works — and you can keep talking to it until it's right, instead of restarting from scratch every time you change your mind.",
      how:
        "Next.js + React + TypeScript on the frontend, Tailwind + Shadcn for the UI. tRPC fronts the agent calls; Inngest runs them as background jobs so a single message can take minutes without blocking the UI. Code generation and execution live inside E2B Code Interpreter sandboxes, with OpenAI and Gemini interchangeable as the underlying model. Prisma + Postgres back the persistence layer, Clerk handles auth, and there's usage tracking + Pro subscription for rate limiting.",
    },
  },
  {
    id: "taskforge",
    index: "02",
    kind: "realtime",
    name: "TaskForge",
    blurb:
      "Real-time Kanban with AI task elaboration. Liveblocks + Mongo, presence-aware boards that feel like Figma for tickets.",
    stack: ["next.js", "liveblocks", "mongodb", "tailwind", "nextauth"],
    meta: "shipped · live",
    image: "/projects/taskforge.png",
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
      "9d6e1f  chore: bump next",
    ],
    details: {
      what:
        "TaskForge is a real-time collaborative Kanban board — Trello meets Notion, with multiplayer baked in. Customizable boards and columns, drag-and-drop cards, threaded comments on each task, and Google OAuth so a whole team can sign in and start moving tickets around together within seconds of opening the dashboard.",
      why:
        "Most Kanban tools either feel slow and bureaucratic or quietly fall apart the moment more than one person opens the same board. I wanted presence to be a first-class citizen — you can literally see other cursors moving, cards getting dragged, and comments landing in real time — without giving up the persistence and structure of a proper task tracker you can actually run a sprint on.",
      how:
        "Next.js handles SSR and routing, Tailwind drives the UI, and the entire realtime layer rides on Liveblocks — it broadcasts board state, cursors, and edits to every connected client without me writing a single line of websocket code. NextAuth gates access via Google OAuth, and MongoDB persists boards, columns, cards, and comment threads. Drag-and-drop is wired straight into Liveblocks so reorderings sync instantly across every collaborator on the board.",
    },
  },
  {
    id: "traveloop",
    index: "03",
    kind: "experiments",
    name: "Traveloop",
    blurb:
      "Odoo Hackathon · The Knights · group build, shipped on the clock. Itinerary planner with collaborative edits.",
    stack: ["next.js", "react", "prisma", "postgres", "tailwind", "shadcn", "nextauth"],
    meta: "hackathon · group of 4",
    image: "/projects/traveloop.png",
    date: "2026-02",
    stats: {
      commits: 38,
      branches: 4,
      langs: "ts 72% · tsx 22% · css 6%",
      team: "group · 4",
      deployed: "vercel",
      lastPush: "2026-02-14",
    },
    gitLog: [
      "1b8c2d  feat: collaborative edits",
      "2a4f73  fix: itinerary diff merge",
      "6e9012  chore: ship-it readme",
    ],
    details: {
      what:
        "Traveloop is a full-stack travel-planning workspace built at the Odoo Hackathon by The Knights. It stitches multi-city itineraries, day-grouped activities, per-stop budgets with Recharts visualizations, packing checklists, markdown notes, and a community feed of shared trips into one integrated app you can run a whole vacation out of.",
      why:
        "Planning a trip usually means juggling a dozen browser tabs — one for the itinerary, one for budget math, one for restaurants, one for notes — and none of them talk to each other. We wanted a single workspace where the trip, the money, the gear list, and the journal all live in the same place, with the structure of a proper tool and the speed of something we'd actually open every day.",
      how:
        "Next.js with App Router and server components everywhere by default; client islands only where there's real interaction. All mutations are Server Actions sharing Zod schemas with React Hook Form, so the same validation runs on both sides. Prisma + PostgreSQL handle a 12-table schema (users, trips, stops, activities, expenses, packing items). NextAuth.js v5 with the credentials provider handles auth, gating the app route group at the layout level.",
    },
  },
];

export type NavLink = {
  label: string;
  href: string;
  kind: "scroll" | "route" | "mailto";
};

export const NAV_LINKS: NavLink[] = [
  { label: "work", href: "/work", kind: "route" },
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
