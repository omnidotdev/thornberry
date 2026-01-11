import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 */
const knipConfig: KnipConfig = {
  entry: ["src/**/*.ts", "src/**/*.tsx"],
  project: ["src/**/*.{ts,tsx,css,mdx}", "content/**/*.mdx"],
  ignore: ["src/registry/**/*.tsx"],
  ignoreDependencies: ["server-only", "ts-pattern"],
  ignoreExportsUsedInFile: true,
  tags: ["-knipignore"],
};

export default knipConfig;
