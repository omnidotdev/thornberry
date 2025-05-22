import { ark } from "@ark-ui/react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-5 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        error:
          "bg-destructive/5 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        info: "bg-blue-500/5 border-blue-500/50 text-blue-500 dark:border-blue-500 [&>svg]:text-blue-500",
        warning:
          "bg-yellow-500/5 border-yellow-500/50 text-yellow-500 dark:border-yellow-500 [&>svg]:text-yellow-500",
        success:
          "bg-green-500/5 border-green-500/50 text-green-500 dark:border-green-500 [&>svg]:text-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = ({
  className,
  variant,
  ...rest
}: ComponentProps<typeof ark.div> & VariantProps<typeof alertVariants>) => (
  <ark.div
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...rest}
  />
);

const AlertIcon = ({ className, ...rest }: ComponentProps<typeof ark.svg>) => (
  <ark.svg
    className={cn("text-foreground shrink-0 size-5", className)}
    asChild
    {...rest}
  />
);

const AlertTitle = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn(
      "-mt-1 mb-1 font-bold leading-none tracking-tight text-lg",
      className,
    )}
    {...rest}
  />
);

const AlertDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...rest}
  />
);

export { Alert, AlertIcon, AlertTitle, AlertDescription, alertVariants };
