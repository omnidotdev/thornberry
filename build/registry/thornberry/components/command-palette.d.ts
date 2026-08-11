import type { ComponentType } from "react";
/** Window event any UI can dispatch to open the shared command palette. */
export declare const OPEN_COMMAND_PALETTE_EVENT = "open-command-palette";
/**
 * Dispatch the open event so a trigger anywhere (a header button, an empty
 * state) can open the palette without threading its state through the layout.
 */
export declare const openCommandPalette: () => void;
/** A single selectable action in the palette. */
export interface CommandAction {
    /** Stable identifier. */
    id: string;
    /** Visible label. */
    label: string;
    /** Group heading this action is listed under. Ungrouped actions list first. */
    group?: string;
    /** Optional leading icon. */
    icon?: ComponentType<{
        className?: string;
    }>;
    /** Extra terms to match against beyond the label. */
    keywords?: string[];
    /** Shortcut hint rendered as a trailing chip (display only, not bound here). */
    shortcut?: string;
    /** Invoked when the action is selected. The palette closes first. */
    onSelect: () => void;
}
export interface CommandPaletteProps {
    /** Actions to list, grouped by `group` in first-seen order. */
    commands: CommandAction[];
    /** Input placeholder. */
    placeholder?: string;
    /** Empty-state text. */
    emptyMessage?: string;
    /** Shortcut that toggles the palette. Defaults to `mod+k`. */
    triggerKey?: string;
    /** Controlled open state. Omit for self-managed (uncontrolled) mode. */
    open?: boolean;
    /** Open-state change handler (pair with `open` for controlled mode). */
    onOpenChange?: (open: boolean) => void;
}
/**
 * Opinionated command palette shared across Omni apps. Owns the global toggle
 * shortcut (defaults to `mod+k`) and an `open-command-palette` window event (so
 * any trigger can open it via {@link openCommandPalette}), then renders grouped,
 * fuzzy-searchable actions on the shared cmdk primitives. Apps supply only their
 * own {@link CommandAction} list, keeping the palette identical product to
 * product. Mount it once near the app root.
 */
declare const CommandPalette: ({ commands, placeholder, emptyMessage, triggerKey, open: openProp, onOpenChange, }: CommandPaletteProps) => import("react/jsx-runtime").JSX.Element;
export { CommandPalette };
