import {
  AvatarRoot2,
  AvatarFallback2,
  AvatarImage2
} from "../../../chunks/ai-describe-panel-6r0bwytq.js";
import {
  MenuRoot2,
  MenuTrigger2,
  MenuPositioner2,
  MenuContent2,
  MenuItem2,
  MenuItemGroup2,
  MenuItemGroupLabel2,
  MenuItemText2,
  MenuSeparator2
} from "../../../chunks/ai-describe-panel-egwd21sn.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/account-menu.tsx
import { ExternalLink, LogOut } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var getInitials = (name, email) => {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const first = words[0];
  if (first) {
    const last = words.length > 1 ? words[words.length - 1] : undefined;
    const initials = (Array.from(first)[0] ?? "") + (last ? Array.from(last)[0] ?? "" : "");
    return initials.toUpperCase();
  }
  const fromEmail = Array.from((email ?? "").trim())[0];
  return fromEmail ? fromEmail.toUpperCase() : "?";
};
var AccountMenuItem = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(MenuItem2, {
  className: cn("justify-start pointer-coarse:min-h-11", className),
  ...rest
});
var AccountMenu = ({
  user,
  onSignOut,
  children,
  manageAccountUrl,
  manageAccountLabel = "Manage account",
  signOutLabel = "Sign out",
  triggerLabel = "Open account menu",
  avatarSize = "sm",
  className,
  contentClassName,
  positioning = { placement: "bottom-end" }
}) => {
  const name = user.name?.trim() || null;
  const email = user.email?.trim() || null;
  return /* @__PURE__ */ jsxs(MenuRoot2, {
    positioning,
    children: [
      /* @__PURE__ */ jsx(MenuTrigger2, {
        "aria-label": triggerLabel,
        className: cn("inline-flex shrink-0 items-center justify-center rounded-full transition-shadow hover:ring-2 hover:ring-border data-[state=open]:ring-2 data-[state=open]:ring-border pointer-coarse:size-11", className),
        children: /* @__PURE__ */ jsxs(AvatarRoot2, {
          size: avatarSize,
          children: [
            /* @__PURE__ */ jsx(AvatarImage2, {
              src: user.image ?? undefined,
              alt: ""
            }),
            /* @__PURE__ */ jsx(AvatarFallback2, {
              className: "font-medium",
              children: getInitials(name, email)
            })
          ]
        })
      }),
      /* @__PURE__ */ jsx(MenuPositioner2, {
        children: /* @__PURE__ */ jsxs(MenuContent2, {
          className: cn("min-w-56 max-w-xs", contentClassName),
          children: [
            /* @__PURE__ */ jsxs(MenuItemGroup2, {
              children: [
                (name || email) && /* @__PURE__ */ jsxs(MenuItemGroupLabel2, {
                  className: "flex-col items-start gap-0.5",
                  children: [
                    /* @__PURE__ */ jsx("span", {
                      className: "w-full truncate",
                      children: name ?? email
                    }),
                    name && email && /* @__PURE__ */ jsx("span", {
                      className: "text-muted-foreground w-full truncate text-xs font-normal",
                      children: email
                    })
                  ]
                }),
                children,
                manageAccountUrl && /* @__PURE__ */ jsx(AccountMenuItem, {
                  value: "manage-account",
                  asChild: true,
                  children: /* @__PURE__ */ jsxs("a", {
                    href: manageAccountUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    children: [
                      /* @__PURE__ */ jsx(MenuItemText2, {
                        children: manageAccountLabel
                      }),
                      /* @__PURE__ */ jsx(ExternalLink, {
                        className: "ml-auto",
                        "aria-hidden": true
                      })
                    ]
                  })
                })
              ]
            }),
            /* @__PURE__ */ jsx(MenuSeparator2, {}),
            /* @__PURE__ */ jsxs(AccountMenuItem, {
              value: "sign-out",
              variant: "destructive",
              onSelect: onSignOut,
              children: [
                /* @__PURE__ */ jsx(LogOut, {
                  "aria-hidden": true
                }),
                /* @__PURE__ */ jsx(MenuItemText2, {
                  children: signOutLabel
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
  AccountMenu,
  AccountMenuItem,
  getInitials
};
