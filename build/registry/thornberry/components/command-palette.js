import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "../../../chunks/avatar-jb5nvfyb.js";
import {
  Kbd
} from "../../../chunks/avatar-ktx8cffm.js";
import"../../../chunks/avatar-p3ac7628.js";
import"../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/command-palette.tsx
import { Fragment, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { jsx, jsxs } from "react/jsx-runtime";
var OPEN_COMMAND_PALETTE_EVENT = "open-command-palette";
var openCommandPalette = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE_EVENT));
  }
};
var CommandPalette = ({
  commands,
  placeholder = "Search commands...",
  emptyMessage = "No results found.",
  triggerKey = "mod+k",
  open: openProp,
  onOpenChange
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = (next) => {
    if (!isControlled)
      setInternalOpen(next);
    onOpenChange?.(next);
  };
  useHotkeys(triggerKey, () => setOpen(!open), {
    enableOnFormTags: true,
    preventDefault: true
  });
  useEffect(() => {
    const onOpen = () => {
      if (!isControlled)
        setInternalOpen(true);
      onOpenChange?.(true);
    };
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpen);
  }, [isControlled, onOpenChange]);
  const groups = [];
  for (const command of commands) {
    const name = command.group ?? "";
    let group = groups.find((g) => g.name === name);
    if (!group) {
      group = { name, items: [] };
      groups.push(group);
    }
    group.items.push(command);
  }
  return /* @__PURE__ */ jsxs(CommandDialog, {
    open,
    onOpenChange: (details) => setOpen(details.open),
    children: [
      /* @__PURE__ */ jsx(CommandInput, {
        placeholder
      }),
      /* @__PURE__ */ jsxs(CommandList, {
        children: [
          /* @__PURE__ */ jsx(CommandEmpty, {
            children: emptyMessage
          }),
          groups.map((group, index) => /* @__PURE__ */ jsxs(Fragment, {
            children: [
              index > 0 && /* @__PURE__ */ jsx(CommandSeparator, {}),
              /* @__PURE__ */ jsx(CommandGroup, {
                heading: group.name || undefined,
                children: group.items.map((command) => {
                  const Icon = command.icon;
                  return /* @__PURE__ */ jsxs(CommandItem, {
                    value: `${command.label} ${command.keywords?.join(" ") ?? ""}`,
                    onSelect: () => {
                      setOpen(false);
                      command.onSelect();
                    },
                    children: [
                      Icon && /* @__PURE__ */ jsx(Icon, {
                        className: "size-4"
                      }),
                      /* @__PURE__ */ jsx("span", {
                        className: "flex-1 truncate",
                        children: command.label
                      }),
                      command.shortcut && /* @__PURE__ */ jsx(CommandShortcut, {
                        children: /* @__PURE__ */ jsx(Kbd, {
                          children: command.shortcut
                        })
                      })
                    ]
                  }, command.id);
                })
              })
            ]
          }, group.name || "__ungrouped"))
        ]
      })
    ]
  });
};
export {
  openCommandPalette,
  OPEN_COMMAND_PALETTE_EVENT,
  CommandPalette
};
