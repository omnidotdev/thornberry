import {
  useAccountContext2
} from "../../../chunks/account-user-two-factor-authentication-b60vh03c.js";
import {
  Button2
} from "../../../chunks/account-user-two-factor-authentication-qyg3bvpa.js";
import"../../../chunks/account-user-two-factor-authentication-8q0yqrx6.js";
import"../../../chunks/account-user-two-factor-authentication-hj664zsh.js";
import"../../../chunks/account-user-two-factor-authentication-fa46q8yp.js";
import {
  AddPasskey2
} from "../../../chunks/account-user-two-factor-authentication-qvta5wkk.js";
import {
  CardRoot2
} from "../../../chunks/account-user-two-factor-authentication-f7d4gzjq.js";

// src/registry/thornberry/components/account-passkey-nudge.tsx
import { Fingerprint, X } from "lucide-react";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DISMISS_KEY = "passkey-nudge-dismissed";
var PasskeyNudge = () => {
  const { authClient } = useAccountContext2();
  const { data, isPending } = authClient.useListPasskeys();
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === "true") {
        setDismissed(true);
      }
    } catch {}
  }, []);
  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "true");
    } catch {}
  };
  if (isPending)
    return null;
  if ((data?.length ?? 0) > 0)
    return null;
  if (dismissed)
    return null;
  return /* @__PURE__ */ jsxs(CardRoot2, {
    className: "flex items-start gap-4 p-4",
    children: [
      /* @__PURE__ */ jsx("div", {
        className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-muted",
        children: /* @__PURE__ */ jsx(Fingerprint, {
          className: "size-5"
        })
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-1 flex-col gap-3",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col gap-1",
            children: [
              /* @__PURE__ */ jsx("h3", {
                className: "font-semibold text-sm leading-none",
                children: "Add a passkey"
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-muted-foreground text-sm",
                children: "Sign in faster and more securely without a password."
              })
            ]
          }),
          /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx(AddPasskey2, {})
          })
        ]
      }),
      /* @__PURE__ */ jsx(Button2, {
        variant: "ghost",
        size: "icon",
        "aria-label": "Dismiss",
        onClick: dismiss,
        children: /* @__PURE__ */ jsx(X, {
          className: "size-4"
        })
      })
    ]
  });
};
export {
  PasskeyNudge
};
