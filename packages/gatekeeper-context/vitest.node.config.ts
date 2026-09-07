import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/vite-config.test.ts"],
  },
});
