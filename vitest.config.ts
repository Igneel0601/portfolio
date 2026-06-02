import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url)).replace(/\/$/, "");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": root }, // mirror tsconfig paths "@/*" → "./*"
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Pin env so modules that read these at load time (lib/site, lib/media)
    // produce deterministic output — snapshots can't drift with CI env.
    env: {
      SITE_URL: "https://vergnyx.dev",
      BLOGGZ_URL: "http://localhost:3001",
    },
    // Unit/contract tests only — Playwright specs under e2e/ are excluded.
    include: ["{lib,components,app}/**/*.test.{ts,tsx}"],
  },
});
