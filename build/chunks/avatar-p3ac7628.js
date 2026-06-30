import {
  cn
} from "./avatar-yp1ewaxt.js";

// src/registry/thornberry/components/dialog.tsx
import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var DialogProvider = ArkDialog.RootProvider;
var DialogContext = ArkDialog.Context;
var DialogRoot = ArkDialog.Root;
var DialogTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Trigger, {
  className: cn("", className),
  ...rest
});
var DialogBackdrop = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Backdrop, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest
});
var DialogPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Positioner, {
  className: cn("fixed inset-0 z-50 flex items-center justify-center", className),
  ...rest
});
var DialogContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Content, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg", className),
  ...rest
});
var DialogTitle = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Title, {
  className: cn("font-semibold text-lg leading-none tracking-tight", className),
  ...rest
});
var DialogDescription = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Description, {
  className: cn("text-muted-foreground text-sm", className),
  ...rest
});
var DialogCloseTrigger = ({
  className,
  children,
  asChild,
  ...rest
}) => {
  if (!children) {
    return /* @__PURE__ */ jsxs(ArkDialog.CloseTrigger, {
      className: cn("absolute top-4 right-4 cursor-pointer rounded opacity-70 outline-none ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none", className),
      ...rest,
      children: [
        /* @__PURE__ */ jsx(X, {
          className: "h-4 w-4"
        }),
        /* @__PURE__ */ jsx("span", {
          className: "sr-only",
          children: "Close"
        })
      ]
    });
  }
  return /* @__PURE__ */ jsx(ArkDialog.CloseTrigger, {
    className,
    asChild,
    ...rest,
    children
  });
};
export { DialogProvider, DialogContext, DialogRoot, DialogTrigger, DialogBackdrop, DialogPositioner, DialogContent, DialogTitle, DialogDescription, DialogCloseTrigger };
