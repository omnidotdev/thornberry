import { Toggle as ArkToggle } from "@ark-ui/react/toggle";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

/**
 * Shared toggle styles, also used by toggle-group items. Variants and sizes
 * mirror the button so toggles sit naturally next to buttons; the pressed
 * ("on") state is expressed through `data-[state=on]`.
 */
const toggleVariants = cva(
  "focus-visible:ring-primary focus-visible:ring-offset-background inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        ghost:
          "hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground bg-transparent",
        outline:
          "bg-background hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground border shadow-xs",
        solid:
          "bg-muted text-muted-foreground hover:bg-muted/80 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90 shadow-xs",
      },
      size: {
        sm: "h-8 min-w-8 gap-1.5 px-2.5",
        md: "h-9 min-w-9 px-3",
        lg: "h-10 min-w-10 px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  },
);

const ToggleContext = ArkToggle.Context;

/**
 * A two-state button that can be either on or off. Use `pressed` and
 * `onPressedChange` to control it, or `defaultPressed` for uncontrolled use.
 */
const Toggle = ({
  className,
  variant,
  size,
  ...rest
}: ComponentProps<typeof ArkToggle.Root> &
  VariantProps<typeof toggleVariants>) => (
  <ArkToggle.Root
    className={cn(toggleVariants({ variant, size }), className)}
    {...rest}
  />
);

/**
 * Renders `children` while the toggle is on and `fallback` while it is off,
 * e.g. to swap an outlined icon for a filled one.
 */
const ToggleIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkToggle.Indicator>) => (
  <ArkToggle.Indicator
    className={cn("inline-flex items-center", className)}
    {...rest}
  />
);

export { Toggle, ToggleContext, ToggleIndicator, toggleVariants };
