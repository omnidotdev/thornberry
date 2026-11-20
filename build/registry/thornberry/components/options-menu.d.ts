import type { ReactNode } from "react";
export interface OptionsMenuProps {
    /**
     * Accessible name and tooltip of the trigger, and the menu's heading.
     * Defaults to "Options"
     */
    label?: string;
    /** Show `label` as text beside the icon, not only to screen readers */
    showLabel?: boolean;
    /** Trigger icon. Defaults to a sliders icon */
    icon?: ReactNode;
    /** The menu's settings, typically one or more `OptionsMenuChoice` groups */
    children: ReactNode;
    disabled?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Where the menu opens relative to the trigger. Defaults to "top-end" */
    placement?: "top-start" | "top-end" | "bottom-start" | "bottom-end";
    /** Class names for the trigger button */
    className?: string;
    /** Class names for the menu panel */
    contentClassName?: string;
}
/**
 * A small settings menu beside a composer's send button: an icon trigger that
 * opens a popover of secondary choices (a model, a quality level, a format),
 * so the main row keeps only what most people need. Presentational; the host
 * owns the values and persists them.
 */
declare const OptionsMenu: ({ label, showLabel, icon, children, disabled, open, onOpenChange, placement, className, contentClassName, }: OptionsMenuProps) => import("react/jsx-runtime").JSX.Element;
/** One choice in an `OptionsMenuChoice` */
export interface OptionsMenuOption<T extends string = string> {
    value: T;
    /** A plain name for the choice, e.g. "Balanced" */
    label: string;
    /** One short line on what the choice is good for */
    description?: string;
    /** A small note beside the name, e.g. a relative cost */
    hint?: string;
}
export interface OptionsMenuChoiceProps<T extends string = string> {
    /** The group's heading, e.g. "Quality" */
    label: string;
    value: T;
    onValueChange: (value: T) => void;
    options: readonly OptionsMenuOption<T>[];
    disabled?: boolean;
    className?: string;
}
/**
 * A single-choice group inside an `OptionsMenu`: one row per option with its
 * plain name, an optional hint, and a one-line description. Arrow keys move
 * between rows, as in any radio group
 */
declare const OptionsMenuChoice: <T extends string = string>({ label, value, onValueChange, options, disabled, className, }: OptionsMenuChoiceProps<T>) => import("react/jsx-runtime").JSX.Element;
export { OptionsMenu, OptionsMenuChoice };
