import { FACTS, STUDY_LINE } from "./profile";

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
  // Home showcase (ProjectsShowcaseCinematic):
  tagline: string; // the italic "what" line
  insight: string; // the "how" body — `*word*` = accent highlight, `\n` = line break
  status: string; // badge label, e.g. "live · v0.4"
  tint: "a" | "s" | "e"; // accent / accent-2 / accent-3 (also the badge dot colour)
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
    tagline:
      "Chat with agents, get a working Next.js app running inside a real E2B sandbox.",
    insight:
      "*Inngest* runs each agent step as a durable background job —\nlong chains never freeze the UI or time out mid-stream.\n*E2B sandboxes* run the output.",
    status: "live · v0.4",
    tint: "a",
    blurb:
      "AI-powered website builder. Chat with agents in real-time E2B sandboxes and get a working Next.js app out the other side.",
    stack: ["next.js", "trpc", "prisma", "inngest", "e2b", "openai", "clerk"],
    url: "code-flow-hazel.vercel.app",
    meta: "product · solo",
    image: "/projects/codeflow.png",
    date: "Feb → May 2026",
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
        "Chat with agents, get a working Next.js app. They generate and execute code inside a real E2B sandbox, and the result lands in a split-pane live preview you can keep iterating on.",
      why:
        "Most AI builders spit out static mockups or hand you a zip. CodeFlow runs actual code in an actual sandbox, so what you see is what works — and you can keep talking to it until it's right.",
      how:
        "Next.js + Tailwind on the front. tRPC fronts agent calls; Inngest runs them as background jobs so long generations don't block the UI. E2B sandboxes execute the code; OpenAI/Gemini are interchangeable models. Prisma + Postgres for persistence, Clerk for auth.",
    },
  },
  {
    id: "taskforge",
    index: "02",
    kind: "realtime",
    name: "TaskForge",
    tagline:
      "Real-time collaborative kanban — live cursors, live drags, comments landing now, not eventually.",
    insight:
      "*Liveblocks* runs the entire real-time layer:\npresence, shared storage, conflict resolution — zero websocket code.\nDrag a card — your collaborator sees it move *before you let go*.",
    status: "shipped · live",
    tint: "s",
    blurb:
      "Real-time Kanban with AI task elaboration. Liveblocks + Mongo, presence-aware boards that feel like Figma for tickets.",
    stack: ["next.js", "liveblocks", "mongodb", "tailwind", "nextauth"],
    meta: "product · duo",
    image: "/projects/taskforge.png",
    date: "Sep → Nov 2025",
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
        "Real-time collaborative Kanban — Trello meets Notion with multiplayer baked in. Customizable boards, drag-and-drop cards, threaded comments, Google OAuth, and a whole team moving tickets around in seconds.",
      why:
        "Most Kanban tools feel slow or quietly fall apart once two people open the same board. I wanted presence as a first-class citizen — live cursors, live drags, comments landing in real time — without losing the structure of a real sprint tracker.",
      how:
        "Next.js + Tailwind for the shell. Liveblocks runs the entire realtime layer — board state, cursors, edits — so I never wrote a line of websocket code. NextAuth + Google OAuth for access, MongoDB for persistence. Drag-and-drop wires straight into Liveblocks.",
    },
  },
  {
    id: "traveloop",
    index: "03",
    kind: "hackathon",
    name: "Traveloop",
    tagline:
      "Multi-city itineraries, budgets, packing — shipped at 4am, demoed at 9. We got second.",
    insight:
      "Trips → stops → days → activities → budgets:\nthe *nested document model* maps the domain perfectly.\nFour people. One weekend. One real, working, demoed app.",
    status: "2nd place",
    tint: "e",
    blurb:
      "Odoo Hackathon · The Knights · group build, shipped on the clock. Itinerary planner with collaborative edits.",
    stack: ["next.js", "prisma", "postgres", "tailwind", "neondb"],
    meta: "event · team of 4",
    image: "/projects/traveloop.png",
    date: "Odoo Hackathon",
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
        "Full-stack travel-planning workspace from the Odoo Hackathon. Multi-city itineraries, day-grouped activities, per-stop budgets with Recharts, packing checklists, markdown notes, and a community feed of shared trips — all in one app.",
      why:
        "Planning a trip usually means a dozen disconnected tabs: itinerary, budget, restaurants, notes. We wanted one workspace where the trip, the money, the gear list, and the journal live together — fast enough to open every day.",
      how:
        "Next.js App Router with server components by default, client islands only where needed. Server Actions share Zod schemas with React Hook Form so the same validation runs on both sides. Prisma + Postgres back a 12-table schema; NextAuth v5 gates the app at the layout level.",
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
  { label: "terminal", href: "/terminal", kind: "route" },
  { label: "/about", href: "/about", kind: "route" },
  { label: "/now", href: "/now", kind: "route" },
  { label: "/uses", href: "/uses", kind: "route" },
  { label: "contact me", href: "/contact", kind: "route" },
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
  email: "hi@vergnyx.dev",
  github: "https://github.com/Igneel0601",
  linkedin: "https://www.linkedin.com/in/",
  x: "https://x.com/",
};

// ── /about ── narrative bio page. Edit the copy here; the page renders it.
export const ABOUT = {
  eyebrow: "Profile · /about",
  lede: "The long version of a one-line bio nobody reads.",
  // the `$ whoami` command-line facts (joined by · separators)
  whoami: ["vaibhav", STUDY_LINE.toLowerCase(), `uptime: ${FACTS.age}y, mostly stable`],
  // narrative paragraphs — plain prose, edit freely
  bio: [
    "I'm Vaibhav — a 2026 CS grad, still early in all this and not pretending otherwise.",
    "I learn by building things and then writing about them — usually the parts I got wrong. Most of it is full-stack apps and developer tools, with the odd AI experiment thrown in.",
    "Right now I'm heads-down on DSA, hoping it lands me a first role where I get to build for real.",
    "Off the screen I'm on Linux, somewhere in an anime, or pretending my reading list is under control. I keep notes so I stop re-learning the same things — some end up on the writing log.",
  ],
  sign: `${FACTS.availability[0].toUpperCase()}${FACTS.availability.slice(1)}.`,
  // mono fact rail (key → value) — atomic facts come from FACTS (lib/profile.ts)
  rail: [
    { k: "whoami", v: "Vaibhav Verma" },
    { k: "role", v: `SWE · ${FACTS.gradYear} grad` },
    { k: "tz", v: FACTS.tz },
    { k: "study", v: STUDY_LINE },
    { k: "stack", v: FACTS.stack.join(", ") },
    { k: "editor", v: FACTS.editor },
    { k: "now", v: FACTS.focus },
    { k: "status", v: FACTS.availability },
  ],
  quote: "writing the README first this time.",
} as const;

// ── /now ── snapshot of current focus. Bump `updated` when you edit.
export const NOW = {
  eyebrow: "Snapshot · /now",
  lede: "What I'm actually doing — not what I wish I were.",
  updated: "2026-06-04",
  staleInDays: 27,
  // status board cards (the live local-time card is rendered separately)
  board: [
    { k: "focus", v: "DSA", sub: "heads-down on fundamentals" },
    { k: "mode", v: "heads-down", sub: "fewer tabs, more commits" },
    { k: "status", v: FACTS.availability, sub: "full-time + freelance", accent: true },
  ],
  log: [
    {
      cat: "building",
      entries: [
        { line: "This portfolio. Always one more gap to close.", meta: "" },
      ],
    },
    {
      cat: "learning",
      entries: [
        { line: "DSA — grinding the classics, arrays to graphs. Same problems, fewer excuses.", meta: "" },
      ],
    },
    {
      cat: "reading",
      entries: [
        { line: "KonoSuba — the light novels. Comedy isekai; the palate cleanser between problem sets.", meta: "" },
      ],
    },
    {
      cat: "life",
      entries: [
        { line: "Earning peanuts. Trying for almonds.", meta: "" },
      ],
    },
  ],
  note: "This page is a snapshot on purpose. It is already a little bit wrong.",
} as const;

// ── /uses ── categorized gear. Edit/correct here; the page renders it.
export const USES = {
  eyebrow: "Setup · /uses",
  lede: "The desk, the keys, the dotfiles. Updated when something breaks.",
  cats: [
    {
      key: "editor",
      label: "editor & terminal",
      rows: [
        { name: "VS Code", note: "My whole personality, one extension at a time.", meta: "daily" },
        { name: "Kitty", note: "GPU terminal. With great frame rate comes great responsibility.", meta: "daily" },
        { name: "zsh", note: "The shell that does the thinking so I don't have to.", meta: "" },
        { name: "Oh My Zsh", note: "Plugins I'll never read, aliases I can't live without.", meta: "" },
      ],
    },
    {
      key: "machine",
      label: "machine",
      rows: [
        { name: "Vivobook Pro 14X OLED", note: "ASUS. The OLED is for the blacks and the bragging.", meta: "primary" },
        { name: "Arch Linux", note: "btw. It was non-negotiable.", meta: "since '23" },
        { name: "Hyprland", note: "Tiling WM. Animated, fast, occasionally on fire.", meta: "" },
        { name: "16 GB RAM", note: "Rationed across the 200 Chrome tabs I refuse to close.", meta: "" },
        { name: "RTX 3050", note: "Modest power. Still, you know the rest.", meta: "" },
      ],
    },
    {
      key: "desk",
      label: "desk & peripherals",
      rows: [
        { name: "BlackWidow V4", note: "Razer. Loud enough that the neighbours know I'm shipping.", meta: "daily" },
        { name: "Basilisk V3 Pro", note: "Razer. Spidey-sense for the cursor, basically.", meta: "daily" },
        { name: '24" 1080p', note: "One screen. Two virtual desktops too many.", meta: "" },
        { name: "WH-1000XM5", note: "Sony. Tunes out the city that never sleeps.", meta: "daily" },
        { name: "iPad Pro M2", note: "For sketching, reading, and pretending it's not a toy.", meta: "" },
      ],
    },
    {
      key: "software",
      label: "software",
      rows: [
        { name: "Claude Design", note: "Design partner. Talks me out of bad ideas, mostly.", meta: "daily" },
        { name: "Figma", note: "Where the design dies peacefully before the code does.", meta: "" },
        { name: "Spotify", note: "Instrumental only, so the words don't compete with mine.", meta: "daily" },
        { name: "Claude Code", note: "Pair programmer that never asks whose turn it is.", meta: "daily" },
        { name: "Notion", note: "Second brain. Also the first place I lose things.", meta: "" },
        { name: "Procreate", note: "iPad sketches nobody asked for.", meta: "" },
        { name: "SVGator", note: "Animating the vectors so they earn their keep.", meta: "" },
      ],
    },
    {
      key: "web",
      label: "this site runs on",
      rows: [
        { name: "Next.js", note: "Static wherever it can get away with it.", meta: "" },
        { name: "Tailwind", note: "Utility classes and zero regrets.", meta: "" },
        { name: "TypeScript", note: "Strict mode. No exceptions — literally none.", meta: "" },
        { name: "Vercel", note: "git push, hope, refresh.", meta: "" },
        { name: "Postgres", note: "Where the words live when they're not on screen.", meta: "" },
      ],
    },
  ],
} as const;

// ── /contact ── direct-links page (no form; links come from CONTACT above).
export const CONTACT_PAGE = {
  eyebrow: "Say hi · /contact",
  lede: "The fastest ways to reach me.",
  availability: { title: FACTS.availability, sub: "freelance too" },
  meta: [
    { k: "based", v: `${FACTS.location} · ${FACTS.tz}` },
    { k: "hours", v: "10:00–17:00, loosely" },
    { k: "reply", v: "~1 business day" },
  ],
  ps: "Not sure what to say? Skim /now first — it's a decent conversation starter.",
} as const;

export const BOOT_LINES: { prompt: string; text: string }[] = [
  { prompt: "$", text: "./hello.sh" },
  { prompt: "",  text: "[boot] mounting portfolio…" },
  { prompt: "",  text: "[boot] loading vaibhav.profile…" },
  { prompt: "",  text: "[ ok ] ready in 0.42s" },
];

export const BOOT_PROMPT_FULL = "$ ./hello.sh";
