import { useHotkeys } from "react-hotkeys-hook";

/**
 * Shared hotkey surface for Omni apps: a single import source for
 * `react-hotkeys-hook`, the normalized global bindings every product shares, and
 * a label helper so shortcuts render identically product to product. Apps extend
 * {@link GLOBAL_HOTKEYS} with their own keys and bind them with {@link useHotkeys}.
 */

/** Shortcuts every Omni app binds the same way. Extend per app as needed. */
export const GLOBAL_HOTKEYS = {
  /** Toggle the command palette. */
  commandPalette: "mod+k",
  /** Toggle light/dark theme. */
  toggleTheme: "t",
} as const;

const isApplePlatform = () =>
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.platform);

/**
 * Named `react-hotkeys-hook` key tokens that should render as their glyph
 * rather than the raw word (e.g. `slash` as `/`). The lookup is case-insensitive
 * via the token's lowercase form.
 */
const NAMED_KEY_GLYPHS: Record<string, string> = {
  slash: "/",
  space: "Space",
  escape: "Esc",
  esc: "Esc",
  enter: "Enter",
  return: "Enter",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  comma: ",",
  period: ".",
  dot: ".",
};

/**
 * Render a `react-hotkeys-hook` binding string as a human label, e.g. `mod+k`
 * becomes `⌘K` on Apple platforms and `Ctrl+K` elsewhere. Use for shortcut hints
 * (pair with the `Kbd` chip) so the displayed key matches the bound key.
 *
 * Named keys render as their glyph (`slash` becomes `/`, `escape` becomes `Esc`,
 * the arrows become `↑↓←→`), and the `shift+slash` binding (the `?` key) renders
 * as `?` on every platform rather than a literal `⇧/` / `Shift+Slash`.
 */
export const hotkeyLabel = (hotkey: string): string => {
  const apple = isApplePlatform();

  const parts = hotkey.split("+");

  // `shift+slash` is how products bind the `?` key (e.g. runa's "show keyboard
  // shortcuts"); render it as the single `?` glyph regardless of part order or
  // platform
  const normalized = parts.map((part) => part.trim().toLowerCase());
  if (
    normalized.length === 2 &&
    normalized.includes("shift") &&
    normalized.includes("slash")
  ) {
    return "?";
  }

  return parts
    .map((part) => {
      if (part === "mod") return apple ? "⌘" : "Ctrl";
      if (part === "shift") return apple ? "⇧" : "Shift";
      if (part === "alt") return apple ? "⌥" : "Alt";
      if (part === "ctrl") return apple ? "⌃" : "Ctrl";
      const glyph = NAMED_KEY_GLYPHS[part.toLowerCase()];
      if (glyph) return glyph;
      return part.length === 1 ? part.toUpperCase() : part;
    })
    .join(apple ? "" : "+");
};

export { useHotkeys };
