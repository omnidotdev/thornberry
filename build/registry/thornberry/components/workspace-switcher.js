import {
  AvatarRoot2,
  AvatarFallback2,
  AvatarImage2
} from "../../../chunks/ai-describe-panel-6r0bwytq.js";
import {
  Button2
} from "../../../chunks/ai-describe-panel-k2cwy48h.js";
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

// src/registry/thornberry/components/workspace-switcher.tsx
import { Check, ChevronsUpDown, ExternalLink } from "lucide-react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var MANAGE_VALUE = "manage-workspaces";
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
var WorkspaceSwitcher = ({
  workspaces,
  currentWorkspaceId,
  onSelect,
  manageUrl,
  manageLabel = "Manage workspaces",
  groupLabel = "Workspaces",
  variant = "header"
}) => {
  const current = workspaces.find((workspace) => workspace.id === currentWorkspaceId);
  if (!current)
    return null;
  const isSidebar = variant === "sidebar";
  const hasMultiple = workspaces.length > 1;
  const triggerContent = /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx(WorkspaceAvatar, {
        workspace: current
      }),
      /* @__PURE__ */ jsx("span", {
        className: `truncate ${isSidebar ? "flex-1 font-medium" : ""}`,
        children: current.name
      }),
      hasMultiple && /* @__PURE__ */ jsx(ChevronsUpDown, {
        className: "size-4 shrink-0 opacity-60"
      })
    ]
  });
  const sidebarTriggerClass = "flex w-full items-center gap-2 rounded-lg border bg-background px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent/60";
  if (!hasMultiple) {
    return isSidebar ? /* @__PURE__ */ jsx("div", {
      className: `${sidebarTriggerClass} cursor-default`,
      children: triggerContent
    }) : /* @__PURE__ */ jsx(Button2, {
      variant: "outline",
      size: "sm",
      className: "max-w-44 cursor-default gap-2",
      "aria-disabled": true,
      children: triggerContent
    });
  }
  return /* @__PURE__ */ jsxs(MenuRoot2, {
    ...isSidebar && {
      positioning: { placement: "bottom-start", sameWidth: true }
    },
    onSelect: (details) => {
      if (details.value !== MANAGE_VALUE)
        onSelect(details.value);
    },
    children: [
      /* @__PURE__ */ jsx(MenuTrigger2, {
        asChild: true,
        children: isSidebar ? /* @__PURE__ */ jsx("button", {
          type: "button",
          className: sidebarTriggerClass,
          children: triggerContent
        }) : /* @__PURE__ */ jsx(Button2, {
          variant: "outline",
          size: "sm",
          className: "max-w-44 gap-2",
          children: triggerContent
        })
      }),
      /* @__PURE__ */ jsx(MenuPositioner2, {
        children: /* @__PURE__ */ jsxs(MenuContent2, {
          className: isSidebar ? "w-full min-w-0" : "min-w-52",
          children: [
            /* @__PURE__ */ jsxs(MenuItemGroup2, {
              className: "max-h-80 min-h-0 overflow-y-auto overscroll-contain",
              children: [
                /* @__PURE__ */ jsx(MenuItemGroupLabel2, {
                  className: "bg-popover sticky top-0 z-10",
                  children: groupLabel
                }),
                workspaces.map((workspace) => /* @__PURE__ */ jsxs(MenuItem2, {
                  value: workspace.id,
                  className: "gap-2",
                  children: [
                    /* @__PURE__ */ jsx(WorkspaceAvatar, {
                      workspace
                    }),
                    /* @__PURE__ */ jsxs("span", {
                      className: "flex min-w-0 flex-1 flex-col",
                      children: [
                        /* @__PURE__ */ jsx("span", {
                          className: "truncate",
                          children: workspace.name
                        }),
                        workspace.slug && /* @__PURE__ */ jsxs("span", {
                          className: "text-muted-foreground truncate text-xs",
                          children: [
                            "@",
                            workspace.slug
                          ]
                        })
                      ]
                    }),
                    workspace.id === currentWorkspaceId && /* @__PURE__ */ jsx(Check, {
                      className: "size-4 shrink-0"
                    })
                  ]
                }, workspace.id))
              ]
            }),
            manageUrl && /* @__PURE__ */ jsxs(Fragment, {
              children: [
                /* @__PURE__ */ jsx(MenuSeparator2, {}),
                /* @__PURE__ */ jsx(MenuItem2, {
                  value: MANAGE_VALUE,
                  asChild: true,
                  children: /* @__PURE__ */ jsxs("a", {
                    href: manageUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "text-muted-foreground",
                    children: [
                      /* @__PURE__ */ jsx(ExternalLink, {
                        className: "size-4"
                      }),
                      manageLabel
                    ]
                  })
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
