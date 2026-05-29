// Single source of truth for the site's canonical origin.
//
// Everything that emits an absolute URL (canonical tags via metadataBase,
// sitemap, robots, rss) reads from here. To change the domain, set the SITE_URL
// env var in Vercel (and .env locally) and redeploy — no code edits, nothing to
// miss. The fallback keeps things working if the env var is ever unset.
export const SITE_URL = process.env.SITE_URL ?? 'https://portfolio.igneel.cloud'
