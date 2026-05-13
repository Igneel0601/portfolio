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
};

export const PROJECTS: Project[] = [
  {
    id: "codeflow",
    index: "01",
    kind: "FEATURED",
    name: "CodeFlow",
    blurb:
      "AI-powered website builder. Chat with agents in real-time E2B sandboxes and get a working Next.js app out the other side.",
    stack: [
      "next.js 16",
      "react 19",
      "tRPC",
      "prisma",
      "inngest",
      "e2b",
      "openai/gemini",
    ],
    url: "code-flow-hazel.vercel.app",
    meta: "61 commits · solo",
    // Unsplash — abstract code/terminal aesthetic
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "taskforge",
    index: "02",
    kind: "COLLABORATION",
    name: "TaskForge",
    blurb:
      "Real-time Kanban with AI task elaboration. Liveblocks + Mongo, presence-aware boards that feel like Figma for tickets.",
    stack: ["next.js", "liveblocks", "mongodb", "tailwind", "openai"],
    meta: "shipped · live",
    image:
      "https://images.unsplash.com/photo-1611224885990-ab7363d7f2a9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "traveloop",
    index: "03",
    kind: "HACKATHON",
    name: "Traveloop",
    blurb:
      "Odoo Hackathon · The Knights · group build, shipped on the clock. Itinerary planner with collaborative edits.",
    stack: ["react", "node", "postgres", "tailwind"],
    meta: "hackathon · group of 4",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
  },
];

export const SKILLS = [
  "typescript",
  "next.js",
  "react",
  "node",
  "python",
  "postgres",
  "mongo",
  "tailwind",
  "prisma",
  "inngest",
  "aws",
];

export const ABOUT = {
  heading: "The short version.",
  body: "CSE grad from Gautam Buddha University, based in Noida. I like the part of software where you stop reading docs and start figuring out why production is on fire. Currently looking for a first full-time role — also taking freelance.",
  code: [
    ["const", "vaibhav = {"],
    ["  name:", `"Vaibhav Verma",`],
    ["  role:", `"software engineer",`],
    ["  based:", `"Noida, IN",`],
    ["  open_to:", `["full-time", "freelance"],`],
    ["  currently:", `"shipping ai tooling",`],
    ["  coffee:", `"more than is reasonable"`],
    ["", "};"],
  ] as const,
};

export const FUTURE = [
  { h: "experiments", s: "tiny demos, shaders, half-finished ideas" },
  { h: "writing", s: "notes from building in public" },
  { h: "/dev/letters", s: "one email a month — what I built, what I broke" },
];

// TODO: confirm real handles before launch
export const CONTACT = {
  email: "hi@igneel.dev",
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/in/",
  x: "https://x.com/",
};

export const BOOT_LINES = [
  { prompt: "$", text: "./hello.sh" },
  { prompt: "", text: "[boot] mounting portfolio…" },
  { prompt: "", text: "[boot] loading vaibhav.profile…" },
  { prompt: "", text: "[ ok ] ready in 0.42s" },
];
