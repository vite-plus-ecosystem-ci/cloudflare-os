import { defineConfig } from "vite-plus";
import { EVAL_TEST_TIMEOUT_MS } from "./src/budgets.js";

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-0-0-rc-1-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    include: ["evals/**/*.eval.ts"],
    globalSetup: ["../integration-tests/src/global-setup.ts", "./src/global-setup.ts"],
    environment: "node",
    testTimeout: EVAL_TEST_TIMEOUT_MS,
    hookTimeout: 3 * 60_000,
    // A file's trials all run at once on the file's one Workshop, so it finishes in the time of
    // its slowest trial. Every file runs at once too: four files of ten trials on one 16 GB runner
    // peaked at 7.7 GB.
    maxConcurrency: 10,
    maxWorkers: 4,
  },
});
