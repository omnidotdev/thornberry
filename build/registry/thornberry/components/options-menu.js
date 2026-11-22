import {
  cn
} from "../../../chunks/ai-describe-panel-zm6svx9v.js";

// src/registry/thornberry/components/options-menu.tsx
import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { Portal } from "@ark-ui/react/portal";
import { RadioGroup as ArkRadioGroup } from "@ark-ui/react/radio-group";
import { SlidersHorizontal } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var OptionsMenu = ({
  label = "Options",
  showLabel = false,
  icon,
  children,
  disabled = false,
  open,
  onOpenChange,
  placement = "top-end",
  className,
  contentClassName
}) => /* @__PURE__ */ jsxs(ArkPopover.Root, {
  open,
  onOpenChange: onOpenChange ? (details) => onOpenChange(details.open) : undefined,
  positioning: { placement, gutter: 8 },
  lazyMount: true,
  unmountOnExit: true,
  children: [
    /* @__PURE__ */ jsxs(ArkPopover.Trigger, {
      type: "button",
      disabled,
      "aria-label": showLabel ? undefined : label,
      title: label,
      className: cn("inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-40 data-[state=open]:text-foreground pointer-fine:min-h-8 pointer-fine:min-w-8", !showLabel && "px-0", className),
      children: [
        icon ?? /* @__PURE__ */ jsx(SlidersHorizontal, {
          className: "size-4",
          "aria-hidden": "true"
        }),
        showLabel && /* @__PURE__ */ jsx("span", {
          children: label
        })
      ]
    }),
    /* @__PURE__ */ jsx(Portal, {
      children: /* @__PURE__ */ jsx(ArkPopover.Positioner, {
        children: /* @__PURE__ */ jsxs(ArkPopover.Content, {
          className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 flex w-72 flex-col gap-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in", contentClassName),
          children: [
            /* @__PURE__ */ jsx(ArkPopover.Title, {
              className: "px-1 text-sm font-semibold",
              children: label
            }),
            children
          ]
        })
      })
    })
  ]
});
var OptionsMenuChoice = ({
  label,
  value,
  onValueChange,
  options,
  disabled = false,
  className
}) => /* @__PURE__ */ jsxs(ArkRadioGroup.Root, {
  value,
  onValueChange: (details) => {
    if (details.value)
      onValueChange(details.value);
  },
  disabled,
  className: cn("flex flex-col gap-1", className),
  children: [
    /* @__PURE__ */ jsx(ArkRadioGroup.Label, {
      className: "text-muted-foreground px-1 text-xs font-medium",
      children: label
    }),
    options.map((option) => /* @__PURE__ */ jsxs(ArkRadioGroup.Item, {
      value: option.value,
      className: "group hover:bg-accent data-[state=checked]:bg-accent flex min-h-11 cursor-pointer items-start gap-2.5 rounded-md px-2 py-2 transition-colors data-disabled:cursor-not-allowed data-disabled:opacity-50",
      children: [
        /* @__PURE__ */ jsx(ArkRadioGroup.ItemHiddenInput, {}),
        /* @__PURE__ */ jsx(ArkRadioGroup.ItemControl, {
          className: "border-input data-focus-visible:ring-primary data-[state=checked]:border-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors data-focus-visible:ring-2",
          children: /* @__PURE__ */ jsx("span", {
            className: "bg-primary size-2 rounded-full opacity-0 transition-opacity group-data-[state=checked]:opacity-100"
          })
        }),
        /* @__PURE__ */ jsxs("span", {
          className: "flex min-w-0 flex-1 flex-col gap-0.5",
          children: [
            /* @__PURE__ */ jsxs("span", {
              className: "flex items-baseline justify-between gap-2",
              children: [
                /* @__PURE__ */ jsx(ArkRadioGroup.ItemText, {
                  className: "text-sm leading-tight font-medium",
                  children: option.label
                }),
                option.hint && /* @__PURE__ */ jsx("span", {
                  className: "text-muted-foreground shrink-0 text-xs",
                  children: option.hint
                })
              ]
            }),
            option.description && /* @__PURE__ */ jsx("span", {
              className: "text-muted-foreground text-xs leading-snug",
              children: option.description
            })
          ]
        })
      ]
    }, option.value))
  ]
});
export {
  OptionsMenu,
  OptionsMenuChoice
};
