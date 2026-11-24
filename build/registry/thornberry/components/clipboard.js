import {
  buttonVariants2
} from "../../../chunks/ai-describe-panel-h4yrvya3.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/clipboard.tsx
import {
  Clipboard as ArkClipboard,
  useClipboardContext
} from "@ark-ui/react/clipboard";
import { Check, Copy } from "lucide-react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var ClipboardProvider = ArkClipboard.RootProvider;
var ClipboardContext = ArkClipboard.Context;
var ClipboardRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkClipboard.Root, {
  className: cn("flex w-full flex-col gap-1.5", className),
  ...rest
});
var ClipboardLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkClipboard.Label, {
  className: cn("font-medium text-foreground text-sm", className),
  ...rest
});
var ClipboardControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkClipboard.Control, {
  className: cn("flex items-center gap-2", className),
  ...rest
});
var ClipboardInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkClipboard.Input, {
  className: cn("flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 font-mono text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50", className),
  ...rest
});
var ClipboardIcon = ({ className }) => {
  const clipboard = useClipboardContext();
  return clipboard.copied ? /* @__PURE__ */ jsx(Check, {
    className: cn("size-4", className),
    "aria-hidden": "true"
  }) : /* @__PURE__ */ jsx(Copy, {
    className: cn("size-4", className),
    "aria-hidden": "true"
  });
};
var ClipboardTrigger = ({
  className,
  variant = "outline",
  size = "icon",
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkClipboard.Trigger, {
  className: cn(buttonVariants2({ variant, size }), className),
  ...rest,
  children: children ?? /* @__PURE__ */ jsx(ClipboardIcon, {})
});
var ClipboardIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkClipboard.Indicator, {
  className: cn("inline-flex items-center", className),
  ...rest
});
var ClipboardValueText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkClipboard.ValueText, {
  className: cn("font-mono text-sm", className),
  ...rest
});
var Clipboard = ({ label, ...rest }) => /* @__PURE__ */ jsxs(ClipboardRoot, {
  ...rest,
  children: [
    label && /* @__PURE__ */ jsx(ClipboardLabel, {
      children: label
    }),
    /* @__PURE__ */ jsxs(ClipboardControl, {
      children: [
        /* @__PURE__ */ jsx(ClipboardInput, {}),
        /* @__PURE__ */ jsx(ClipboardTrigger, {})
      ]
    })
  ]
});
var CopyButton = ({
  value,
  timeout,
  onCopy,
  label = "Copy to clipboard",
  copiedLabel = "Copied",
  variant = "ghost",
  size = "icon",
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkClipboard.Root, {
  value,
  timeout,
  onStatusChange: ({ copied }) => {
    if (copied)
      onCopy?.();
  },
  className: "inline-flex",
  children: /* @__PURE__ */ jsx(ArkClipboard.Context, {
    children: (clipboard) => /* @__PURE__ */ jsxs(Fragment, {
      children: [
        /* @__PURE__ */ jsxs(ArkClipboard.Trigger, {
          "aria-label": clipboard.copied ? copiedLabel : label,
          className: cn(buttonVariants2({ variant, size }), className),
          ...rest,
          children: [
            /* @__PURE__ */ jsx(ClipboardIcon, {}),
            children
          ]
        }),
        /* @__PURE__ */ jsx("span", {
          "aria-live": "polite",
          className: "sr-only",
          children: clipboard.copied ? copiedLabel : ""
        })
      ]
    })
  })
});
export {
  Clipboard,
  ClipboardContext,
  ClipboardControl,
  ClipboardIndicator,
  ClipboardInput,
  ClipboardLabel,
  ClipboardProvider,
  ClipboardRoot,
  ClipboardTrigger,
  ClipboardValueText,
  CopyButton
};
