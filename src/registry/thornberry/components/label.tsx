import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

/**
 * Text label for a form control. Pair with a control's `id` via `htmlFor`.
 */
const Label = ({ className, ...rest }: ComponentProps<"label">) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: generic primitive; the control association (htmlFor) is supplied by the consumer via spread props
  <label
    className={cn(
      "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...rest}
  />
);

export { Label };
