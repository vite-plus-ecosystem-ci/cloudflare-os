// Build the Context Library SPA into generated single-file HTML for startAppUi().

import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const pkgDir = resolve(fileURLToPath(import.meta.url), "..");
const watch = process.argv.includes("--watch");
// One-shot build that produces the same bytes `--watch` would, for the `pnpm dev-server`
// pre-flight see the `unminified` note in vite.app.config.ts.
const dev = process.argv.includes("--dev");

console.log(
  watch
    ? "watching context library app for changes…"
    : "building context library app single-file bundle…",
);
// Resolve the JavaScript entry directly so the build also works without a shell on Windows.
const viteArgs = ["build", "-c", "vite.app.config.ts", ...(watch ? ["--watch"] : [])];
const require = createRequire(import.meta.url);
const viteEntry = resolve(require.resolve("vite-plus/package.json"), "../dist/bin.js");
const [command, argv] = [process.execPath, [viteEntry, ...viteArgs]];
execFileSync(command, argv, {
  cwd: pkgDir,
  stdio: "inherit",
  // Always set explicitly an inherited GATEKEEPER_APP_UNMINIFIED would
  // turn a production build unminified, and Vite+ would cache that under `build:app`.
  env: { ...process.env, GATEKEEPER_APP_UNMINIFIED: dev ? "true" : "false" },
});
