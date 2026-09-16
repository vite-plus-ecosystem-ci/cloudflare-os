import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    clearMocks: false,
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
