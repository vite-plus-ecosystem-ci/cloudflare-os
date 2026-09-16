import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    clearMocks: false,
    environment: "node",
    include: ["__tests__/vite-config.test.ts"],
  },
});
