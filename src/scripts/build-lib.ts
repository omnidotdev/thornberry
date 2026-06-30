import { $, Glob } from "bun";

/**
 * Build the Thornberry component library for consumption as a git dependency
 * (the @omnidotdev/providers model): each component compiles to its own ESM
 * module under build/ with a co-located declaration file, so consumers import
 * `@omnidotdev/thornberry/<component>`. Bundled JS resolves the `@/` tsconfig
 * paths and inlines pure utilities; the emitted declarations keep `@/` aliases,
 * which tsc-alias rewrites to relative paths so they resolve in consumers.
 */

const ROOT = "src";
const COMPONENTS_DIR = "src/registry/thornberry/components";

// Peer-provided packages: never bundle, so the consuming app supplies a single
// instance (critical for React and Lexical). Pure class utilities (clsx,
// tailwind-merge, class-variance-authority) are intentionally bundled so
// consumers do not have to install them.
const EXTERNAL = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "@ark-ui/react",
  "cmdk",
  "lexical",
  "@lexical/html",
  "@lexical/link",
  "@lexical/list",
  "@lexical/markdown",
  "@lexical/react",
  "@lexical/rich-text",
  "@lexical/utils",
  "lucide-react",
  "isomorphic-dompurify",
  "react-hotkeys-hook",
  "@unpic/react",
  "@xyflow/react",
  "@omnidotdev/providers",
];

const build = async () => {
  // NB: this build must run with NODE_ENV=production (set in the `build:lib`
  // script). Bun.build selects the JSX runtime from NODE_ENV at process start,
  // and the development runtime (jsxDEV) is stubbed out by consumers'
  // production bundlers (@vitejs/plugin-react sets jsxDEV to undefined),
  // crashing every component with "jsxDEV is not a function".
  await $`rm -rf build`;

  const entrypoints: string[] = [];
  for await (const file of new Glob("*.tsx").scan({ cwd: COMPONENTS_DIR })) {
    if (file.endsWith(".test.tsx")) continue;
    entrypoints.push(`${COMPONENTS_DIR}/${file}`);
  }

  console.warn(`Bundling ${entrypoints.length} components...`);
  const result = await Bun.build({
    entrypoints,
    outdir: "build",
    root: ROOT,
    target: "browser",
    format: "esm",
    splitting: true,
    external: EXTERNAL,
    naming: {
      entry: "[dir]/[name].[ext]",
      chunk: "chunks/[name]-[hash].[ext]",
    },
  });
  if (!result.success) {
    for (const log of result.logs) console.error(log);
    throw new Error("Bun.build failed");
  }

  console.warn("Emitting declarations...");
  await $`bunx tsc -p tsconfig.build.json`;
  await $`bunx tsc-alias -p tsconfig.build.json`;

  console.warn("Library build complete.");
};

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
