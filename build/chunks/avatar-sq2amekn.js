import {
  cn
} from "./avatar-yp1ewaxt.js";

// src/registry/thornberry/components/base-node.tsx
import { Handle } from "@xyflow/react";
import { memo } from "react";

// src/registry/thornberry/lib/node-themes.ts
var nodeThemes = {
  default: {
    border: "border-border",
    bg: "bg-card",
    iconBg: "bg-secondary",
    iconText: "text-secondary-foreground",
    accent: "text-foreground",
    handleColor: "!bg-muted-foreground"
  },
  accent: {
    border: "border-primary",
    bg: "bg-primary/10",
    iconBg: "bg-primary",
    iconText: "text-primary-foreground",
    accent: "text-primary",
    handleColor: "!bg-primary",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]"
  },
  success: {
    border: "border-emerald-300/60 dark:border-emerald-600/40",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    iconBg: "bg-emerald-600 dark:bg-emerald-500",
    iconText: "text-white",
    accent: "text-emerald-600 dark:text-emerald-400",
    handleColor: "!bg-emerald-500",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]"
  },
  warning: {
    border: "border-amber-300/60 dark:border-amber-600/40",
    bg: "bg-amber-50 dark:bg-amber-950",
    iconBg: "bg-amber-500 dark:bg-amber-600",
    iconText: "text-white",
    accent: "text-amber-600 dark:text-amber-400",
    handleColor: "!bg-amber-500",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]"
  },
  danger: {
    border: "border-destructive",
    bg: "bg-destructive/10",
    iconBg: "bg-destructive",
    iconText: "text-white",
    accent: "text-destructive",
    handleColor: "!bg-destructive",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]"
  },
  muted: {
    border: "border-border",
    bg: "bg-muted",
    iconBg: "bg-muted-foreground",
    iconText: "text-background",
    accent: "text-muted-foreground",
    handleColor: "!bg-muted-foreground"
  }
};
var resolveTheme = (theme) => typeof theme === "string" ? nodeThemes[theme] : theme;

// src/registry/thornberry/components/base-node.tsx
import { jsx, jsxs } from "react/jsx-runtime";
"use client";
var NODE_WIDTH = 300;
var NODE_MIN_HEIGHT = 120;
var BaseNode = memo(({ data, selected }) => {
  const {
    theme,
    icon: Icon,
    label,
    description,
    badge,
    handles = [],
    children,
    footer,
    onClick,
    onDelete
  } = data;
  const t = resolveTheme(theme);
  return /* @__PURE__ */ jsxs("div", {
    className: cn("group relative rounded-xl border px-4 py-3", onClick && "cursor-pointer", t.border, t.bg, t.glow, selected && "ring-2 ring-ring ring-offset-2"),
    style: { width: NODE_WIDTH, minHeight: NODE_MIN_HEIGHT },
    role: onClick ? "button" : undefined,
    tabIndex: onClick ? 0 : undefined,
    onClick,
    onKeyDown: onClick ? (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    } : undefined,
    children: [
      onDelete && /* @__PURE__ */ jsx("button", {
        type: "button",
        "aria-label": "Delete node",
        className: "absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-destructive opacity-0 shadow-md transition-opacity group-hover:opacity-100",
        onClick: (e) => {
          e.stopPropagation();
          onDelete();
        },
        children: /* @__PURE__ */ jsx("span", {
          "aria-hidden": "true",
          children: "x"
        })
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex min-w-0 items-center justify-between gap-3",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex min-w-0 flex-1 items-center gap-3",
            children: [
              Icon && /* @__PURE__ */ jsx("div", {
                className: cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm", t.iconBg),
                children: /* @__PURE__ */ jsx(Icon, {
                  className: cn("h-5 w-5", t.iconText)
                })
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "flex min-w-0 flex-1 flex-col overflow-hidden",
                children: [
                  /* @__PURE__ */ jsx("span", {
                    className: "truncate font-medium",
                    children: label
                  }),
                  description && /* @__PURE__ */ jsx("span", {
                    className: "truncate text-xs opacity-70",
                    children: description
                  })
                ]
              })
            ]
          }),
          badge && /* @__PURE__ */ jsx("span", {
            className: cn("shrink-0 rounded-full px-2 py-0.5 text-xs", t.iconBg, t.iconText),
            children: badge
          })
        ]
      }),
      children && /* @__PURE__ */ jsx("div", {
        className: "mt-3 space-y-2",
        children
      }),
      footer && /* @__PURE__ */ jsx("div", {
        className: "mt-3",
        children: footer
      }),
      handles.map((handle, index) => /* @__PURE__ */ jsx(Handle, {
        type: handle.type,
        position: handle.position,
        id: handle.id,
        className: cn("h-3 w-3", handle.className ?? t.handleColor),
        style: handle.style
      }, handle.id ?? `${handle.type}-${handle.position}-${index}`))
    ]
  });
});
BaseNode.displayName = "BaseNode";

export { NODE_WIDTH, NODE_MIN_HEIGHT, BaseNode };
