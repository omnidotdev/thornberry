import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle
} from "./account-user-two-factor-authentication-p3ac7628.js";
import {
  Button
} from "./account-user-two-factor-authentication-jb3sh07m.js";

// src/registry/thornberry/components/confirm-dialog.tsx
import { Loader2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isPending = false
}) => /* @__PURE__ */ jsxs(DialogRoot, {
  open,
  onOpenChange: (details) => {
    if (!isPending)
      onOpenChange(details.open);
  },
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
                disabled: isPending,
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
});
export { ConfirmDialog };
