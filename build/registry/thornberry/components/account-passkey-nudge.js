import {
  useAccountContext2
} from "../../../chunks/ai-describe-panel-b60vh03c.js";
import {
  Button2
} from "../../../chunks/ai-describe-panel-g9z5bw52.js";
import"../../../chunks/ai-describe-panel-tn4pedcc.js";
import"../../../chunks/ai-describe-panel-mxvczhaq.js";
import"../../../chunks/ai-describe-panel-2b38chzx.js";
import {
  AddPasskey2
} from "../../../chunks/ai-describe-panel-jp3j4nk3.js";
import {
  CardRoot2
} from "../../../chunks/ai-describe-panel-5e732fet.js";

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
        className: "bg-muted flex size-10 shrink-0 items-center justify-center rounded-full",
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
                className: "text-sm leading-none font-semibold",
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
