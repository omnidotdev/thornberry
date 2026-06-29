import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/logo-lockup.tsx
import { jsxDEV } from "react/jsx-dev-runtime";
var LogoLockup = ({
  logo,
  name,
  className,
  nameClassName,
  ...rest
}) => /* @__PURE__ */ jsxDEV("div", {
  "data-slot": "logo-lockup",
  className: cn("flex items-center gap-2", className),
  ...rest,
  children: [
    logo,
    /* @__PURE__ */ jsxDEV("span", {
      className: cn("font-semibold text-foreground text-lg tracking-tight", nameClassName),
      children: name
    }, undefined, false, undefined, this)
  ]
}, undefined, true, undefined, this);
export {
  LogoLockup
};
