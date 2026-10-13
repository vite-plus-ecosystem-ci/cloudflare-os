import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * The browser suite, `src/**\/*.browser.test.tsx`: what only a real browser shows -- pointer and
 * keyboard input, focus -- in headless Chromium, which `playwright install chromium` fetches. The
 * rest of the tests run under `vite.config.ts`, which leaves these out.
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-2-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    include: ["src/**/*.browser.test.tsx"],
    // Kept with vitest's other scratch, under node_modules/.vite, out of the source tree and the
    // test task's fingerprint: a failure's screenshot, and the copy of it attached to the report.
    attachmentsDir: "node_modules/.vite/vitest-browser/attachments",
    browser: {
      locators: {
        // Vitest v4 compatibility: keep partial, case-insensitive locator matching.
        // Remove after updating locators for full, case-sensitive matches.
        // https://release-v1-2-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
        // https://vitest.dev/guide/migration/#locators-are-strict-by-default
        exact: false,
      },
      expect: {
        toMatchScreenshot: { screenshotDirectory: "node_modules/.vite/vitest-browser/screenshots" },
      },
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
      screenshotDirectory: "node_modules/.vite/vitest-browser/screenshots",
    },
  },
});
