import {
  cn
} from "./account-user-two-factor-authentication-81fr4sax.js";

// src/registry/thornberry/components/dialog.tsx
import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var DialogProvider2 = ArkDialog.RootProvider;
var DialogContext2 = ArkDialog.Context;
var DialogRoot2 = ArkDialog.Root;
var DialogPortal2 = Portal;
var DialogTrigger2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Trigger, {
  className: cn("", className),
  ...rest
});
var DialogBackdrop2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Backdrop, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest
});
var DialogPositioner2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Positioner, {
  className: cn("fixed inset-0 z-50 flex items-center justify-center", className),
  ...rest
});
var DialogContent2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Content, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg", className),
  ...rest
});
var DialogTitle2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Title, {
  className: cn("font-semibold text-lg leading-none tracking-tight", className),
  ...rest
});
var DialogDescription2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkDialog.Description, {
  className: cn("text-muted-foreground text-sm", className),
  ...rest
});
var DialogCloseTrigger2 = ({
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
export { DialogProvider2, DialogContext2, DialogRoot2, DialogPortal2, DialogTrigger2, DialogBackdrop2, DialogPositioner2, DialogContent2, DialogTitle2, DialogDescription2, DialogCloseTrigger2 };
