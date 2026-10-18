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
import {
  ConfirmDialog2
} from "./account-user-two-factor-authentication-1qzbdkf5.js";
import {
  Table2,
  TableHeader2,
  TableBody2,
  TableRow2,
  TableHead2,
  TableCell2
} from "./account-user-two-factor-authentication-06kze8cq.js";

// src/registry/thornberry/components/account-view-passkeys.tsx
import { Fingerprint, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var ViewPasskeys2 = () => {
  const { authClient, toaster } = useAccountContext2();
  const { data } = authClient.useListPasskeys();
  const [isOpen, setIsOpen] = useState(false);
  const [passkeyName, setPasskeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingPasskey, setIsDeletingPasskey] = useState(false);
  const [passkeyToDelete, setPasskeyToDelete] = useState(null);
  const handleDeletePasskey = async () => {
    if (!passkeyToDelete)
      return;
    await authClient.passkey.deletePasskey({
      id: passkeyToDelete.id,
      fetchOptions: {
        onRequest: () => setIsDeletingPasskey(true),
        onSuccess: () => {
          toaster.success({ title: "Passkey deleted successfully" });
          setIsDeletingPasskey(false);
          setPasskeyToDelete(null);
        },
        onError: (error) => {
          toaster.error({
            title: typeof error?.error?.message === "string" ? error.error.message : "Failed to delete passkey"
          });
          setIsDeletingPasskey(false);
        }
      }
    });
  };
  const handleAddPasskey = async () => {
    if (!passkeyName) {
      toaster.error({ title: "Passkey name is required" });
      return;
    }
    setIsLoading(true);
    const res = await authClient.passkey.addPasskey({ name: passkeyName });
    setIsLoading(false);
    if (res?.error) {
      toaster.error({
        title: typeof res.error.message === "string" ? res.error.message : "Failed to add passkey"
      });
    } else {
      toaster.success({
        title: "Passkey added successfully. You can now use it to sign in."
      });
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsxs(DialogRoot2, {
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
                /* @__PURE__ */ jsxs("span", {
                  children: [
                    "View Passkeys ",
                    data?.length ? `[${data.length}]` : ""
                  ]
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
                      children: "Passkeys"
                    }),
                    /* @__PURE__ */ jsx(DialogDescription2, {
                      children: "Your registered passkeys for passwordless sign-in."
                    })
                  ]
                }),
                data?.length ? /* @__PURE__ */ jsxs(Table2, {
                  children: [
                    /* @__PURE__ */ jsx(TableHeader2, {
                      children: /* @__PURE__ */ jsxs(TableRow2, {
                        children: [
                          /* @__PURE__ */ jsx(TableHead2, {
                            children: "Name"
                          }),
                          /* @__PURE__ */ jsx(TableHead2, {
                            className: "w-0"
                          })
                        ]
                      })
                    }),
                    /* @__PURE__ */ jsx(TableBody2, {
                      children: data.map((passkey) => /* @__PURE__ */ jsxs(TableRow2, {
                        children: [
                          /* @__PURE__ */ jsx(TableCell2, {
                            children: passkey.name || "My Passkey"
                          }),
                          /* @__PURE__ */ jsx(TableCell2, {
                            children: /* @__PURE__ */ jsx(Button2, {
                              variant: "ghost",
                              size: "sm",
                              "aria-label": "Delete passkey",
                              onClick: () => setPasskeyToDelete(passkey),
                              children: /* @__PURE__ */ jsx(Trash2, {
                                className: "size-4"
                              })
                            })
                          })
                        ]
                      }, passkey.id))
                    })
                  ]
                }) : /* @__PURE__ */ jsxs(Fragment, {
                  children: [
                    /* @__PURE__ */ jsx("p", {
                      children: "No passkeys found"
                    }),
                    /* @__PURE__ */ jsx(Label2, {
                      htmlFor: "passkey-name",
                      children: "New Passkey"
                    }),
                    /* @__PURE__ */ jsx(Input2, {
                      id: "passkey-name",
                      value: passkeyName,
                      onChange: (event) => setPasskeyName(event.target.value),
                      placeholder: "My Passkey"
                    }),
                    /* @__PURE__ */ jsx(Button2, {
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
                }),
                /* @__PURE__ */ jsx(Button2, {
                  variant: "outline",
                  onClick: () => setIsOpen(false),
                  children: "Close"
                })
              ]
            })
          })
        ]
      }),
      /* @__PURE__ */ jsx(ConfirmDialog2, {
        open: passkeyToDelete !== null,
        onOpenChange: (open) => {
          if (!open)
            setPasskeyToDelete(null);
        },
        title: "Delete passkey?",
        description: `"${passkeyToDelete?.name || "My Passkey"}" will be removed and can no longer be used to sign in. This cannot be undone.`,
        confirmLabel: "Delete",
        onConfirm: handleDeletePasskey,
        isPending: isDeletingPasskey
      })
    ]
  });
};
export { ViewPasskeys2 };
