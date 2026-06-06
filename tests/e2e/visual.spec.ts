import { test, expect } from "@playwright/test";

// Visual regression. Animations are killed (reduced-motion + a global CSS
// override injected before paint) so GSAP mid-states can't flake the diff.
// Screenshots are viewport-only — the home deck is 500vh of pinned scroll, so
// above-the-fold is the stable, meaningful surface to lock.

const KILL_MOTION = `*,*::before,*::after{
  animation:none!important;transition:none!important;
  animation-duration:0s!important;transition-duration:0s!important;
  caret-color:transparent!important;scroll-behavior:auto!important}`;

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript((css) => {
    const apply = () => {
      const s = document.createElement("style");
      s.id = "kill-motion";
      s.textContent = css;
      document.head.appendChild(s);
    };
    if (document.head) apply();
    else document.addEventListener("DOMContentLoaded", apply);
  }, KILL_MOTION);
});

// /now is intentionally excluded — its live IST clock changes every second,
// so a pixel baseline would never be stable. It's covered by the smoke check.
const PAGES = ["/", "/work", "/writing", "/about", "/uses", "/contact"];

for (const path of PAGES) {
  test(`${path} @visual`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await expect(page).toHaveScreenshot({
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });
}
