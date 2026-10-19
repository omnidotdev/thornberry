import {
  AvatarRoot2,
  AvatarFallback2,
  AvatarImage2
} from "../../../chunks/account-user-two-factor-authentication-b7jpk793.js";
import {
  Button2
} from "../../../chunks/account-user-two-factor-authentication-qyg3bvpa.js";
import {
  MenuRoot2,
  MenuTrigger2,
  MenuPositioner2,
  MenuContent2,
  MenuItem2,
  MenuItemGroup2,
  MenuItemGroupLabel2,
  MenuSeparator2
} from "../../../chunks/account-user-two-factor-authentication-jw3adf69.js";

// src/registry/thornberry/components/workspace-switcher.tsx
import { Check, ChevronsUpDown, ExternalLink } from "lucide-react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
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
  groupLabel = "Workspaces"
}) => {
  const current = workspaces.find((workspace) => workspace.id === currentWorkspaceId);
  if (!current)
    return null;
  return /* @__PURE__ */ jsxs(MenuRoot2, {
    onSelect: (details) => onSelect(details.value),
    children: [
      /* @__PURE__ */ jsx(MenuTrigger2, {
        asChild: true,
        children: /* @__PURE__ */ jsxs(Button2, {
          variant: "outline",
          size: "sm",
          className: "max-w-44 gap-2",
          children: [
            /* @__PURE__ */ jsx(WorkspaceAvatar, {
              workspace: current
            }),
            /* @__PURE__ */ jsx("span", {
              className: "truncate",
              children: current.name
            }),
            /* @__PURE__ */ jsx(ChevronsUpDown, {
              className: "size-4 shrink-0 opacity-60"
            })
          ]
        })
      }),
      /* @__PURE__ */ jsx(MenuPositioner2, {
        children: /* @__PURE__ */ jsxs(MenuContent2, {
          className: "min-w-52",
          children: [
            /* @__PURE__ */ jsxs(MenuItemGroup2, {
              children: [
                /* @__PURE__ */ jsx(MenuItemGroupLabel2, {
                  children: groupLabel
                }),
                workspaces.map((workspace) => /* @__PURE__ */ jsxs(MenuItem2, {
                  value: workspace.id,
                  className: "gap-2",
                  children: [
                    /* @__PURE__ */ jsx(WorkspaceAvatar, {
                      workspace
                    }),
                    /* @__PURE__ */ jsx("span", {
                      className: "flex-1 truncate",
                      children: workspace.name
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
                /* @__PURE__ */ jsxs("a", {
                  href: manageUrl,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "flex items-center gap-2 rounded-sm px-2 py-1.5 text-muted-foreground text-sm hover:bg-accent",
                  children: [
                    /* @__PURE__ */ jsx(ExternalLink, {
                      className: "size-4"
                    }),
                    manageLabel
                  ]
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
