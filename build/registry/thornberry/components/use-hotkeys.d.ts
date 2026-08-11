import { useHotkeys } from "react-hotkeys-hook";
/**
 * Shared hotkey surface for Omni apps: a single import source for
 * `react-hotkeys-hook`, the normalized global bindings every product shares, and
 * a label helper so shortcuts render identically product to product. Apps extend
 * {@link GLOBAL_HOTKEYS} with their own keys and bind them with {@link useHotkeys}.
 */
/** Shortcuts every Omni app binds the same way. Extend per app as needed. */
export declare const GLOBAL_HOTKEYS: {
    /** Toggle the command palette. */
    readonly commandPalette: "mod+k";
    /** Toggle light/dark theme. */
    readonly toggleTheme: "t";
};
/**
 * Render a `react-hotkeys-hook` binding string as a human label, e.g. `mod+k`
 * becomes `⌘K` on Apple platforms and `Ctrl+K` elsewhere. Use for shortcut hints
 * (pair with the `Kbd` chip) so the displayed key matches the bound key.
 */
export declare const hotkeyLabel: (hotkey: string) => string;
export { useHotkeys };
