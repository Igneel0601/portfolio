import { CONTACT, GIT_LOG_PREVIEW } from "@/lib/content";

// GitHub handle, derived from CONTACT.github so a clone only edits one place.
const GH_USER =
  CONTACT.github.replace(/\/+$/, "").split("/").pop() || "Igneel0601";

const API = "https://api.github.com";
const REVALIDATE = 3600; // 1 cached call/hr/endpoint — well under the 60/hr anon limit
const MAX_REPOS = 4; // how many recently-active repos to pull commits from
const MAX_PER_REPO = 2; // cap per repo so the log spreads across projects

function ghHeaders(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    // Optional: lifts the rate limit to 5000/hr if a token is present.
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  };
}

async function ghJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: ghHeaders(),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type GhEvent = { type: string; repo: { name: string } };
type GhCommit = {
  sha: string;
  commit: { message: string; author: { date: string } | null };
};

function firstLine(msg: string): string {
  const l = msg.split("\n")[0].trim();
  return l.length > 72 ? `${l.slice(0, 71)}…` : l;
}

// Recent real commits across the user's public repos, newest-first, formatted
// as "<sha> · <repo>: <message>" to match the existing git-log preview render.
//
// Two steps, because GitHub's *public* events feed strips PushEvent commit
// payloads (only ref/head SHAs survive):
//   1. events/public → discover which repos were recently pushed to (no list to
//      maintain — it auto-follows wherever the activity is), newest-push first.
//   2. each repo's commits API → the real messages + dates, merged and sorted.
//
// Cached hourly via ISR. Merge commits are dropped as noise. Falls back to the
// hand-written GIT_LOG_PREVIEW on any failure, empty feed, or offline dev — the
// /work page must never break on a flaky third party.
type CommitRow = { sha: string; repo: string; msg: string; date: number };

// Shared fetch+merge for the two exports below: events feed → recently-pushed
// repos → each repo's commits, deduped and sorted newest-first. Returns [] on
// any failure (callers decide their own fallback).
async function fetchCommitRows(): Promise<CommitRow[]> {
  const events = await ghJson<GhEvent[]>(
    `/users/${GH_USER}/events/public?per_page=100`,
  );
  if (!Array.isArray(events)) return [];

  const repos: string[] = [];
  for (const e of events) {
    if (e.type === "PushEvent" && !repos.includes(e.repo.name)) {
      repos.push(e.repo.name);
      if (repos.length >= MAX_REPOS) break;
    }
  }
  if (!repos.length) return [];

  const perRepo = await Promise.all(
    repos.map((r) => ghJson<GhCommit[]>(`/repos/${r}/commits?per_page=8`)),
  );

  const rows: CommitRow[] = [];
  const seen = new Set<string>();
  perRepo.forEach((commits, i) => {
    if (!Array.isArray(commits)) return;
    const repo = repos[i].split("/").pop() ?? repos[i];
    for (const c of commits) {
      const msg = firstLine(c.commit.message);
      if (/^merge\b/i.test(msg)) continue; // skip merge commits — noise
      const sha = c.sha.slice(0, 7);
      if (seen.has(sha)) continue;
      seen.add(sha);
      rows.push({
        sha,
        repo,
        msg,
        date: c.commit.author ? Date.parse(c.commit.author.date) : 0,
      });
    }
  });

  rows.sort((a, b) => b.date - a.date);
  return rows;
}

export async function getRecentCommits(limit = 3): Promise<string[]> {
  const rows = await fetchCommitRows();
  if (!rows.length) return GIT_LOG_PREVIEW;

  // Prefer spread: take up to MAX_PER_REPO newest commits per repo, then
  // backfill from the overflow (still recency-ordered) so a single dominant
  // repo can't starve the list below `limit`.
  const count = new Map<string, number>();
  const picked: CommitRow[] = [];
  const overflow: CommitRow[] = [];
  for (const r of rows) {
    const n = count.get(r.repo) ?? 0;
    if (n < MAX_PER_REPO) {
      count.set(r.repo, n + 1);
      picked.push(r);
      if (picked.length >= limit) break;
    } else {
      overflow.push(r);
    }
  }
  if (picked.length < limit) {
    picked.push(...overflow.slice(0, limit - picked.length));
  }

  const lines = picked
    .slice(0, limit)
    .map((r) => `${r.sha} · ${r.repo}: ${r.msg}`);
  return lines.length ? lines : GIT_LOG_PREVIEW;
}

// Date (YYYY-MM-DD) of the most recent commit across the user's public repos —
// drives the /work "last commit" status line. null on any failure, so the line
// just omits it (same graceful-degrade contract as getRecentCommits).
export async function getLatestCommitDate(): Promise<string | null> {
  const [top] = await fetchCommitRows();
  if (!top?.date) return null;
  return new Date(top.date).toISOString().slice(0, 10);
}
