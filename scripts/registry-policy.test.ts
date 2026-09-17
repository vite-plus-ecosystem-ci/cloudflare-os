import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

// This repository is public, and every consumer of it — forks, CI, external contributors — can
// only reach registry.npmjs.org, so every dependency has to resolve from there.
const PUBLIC_REGISTRY = "https://registry.npmjs.org/";

// This fork smoke test permits only the exact release candidate tarballs.
const PREVIEW_TARBALLS = new Set([
  "https://registry-bridge.viteplus.dev/tarballs/@voidzero-dev/vite-plus-core/0.0.0-commit.fba044cf40fea5a7bf4a2ee97822f174eab33dfa/392f5901fc7eaba89a863d26b72d4580a73163d0.tgz",
  "https://registry-bridge.viteplus.dev/tarballs/@voidzero-dev/vite-plus-darwin-arm64/0.0.0-commit.fba044cf40fea5a7bf4a2ee97822f174eab33dfa/2d2e55603f26c36ca4628df18d510d5909de2fbd.tgz",
  "https://registry-bridge.viteplus.dev/tarballs/@voidzero-dev/vite-plus-darwin-x64/0.0.0-commit.fba044cf40fea5a7bf4a2ee97822f174eab33dfa/5cac120e40257604d934329fe4ed8b984048cf5b.tgz",
  "https://registry-bridge.viteplus.dev/tarballs/@voidzero-dev/vite-plus-linux-arm64-gnu/0.0.0-commit.fba044cf40fea5a7bf4a2ee97822f174eab33dfa/2af6c623cb23a483ba02fe3a9c93b2a9e052c5bc.tgz",
  "https://registry-bridge.viteplus.dev/tarballs/@voidzero-dev/vite-plus-linux-arm64-musl/0.0.0-commit.fba044cf40fea5a7bf4a2ee97822f174eab33dfa/fd8e9f11794b3553f525edf53eeaca709a2d7172.tgz",
  "https://registry-bridge.viteplus.dev/tarballs/@voidzero-dev/vite-plus-linux-x64-gnu/0.0.0-commit.fba044cf40fea5a7bf4a2ee97822f174eab33dfa/1a77b8c0a2fd07c21d67c958e42f679ee3e1e8b4.tgz",
  "https://registry-bridge.viteplus.dev/tarballs/@voidzero-dev/vite-plus-linux-x64-musl/0.0.0-commit.fba044cf40fea5a7bf4a2ee97822f174eab33dfa/69c1cb449c927ae1367852d759f8f7fdad6eda49.tgz",
  "https://registry-bridge.viteplus.dev/tarballs/@voidzero-dev/vite-plus-win32-arm64-msvc/0.0.0-commit.fba044cf40fea5a7bf4a2ee97822f174eab33dfa/515ec6503d3a18b2b13e9b80610a636afd8ae067.tgz",
  "https://registry-bridge.viteplus.dev/tarballs/@voidzero-dev/vite-plus-win32-x64-msvc/0.0.0-commit.fba044cf40fea5a7bf4a2ee97822f174eab33dfa/e9acb1958ec35662c0084de4baff67e02eb1c555.tgz",
  "https://registry-bridge.viteplus.dev/tarballs/vite-plus/0.0.0-commit.fba044cf40fea5a7bf4a2ee97822f174eab33dfa/8a414b7dd8a1fb8a8086e9a14ef85cca78ca56a2.tgz",
]);

const lockfile = readFileSync(new URL("../pnpm-lock.yaml", import.meta.url), "utf8");
const npmrc = readFileSync(new URL("../.npmrc", import.meta.url), "utf8");

describe("registry policy", () => {
  it("resolves every tarball from npm or the exact release preview", () => {
    const offenders = lockfile
      .split("\n")
      .filter((line) => /tarball: (?!https:\/\/registry\.npmjs\.org\/)/.test(line))
      .filter((line) => !PREVIEW_TARBALLS.has(line.match(/tarball: ([^}\s]+)/)?.[1] ?? ""))
      .map((line) => line.trim());

    assert.deepEqual(
      offenders,
      [],
      `pnpm-lock.yaml resolves packages from a registry other than ${PUBLIC_REGISTRY}, which ` +
        "forks, CI and external contributors cannot reach. Re-run the install with the " +
        "repository's root .npmrc in effect rather than under a config that points a scope " +
        "somewhere private.",
    );
  });

  it("configures the @cloudflare scope and release preview bridge", () => {
    const directives = npmrc
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && !line.startsWith("#"));

    assert.deepEqual(
      directives,
      [`@cloudflare:registry=${PUBLIC_REGISTRY}`, "registry=https://registry-bridge.viteplus.dev/"],
      "the root .npmrc must contain exactly the @cloudflare scope pin; it is what keeps a " +
        "resolving install from rewriting pnpm-lock.yaml to a registry this repository's " +
        "consumers cannot reach.",
    );
  });
});
