import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";
import"../../../chunks/avatar-d1wjbx81.js";

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
          className: "font-semibold text-foreground text-lg tracking-tight",
          children: appName
        })
      ]
    }),
    /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col items-center gap-2",
      children: [
        /* @__PURE__ */ jsx("h1", {
          className: "font-bold text-7xl text-foreground tabular-nums tracking-tight",
          children: "404"
        }),
        /* @__PURE__ */ jsx("h2", {
          className: "font-semibold text-2xl text-foreground",
          children: "Page not found"
        }),
        /* @__PURE__ */ jsx("p", {
          className: "max-w-md text-muted-foreground",
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
          className: "rounded-lg border border-border bg-card px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent",
          children: backLabel
        }),
        /* @__PURE__ */ jsx("a", {
          href: homeHref,
          className: "rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90",
          children: homeLabel
        })
      ]
    })
  ]
});
export {
  NotFoundPage
};
