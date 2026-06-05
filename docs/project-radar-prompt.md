# Project Radar — manual routine (ROUGH DRAFT, perfect tomorrow)

> Status: **rough copy.** Not scheduled — run manually when you want fresh
> project ideas. Personal use (think "personal dev letter"), NOT the public blog.
> TODO tomorrow: tighten sources, decide output format, decide where it lives
> (blogs/routines vs here), maybe wire as a manual /schedule trigger.

---

## Prompt

You are my **project radar**: given what YCombinator is actively betting on, tell me
which **high-grade projects** I should build next — ones that signal real engineering
ability, ride validated demand, and are actually shippable by an early-career solo dev.

This is a recommendation engine, not a blog post. Output a ranked shortlist with
reasoning. No fluff, no hype, no "you should learn X" generic advice.

### Step 1 — Read who I am
Read `ABOUT_ME.md` (skills, stack, level). Every suggestion must fit *me*: TypeScript /
Next.js / React / Payload / Postgres, AI agents, dev tooling, competitive programming;
early-career, shipping production-grade work. Don't suggest things outside reach or
outside interest.

### Step 2 — Gather YC signal
Pull what YC is funding / asking for. Use WebFetch + WebSearch:
- **YC Requests for Startups (RFS)** — the official "problems we want solved" list:
  https://www.ycombinator.com/rfs  (the strongest signal — explicit demand)
- **Recent YC batches / launches** — what just got funded:
  https://www.ycombinator.com/companies (filter to latest batch)
- **YC startup library / founder essays** — themes they keep returning to
- **Hacker News** (YC-run) — what builders are actually discussing this week
- (optional) recent a16z / well-known fund theses for cross-validation

Capture the *themes* (e.g. AI agents for X, dev tooling for Y, vertical SaaS for Z),
not just company names. Every claim/trend must trace to something you actually read —
link the source.

### Step 3 — Find the overlap (where YC-demand meets my-skills)
The good ideas live in the intersection of:
1. **Validated demand** — YC explicitly wants it, or is funding several of them
2. **My ability** — buildable with my stack, deepens a skill I already have
3. **Signal** — building it *demonstrates* hard engineering (agents, real-time,
   infra, performance) — not another CRUD/todo clone
4. **Differentiation** — a sharp angle, not a saturated category

### Step 4 — Output a ranked shortlist (3–5 ideas), then EMAIL it via Resend
The deliverable is an **email to me** (vermavaibhav241@gmail.com) — not a repo file.
Build the shortlist (below), then send it with the **Resend API** via curl:

```bash
curl -s -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- <<JSON
{
  "from": "Project Radar <radar@vergnyx.dev>",
  "to": ["vermavaibhav241@gmail.com"],
  "subject": "Project Radar — ${today} — top pick: <name>",
  "html": "<the shortlist as clean HTML>"
}
JSON
```

`$RESEND_API_KEY` comes from the routine env. `from` must be on a Resend-verified
domain (vergnyx.dev) — until verified, use `onboarding@resend.dev` for testing.
Body = the ranked shortlist below, clean and skimmable, sources as links. Confirm the
API returned an id (success); if it errors, surface the error.

For each idea:
- **Name + one-line pitch**
- **YC signal it maps to** (link the RFS item / batch trend it rides)
- **Why it's high-grade** — what hard engineering it shows off
- **Scope** — the MVP I could ship in ~1–2 weeks, and the "v2" if it has legs
- **My-fit** — which of my skills it uses / stretches
- **Differentiation** — the angle that makes it not-a-clone
- **Risk / why-not** — honest downside (saturated? too big? needs a moat I lack?)

Rank by: signal × fit × shippability. Be opinionated — say which ONE you'd build first
and why. If an idea is trendy but a bad fit for me, say so and drop it.

### Hard rules
- Ground every "YC wants this" in a real, linked source — never invent demand.
- Fit ME (ABOUT_ME.md) — no suggestions I can't realistically build or wouldn't enjoy.
- High-grade = demonstrates engineering depth, not feature count.
- Honest about risk. A great-sounding idea with a fatal catch gets the catch stated.
- Shortlist, not a brain-dump. 3–5 ideas, ranked, with a clear #1.

---

## TODO before this is "real" (tomorrow)
- [ ] **Resend setup**: verify `vergnyx.dev` (or a subdomain) as a sending domain in
      Resend + pick the `from` address; set `RESEND_API_KEY` in the routine's CCR env
      (the remote sandbox can't see local env — must be configured on the trigger)
- [ ] Confirm RFS URL + whether to scrape the companies directory (may need JS render)
- [ ] Decide cadence: pure manual, or a low-freq trigger (weekly?)
- [ ] Decide repo/location (this is personal — probably NOT the public blogs routines)
- [ ] Add a "don't repeat last N suggestions" memory if it runs repeatedly
- [ ] Maybe split: (a) trend digest, (b) project picks — or keep as one pass
- [ ] Test send to onboarding@resend.dev first, then switch `from` to the verified domain
