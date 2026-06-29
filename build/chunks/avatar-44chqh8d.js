import {
  cn
} from "./avatar-yp1ewaxt.js";

// src/registry/thornberry/components/sheet.tsx
import { Dialog as ArkSheet } from "@ark-ui/react/dialog";
import { X } from "lucide-react";
import { jsxDEV } from "react/jsx-dev-runtime";
var SheetProvider = ArkSheet.RootProvider;
var SheetContext = ArkSheet.Context;
var SheetRoot = ArkSheet.Root;
var SheetTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSheet.Trigger, {
  className,
  ...rest
}, undefined, false, undefined, this);
var SheetBackdrop = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSheet.Backdrop, {
  className,
  ...rest
}, undefined, false, undefined, this);
var SheetPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSheet.Positioner, {
  className,
  ...rest
}, undefined, false, undefined, this);
var SheetContent = ({
  className,
  side = "left",
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSheet.Content, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed z-50 bg-background data-[state=closed]:animate-out data-[state=open]:animate-in", side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm", side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm", side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b", side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t", className),
  ...rest
}, undefined, false, undefined, this);
var SheetTitle = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSheet.Title, {
  className: cn("font-semibold text-lg leading-none tracking-tight", className),
  ...rest
}, undefined, false, undefined, this);
var SheetDescription = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSheet.Description, {
  className: cn("text-muted-foreground text-sm", className),
  ...rest
}, undefined, false, undefined, this);
var SheetCloseTrigger = ({
  className,
  children,
  asChild,
  ...rest
}) => {
  if (!children) {
    return /* @__PURE__ */ jsxDEV(ArkSheet.CloseTrigger, {
      className: cn("absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", className),
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
  return /* @__PURE__ */ jsxDEV(ArkSheet.CloseTrigger, {
    className,
    asChild,
    ...rest,
    children
  }, undefined, false, undefined, this);
};
export { SheetProvider, SheetContext, SheetRoot, SheetTrigger, SheetBackdrop, SheetPositioner, SheetContent, SheetTitle, SheetDescription, SheetCloseTrigger };
