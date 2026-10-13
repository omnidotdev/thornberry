import {
  DialogRoot2,
  DialogBackdrop2,
  DialogPositioner2,
  DialogContent2,
  DialogTitle2,
  DialogDescription2
} from "./account-user-two-factor-authentication-8q0yqrx6.js";
import {
  cn
} from "./account-user-two-factor-authentication-81fr4sax.js";

// src/registry/thornberry/components/command.tsx
import { Portal } from "@ark-ui/react/portal";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var Command2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(CommandPrimitive, {
  className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
  ...rest
});
var CommandDialog2 = ({
  children,
  title = "Command Palette",
  description = "Search for a command to run",
  ...rest
}) => /* @__PURE__ */ jsx(DialogRoot2, {
  ...rest,
  children: /* @__PURE__ */ jsxs(Portal, {
    children: [
      /* @__PURE__ */ jsx(DialogBackdrop2, {}),
      /* @__PURE__ */ jsx(DialogPositioner2, {
        children: /* @__PURE__ */ jsxs(DialogContent2, {
          className: "overflow-hidden p-0 sm:max-w-lg",
          children: [
            /* @__PURE__ */ jsx(DialogTitle2, {
              className: "sr-only",
              children: title
            }),
            /* @__PURE__ */ jsx(DialogDescription2, {
              className: "sr-only",
              children: description
            }),
            /* @__PURE__ */ jsx(Command2, {
              loop: true,
              className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5",
              children
            })
          ]
        })
      })
    ]
  })
});
var CommandInput2 = ({
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
var CommandList2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(CommandPrimitive.List, {
  className: cn("max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden", className),
  ...rest
});
var CommandEmpty2 = (rest) => /* @__PURE__ */ jsx(CommandPrimitive.Empty, {
  className: "py-6 text-center text-muted-foreground text-sm",
  ...rest
});
var CommandGroup2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(CommandPrimitive.Group, {
  className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs", className),
  ...rest
});
var CommandSeparator2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(CommandPrimitive.Separator, {
  className: cn("-mx-1 h-px bg-border", className),
  ...rest
});
var CommandItem2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(CommandPrimitive.Item, {
  className: cn("relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-muted data-[selected=true]:text-foreground data-[disabled=true]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground", className),
  ...rest
});
var CommandShortcut2 = ({ className, ...rest }) => /* @__PURE__ */ jsx("span", {
  className: cn("ml-auto text-muted-foreground text-xs tracking-widest", className),
  ...rest
});
export { Command2, CommandDialog2, CommandInput2, CommandList2, CommandEmpty2, CommandGroup2, CommandSeparator2, CommandItem2, CommandShortcut2 };
