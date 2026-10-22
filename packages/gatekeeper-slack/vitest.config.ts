import { defineConfig } from "vite-plus";

export default defineConfig({
  esbuild: { jsxFactory: "h", jsxFragment: "Fragment" },
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
