import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "evals/**/*.test.ts"],
    environment: "node",
  },
});
