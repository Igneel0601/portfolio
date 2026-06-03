import { test, expect } from "@playwright/test";

const HEADING_ROUTES = ["/", "/work", "/writing"];
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
  // desktop: [data-git-line] · mobile: .m-wklog-l — exactly one shell renders.
  await expect(page.locator("[data-git-line], .m-wklog-l")).toHaveCount(3);
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
