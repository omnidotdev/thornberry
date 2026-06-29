import {
  Button
} from "../../../chunks/avatar-k4xwgeme.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/combobox.tsx
import { Combobox as ArkCombobox } from "@ark-ui/react/combobox";
import { Check, ChevronsUpDown } from "lucide-react";
import { jsxDEV } from "react/jsx-dev-runtime";
var ComboboxProvider = ArkCombobox.RootProvider;
var ComboboxContext = ArkCombobox.Context;
var ComboboxRoot = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV(ArkCombobox.Root, {
  className: cn("flex w-full flex-col gap-1.5", className),
  ...rest
}, undefined, false, undefined, this);
var ComboboxLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.Label, {
  className: cn("block font-medium text-sm", className),
  ...rest
}, undefined, false, undefined, this);
var ComboboxControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.Control, {
  className: cn("relative flex items-center justify-between", className),
  ...rest
}, undefined, false, undefined, this);
var ComboboxInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.Input, {
  className: cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
  ...rest
}, undefined, false, undefined, this);
var ComboboxTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.Trigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Button, {
    variant: "ghost",
    size: "icon",
    className: cn("absolute top-0.5 right-0.5 opacity-50 hover:bg-background", className),
    children: /* @__PURE__ */ jsxDEV(ChevronsUpDown, {
      className: "size-4"
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var ComboboxClearTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.ClearTrigger, {
  className: cn("absolute top-0 right-10 flex h-full items-center justify-center pr-2 text-muted-foreground hover:text-foreground disabled:pointer-events-none", className),
  ...rest
}, undefined, false, undefined, this);
var ComboboxPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.Positioner, {
  className: cn("z-50 w-full min-w-32", className),
  ...rest
}, undefined, false, undefined, this);
var ComboboxContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.Content, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 max-h-[300px] overflow-y-auto rounded-md border bg-popover p-1 shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest
}, undefined, false, undefined, this);
var ComboboxItem = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.Item, {
  className: cn("flex w-full cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 pr-2 text-sm outline-none data-disabled:pointer-events-none data-[state=checked]:bg-accent data-highlighted:bg-accent data-[state=checked]:text-accent-foreground data-highlighted:text-accent-foreground data-disabled:opacity-50", className),
  ...rest,
  children
}, undefined, false, undefined, this);
var ComboboxItemGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.ItemGroup, {
  className: cn("p-1", className),
  ...rest
}, undefined, false, undefined, this);
var ComboboxItemGroupLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.ItemGroupLabel, {
  className: cn("px-2 py-1.5 font-medium text-muted-foreground text-xs", className),
  ...rest
}, undefined, false, undefined, this);
var ComboboxItemIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.ItemIndicator, {
  className: cn("ml-auto flex h-3.5 w-3.5 items-center justify-center", className),
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Check, {
    className: "size-4"
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var ComboboxItemText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCombobox.ItemText, {
  className,
  ...rest
}, undefined, false, undefined, this);
export {
  ComboboxTrigger,
  ComboboxRoot,
  ComboboxProvider,
  ComboboxPositioner,
  ComboboxLabel,
  ComboboxItemText,
  ComboboxItemIndicator,
  ComboboxItemGroupLabel,
  ComboboxItemGroup,
  ComboboxItem,
  ComboboxInput,
  ComboboxControl,
  ComboboxContext,
  ComboboxContent,
  ComboboxClearTrigger
};
