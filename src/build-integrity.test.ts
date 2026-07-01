import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { Glob } from "bun";

/**
 * Guards the committed build/ output against the development JSX runtime.
 *
 * build:lib already fails at build time if jsxDEV leaks into the bundle (see
 * src/scripts/build-lib.ts), but that guard only runs when build:lib runs. This
 * test runs in CI (`bun test`) against the committed build/, so a stale or
 * hand-committed build/ that shipped jsxDEV cannot slip through unnoticed. A
 * jsxDEV build crashes every consumer app with "jsxDEV is not a function"
 * (consumers' production bundlers stub react/jsx-dev-runtime to undefined).
 */
describe("build output integrity", () => {
  test("committed build/ contains no development JSX runtime (jsxDEV)", () => {
    const offenders: string[] = [];
    let scanned = 0;
    for (const file of new Glob("build/**/*.js").scanSync(".")) {
      scanned += 1;
      if (readFileSync(file, "utf8").includes("jsxDEV")) offenders.push(file);
    }
    expect(offenders).toEqual([]);
    // Also fail if build/ is missing entirely: a published lib with no build
    // output is as broken to consumers as one with jsxDEV.
    expect(scanned).toBeGreaterThan(0);
  });
});
