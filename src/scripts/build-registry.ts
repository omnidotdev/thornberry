import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * Build the public shadcn registry (`public/r/*.json`) from `registry.json`.
 *
 * Each item ships its own files plus every local module they import (the shared
 * `cn` helper, sibling components, lib modules), inlined so `shadcn add` works
 * from this registry alone, and its npm dependencies are inferred from the
 * imports of everything it ships. Declared `dependencies` and
 * `registryDependencies` are kept and merged in. The current shadcn CLI's
 * `build` command does neither, which would publish items that install without
 * their dependencies, so this script owns the output instead.
 */

const REGISTRY = "registry.json";
const OUT_DIR = "public/r";
const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";

/** Packages every consumer already has; never listed as dependencies */
const PROVIDED = new Set(["react", "react-dom"]);

/** Source extensions tried when resolving an extensionless local import */
const EXTENSIONS = [".tsx", ".ts"];

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

const IMPORT_RE =
  /(?:import|export)\s+(?:type\s+)?(?:[^"';]*?\s+from\s+)?["']([^"']+)["']/g;

/** Every module specifier imported or re-exported by a source file */
const importsOf = (source: string) =>
  Array.from(source.matchAll(IMPORT_RE), (match) => match[1] as string);

/** npm package name of a bare specifier (`@scope/pkg/sub` to `@scope/pkg`) */
const packageName = (specifier: string) => {
  const parts = specifier.split("/");

  return specifier.startsWith("@")
    ? parts.slice(0, 2).join("/")
    : (parts[0] as string);
};

const fileExists = async (path: string) => Bun.file(path).exists();

/** Resolve a local (`@/` or relative) specifier to a source path */
const resolveLocal = async (specifier: string, fromPath: string) => {
  const base = specifier.startsWith("@/")
    ? join("src", specifier.slice(2))
    : join(dirname(fromPath), specifier);

  if (/\.(tsx?|css)$/.test(base) && (await fileExists(base))) return base;

  for (const ext of EXTENSIONS)
    if (await fileExists(`${base}${ext}`)) return `${base}${ext}`;

  for (const ext of EXTENSIONS)
    if (await fileExists(join(base, `index${ext}`)))
      return join(base, `index${ext}`);

  throw new Error(`cannot resolve "${specifier}" imported from ${fromPath}`);
};

/** Registry file type of an inlined local module, by where it lives */
const inlinedType = (path: string) =>
  path.includes("/components/") ? "registry:component" : "registry:lib";

const buildItem = async (item: RegistryItem) => {
  const own = item.files ?? [];
  const files: (RegistryFile & { content: string })[] = [];
  const seen = new Set(own.map((file) => file.path));
  const dependencies: string[] = [...(item.dependencies ?? [])];
  const queue: RegistryFile[] = [...own];

  // Walk breadth-first so dependencies and inlined files keep import order
  while (queue.length) {
    const file = queue.shift() as RegistryFile;
    const content = await readFile(file.path, "utf8");

    files.push({ ...file, content });

    for (const specifier of importsOf(content)) {
      if (specifier.startsWith("@/") || specifier.startsWith(".")) {
        const path = await resolveLocal(specifier, file.path);
        if (seen.has(path)) continue;
        seen.add(path);
        queue.push({ path, type: inlinedType(path), target: "" });
        continue;
      }

      const name = packageName(specifier);
      if (!PROVIDED.has(name) && !dependencies.includes(name))
        dependencies.push(name);
    }
  }

  return {
    $schema: ITEM_SCHEMA,
    name: item.name,
    ...(item.title && { title: item.title }),
    ...(item.description && { description: item.description }),
    ...(dependencies.length && { dependencies }),
    ...(item.registryDependencies?.length && {
      registryDependencies: item.registryDependencies,
    }),
    files: files.map(({ path, content, type, target }) => ({
      path,
      content,
      type,
      ...(target !== undefined && { target }),
    })),
    type: item.type,
  };
};

const registry: Registry = JSON.parse(await readFile(REGISTRY, "utf8"));

await mkdir(OUT_DIR, { recursive: true });

for (const item of registry.items) {
  const built = await buildItem(item);
  await writeFile(
    join(OUT_DIR, `${item.name}.json`),
    `${JSON.stringify(built, null, 2)}\n`,
  );
}

await writeFile(
  join(OUT_DIR, "registry.json"),
  `${JSON.stringify(registry, null, 2)}\n`,
);

console.warn(`Built ${registry.items.length} registry items into ${OUT_DIR}`);
