import {
  cva
} from "./ai-describe-panel-dcxtbj5x.js";
import {
  cn
} from "./ai-describe-panel-zm6svx9v.js";

// src/registry/thornberry/components/toggle.tsx
import { Toggle as ArkToggle } from "@ark-ui/react/toggle";
import { jsx } from "react/jsx-runtime";
var toggleVariants2 = cva("focus-visible:ring-primary focus-visible:ring-offset-background inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50", {
  variants: {
    variant: {
      ghost: "hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground bg-transparent",
      outline: "bg-background hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground border shadow-xs",
      solid: "bg-muted text-muted-foreground hover:bg-muted/80 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90 shadow-xs"
    },
    size: {
      sm: "h-8 min-w-8 gap-1.5 px-2.5",
      md: "h-9 min-w-9 px-3",
      lg: "h-10 min-w-10 px-4",
      icon: "size-9"
    }
  },
  defaultVariants: {
    variant: "ghost",
    size: "md"
  }
});
var ToggleContext2 = ArkToggle.Context;
var Toggle2 = ({
  className,
  variant,
  size,
  ...rest
}) => /* @__PURE__ */ jsx(ArkToggle.Root, {
  className: cn(toggleVariants2({ variant, size }), className),
  ...rest
});
var ToggleIndicator2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkToggle.Indicator, {
  className: cn("inline-flex items-center", className),
  ...rest
});
export { toggleVariants2, ToggleContext2, Toggle2, ToggleIndicator2 };
