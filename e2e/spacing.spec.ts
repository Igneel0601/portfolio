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
