import {
  Button2
} from "./account-user-two-factor-authentication-qyg3bvpa.js";
import {
  DialogRoot2,
  DialogPortal2,
  DialogBackdrop2,
  DialogPositioner2,
  DialogContent2,
  DialogTitle2,
  DialogDescription2
} from "./account-user-two-factor-authentication-8q0yqrx6.js";
import {
  Input2
} from "./account-user-two-factor-authentication-hj664zsh.js";
import {
  Label2
} from "./account-user-two-factor-authentication-fa46q8yp.js";

// src/registry/thornberry/components/confirm-dialog.tsx
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ConfirmDialog2 = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isPending = false,
  confirmationText
}) => {
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (!open)
      setTyped("");
  }, [open]);
  const confirmable = !confirmationText || typed === confirmationText;
  return /* @__PURE__ */ jsx(DialogRoot2, {
    open,
    onOpenChange: (details) => {
      if (!isPending)
        onOpenChange(details.open);
    },
    children: /* @__PURE__ */ jsxs(DialogPortal2, {
      children: [
        /* @__PURE__ */ jsx(DialogBackdrop2, {}),
        /* @__PURE__ */ jsx(DialogPositioner2, {
          children: /* @__PURE__ */ jsxs(DialogContent2, {
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-1.5",
                children: [
                  /* @__PURE__ */ jsx(DialogTitle2, {
                    children: title
                  }),
                  description && /* @__PURE__ */ jsx(DialogDescription2, {
                    children: description
                  })
                ]
              }),
              confirmationText && /* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [
                  /* @__PURE__ */ jsxs(Label2, {
                    htmlFor: "confirm-input",
                    children: [
                      "Type",
                      " ",
                      /* @__PURE__ */ jsx("span", {
                        className: "font-medium text-foreground",
                        children: confirmationText
                      }),
                      " ",
                      "to confirm"
                    ]
                  }),
                  /* @__PURE__ */ jsx(Input2, {
                    id: "confirm-input",
                    value: typed,
                    onChange: (event) => setTyped(event.target.value),
                    autoComplete: "off",
                    autoCapitalize: "off",
                    spellCheck: false,
                    disabled: isPending
                  })
                ]
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "flex justify-end gap-2",
                children: [
                  /* @__PURE__ */ jsx(Button2, {
                    variant: "outline",
                    onClick: () => onOpenChange(false),
                    disabled: isPending,
                    children: cancelLabel
                  }),
                  /* @__PURE__ */ jsx(Button2, {
                    variant: "destructive",
                    onClick: onConfirm,
                    disabled: isPending || !confirmable,
                    children: isPending ? /* @__PURE__ */ jsx(Loader2, {
                      className: "size-4 animate-spin"
                    }) : confirmLabel
                  })
                ]
              })
            ]
          })
        })
      ]
    })
  });
};
export { ConfirmDialog2 };
