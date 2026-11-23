import {
  DialogRoot2,
  DialogPortal2,
  DialogBackdrop2,
  DialogPositioner2,
  DialogContent2,
  DialogTitle2,
  DialogDescription2,
  DialogCloseTrigger2
} from "../../../chunks/ai-describe-panel-8q0yqrx6.js";
import {
  Kbd2
} from "../../../chunks/ai-describe-panel-ym1fwyxy.js";
import {
  useHotkeys2,
  GLOBAL_HOTKEYS2,
  hotkeyLabel2
} from "../../../chunks/ai-describe-panel-vea3rdsy.js";

// src/registry/thornberry/components/shortcuts-dialog.tsx
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var GLOBAL_LABELS = {
  commandPalette: "Open command palette",
  showShortcuts: "Show keyboard shortcuts",
  toggleSidebar: "Toggle sidebar",
  toggleTheme: "Toggle light/dark theme"
};
var DEFAULT_GLOBALS = [
  "commandPalette",
  "showShortcuts",
  "toggleTheme"
];
var ShortcutsDialog = ({
  globals = DEFAULT_GLOBALS,
  general = [],
  groups = [],
  open: openProp,
  onOpenChange
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = (next) => {
    if (openProp === undefined)
      setOpenState(next);
    onOpenChange?.(next);
  };
  useHotkeys2(GLOBAL_HOTKEYS2.showShortcuts, () => setOpen(!open), [open]);
  const ordered = Object.keys(GLOBAL_LABELS).filter((key) => globals.includes(key));
  const allGroups = [
    {
      title: "General",
      shortcuts: [
        ...ordered.map((key) => ({
          keys: GLOBAL_HOTKEYS2[key],
          label: GLOBAL_LABELS[key]
        })),
        ...general
      ]
    },
    ...groups
  ];
  return /* @__PURE__ */ jsx(DialogRoot2, {
    open,
    onOpenChange: (details) => setOpen(details.open),
    lazyMount: true,
    unmountOnExit: true,
    children: /* @__PURE__ */ jsxs(DialogPortal2, {
      children: [
        /* @__PURE__ */ jsx(DialogBackdrop2, {}),
        /* @__PURE__ */ jsx(DialogPositioner2, {
          children: /* @__PURE__ */ jsxs(DialogContent2, {
            className: "max-h-full overflow-y-auto",
            children: [
              /* @__PURE__ */ jsx(DialogCloseTrigger2, {}),
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-1.5",
                children: [
                  /* @__PURE__ */ jsx(DialogTitle2, {
                    children: "Keyboard shortcuts"
                  }),
                  /* @__PURE__ */ jsxs(DialogDescription2, {
                    children: [
                      "Press ",
                      /* @__PURE__ */ jsx(Kbd2, {
                        children: hotkeyLabel2(GLOBAL_HOTKEYS2.showShortcuts)
                      }),
                      " ",
                      "anytime to open this list."
                    ]
                  })
                ]
              }),
              /* @__PURE__ */ jsx("div", {
                className: "flex flex-col gap-5",
                children: allGroups.filter((group) => group.shortcuts.length > 0).map((group) => /* @__PURE__ */ jsxs("section", {
                  className: "flex flex-col gap-2",
                  children: [
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex items-baseline gap-2",
                      children: [
                        /* @__PURE__ */ jsx("h3", {
                          className: "text-foreground text-sm font-medium",
                          children: group.title
                        }),
                        group.hint && /* @__PURE__ */ jsx("span", {
                          className: "text-muted-foreground text-xs",
                          children: group.hint
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsx("ul", {
                      className: "divide-border flex flex-col divide-y",
                      children: group.shortcuts.map((shortcut) => /* @__PURE__ */ jsxs("li", {
                        className: "flex items-center justify-between gap-4 py-1.5",
                        children: [
                          /* @__PURE__ */ jsx("span", {
                            className: "text-muted-foreground text-sm",
                            children: shortcut.label
                          }),
                          /* @__PURE__ */ jsx(Kbd2, {
                            children: hotkeyLabel2(shortcut.keys)
                          })
                        ]
                      }, `${shortcut.keys}-${shortcut.label}`))
                    })
                  ]
                }, group.title))
              })
            ]
          })
        })
      ]
    })
  });
};
export {
  ShortcutsDialog
};
