import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import capnwebValidate from "capnweb-validate/vite";
import { defineConfig } from "vite-plus";

/** Workerd coverage for Google resource configurators, Gmail sessions, and the Gmail Durable Object. */
export default defineConfig({
  plugins: [
    capnwebValidate(),
    cloudflareTest({
      main: "./__tests__/workerd/worker.ts",
      miniflare: {
        compatibilityDate: "2026-09-04",
        compatibilityFlags: ["allow_irrevocable_stub_storage", "nodejs_als"],
        bindings: { CLIENT_ID: "test-client", CLIENT_SECRET: "test-secret" },
        durableObjects: {
          GmailGatekeeperImpl: { className: "GmailGatekeeperImpl", useSQLite: true },
          TestHooks: { className: "TestHooks", useSQLite: true },
          UserAccount: { className: "UserAccount", useSQLite: true },
        },
      },
    }),
  ],
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://rfc-vitest-v5-upgrade-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    include: [
      "__tests__/workerd/configurators.test.ts",
      "__tests__/workerd/gmail-actions.test.ts",
      "__tests__/workerd/gmail-state.test.ts",
    ],
    setupFiles: ["@gadgets/scripts/assert-workerd"],
  },
});
