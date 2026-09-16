import { defineConfig } from "vite-plus";

/** The pure-logic suites, which are far cheaper in Node. Workers-API modules use the sibling config. */
export default defineConfig({
  test: {
    clearMocks: false,
    include: ["__tests__/*.test.ts"],
    environment: "node",
  },
});
