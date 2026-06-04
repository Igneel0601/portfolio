import { test, expect } from "@playwright/test";

// Spacing contract — asserts the inter-scene rhythm token (--scene-gap) and that
// every scene consuming it resolves to the token's value. Covers the blind spot
// in visual.spec.ts, which is viewport-only (the home deck is 500vh of pinned
// scroll) and never sees below-the-fold spacing — exactly how an earlier
// --scene-gap change slipped through unnoticed.
//
// The root font-size is fluid, so --scene-gap (3rem) is NOT a fixed px. We
// derive the expected px dynamically from the live root font-size (3 × root),
// assert the declared token is 3rem, that all consumers agree with each other,
// and that each is 3rem within a sub-pixel tolerance (px resolution of rem
// differs slightly between properties). This catches a token change or a
// consumer drifting off the token (e.g. a hardcoded value) without baking a px.
//
// Scenes (SceneBoot/SceneCTA) are desktop-shell only; the /m shell uses
// different components, so this runs on the desktop project only.

const SUBPIXEL = 0.5; // tolerance for rem→px rounding differences across props

test.describe("spacing contract", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop",
      "--scene-gap is a desktop-shell concern (mobile uses different scenes)",
    );
  });

  test("home --scene-gap token + scene consumers @spacing", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const data = await page.evaluate(() => {
      const root = document.documentElement;
      const raw = getComputedStyle(root).getPropertyValue("--scene-gap").trim();
      const rootFontPx = parseFloat(getComputedStyle(root).fontSize);

      const boot = document.querySelector("[data-boot-sticky]");
      const ctaWrap = document.querySelector("[data-scene='cta']")?.parentElement;
      const cta = ctaWrap ? getComputedStyle(ctaWrap) : null;

      return {
        raw,
        expectedPx: rootFontPx * 3, // 3rem, derived from the live (fluid) root
        bootPaddingBottom: boot ? getComputedStyle(boot).paddingBottom : null,
        ctaMarginTop: cta?.marginTop ?? null,
        ctaMarginBottom: cta?.marginBottom ?? null,
      };
    });

    // Token is declared as 3rem.
    expect(data.raw).toBe("3rem");

    // Every consumer is present and resolves to 3rem (within sub-pixel rounding).
    const consumers = [
      data.bootPaddingBottom,
      data.ctaMarginTop,
      data.ctaMarginBottom,
    ];
    for (const value of consumers) {
      expect(value).not.toBeNull();
      expect(parseFloat(value as string)).toBeCloseTo(data.expectedPx, 0);
      expect(Math.abs(parseFloat(value as string) - data.expectedPx)).toBeLessThanOrEqual(SUBPIXEL);
    }

    // …and they all agree with each other (one shared rhythm).
    expect(data.ctaMarginTop).toBe(data.bootPaddingBottom);
    expect(data.ctaMarginBottom).toBe(data.bootPaddingBottom);
  });
});

// Mobile link affordance contract — the site-wide link rule in tokens.css
// (a:not(.nav-link):not(.btn):not(.no-pop)) carries specificity (0,3,1) and is
// NOT wrapped in :where(), so it out-competes every bespoke .m-* link rule
// (0,1,0) in mobile.css and bleeds a green resting underline onto them. Those
// links opt out with .no-pop. This asserts the computed result so a future
// global-link change (or a dropped .no-pop) that re-underlines a mobile-shell
// link fails here instead of only in a PR-gated screenshot diff. The blind spot
// is real: pnpm check (tsc/stylelint/eslint/vitest) can't model the cascade.
//
// text-decoration-line is the clean signal: every bespoke mobile link declares
// `none`, the global rule forces `underline`. (color is unreliable — some links
// are already --accent, identical to the global colour.)

// path → selectors that must resolve to text-decoration-line: none.
const MOBILE_PLAIN_LINKS: Array<{ path: string; selectors: string[] }> = [
  { path: "/", selectors: ["a.m-panel-cta"] },
  { path: "/writing", selectors: ["a.m-wrow", "a.m-chip", "a.m-wfoot-rss"] },
  { path: "/work", selectors: ["a.m-wkrow", "a.m-wklog-more"] },
];

test.describe("mobile link affordance contract", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile",
      "bespoke .m-* links are a mobile-shell concern",
    );
  });

  for (const { path, selectors } of MOBILE_PLAIN_LINKS) {
    test(`no stray underline on ${path} @spacing`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });

      const decorations = await page.evaluate((sels) => {
        return sels.map((sel) => {
          const el = document.querySelector(sel);
          return {
            sel,
            found: !!el,
            line: el ? getComputedStyle(el).textDecorationLine : null,
          };
        });
      }, selectors);

      for (const d of decorations) {
        expect(d.found, `${d.sel} present on ${path}`).toBe(true);
        expect(d.line, `${d.sel} should not carry the global underline`).toBe("none");
      }
    });
  }

  // Nav menu links live behind the hamburger; assert them once the overlay opens.
  test("no stray underline on nav overlay links @spacing", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open menu" }).click();

    const lines = await page.evaluate(() =>
      [...document.querySelectorAll("a.t-h2")].map(
        (el) => getComputedStyle(el).textDecorationLine,
      ),
    );

    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) expect(line).toBe("none");
  });

  // ReadingProgress renders on both shells, but on mobile the shared .wp-progress
  // (z-index 60) is lifted above the fixed top nav (z-110) by a mobile.css
  // override — without it the bar hides behind the nav. Assert it's present on a
  // post AND stacks above the nav, so the lift can't silently regress.
  test("reading-progress bar present + above nav on posts @spacing", async ({ page }) => {
    await page.goto("/writing", { waitUntil: "networkidle" });
    const href = await page.locator('a[href^="/writing/"]').first().getAttribute("href");
    expect(href, "a post link on /writing").toBeTruthy();

    await page.goto(href as string, { waitUntil: "networkidle" });

    const data = await page.evaluate(() => {
      const bar = document.querySelector(".wp-progress");
      const nav = document.querySelector("[data-mobile-nav]");
      const z = (el: Element | null) =>
        el ? parseInt(getComputedStyle(el).zIndex || "0", 10) : null;
      return { barFound: !!bar, navFound: !!nav, barZ: z(bar), navZ: z(nav) };
    });

    expect(data.barFound, ".wp-progress present on mobile post").toBe(true);
    expect(data.navFound, "[data-mobile-nav] present").toBe(true);
    expect(data.barZ as number).toBeGreaterThan(data.navZ as number);
  });
});
