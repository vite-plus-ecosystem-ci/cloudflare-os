import { defineConfig } from "vite-plus";
import { cloudflareTest } from "@cloudflare/vitest-pool-workers";

/**
 * Tests run inside workerd (via vitest-pool-workers) so they exercise the same runtime as
 * production. A minimal inline Miniflare config is used since the tests mock DurableObjectStorage
 * and don't need any real bindings.
 */
export default defineConfig({
  plugins: [
    cloudflareTest({
      miniflare: {
        compatibilityDate: "2026-09-04",
        compatibilityFlags: ["nodejs_compat"],
      },
    }),
  ],
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-0-0-rc-1-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    include: ["__tests__/*.test.ts"],
    // Nothing here imports `cloudflare:test`, so a pool that failed to start would leave this suite
    // green while running under Node. The guard makes that fail loudly instead.
    setupFiles: ["@gadgets/scripts/assert-workerd"],
  },
});
