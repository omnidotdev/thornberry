import {
  Label
} from "./account-user-two-factor-authentication-gsg3ph0v.js";
import {
  Input
} from "./account-user-two-factor-authentication-nmmcnpth.js";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle
} from "./account-user-two-factor-authentication-negb4kbv.js";
import {
  Button
} from "./account-user-two-factor-authentication-jb3sh07m.js";

// src/registry/thornberry/components/confirm-dialog.tsx
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ConfirmDialog = ({
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
  return /* @__PURE__ */ jsx(DialogRoot, {
    open,
    onOpenChange: (details) => {
      if (!isPending)
        onOpenChange(details.open);
    },
    children: /* @__PURE__ */ jsxs(DialogPortal, {
      children: [
        /* @__PURE__ */ jsx(DialogBackdrop, {}),
        /* @__PURE__ */ jsx(DialogPositioner, {
          children: /* @__PURE__ */ jsxs(DialogContent, {
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-1.5",
                children: [
                  /* @__PURE__ */ jsx(DialogTitle, {
                    children: title
                  }),
                  description && /* @__PURE__ */ jsx(DialogDescription, {
                    children: description
                  })
                ]
              }),
              confirmationText && /* @__PURE__ */ jsxs("div", {
                className: "space-y-1.5",
                children: [
                  /* @__PURE__ */ jsxs(Label, {
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
                  /* @__PURE__ */ jsx(Input, {
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
                  /* @__PURE__ */ jsx(Button, {
                    variant: "outline",
                    onClick: () => onOpenChange(false),
                    disabled: isPending,
                    children: cancelLabel
                  }),
                  /* @__PURE__ */ jsx(Button, {
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
export { ConfirmDialog };
