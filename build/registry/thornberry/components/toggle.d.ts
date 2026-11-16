import { Toggle as ArkToggle } from "@ark-ui/react/toggle";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
/**
 * Shared toggle styles, also used by toggle-group items. Variants and sizes
 * mirror the button so toggles sit naturally next to buttons; the pressed
 * ("on") state is expressed through `data-[state=on]`.
 */
declare const toggleVariants: (props?: ({
    variant?: "ghost" | "outline" | "solid" | null | undefined;
    size?: "icon" | "lg" | "md" | "sm" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const ToggleContext: (props: ArkToggle.ContextProps) => import("react").ReactNode;
/**
 * A two-state button that can be either on or off. Use `pressed` and
 * `onPressedChange` to control it, or `defaultPressed` for uncontrolled use.
 */
declare const Toggle: ({ className, variant, size, ...rest }: ComponentProps<typeof ArkToggle.Root> & VariantProps<typeof toggleVariants>) => import("react/jsx-runtime").JSX.Element;
/**
 * Renders `children` while the toggle is on and `fallback` while it is off,
 * e.g. to swap an outlined icon for a filled one.
 */
declare const ToggleIndicator: ({ className, ...rest }: ComponentProps<typeof ArkToggle.Indicator>) => import("react/jsx-runtime").JSX.Element;
export { Toggle, ToggleContext, ToggleIndicator, toggleVariants };
