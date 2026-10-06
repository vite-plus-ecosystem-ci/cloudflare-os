import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import capnwebValidate from "capnweb-validate/vite";
import { defineConfig } from "vite-plus";
import deployed from "./cloudflare.config.ts";

const { compatibilityDate, compatibilityFlags } = deployed.worker;

/** Workerd coverage for Google resource configurators and the Gmail and Chat Durable Objects. */
export default defineConfig({
  plugins: [
    capnwebValidate(),
    cloudflareTest({
      main: "./__tests__/workerd/worker.ts",
      miniflare: {
        compatibilityDate,
        compatibilityFlags,
        bindings: { CLIENT_ID: "test-client", CLIENT_SECRET: "test-secret" },
        durableObjects: {
          GmailGatekeeperImpl: { className: "GmailGatekeeperImpl", useSQLite: true },
          GoogleChatGatekeeperImpl: { className: "GoogleChatGatekeeperImpl", useSQLite: true },
          TestHooks: { className: "TestHooks", useSQLite: true },
          UserAccount: { className: "UserAccount", useSQLite: true },
        },
      },
    }),
  ],
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-1-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    include: [
      "__tests__/workerd/chat-actions.test.ts",
      "__tests__/workerd/configurators.test.ts",
      "__tests__/workerd/gmail-actions.test.ts",
      "__tests__/workerd/gmail-state.test.ts",
    ],
    setupFiles: ["@gadgets/scripts/assert-workerd"],
  },
});
