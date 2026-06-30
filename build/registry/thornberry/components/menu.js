import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/menu.tsx
import { Menu as ArkMenu } from "@ark-ui/react/menu";
import { Check, ChevronRight } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var MenuProvider = ArkMenu.RootProvider;
var MenuRoot = ArkMenu.Root;
var MenuContextTrigger = ArkMenu.ContextTrigger;
var PrimitiveMenuIndicator = ArkMenu.ItemIndicator;
var MenuTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.Trigger, {
  className,
  ...rest
});
var MenuPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.Positioner, {
  className,
  ...rest
});
var MenuContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.Content, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 flex min-w-32 origin-(--transform-origin) flex-col gap-0.5 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest
});
var MenuArrow = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.Arrow, {
  className: cn("fill-popover", className),
  ...rest
});
var MenuArrowTip = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.ArrowTip, {
  className: cn("fill-border", className),
  ...rest
});
var MenuItem = ({
  className,
  children,
  variant = "default",
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.Item, {
  "data-variant": variant,
  className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden hover:bg-accent focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-[state=checked]:bg-accent data-highlighted:bg-accent data-inset:pl-8 data-[state=checked]:text-accent-foreground data-[variant=destructive]:text-destructive data-highlighted:text-accent-foreground data-disabled:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 [&[data-state=checked][data-highlighted]]:bg-sidebar-accent/80 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[variant=destructive]:*:[svg]:text-destructive!", variant === "destructive" && "data-highlighted:bg-destructive/10 data-highlighted:text-destructive", className),
  ...rest,
  children
});
var MenuCheckboxItem = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.CheckboxItem, {
  className: cn("relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-[state=checked]:bg-accent data-highlighted:bg-accent data-[state=checked]:text-accent-foreground data-highlighted:text-accent-foreground data-disabled:opacity-50 [&[data-state=checked][data-highlighted]]:bg-sidebar-accent/80", className),
  ...rest,
  children
});
var MenuItemGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.ItemGroup, {
  className: cn("overflow-hidden", className),
  ...rest
});
var MenuItemGroupLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.ItemGroupLabel, {
  className: cn("flex w-full cursor-default items-center justify-between p-2 font-medium text-foreground text-sm", className),
  ...rest
});
var MenuItemText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.ItemText, {
  className,
  ...rest
});
var MenuItemIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.ItemIndicator, {
  className: cn("ml-auto flex h-3.5 w-3.5 items-center justify-center", className),
  ...rest,
  children: /* @__PURE__ */ jsx(Check, {
    className: "size-4"
  })
});
var MenuRadioItem = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.RadioItem, {
  className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className),
  ...rest,
  children
});
var MenuRadioItemGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.RadioItemGroup, {
  className,
  ...rest
});
var MenuSeparator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkMenu.Separator, {
  className: cn("-mx-1 mt-1 mb-1 h-px bg-border", className),
  ...rest
});
var MenuTriggerItem = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsxs(ArkMenu.TriggerItem, {
  className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50 [&>svg]:size-4", className),
  ...rest,
  children: [
    children,
    /* @__PURE__ */ jsx(ChevronRight, {
      className: "ml-auto h-4 w-4"
    })
  ]
});
var MenuItemShortcut = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx("span", {
  className: cn("ml-auto text-muted-foreground text-xs tracking-widest", className),
  ...rest,
  children
});
export {
  PrimitiveMenuIndicator,
  MenuTriggerItem,
  MenuTrigger,
  MenuSeparator,
  MenuRoot,
  MenuRadioItemGroup,
  MenuRadioItem,
  MenuProvider,
  MenuPositioner,
  MenuItemText,
  MenuItemShortcut,
  MenuItemIndicator,
  MenuItemGroupLabel,
  MenuItemGroup,
  MenuItem,
  MenuContextTrigger,
  MenuContent,
  MenuCheckboxItem,
  MenuArrowTip,
  MenuArrow
};
