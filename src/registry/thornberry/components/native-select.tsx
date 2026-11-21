import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const nativeSelectVariants = cva(
  // `peer` lets the chevron dim with a disabled select, `has-[...]` mutes the
  // closed control while the placeholder option is the selected one, and the
  // `**:` option colors plus `scheme-*` keep the OS dropdown list on theme
  "peer border-input text-foreground **:bg-popover **:text-popover-foreground focus-visible:ring-primary has-[option[data-placeholder]:checked]:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 w-full max-w-full min-w-0 cursor-pointer appearance-none truncate rounded-md border bg-transparent py-1 text-base scheme-light shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:scheme-dark",
  {
    variants: {
      size: {
        sm: "h-8 pr-8 pl-2.5",
        md: "h-9 pr-9 pl-3",
        lg: "h-10 pr-10 pl-3.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const chevronVariants = cva(
  "text-muted-foreground pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 peer-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "right-2.5",
        md: "right-3",
        lg: "right-3.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

interface NativeSelectOption {
  /** Submitted value */
  value: string;
  /** Text shown for the option */
  label: string;
  /** Show the option but prevent choosing it */
  disabled?: boolean;
}

type NativeSelectProps = Omit<ComponentProps<"select">, "size" | "multiple"> &
  VariantProps<typeof nativeSelectVariants> & {
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
const NativeSelect = ({
  className,
  selectClassName,
  size,
  options,
  placeholder,
  value,
  defaultValue,
  children,
  ...rest
}: NativeSelectProps) => {
  // Start on the placeholder when the caller sets no initial value, otherwise
  // the browser would preselect the first real option
  const initialValue =
    placeholder !== undefined &&
    value === undefined &&
    defaultValue === undefined
      ? ""
      : defaultValue;

  return (
    <span className={cn("relative inline-flex min-w-0 max-w-full", className)}>
      <select
        className={cn(nativeSelectVariants({ size }), selectClassName)}
        value={value}
        defaultValue={initialValue}
        {...rest}
      >
        {placeholder !== undefined && (
          <option value="" disabled hidden data-placeholder="">
            {placeholder}
          </option>
        )}

        {options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}

        {children}
      </select>

      <ChevronDown aria-hidden="true" className={chevronVariants({ size })} />
    </span>
  );
};

export type { NativeSelectOption, NativeSelectProps };
export { NativeSelect, nativeSelectVariants };
