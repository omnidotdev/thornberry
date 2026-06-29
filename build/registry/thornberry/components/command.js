import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle
} from "../../../chunks/avatar-chvaergx.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/command.tsx
import { Portal } from "@ark-ui/react/portal";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { jsxDEV } from "react/jsx-dev-runtime";
var Command = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(CommandPrimitive, {
  className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
  ...rest
}, undefined, false, undefined, this);
var CommandDialog = ({
  children,
  title = "Command Palette",
  description = "Search for a command to run",
  ...rest
}) => /* @__PURE__ */ jsxDEV(DialogRoot, {
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Portal, {
    children: [
      /* @__PURE__ */ jsxDEV(DialogBackdrop, {}, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV(DialogPositioner, {
        children: /* @__PURE__ */ jsxDEV(DialogContent, {
          className: "overflow-hidden p-0 sm:max-w-lg",
          children: [
            /* @__PURE__ */ jsxDEV(DialogTitle, {
              className: "sr-only",
              children: title
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(DialogDescription, {
              className: "sr-only",
              children: description
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(Command, {
              className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5",
              children
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this)
}, undefined, false, undefined, this);
var CommandInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV("div", {
  className: "flex items-center border-b px-3",
  "cmdk-input-wrapper": "",
  children: [
    /* @__PURE__ */ jsxDEV(Search, {
      className: "mr-2 size-4 shrink-0 opacity-50"
    }, undefined, false, undefined, this),
    /* @__PURE__ */ jsxDEV(CommandPrimitive.Input, {
      className: cn("flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
      ...rest
    }, undefined, false, undefined, this)
  ]
}, undefined, true, undefined, this);
var CommandList = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(CommandPrimitive.List, {
  className: cn("max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden", className),
  ...rest
}, undefined, false, undefined, this);
var CommandEmpty = (rest) => /* @__PURE__ */ jsxDEV(CommandPrimitive.Empty, {
  className: "py-6 text-center text-muted-foreground text-sm",
  ...rest
}, undefined, false, undefined, this);
var CommandGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(CommandPrimitive.Group, {
  className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs", className),
  ...rest
}, undefined, false, undefined, this);
var CommandSeparator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(CommandPrimitive.Separator, {
  className: cn("-mx-1 h-px bg-border", className),
  ...rest
}, undefined, false, undefined, this);
var CommandItem = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(CommandPrimitive.Item, {
  className: cn("relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-muted data-[selected=true]:text-foreground data-[disabled=true]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground", className),
  ...rest
}, undefined, false, undefined, this);
var CommandShortcut = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV("span", {
  className: cn("ml-auto text-muted-foreground text-xs tracking-widest", className),
  ...rest
}, undefined, false, undefined, this);
export {
  CommandShortcut,
  CommandSeparator,
  CommandList,
  CommandItem,
  CommandInput,
  CommandGroup,
  CommandEmpty,
  CommandDialog,
  Command
};
