import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [react()],
  test: {
    clearMocks: false,
    environment: "jsdom",
    include: ["app/*.test.{ts,tsx}"],
  },
});
