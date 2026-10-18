import {
  cn
} from "./account-user-two-factor-authentication-81fr4sax.js";

// src/registry/thornberry/components/select.tsx
import { Select as ArkSelect } from "@ark-ui/react/select";
import { Check } from "lucide-react";
import { createListCollection as createListCollection2 } from "@ark-ui/react";
import { jsx } from "react/jsx-runtime";
var SelectRoot2 = ArkSelect.Root;
var SelectRootProvider2 = ArkSelect.RootProvider;
var SelectContext2 = ArkSelect.Context;
var SelectHiddenSelect2 = ArkSelect.HiddenSelect;
var Select2 = ({ className, ...rest }) => /* @__PURE__ */ jsx(ArkSelect.Root, {
  className,
  ...rest
});
var SelectLabel2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.Label, {
  className: cn("font-medium text-muted-foreground text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
  ...rest
});
var SelectControl2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.Control, {
  className,
  ...rest
});
var SelectTrigger2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.Trigger, {
  className: cn("flex w-fit cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-md px-3 py-2 text-foreground text-sm shadow-xs outline-none transition-transform disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=xs]:h-7 dark:aria-invalid:ring-destructive/40 dark:hover:bg-base-800 [&[data-state=open]>svg]:rotate-180 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className),
  ...rest
});
var SelectValueText2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.ValueText, {
  className: cn("line-clamp-1 flex items-center gap-2", className),
  ...rest
});
var SelectIndicator2 = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.Indicator, {
  className: cn("size-4 transition-transform", className),
  ...rest,
  children
});
var SelectClearTrigger2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.ClearTrigger, {
  className: cn("w-full outline-none focus-visible:bg-muted focus-visible:outline-none", className),
  ...rest
});
var SelectPositioner2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.Positioner, {
  className,
  ...rest
});
var SelectContent2 = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.Content, {
  className: cn("no-scrollbar data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--available-height) w-fit min-w-32 origin-(--transform-origin) overflow-auto overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest,
  children
});
var SelectItemGroup2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.ItemGroup, {
  className,
  ...rest
});
var SelectItemGroupLabel2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.ItemGroupLabel, {
  className: cn("px-2 py-1.5 font-semibold text-muted-foreground text-xs", className),
  ...rest
});
var SelectItem2 = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.Item, {
  className: cn("relative flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-hidden hover:bg-muted focus:bg-muted data-disabled:pointer-events-none data-[state=checked]:bg-muted data-highlighted:bg-muted data-inset:pl-8 data-disabled:opacity-50 data-[state=checked]:hover:bg-muted [&[data-state=checked][data-highlighted]]:bg-muted [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className),
  ...rest,
  children
});
var SelectItemText2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.ItemText, {
  className: cn("flex items-center gap-2", className),
  ...rest
});
var SelectItemIndicator2 = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSelect.ItemIndicator, {
  className: cn("ml-auto flex h-3.5 w-3.5 items-center justify-center text-green-500", className),
  ...rest,
  children: /* @__PURE__ */ jsx(Check, {
    className: "size-4"
  })
});
var SelectSeparator2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx("div", {
  className: cn("pointer-events-none -mx-1 my-1 h-px bg-border", className),
  ...rest
});
export { SelectRoot2, SelectRootProvider2, SelectContext2, SelectHiddenSelect2, Select2, SelectLabel2, SelectControl2, SelectTrigger2, SelectValueText2, SelectIndicator2, SelectClearTrigger2, SelectPositioner2, SelectContent2, SelectItemGroup2, SelectItemGroupLabel2, SelectItem2, SelectItemText2, SelectItemIndicator2, SelectSeparator2, createListCollection2 };
