import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 */
const knipConfig: KnipConfig = {
  entry: ["src/**/*.ts", "src/**/*.tsx", "test/setup.ts"],
  project: ["src/**/*.{ts,tsx,css,mdx}", "content/**/*.mdx"],
  // base.css is a published asset consumers import (@omnidotdev/thornberry/base.css),
  // not referenced internally, so knip would flag it as unused.
  ignore: ["src/registry/**/*.tsx", "src/lib/styles/base.css"],
  ignoreDependencies: ["server-only", "ts-pattern"],
  ignoreExportsUsedInFile: true,
  tags: ["-knipignore"],
};

export default knipConfig;
