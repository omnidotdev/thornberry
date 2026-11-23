import {
  Button2
} from "./ai-describe-panel-h4yrvya3.js";
import {
  DialogRoot2,
  DialogPortal2,
  DialogBackdrop2,
  DialogPositioner2,
  DialogContent2,
  DialogTitle2,
  DialogDescription2
} from "./ai-describe-panel-6bn090ct.js";
import {
  Input2
} from "./ai-describe-panel-hj664zsh.js";
import {
  Label2
} from "./ai-describe-panel-fa46q8yp.js";

// src/registry/thornberry/components/confirm-dialog.tsx
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var ConfirmDialog2 = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "destructive",
  onConfirm,
  isPending = false,
  pendingLabel,
  error,
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
    role: "alertdialog",
    closeOnInteractOutside: !isPending,
    closeOnEscape: !isPending,
    lazyMount: true,
    unmountOnExit: true,
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
                        className: "text-foreground font-medium",
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
                    onKeyDown: (event) => {
                      if (event.key === "Enter" && confirmable && !isPending) {
                        event.preventDefault();
                        onConfirm();
                      }
                    },
                    autoComplete: "off",
                    autoCapitalize: "off",
                    spellCheck: false,
                    disabled: isPending
                  })
                ]
              }),
              error && /* @__PURE__ */ jsx("p", {
                role: "alert",
                className: "text-destructive text-sm",
                children: error
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
                    variant: confirmVariant,
                    onClick: onConfirm,
                    disabled: isPending || !confirmable,
                    children: isPending ? /* @__PURE__ */ jsxs(Fragment, {
                      children: [
                        /* @__PURE__ */ jsx(Loader2, {
                          className: "size-4 animate-spin"
                        }),
                        pendingLabel
                      ]
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
