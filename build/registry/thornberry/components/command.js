import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle
} from "../../../chunks/avatar-p3ac7628.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/command.tsx
import { Portal } from "@ark-ui/react/portal";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var Command = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(CommandPrimitive, {
  className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
  ...rest
});
var CommandDialog = ({
  children,
  title = "Command Palette",
  description = "Search for a command to run",
  ...rest
}) => /* @__PURE__ */ jsx(DialogRoot, {
  ...rest,
  children: /* @__PURE__ */ jsxs(Portal, {
    children: [
      /* @__PURE__ */ jsx(DialogBackdrop, {}),
      /* @__PURE__ */ jsx(DialogPositioner, {
        children: /* @__PURE__ */ jsxs(DialogContent, {
          className: "overflow-hidden p-0 sm:max-w-lg",
          children: [
            /* @__PURE__ */ jsx(DialogTitle, {
              className: "sr-only",
              children: title
            }),
            /* @__PURE__ */ jsx(DialogDescription, {
              className: "sr-only",
              children: description
            }),
            /* @__PURE__ */ jsx(Command, {
              className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5",
              children
            })
          ]
        })
      })
    ]
  })
});
var CommandInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxs("div", {
  className: "flex items-center border-b px-3",
  "cmdk-input-wrapper": "",
  children: [
    /* @__PURE__ */ jsx(Search, {
      className: "mr-2 size-4 shrink-0 opacity-50"
    }),
    /* @__PURE__ */ jsx(CommandPrimitive.Input, {
      className: cn("flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
      ...rest
    })
  ]
});
var CommandList = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(CommandPrimitive.List, {
  className: cn("max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden", className),
  ...rest
});
var CommandEmpty = (rest) => /* @__PURE__ */ jsx(CommandPrimitive.Empty, {
  className: "py-6 text-center text-muted-foreground text-sm",
  ...rest
});
var CommandGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(CommandPrimitive.Group, {
  className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs", className),
  ...rest
});
var CommandSeparator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(CommandPrimitive.Separator, {
  className: cn("-mx-1 h-px bg-border", className),
  ...rest
});
var CommandItem = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(CommandPrimitive.Item, {
  className: cn("relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-muted data-[selected=true]:text-foreground data-[disabled=true]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground", className),
  ...rest
});
var CommandShortcut = ({ className, ...rest }) => /* @__PURE__ */ jsx("span", {
  className: cn("ml-auto text-muted-foreground text-xs tracking-widest", className),
  ...rest
});
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
