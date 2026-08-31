import {
  cn
} from "./account-user-two-factor-authentication-yp1ewaxt.js";

// src/registry/thornberry/components/account-password-requirements.tsx
import { Check, X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var PasswordRequirements = ({ requirements }) => /* @__PURE__ */ jsx("ul", {
  className: "mt-1.5 space-y-1",
  "aria-label": "Password requirements",
  children: requirements.map(({ label, met }) => /* @__PURE__ */ jsxs("li", {
    className: cn("flex items-center gap-1.5 text-xs transition-colors", met ? "text-green-600" : "text-muted-foreground"),
    children: [
      met ? /* @__PURE__ */ jsx(Check, {
        className: "size-3.5 shrink-0",
        "aria-hidden": "true"
      }) : /* @__PURE__ */ jsx(X, {
        className: "size-3.5 shrink-0",
        "aria-hidden": "true"
      }),
      /* @__PURE__ */ jsx("span", {
        children: label
      }),
      /* @__PURE__ */ jsx("span", {
        className: "sr-only",
        children: met ? "(met)" : "(not met)"
      })
    ]
  }, label))
});
export { PasswordRequirements };
