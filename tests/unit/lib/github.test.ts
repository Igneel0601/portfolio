import { afterEach, describe, expect, it, vi } from "vitest";
import { getRecentCommits } from "@/lib/github";
import { GIT_LOG_PREVIEW } from "@/lib/content";

// --- fetch stub ------------------------------------------------------------
// getRecentCommits hits two endpoints: the events feed (repo discovery) and
// each repo's commits API. Route the stub by URL substring.

type Commit = { sha: string; message: string; date: string };
type Handlers = {
  events?: { ok?: boolean; data?: unknown } | "throw";
  commits?: Record<string, Commit[]>; // keyed by "owner/repo"
};

function commit(c: Commit) {
  return { sha: c.sha, commit: { message: c.message, author: { date: c.date } } };
}

function stubFetch(h: Handlers) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: unknown) => {
      const url = String(input);
      if (url.includes("/events/public")) {
        if (h.events === "throw") throw new Error("network");
        const e = h.events ?? { ok: true, data: [] };
        return { ok: e.ok ?? true, json: async () => e.data } as unknown as Response;
      }
      const m = url.match(/\/repos\/([^/]+\/[^/]+)\/commits/);
      if (m && h.commits?.[m[1]]) {
        return {
          ok: true,
          json: async () => h.commits![m[1]].map(commit),
        } as unknown as Response;
      }
      return { ok: false, json: async () => [] } as unknown as Response;
    }),
  );
}

function pushEvents(...repos: string[]) {
  return repos.map((name) => ({ type: "PushEvent", repo: { name } }));
}

afterEach(() => vi.unstubAllGlobals());

describe("getRecentCommits", () => {
  it("formats <sha> · <repo>: <msg>, sorts by recency, caps 2/repo", async () => {
    stubFetch({
      events: {
        data: [
          { type: "WatchEvent", repo: { name: "Igneel0601/x" } }, // non-push ignored
          ...pushEvents("Igneel0601/portfolio", "Igneel0601/bloggz"),
        ],
      },
      commits: {
        "Igneel0601/portfolio": [
          { sha: "aaaaaa1", message: "feat: a", date: "2026-06-02T10:00:00Z" },
          { sha: "aaaaaa2", message: "fix: b", date: "2026-06-01T10:00:00Z" },
          { sha: "aaaaaa3", message: "chore: c", date: "2026-05-31T10:00:00Z" },
        ],
        "Igneel0601/bloggz": [
          { sha: "bbbbbb1", message: "feat: d", date: "2026-06-03T10:00:00Z" },
          { sha: "bbbbbb2", message: "fix: e", date: "2026-05-30T10:00:00Z" },
        ],
      },
    });

    // newest is bloggz feat:d, then portfolio a, b (portfolio capped at 2;
    // chore:c drops because the 3-line limit is hit first).
    expect(await getRecentCommits()).toEqual([
      "bbbbbb1 · bloggz: feat: d",
      "aaaaaa1 · portfolio: feat: a",
      "aaaaaa2 · portfolio: fix: b",
    ]);
  });

  it("filters merge commits", async () => {
    stubFetch({
      events: { data: pushEvents("Igneel0601/portfolio") },
      commits: {
        "Igneel0601/portfolio": [
          { sha: "mmmmmm1", message: "Merge branch 'dev'", date: "2026-06-09T00:00:00Z" },
          { sha: "cccccc1", message: "feat: real one", date: "2026-06-08T00:00:00Z" },
        ],
      },
    });
    const out = await getRecentCommits();
    expect(out.some((l) => /Merge/i.test(l))).toBe(false);
    expect(out[0]).toBe("cccccc1 · portfolio: feat: real one");
  });

  it("truncates messages over 72 chars with an ellipsis", async () => {
    const long = "feat: " + "x".repeat(100);
    stubFetch({
      events: { data: pushEvents("Igneel0601/portfolio") },
      commits: {
        "Igneel0601/portfolio": [
          { sha: "ddddd01", message: long, date: "2026-06-08T00:00:00Z" },
        ],
      },
    });
    const [line] = await getRecentCommits();
    const msg = line.split(": ").slice(1).join(": ");
    expect(msg.length).toBe(72);
    expect(msg.endsWith("…")).toBe(true);
  });

  it("backfills past the 2/repo cap when only one repo is active", async () => {
    stubFetch({
      events: { data: pushEvents("Igneel0601/portfolio") },
      commits: {
        "Igneel0601/portfolio": [
          { sha: "e000001", message: "c1", date: "2026-06-04T00:00:00Z" },
          { sha: "e000002", message: "c2", date: "2026-06-03T00:00:00Z" },
          { sha: "e000003", message: "c3", date: "2026-06-02T00:00:00Z" },
          { sha: "e000004", message: "c4", date: "2026-06-01T00:00:00Z" },
        ],
      },
    });
    // cap would yield 2; backfill restores the 3rd so head -3 stays full.
    expect(await getRecentCommits()).toEqual([
      "e000001 · portfolio: c1",
      "e000002 · portfolio: c2",
      "e000003 · portfolio: c3",
    ]);
  });

  it("falls back to GIT_LOG_PREVIEW on a failed events fetch", async () => {
    stubFetch({ events: { ok: false } });
    expect(await getRecentCommits()).toEqual(GIT_LOG_PREVIEW);
  });

  it("falls back when the events feed has no PushEvents", async () => {
    stubFetch({ events: { data: [{ type: "WatchEvent", repo: { name: "a/b" } }] } });
    expect(await getRecentCommits()).toEqual(GIT_LOG_PREVIEW);
  });

  it("falls back when fetch throws (offline)", async () => {
    stubFetch({ events: "throw" });
    expect(await getRecentCommits()).toEqual(GIT_LOG_PREVIEW);
  });
});
