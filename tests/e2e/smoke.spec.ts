import { test, expect } from "@playwright/test";

const HEADING_ROUTES = ["/", "/work", "/writing", "/about", "/now", "/uses", "/contact"];
const ALL_ROUTES = [...HEADING_ROUTES, "/terminal"];

for (const path of ALL_ROUTES) {
  test(`${path} responds 2xx/3xx with a non-empty <title>`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res, "navigation response").not.toBeNull();
    expect(res!.status()).toBeLessThan(400);
    expect((await page.title()).trim().length).toBeGreaterThan(0);
  });
}

for (const path of HEADING_ROUTES) {
  test(`${path} renders a heading`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1, h2").first()).toBeAttached();
  });
}

test("home exposes crawlable section links in the initial DOM", async ({
  page,
}) => {
  // Locks the mobile-nav crawlability fix (links must exist with the hamburger
  // closed) and the desktop nav. Both shells must have real <a href>.
  await page.goto("/");
  await expect(page.locator('a[href="/work"]').first()).toBeAttached();
  await expect(page.locator('a[href="/writing"]').first()).toBeAttached();
});

test("/work renders the git-log footer (3 lines)", async ({ page }) => {
  await page.goto("/work");
  // Single shell renders BOTH variants and toggles with CSS, so both are in the
  // DOM — assert on the *visible* one. Both shells now mark git-log lines with
  // [data-git-line]; exactly one shell is visible per viewport, so this is 3.
  await expect(page.locator("[data-git-line]:visible")).toHaveCount(3);
});

test("/writing paginates and filters via URL", async ({ page }) => {
  // page 1 caps at the page size and shows a pager (works only when there are
  // >10 posts; tolerate fewer by asserting rows never exceed the page size).
  // Single shell renders both variants toggled by CSS, so scope to the visible
  // shell's rows. Select by stable data hooks (desktop [data-wa-row]) / mobile
  // class (.m-wrow), NOT styling classes — those move during the Tailwind
  // migration and shouldn't break this test.
  await page.goto("/writing");
  const rows = page.locator("[data-wa-row]:visible, .m-wrow:visible");
  expect(await rows.count()).toBeLessThanOrEqual(10);

  // a category filter is a real URL and narrows the list (server-side).
  await page.goto("/writing?tag=security");
  const filtered = page.locator("[data-wa-row]:visible, .m-wrow:visible");
  await expect(filtered.first()).toBeAttached();
  // every visible row on a filtered page belongs to that category
  const cats = await page.locator("[data-wa-cat]:visible, .m-wrow-cat:visible").allTextContents();
  expect(cats.every((c) => c.toLowerCase().includes("security"))).toBe(true);
});

test("/api/og renders a PNG card", async ({ request }) => {
  // The dynamic per-route OG generator (app/api/og). Routes point their
  // openGraph.images here; if it 500s or stops returning an image, every
  // share card breaks.
  const res = await request.get("/api/og?title=Test&eyebrow=case%20study");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
  expect((await res.body()).byteLength).toBeGreaterThan(1000);
});

test("home head has a canonical tag and Person JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(blocks.join("")).toContain('"Person"');
});
