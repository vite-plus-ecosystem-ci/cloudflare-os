import { defineConfig } from "vite-plus";
import { EVAL_TEST_TIMEOUT_MS } from "./src/budgets.js";

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-0-0-rc-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    include: ["evals/**/*.eval.ts"],
    globalSetup: ["../integration-tests/src/global-setup.ts", "./src/global-setup.ts"],
    environment: "node",
    testTimeout: EVAL_TEST_TIMEOUT_MS,
    hookTimeout: 3 * 60_000,
  },
});
