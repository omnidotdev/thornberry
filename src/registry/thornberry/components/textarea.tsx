import { ark } from "@ark-ui/react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

/**
 * Multi-line text control, styled to match `Input`. Pair with `Label` via
 * `htmlFor`; set `aria-invalid` to show the error state.
 */
const Textarea = ({
  className,
  ...rest
}: ComponentProps<typeof ark.textarea>) => (
  <ark.textarea
    className={cn(
      "flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive md:text-sm",
      className,
    )}
    {...rest}
  />
);

export { Textarea };
