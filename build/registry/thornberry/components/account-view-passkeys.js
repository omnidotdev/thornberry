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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../../chunks/avatar-f7k9a70k.js";
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

// src/registry/thornberry/components/account-view-passkeys.tsx
import { Fingerprint, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var ViewPasskeys = () => {
  const { authClient, toaster } = useAccountContext();
  const { data } = authClient.useListPasskeys();
  const [isOpen, setIsOpen] = useState(false);
  const [passkeyName, setPasskeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingPasskey, setIsDeletingPasskey] = useState(false);
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
            /* @__PURE__ */ jsxs("span", {
              children: [
                "View Passkeys ",
                data?.length ? `[${data.length}]` : ""
              ]
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
                  children: "Passkeys"
                }),
                /* @__PURE__ */ jsx(DialogDescription, {
                  children: "Your registered passkeys for passwordless sign-in."
                })
              ]
            }),
            data?.length ? /* @__PURE__ */ jsxs(Table, {
              children: [
                /* @__PURE__ */ jsx(TableHeader, {
                  children: /* @__PURE__ */ jsxs(TableRow, {
                    children: [
                      /* @__PURE__ */ jsx(TableHead, {
                        children: "Name"
                      }),
                      /* @__PURE__ */ jsx(TableHead, {
                        className: "w-0"
                      })
                    ]
                  })
                }),
                /* @__PURE__ */ jsx(TableBody, {
                  children: data.map((passkey) => /* @__PURE__ */ jsxs(TableRow, {
                    children: [
                      /* @__PURE__ */ jsx(TableCell, {
                        children: passkey.name || "My Passkey"
                      }),
                      /* @__PURE__ */ jsx(TableCell, {
                        children: /* @__PURE__ */ jsx(Button, {
                          variant: "ghost",
                          size: "sm",
                          "aria-label": "Delete passkey",
                          onClick: async () => {
                            await authClient.passkey.deletePasskey({
                              id: passkey.id,
                              fetchOptions: {
                                onRequest: () => setIsDeletingPasskey(true),
                                onSuccess: () => {
                                  toaster.success({
                                    title: "Passkey deleted successfully"
                                  });
                                  setIsDeletingPasskey(false);
                                },
                                onError: (error) => {
                                  toaster.error({
                                    title: typeof error?.error?.message === "string" ? error.error.message : "Failed to delete passkey"
                                  });
                                  setIsDeletingPasskey(false);
                                }
                              }
                            });
                          },
                          children: isDeletingPasskey ? /* @__PURE__ */ jsx(Loader2, {
                            className: "size-4 animate-spin"
                          }) : /* @__PURE__ */ jsx(Trash2, {
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
                /* @__PURE__ */ jsx(Label, {
                  htmlFor: "passkey-name",
                  children: "New Passkey"
                }),
                /* @__PURE__ */ jsx(Input, {
                  id: "passkey-name",
                  value: passkeyName,
                  onChange: (event) => setPasskeyName(event.target.value),
                  placeholder: "My Passkey"
                }),
                /* @__PURE__ */ jsx(Button, {
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
            /* @__PURE__ */ jsx(Button, {
              variant: "outline",
              onClick: () => setIsOpen(false),
              children: "Close"
            })
          ]
        })
      })
    ]
  });
};
export {
  ViewPasskeys
};
