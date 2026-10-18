import {
  Button2
} from "./account-user-two-factor-authentication-qyg3bvpa.js";
import {
  Input2
} from "./account-user-two-factor-authentication-hj664zsh.js";
import {
  cn
} from "./account-user-two-factor-authentication-81fr4sax.js";

// src/registry/thornberry/components/password-input.tsx
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var PasswordInput2 = ({
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const disabled = props.value === "" || props.value === undefined || props.disabled;
  return /* @__PURE__ */ jsxs("div", {
    className: "relative",
    children: [
      /* @__PURE__ */ jsx(Input2, {
        ...props,
        type: showPassword ? "text" : "password",
        className: cn("pr-9", className)
      }),
      /* @__PURE__ */ jsx(Button2, {
        type: "button",
        variant: "ghost",
        size: "icon",
        className: "absolute top-0 right-0 size-9 text-muted-foreground hover:text-foreground",
        onClick: () => setShowPassword((prev) => !prev),
        disabled,
        "aria-label": showPassword ? "Hide password" : "Show password",
        children: showPassword && !disabled ? /* @__PURE__ */ jsx(Eye, {
          className: "size-4",
          "aria-hidden": "true"
        }) : /* @__PURE__ */ jsx(EyeOff, {
          className: "size-4",
          "aria-hidden": "true"
        })
      })
    ]
  });
};
export { PasswordInput2 };
