import {
  cva
} from "./ai-describe-panel-g7wczx51.js";
import {
  cn
} from "./ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/button.tsx
import { ark } from "@ark-ui/react";
import { jsx } from "react/jsx-runtime";
var buttonVariants2 = cva("focus-visible:ring-offset-background focus-visible:ring-primary aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap outline-hidden transition-[color,box-shadow,transform] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
  variants: {
    variant: {
      solid: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
      outline: "bg-background hover:bg-accent hover:text-accent-foreground border shadow-xs",
      muted: "bg-muted text-muted-foreground hover:bg-muted/80 shadow-xs",
      ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      link: "text-primary underline-offset-2 hover:underline",
      destructive: "bg-destructive text-background hover:bg-destructive/90 shadow-xs focus-visible:ring-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40",
      unstyled: ""
    },
    size: {
      xs: "h-7 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5",
      sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
      md: "h-9 px-4 py-2 has-[>svg]:px-3",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9"
    }
  },
  defaultVariants: {
    variant: "solid",
    size: "md"
  }
});
var Button2 = ({
  className,
  variant,
  size,
  ...rest
}) => /* @__PURE__ */ jsx(ark.button, {
  type: "button",
  className: cn(buttonVariants2({ variant, size }), className),
  ...rest
});
export { buttonVariants2, Button2 };
