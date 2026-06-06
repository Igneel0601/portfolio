import { defineConfig, devices } from "@playwright/test";

// Target: E2E_BASE_URL (a Vercel preview/prod URL in CI) or the local dev
// server. The site routes /d vs /m by User-Agent (proxy.ts), so the desktop
// and mobile "projects" exercise both shells off the same specs.
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3001";

// Vercel preview deploys are gated by Deployment Protection (every request 401s
// otherwise). "Protection Bypass for Automation" issues a secret we send as a
// header on all requests; x-vercel-set-bypass-cookie persists it for the session
// so client-side fetches (e.g. /api/posts) pass too. Local runs (no secret) skip it.
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const extraHTTPHeaders: Record<string, string> = bypass
  ? {
      "x-vercel-protection-bypass": bypass,
      "x-vercel-set-bypass-cookie": "true",
    }
  : {};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    extraHTTPHeaders,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // iPhone UA/viewport (drives the /m shell via proxy UA-sniffing) but on
    // chromium, so CI only needs one browser engine installed.
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], browserName: "chromium" },
    },
  ],
  // Locally (no E2E_BASE_URL) manage the dev server; against a preview URL, don't.
  // reuseExistingServer means a dev server you already have on 3001 is reused
  // instantly — the most reliable path. If Playwright has to cold-boot one, the
  // first Turbopack compile of the whole app can be slow, so allow 240s. If you
  // hit a stale-chunk "Unexpected end of input", clear .next and retry.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "next dev -p 3001",
        url: "http://localhost:3001",
        reuseExistingServer: true,
        timeout: 240_000,
      },
});
