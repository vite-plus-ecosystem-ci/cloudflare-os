import { defineConfig } from "vite-plus";

/**
 * The live checks of what the hooks rely on GitHub for (`__tests__/contract`), which the
 * github-contract workflow runs. Never part of `test`: they need a real repository and token, and
 * wait on GitHub's own delivery times.
 */
export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-3-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    include: ["__tests__/contract/*.test.ts"],
    environment: "node",
    testTimeout: 15 * 60_000,
    hookTimeout: 2 * 60_000,
  },
});
