import {
  cva
} from "../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/alert.tsx
import { ark } from "@ark-ui/react";
import { jsxDEV } from "react/jsx-dev-runtime";
var alertVariants = cva("relative w-full rounded-lg border px-4 py-5 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg]:text-foreground [&>svg~*]:pl-7", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      error: "border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive [&>svg]:text-destructive",
      info: "border-blue-500/50 bg-blue-500/5 text-blue-500 dark:border-blue-500 [&>svg]:text-blue-500",
      warning: "border-yellow-500/50 bg-yellow-500/5 text-yellow-500 dark:border-yellow-500 [&>svg]:text-yellow-500",
      success: "border-green-500/50 bg-green-500/5 text-green-500 dark:border-green-500 [&>svg]:text-green-500"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
var AlertRoot = ({
  className,
  variant,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ark.div, {
  role: "alert",
  className: cn(alertVariants({ variant }), className),
  ...rest
}, undefined, false, undefined, this);
var AlertIcon = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV(ark.svg, {
  className: cn("size-5 shrink-0", className),
  asChild: true,
  ...rest
}, undefined, false, undefined, this);
var AlertTitle = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV(ark.div, {
  className: cn("mb-1 font-bold text-lg leading-none tracking-tight", className),
  ...rest
}, undefined, false, undefined, this);
var AlertDescription = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ark.div, {
  className: cn("text-sm [&_p]:leading-relaxed", className),
  ...rest
}, undefined, false, undefined, this);
export {
  alertVariants,
  AlertTitle,
  AlertRoot,
  AlertIcon,
  AlertDescription
};
