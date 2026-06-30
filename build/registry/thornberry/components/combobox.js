import {
  Button
} from "../../../chunks/avatar-jb3sh07m.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/combobox.tsx
import { Combobox as ArkCombobox } from "@ark-ui/react/combobox";
import { Check, ChevronsUpDown } from "lucide-react";
import { jsx } from "react/jsx-runtime";
var ComboboxProvider = ArkCombobox.RootProvider;
var ComboboxContext = ArkCombobox.Context;
var ComboboxRoot = ({ className, ...rest }) => /* @__PURE__ */ jsx(ArkCombobox.Root, {
  className: cn("flex w-full flex-col gap-1.5", className),
  ...rest
});
var ComboboxLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Label, {
  className: cn("block font-medium text-sm", className),
  ...rest
});
var ComboboxControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Control, {
  className: cn("relative flex items-center justify-between", className),
  ...rest
});
var ComboboxInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Input, {
  className: cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
  ...rest
});
var ComboboxTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Trigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsx(Button, {
    variant: "ghost",
    size: "icon",
    className: cn("absolute top-0.5 right-0.5 opacity-50 hover:bg-background", className),
    children: /* @__PURE__ */ jsx(ChevronsUpDown, {
      className: "size-4"
    })
  })
});
var ComboboxClearTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.ClearTrigger, {
  className: cn("absolute top-0 right-10 flex h-full items-center justify-center pr-2 text-muted-foreground hover:text-foreground disabled:pointer-events-none", className),
  ...rest
});
var ComboboxPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Positioner, {
  className: cn("z-50 w-full min-w-32", className),
  ...rest
});
var ComboboxContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Content, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 max-h-[300px] overflow-y-auto rounded-md border bg-popover p-1 shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest
});
var ComboboxItem = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.Item, {
  className: cn("flex w-full cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 pr-2 text-sm outline-none data-disabled:pointer-events-none data-[state=checked]:bg-accent data-highlighted:bg-accent data-[state=checked]:text-accent-foreground data-highlighted:text-accent-foreground data-disabled:opacity-50", className),
  ...rest,
  children
});
var ComboboxItemGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.ItemGroup, {
  className: cn("p-1", className),
  ...rest
});
var ComboboxItemGroupLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.ItemGroupLabel, {
  className: cn("px-2 py-1.5 font-medium text-muted-foreground text-xs", className),
  ...rest
});
var ComboboxItemIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.ItemIndicator, {
  className: cn("ml-auto flex h-3.5 w-3.5 items-center justify-center", className),
  ...rest,
  children: /* @__PURE__ */ jsx(Check, {
    className: "size-4"
  })
});
var ComboboxItemText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCombobox.ItemText, {
  className,
  ...rest
});
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
