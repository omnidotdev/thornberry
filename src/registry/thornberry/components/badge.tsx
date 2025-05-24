import { ark } from "@ark-ui/react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const badgeVariants = cva(
  "inline-flex select-none items-center whitespace-nowrap rounded-md border font-medium transition-colors",
  {
    variants: {
      variant: {
        solid: "border-transparent bg-primary text-primary-foreground",
        subtle:
          "border-transparent bg-primary-200/20 text-foreground dark:bg-primary-900/20",
        outline: "text-foreground",
      },
      size: {
        sm: "h-5 gap-1 px-2 text-xs [&_svg]:size-3",
        md: "h-6 gap-1 px-2.5 text-xs [&_svg]:size-4",
        lg: "h-7 gap-1 px-3 text-sm [&_svg]:size-4",
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
