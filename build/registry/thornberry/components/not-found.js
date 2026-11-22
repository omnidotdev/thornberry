import {
  cn
} from "../../../chunks/ai-describe-panel-zm6svx9v.js";

// src/registry/thornberry/components/not-found.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var NotFoundPage = ({
  appName,
  appLogo,
  homeHref = "/",
  homeLabel = "Go home",
  showBack = true,
  backLabel = "Go back",
  description = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
  className,
  ...rest
}) => /* @__PURE__ */ jsxs("div", {
  "data-slot": "not-found",
  className: cn("flex min-h-screen w-full flex-col items-center justify-center gap-6 p-6 text-center", className),
  ...rest,
  children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2",
      children: [
        appLogo,
        /* @__PURE__ */ jsx("span", {
          className: "text-foreground text-lg font-semibold tracking-tight",
          children: appName
        })
      ]
    }),
    /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col items-center gap-2",
      children: [
        /* @__PURE__ */ jsx("h1", {
          className: "text-foreground text-7xl font-bold tracking-tight tabular-nums",
          children: "404"
        }),
        /* @__PURE__ */ jsx("h2", {
          className: "text-foreground text-2xl font-semibold",
          children: "Page not found"
        }),
        /* @__PURE__ */ jsx("p", {
          className: "text-muted-foreground max-w-md",
          children: description
        })
      ]
    }),
    /* @__PURE__ */ jsxs("div", {
      className: "flex flex-wrap items-center justify-center gap-2",
      children: [
        showBack && /* @__PURE__ */ jsx("button", {
          type: "button",
          onClick: () => window.history.back(),
          className: "border-border bg-card text-foreground hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
          children: backLabel
        }),
        /* @__PURE__ */ jsx("a", {
          href: homeHref,
          className: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          children: homeLabel
        })
      ]
    })
  ]
});
export {
  NotFoundPage
};
