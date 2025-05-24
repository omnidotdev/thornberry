import { ark } from "@ark-ui/react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border transition-colors select-none font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        solid: "border-transparent bg-primary text-primary-foreground",
        subtle:
          "border-transparent bg-primary-200/20 dark:bg-primary-900/20 text-foreground",
        outline: "text-foreground",
      },
      size: {
        sm: "text-xs px-2 h-5 gap-1 [&_svg]:size-3",
        md: "text-xs px-2.5 h-6 gap-1 [&_svg]:size-4",
        lg: "text-sm px-3 h-7 gap-1 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

const Badge = ({
  className,
  variant,
  size,
  ...rest
}: ComponentProps<typeof ark.div> & VariantProps<typeof badgeVariants>) => (
  <ark.div
    className={cn(badgeVariants({ className, variant, size }))}
    {...rest}
  />
);

export { Badge, badgeVariants };
