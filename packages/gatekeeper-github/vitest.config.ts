import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    clearMocks: false,
    include: ["__tests__/*.test.ts"],
    environment: "node",
  },
});
