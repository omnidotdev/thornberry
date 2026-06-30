import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/logo-lockup.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var LogoLockup = ({
  logo,
  name,
  className,
  nameClassName,
  ...rest
}) => /* @__PURE__ */ jsxs("div", {
  "data-slot": "logo-lockup",
  className: cn("flex items-center gap-2", className),
  ...rest,
  children: [
    logo,
    /* @__PURE__ */ jsx("span", {
      className: cn("font-semibold text-foreground text-lg tracking-tight", nameClassName),
      children: name
    })
  ]
});
export {
  LogoLockup
};
