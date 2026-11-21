import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
declare const nativeSelectVariants: (props?: ({
    size?: "lg" | "md" | "sm" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
interface NativeSelectOption {
    /** Submitted value */
    value: string;
    /** Text shown for the option */
    label: string;
    /** Show the option but prevent choosing it */
    disabled?: boolean;
}
type NativeSelectProps = Omit<ComponentProps<"select">, "size" | "multiple"> & VariantProps<typeof nativeSelectVariants> & {
    /** Options rendered before any `children` */
    options?: NativeSelectOption[];
    /**
     * Prompt shown until a choice is made. Rendered as a disabled, hidden first
     * option with an empty value, so `required` rejects it on submit
     */
    placeholder?: string;
    /** Classes for the `<select>` itself (`className` sizes the outer box) */
    selectClassName?: string;
};
/**
 * A styled native `<select>`. Use it for plain form choices: it submits with
 * forms, opens the OS picker on mobile, and keeps full keyboard and screen
 * reader support. `className` lands on the outer box so width utilities
 * (`w-full`, `w-48`, `flex-1`) size the control and its chevron together;
 * every other prop, including `id`, `name`, `ref`, and `aria-*`, goes to the
 * `<select>`.
 */
declare const NativeSelect: ({ className, selectClassName, size, options, placeholder, value, defaultValue, children, ...rest }: NativeSelectProps) => import("react/jsx-runtime").JSX.Element;
export type { NativeSelectOption, NativeSelectProps };
export { NativeSelect, nativeSelectVariants };
