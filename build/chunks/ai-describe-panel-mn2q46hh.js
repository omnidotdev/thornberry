import {
  cva
} from "./ai-describe-panel-g7wczx51.js";
import {
  cn
} from "./ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/badge.tsx
import { ark } from "@ark-ui/react";
import { jsx } from "react/jsx-runtime";
var badgeVariants2 = cva("focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3", {
  variants: {
    variant: {
      solid: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent",
      secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent",
      destructive: "bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 border-transparent text-white",
      outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      soft: "bg-muted text-muted-foreground border-transparent",
      success: "border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      warning: "border-transparent bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
      info: "border-transparent bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
      danger: "border-transparent bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300"
    }
  },
  defaultVariants: {
    variant: "solid"
  }
});
var Badge2 = ({
  className,
  variant,
  ...rest
}) => /* @__PURE__ */ jsx(ark.div, {
  className: cn(badgeVariants2({ variant }), className),
  ...rest
});
export { badgeVariants2, Badge2 };
