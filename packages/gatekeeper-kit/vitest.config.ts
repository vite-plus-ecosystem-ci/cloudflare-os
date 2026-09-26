import { defineConfig } from "vite-plus";

/** The pure-logic suites, which are far cheaper in Node. Workers-API modules use the sibling config. */
export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-0-0-rc-1-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    include: ["__tests__/*.test.ts"],
    environment: "node",
  },
});
