import {
  useAccountContext2
} from "./account-user-two-factor-authentication-b60vh03c.js";
import {
  Button2
} from "./account-user-two-factor-authentication-qyg3bvpa.js";
import {
  DialogRoot2,
  DialogTrigger2,
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

// src/registry/thornberry/components/account-add-passkey.tsx
import { Fingerprint, Loader2 } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var AddPasskey2 = () => {
  const { authClient, toaster } = useAccountContext2();
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
  return /* @__PURE__ */ jsxs(DialogRoot2, {
    open: isOpen,
    onOpenChange: ({ open }) => setIsOpen(open),
    children: [
      /* @__PURE__ */ jsx(DialogTrigger2, {
        asChild: true,
        children: /* @__PURE__ */ jsxs(Button2, {
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
      /* @__PURE__ */ jsx(DialogBackdrop2, {}),
      /* @__PURE__ */ jsx(DialogPositioner2, {
        children: /* @__PURE__ */ jsxs(DialogContent2, {
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-1.5",
              children: [
                /* @__PURE__ */ jsx(DialogTitle2, {
                  children: "Add New Passkey"
                }),
                /* @__PURE__ */ jsx(DialogDescription2, {
                  children: "Create a new passkey to securely access your account without a password."
                })
              ]
            }),
            /* @__PURE__ */ jsx(Label2, {
              htmlFor: "passkey-name",
              children: "Passkey Name"
            }),
            /* @__PURE__ */ jsx(Input2, {
              id: "passkey-name",
              value: passkeyName,
              onChange: (event) => setPasskeyName(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter" && !isLoading) {
                  event.preventDefault();
                  handleAddPasskey();
                }
              },
              placeholder: "My Passkey"
            }),
            /* @__PURE__ */ jsx(Button2, {
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
export { AddPasskey2 };
