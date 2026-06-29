import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/popover.tsx
import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { X } from "lucide-react";
import { jsxDEV } from "react/jsx-dev-runtime";
var PopoverProvider = ArkPopover.RootProvider;
var PopoverContext = ArkPopover.Context;
var PopoverRoot = ArkPopover.Root;
var PopoverArrow = ArkPopover.Arrow;
var PopoverTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPopover.Trigger, {
  className: cn(className),
  ...rest
}, undefined, false, undefined, this);
var PopoverContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPopover.Content, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest
}, undefined, false, undefined, this);
var PopoverPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPopover.Positioner, {
  className,
  ...rest
}, undefined, false, undefined, this);
var PopoverArrowTip = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPopover.ArrowTip, {
  className: cn("border-t border-l", className),
  ...rest
}, undefined, false, undefined, this);
var PopoverCloseTrigger = ({
  className,
  children,
  asChild,
  ...rest
}) => {
  if (!children) {
    return /* @__PURE__ */ jsxDEV(ArkPopover.CloseTrigger, {
      className: cn("opacity] absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-[color,box-shadow, hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", className),
      ...rest,
      children: [
        /* @__PURE__ */ jsxDEV(X, {
          className: "h-4 w-4"
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV("span", {
          className: "sr-only",
          children: "Close"
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this);
  }
  return /* @__PURE__ */ jsxDEV(ArkPopover.CloseTrigger, {
    className,
    asChild,
    ...rest,
    children
  }, undefined, false, undefined, this);
};
var PopoverTitle = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPopover.Title, {
  className: cn("font-semibold text-lg", className),
  ...rest
}, undefined, false, undefined, this);
var PopoverDescription = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPopover.Description, {
  className: cn("text-muted-foreground text-sm", className),
  ...rest
}, undefined, false, undefined, this);
export {
  PopoverTrigger,
  PopoverTitle,
  PopoverRoot,
  PopoverProvider,
  PopoverPositioner,
  PopoverDescription,
  PopoverContext,
  PopoverContent,
  PopoverCloseTrigger,
  PopoverArrowTip,
  PopoverArrow
};
