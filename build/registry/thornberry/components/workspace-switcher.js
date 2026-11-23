import {
  AvatarRoot2,
  AvatarFallback2,
  AvatarImage2
} from "../../../chunks/ai-describe-panel-516n6cnr.js";
import {
  Button2
} from "../../../chunks/ai-describe-panel-h4yrvya3.js";
import {
  MenuRoot2,
  MenuTrigger2,
  MenuPositioner2,
  MenuContent2,
  MenuItem2,
  MenuItemGroup2,
  MenuItemGroupLabel2,
  MenuSeparator2
} from "../../../chunks/ai-describe-panel-c85b3y6e.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/workspace-switcher.tsx
import { Check, ChevronsUpDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var ACTION_PREFIX = "action:";
var MANAGE_ID = "manage-workspaces";
var WorkspaceAvatar = ({ workspace }) => /* @__PURE__ */ jsxs(AvatarRoot2, {
  className: "size-5 shrink-0 text-xs",
  children: [
    /* @__PURE__ */ jsx(AvatarImage2, {
      src: workspace.logo ?? undefined,
      alt: workspace.name
    }),
    /* @__PURE__ */ jsx(AvatarFallback2, {
      children: workspace.name?.[0]?.toUpperCase()
    })
  ]
});
var WorkspaceBadge = ({ children }) => /* @__PURE__ */ jsx("span", {
  className: "bg-muted text-muted-foreground shrink-0 rounded-sm px-1.5 py-0.5 text-xs leading-none font-medium",
  children
});
var WorkspaceSwitcher = ({
  workspaces,
  currentWorkspaceId,
  onSelect,
  onItemIntent,
  actions = [],
  manageUrl,
  manageLabel = "Manage workspaces",
  groupLabel = "Workspaces",
  placeholder = "Select workspace",
  hideWhenSingle = false,
  variant = "header",
  className
}) => {
  const [inCollapsedRail, setInCollapsedRail] = useState(false);
  const current = workspaces.find((workspace) => workspace.id === currentWorkspaceId);
  const entries = manageUrl ? [
    ...actions,
    { id: MANAGE_ID, label: manageLabel, href: manageUrl, external: true }
  ] : actions;
  const isSidebar = variant === "sidebar";
  const hasMenu = workspaces.length > 1 || entries.length > 0 || !current;
  if (!workspaces.length && !entries.length)
    return null;
  if (hideWhenSingle && workspaces.length <= 1 && !entries.length)
    return null;
  const label = current?.name ?? placeholder;
  const triggerContent = /* @__PURE__ */ jsxs(Fragment, {
    children: [
      current && /* @__PURE__ */ jsx(WorkspaceAvatar, {
        workspace: current
      }),
      /* @__PURE__ */ jsx("span", {
        className: cn("truncate", isSidebar && "flex-1 font-medium group-data-[collapsible=icon]:sr-only", !current && "text-muted-foreground"),
        children: label
      }),
      hasMenu && /* @__PURE__ */ jsx(ChevronsUpDown, {
        className: cn("size-4 shrink-0 opacity-60", isSidebar && current && "group-data-[collapsible=icon]:hidden")
      })
    ]
  });
  const sidebarTriggerClass = cn("flex w-full items-center gap-2 rounded-lg border bg-background px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent/60", "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0", className);
  const headerTriggerClass = cn("max-w-44 gap-2", className);
  if (!hasMenu) {
    return isSidebar ? /* @__PURE__ */ jsx("div", {
      className: cn(sidebarTriggerClass, "cursor-default"),
      children: triggerContent
    }) : /* @__PURE__ */ jsx(Button2, {
      variant: "outline",
      size: "sm",
      className: cn(headerTriggerClass, "cursor-default"),
      "aria-disabled": true,
      children: triggerContent
    });
  }
  const handleSelect = (value) => {
    if (!value.startsWith(ACTION_PREFIX)) {
      onSelect(value);
      return;
    }
    const action = entries.find((entry) => `${ACTION_PREFIX}${entry.id}` === value);
    action?.onSelect?.();
  };
  const detectRail = (event) => {
    setInCollapsedRail(!!event.currentTarget.closest("[data-collapsible='icon']"));
  };
  return /* @__PURE__ */ jsxs(MenuRoot2, {
    ...isSidebar && {
      positioning: inCollapsedRail ? { placement: "right-start" } : { placement: "bottom-start", sameWidth: true }
    },
    onSelect: (details) => handleSelect(details.value),
    ...onItemIntent && {
      onHighlightChange: ({ highlightedValue }) => {
        if (highlightedValue && !highlightedValue.startsWith(ACTION_PREFIX))
          onItemIntent(highlightedValue);
      }
    },
    children: [
      /* @__PURE__ */ jsx(MenuTrigger2, {
        asChild: true,
        "aria-label": `${label}, switch workspace`,
        ...isSidebar && {
          onPointerDown: detectRail,
          onKeyDown: detectRail
        },
        children: isSidebar ? /* @__PURE__ */ jsx("button", {
          type: "button",
          className: sidebarTriggerClass,
          children: triggerContent
        }) : /* @__PURE__ */ jsx(Button2, {
          variant: "outline",
          size: "sm",
          className: headerTriggerClass,
          children: triggerContent
        })
      }),
      /* @__PURE__ */ jsx(MenuPositioner2, {
        children: /* @__PURE__ */ jsxs(MenuContent2, {
          className: isSidebar ? cn("w-full min-w-0", inCollapsedRail && "min-w-52") : "min-w-52",
          children: [
            workspaces.length > 0 && /* @__PURE__ */ jsxs(MenuItemGroup2, {
              className: "max-h-80 min-h-0 overflow-y-auto overscroll-contain",
              children: [
                /* @__PURE__ */ jsx(MenuItemGroupLabel2, {
                  className: "bg-popover sticky top-0 z-10",
                  children: groupLabel
                }),
                workspaces.map((workspace) => {
                  const subtitle = workspace.description ?? (workspace.slug ? `@${workspace.slug}` : null);
                  return /* @__PURE__ */ jsxs(MenuItem2, {
                    value: workspace.id,
                    className: "gap-2",
                    children: [
                      /* @__PURE__ */ jsx(WorkspaceAvatar, {
                        workspace
                      }),
                      /* @__PURE__ */ jsxs("span", {
                        className: "flex min-w-0 flex-1 flex-col",
                        children: [
                          /* @__PURE__ */ jsxs("span", {
                            className: "flex min-w-0 items-center gap-1.5",
                            children: [
                              /* @__PURE__ */ jsx("span", {
                                className: "truncate",
                                children: workspace.name
                              }),
                              workspace.badge && /* @__PURE__ */ jsx(WorkspaceBadge, {
                                children: workspace.badge
                              })
                            ]
                          }),
                          subtitle && /* @__PURE__ */ jsx("span", {
                            className: "text-muted-foreground truncate text-xs",
                            children: subtitle
                          })
                        ]
                      }),
                      workspace.id === currentWorkspaceId && /* @__PURE__ */ jsx(Check, {
                        className: "size-4 shrink-0"
                      })
                    ]
                  }, workspace.id);
                })
              ]
            }),
            entries.length > 0 && /* @__PURE__ */ jsxs(Fragment, {
              children: [
                workspaces.length > 0 && /* @__PURE__ */ jsx(MenuSeparator2, {}),
                entries.map((entry) => {
                  const value = `${ACTION_PREFIX}${entry.id}`;
                  const content = /* @__PURE__ */ jsxs(Fragment, {
                    children: [
                      entry.icon,
                      /* @__PURE__ */ jsx("span", {
                        className: "flex-1 truncate",
                        children: entry.label
                      }),
                      entry.external && entry.icon && /* @__PURE__ */ jsx(ExternalLink, {
                        className: "size-3.5 opacity-60"
                      })
                    ]
                  });
                  return entry.href ? /* @__PURE__ */ jsx(MenuItem2, {
                    value,
                    asChild: true,
                    children: /* @__PURE__ */ jsxs("a", {
                      href: entry.href,
                      ...entry.external && {
                        target: "_blank",
                        rel: "noreferrer"
                      },
                      className: "text-muted-foreground",
                      children: [
                        entry.external && !entry.icon && /* @__PURE__ */ jsx(ExternalLink, {
                          className: "size-4"
                        }),
                        content
                      ]
                    })
                  }, entry.id) : /* @__PURE__ */ jsx(MenuItem2, {
                    value,
                    className: "text-muted-foreground",
                    children: content
                  }, entry.id);
                })
              ]
            })
          ]
        })
      })
    ]
  });
};
export {
  WorkspaceSwitcher
};
