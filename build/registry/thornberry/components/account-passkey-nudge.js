import {
  CardRoot
} from "../../../chunks/avatar-t5d4htnb.js";
import {
  AddPasskey
} from "../../../chunks/avatar-qm0wgtth.js";
import {
  useAccountContext
} from "../../../chunks/avatar-en4v22ys.js";
import"../../../chunks/avatar-gsg3ph0v.js";
import"../../../chunks/avatar-nmmcnpth.js";
import"../../../chunks/avatar-p3ac7628.js";
import {
  Button
} from "../../../chunks/avatar-jb3sh07m.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import"../../../chunks/avatar-yp1ewaxt.js";
import"../../../chunks/avatar-d1wjbx81.js";

// src/registry/thornberry/components/account-passkey-nudge.tsx
import { Fingerprint, X } from "lucide-react";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DISMISS_KEY = "passkey-nudge-dismissed";
var PasskeyNudge = () => {
  const { authClient } = useAccountContext();
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
  return /* @__PURE__ */ jsxs(CardRoot, {
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
            children: /* @__PURE__ */ jsx(AddPasskey, {})
          })
        ]
      }),
      /* @__PURE__ */ jsx(Button, {
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
