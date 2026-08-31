import {
  useAccountContext
} from "../../../chunks/avatar-en4v22ys.js";
import {
  Label
} from "../../../chunks/avatar-gsg3ph0v.js";
import {
  Input
} from "../../../chunks/avatar-nmmcnpth.js";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from "../../../chunks/avatar-p3ac7628.js";
import {
  Button
} from "../../../chunks/avatar-jb3sh07m.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import"../../../chunks/avatar-yp1ewaxt.js";
import"../../../chunks/avatar-d1wjbx81.js";

// src/registry/thornberry/components/account-add-passkey.tsx
import { Fingerprint, Loader2 } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var AddPasskey = () => {
  const { authClient, toaster } = useAccountContext();
  const [isOpen, setIsOpen] = useState(false);
  const [passkeyName, setPasskeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleAddPasskey = async () => {
    if (!passkeyName) {
      toaster.error({ title: "Passkey name is required" });
      return;
    }
    setIsLoading(true);
    const res = await authClient.passkey.addPasskey({ name: passkeyName });
    if (res?.error) {
      toaster.error({
        title: typeof res.error.message === "string" ? res.error.message : "Failed to add passkey"
      });
    } else {
      setIsOpen(false);
      toaster.success({
        title: "Passkey added successfully. You can now use it to sign in."
      });
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsxs(DialogRoot, {
    open: isOpen,
    onOpenChange: ({ open }) => setIsOpen(open),
    children: [
      /* @__PURE__ */ jsx(DialogTrigger, {
        asChild: true,
        children: /* @__PURE__ */ jsxs(Button, {
          variant: "outline",
          children: [
            /* @__PURE__ */ jsx(Fingerprint, {
              className: "mr-2 size-4"
            }),
            /* @__PURE__ */ jsx("span", {
              children: "Add Passkey"
            })
          ]
        })
      }),
      /* @__PURE__ */ jsx(DialogBackdrop, {}),
      /* @__PURE__ */ jsx(DialogPositioner, {
        children: /* @__PURE__ */ jsxs(DialogContent, {
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-1.5",
              children: [
                /* @__PURE__ */ jsx(DialogTitle, {
                  children: "Add New Passkey"
                }),
                /* @__PURE__ */ jsx(DialogDescription, {
                  children: "Create a new passkey to securely access your account without a password."
                })
              ]
            }),
            /* @__PURE__ */ jsx(Label, {
              htmlFor: "passkey-name",
              children: "Passkey Name"
            }),
            /* @__PURE__ */ jsx(Input, {
              id: "passkey-name",
              value: passkeyName,
              onChange: (event) => setPasskeyName(event.target.value),
              placeholder: "My Passkey"
            }),
            /* @__PURE__ */ jsx(Button, {
              disabled: isLoading,
              type: "submit",
              onClick: handleAddPasskey,
              children: isLoading ? /* @__PURE__ */ jsx(Loader2, {
                className: "mr-2 size-4 animate-spin"
              }) : /* @__PURE__ */ jsxs(Fragment, {
                children: [
                  /* @__PURE__ */ jsx(Fingerprint, {
                    className: "mr-2 size-4"
                  }),
                  "Create Passkey"
                ]
              })
            })
          ]
        })
      })
    ]
  });
};
export {
  AddPasskey
};
