import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    // Declaration compilation needs headroom when the full graph shares cloud CPUs.
    testTimeout: 15_000,
    include: ["__tests__/*.test.ts"],
    environment: "node",
  },
});
