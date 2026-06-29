import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/select.tsx
import { Select as ArkSelect } from "@ark-ui/react/select";
import { Check } from "lucide-react";
import { createListCollection } from "@ark-ui/react";
import { jsxDEV } from "react/jsx-dev-runtime";
var SelectRoot = ArkSelect.Root;
var SelectRootProvider = ArkSelect.RootProvider;
var SelectContext = ArkSelect.Context;
var SelectHiddenSelect = ArkSelect.HiddenSelect;
var Select = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV(ArkSelect.Root, {
  className,
  ...rest
}, undefined, false, undefined, this);
var SelectLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.Label, {
  className: cn("font-medium text-muted-foreground text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
  ...rest
}, undefined, false, undefined, this);
var SelectControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.Control, {
  className,
  ...rest
}, undefined, false, undefined, this);
var SelectTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.Trigger, {
  className: cn("flex w-fit cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-md px-3 py-2 text-foreground text-sm shadow-xs outline-none transition-transform disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=xs]:h-7 dark:aria-invalid:ring-destructive/40 dark:hover:bg-base-800 [&[data-state=open]>svg]:rotate-180 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className),
  ...rest
}, undefined, false, undefined, this);
var SelectValueText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.ValueText, {
  className: cn("line-clamp-1 flex items-center gap-2", className),
  ...rest
}, undefined, false, undefined, this);
var SelectIndicator = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.Indicator, {
  className: cn("size-4 transition-transform", className),
  ...rest,
  children
}, undefined, false, undefined, this);
var SelectClearTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.ClearTrigger, {
  className: cn("w-full outline-none focus-visible:bg-accent focus-visible:outline-none", className),
  ...rest
}, undefined, false, undefined, this);
var SelectPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.Positioner, {
  className,
  ...rest
}, undefined, false, undefined, this);
var SelectContent = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.Content, {
  className: cn("no-scrollbar data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--available-height) w-fit min-w-32 origin-(--transform-origin) overflow-auto overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest,
  children
}, undefined, false, undefined, this);
var SelectItemGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.ItemGroup, {
  className,
  ...rest
}, undefined, false, undefined, this);
var SelectItemGroupLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.ItemGroupLabel, {
  className: cn("px-2 py-1.5 font-semibold text-muted-foreground text-xs", className),
  ...rest
}, undefined, false, undefined, this);
var SelectItem = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.Item, {
  className: cn("relative flex cursor-default select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-hidden hover:bg-accent focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-[state=checked]:bg-accent data-highlighted:bg-accent data-inset:pl-8 data-[state=checked]:text-accent-foreground data-highlighted:text-accent-foreground data-disabled:opacity-50 data-[state=checked]:hover:bg-sidebar-accent/80 [&[data-state=checked][data-highlighted]]:bg-sidebar-accent/80 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className),
  ...rest,
  children
}, undefined, false, undefined, this);
var SelectItemText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.ItemText, {
  className: cn("flex items-center gap-2", className),
  ...rest
}, undefined, false, undefined, this);
var SelectItemIndicator = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSelect.ItemIndicator, {
  className: cn("ml-auto flex h-3.5 w-3.5 items-center justify-center text-green-500", className),
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Check, {
    className: "size-4"
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var SelectSeparator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV("div", {
  className: cn("pointer-events-none -mx-1 my-1 h-px bg-border", className),
  ...rest
}, undefined, false, undefined, this);
export {
  createListCollection,
  SelectValueText,
  SelectTrigger,
  SelectSeparator,
  SelectRootProvider,
  SelectRoot,
  SelectPositioner,
  SelectLabel,
  SelectItemText,
  SelectItemIndicator,
  SelectItemGroupLabel,
  SelectItemGroup,
  SelectItem,
  SelectIndicator,
  SelectHiddenSelect,
  SelectControl,
  SelectContext,
  SelectContent,
  SelectClearTrigger,
  Select
};
