import {
  useAccountContext2
} from "./ai-describe-panel-b60vh03c.js";
import {
  Button2
} from "./ai-describe-panel-k2cwy48h.js";
import {
  DialogRoot2,
  DialogTrigger2,
  DialogBackdrop2,
  DialogPositioner2,
  DialogContent2,
  DialogTitle2,
  DialogDescription2
} from "./ai-describe-panel-b6hxzz19.js";
import {
  Input2
} from "./ai-describe-panel-hj664zsh.js";
import {
  Label2
} from "./ai-describe-panel-fa46q8yp.js";
import {
  PasswordInput2
} from "./ai-describe-panel-nw1mqaed.js";
import {
  QrCode2
} from "./ai-describe-panel-6sr16pzs.js";

// src/registry/thornberry/components/account-user-two-factor-authentication.tsx
import {
  Copy,
  Download,
  ExternalLink,
  KeyRound,
  Loader2,
  ShieldCheck,
  ShieldOff
} from "lucide-react";
import { useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var onEnter = (run) => (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    run();
  }
};
var QrPanel = ({ value }) => /* @__PURE__ */ jsx("div", {
  className: "flex justify-center",
  children: /* @__PURE__ */ jsx(QrCode2, {
    value,
    size: 180,
    label: "Authenticator setup QR code",
    className: "border-border rounded-lg border p-4"
  })
});
var BackupCodesPanel = ({
  codes,
  organizationName,
  toaster
}) => /* @__PURE__ */ jsxs("div", {
  className: "flex flex-col gap-2",
  children: [
    /* @__PURE__ */ jsx("p", {
      className: "text-sm font-medium",
      children: "Save these backup codes somewhere safe. Each one works once to sign in if you lose your authenticator. They will not be shown again."
    }),
    /* @__PURE__ */ jsx("ul", {
      className: "border-border bg-muted grid grid-cols-2 gap-2 rounded-md border p-3",
      children: codes.map((code) => /* @__PURE__ */ jsx("li", {
        className: "font-mono text-sm",
        children: code
      }, code))
    }),
    /* @__PURE__ */ jsxs("div", {
      className: "flex flex-wrap gap-2",
      children: [
        /* @__PURE__ */ jsxs(Button2, {
          size: "sm",
          variant: "outline",
          className: "w-fit",
          onClick: async () => {
            try {
              await navigator.clipboard?.writeText(codes.join(`
`));
              toaster.success({ title: "Backup codes copied" });
            } catch {
              toaster.error({ title: "Could not copy. Copy them manually." });
            }
          },
          children: [
            /* @__PURE__ */ jsx(Copy, {
              className: "mr-2 size-4"
            }),
            "Copy codes"
          ]
        }),
        /* @__PURE__ */ jsxs(Button2, {
          size: "sm",
          variant: "outline",
          className: "w-fit",
          onClick: () => {
            try {
              const blob = new Blob([`${codes.join(`
`)}
`], {
                type: "text/plain"
              });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = `${organizationName.toLowerCase()}-backup-codes.txt`;
              document.body.appendChild(anchor);
              anchor.click();
              anchor.remove();
              URL.revokeObjectURL(url);
            } catch {
              toaster.error({ title: "Could not download. Copy them manually." });
            }
          },
          children: [
            /* @__PURE__ */ jsx(Download, {
              className: "mr-2 size-4"
            }),
            "Download"
          ]
        })
      ]
    })
  ]
});
var UserTwoFactorAuthentication2 = () => {
  const { authClient, toaster, brand } = useAccountContext2();
  const { data: session } = authClient.useSession();
  const [isPendingTwoFa, setIsPendingTwoFa] = useState(false);
  const [password, setPassword] = useState("");
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [twoFactorVerifyUri, setTwoFactorVerifyUri] = useState("");
  const [pendingBackupCodes, setPendingBackupCodes] = useState([]);
  const [enrolledBackupCodes, setEnrolledBackupCodes] = useState(null);
  const [codesAcknowledged, setCodesAcknowledged] = useState(false);
  const [regenDialogOpen, setRegenDialogOpen] = useState(false);
  const [regenPassword, setRegenPassword] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratedCodes, setRegeneratedCodes] = useState(null);
  const [regenAcknowledged, setRegenAcknowledged] = useState(false);
  const twoFactorEnabled = !!session?.user.twoFactorEnabled;
  const resetTwoFactorDialog = () => {
    setTwoFactorDialogOpen(false);
    setTwoFactorVerifyUri("");
    setPendingBackupCodes([]);
    setEnrolledBackupCodes(null);
    setCodesAcknowledged(false);
    setPassword("");
  };
  const resetRegenDialog = () => {
    setRegenDialogOpen(false);
    setRegenPassword("");
    setRegeneratedCodes(null);
    setRegenAcknowledged(false);
    setIsRegenerating(false);
  };
  const submitTwoFactor = async () => {
    if (enrolledBackupCodes) {
      resetTwoFactorDialog();
      return;
    }
    setIsPendingTwoFa(true);
    if (twoFactorEnabled) {
      await authClient.twoFactor.disable({
        password,
        fetchOptions: {
          onError(context) {
            toaster.error({ title: context.error.message });
          },
          onSuccess() {
            toaster.success({ title: "2FA disabled successfully" });
            resetTwoFactorDialog();
          }
        }
      });
    } else if (twoFactorVerifyUri) {
      await authClient.twoFactor.verifyTotp({
        code: password,
        fetchOptions: {
          onError(context) {
            setIsPendingTwoFa(false);
            setPassword("");
            toaster.error({ title: context.error.message });
          },
          onSuccess() {
            toaster.success({ title: "2FA enabled successfully" });
            setEnrolledBackupCodes(pendingBackupCodes);
            setCodesAcknowledged(false);
            setPendingBackupCodes([]);
            setTwoFactorVerifyUri("");
            setIsPendingTwoFa(false);
            setPassword("");
          }
        }
      });
      return;
    } else {
      await authClient.twoFactor.enable({
        password,
        fetchOptions: {
          onError(context) {
            toaster.error({ title: context.error.message });
          },
          onSuccess(context) {
            setTwoFactorVerifyUri(context.data.totpURI);
            setPendingBackupCodes(context.data.backupCodes ?? []);
          }
        }
      });
    }
    setIsPendingTwoFa(false);
    setPassword("");
  };
  const showRescanQr = async () => {
    if (password.length < 8) {
      toaster.error({ title: "Password must be at least 8 characters" });
      return;
    }
    await authClient.twoFactor.getTotpUri({ password }, {
      onSuccess(context) {
        setTwoFactorVerifyUri(context.data.totpURI);
      }
    });
    setPassword("");
  };
  const submitRegen = async () => {
    if (regenPassword.length < 8) {
      toaster.error({ title: "Password must be at least 8 characters" });
      return;
    }
    setIsRegenerating(true);
    await authClient.twoFactor.generateBackupCodes({
      password: regenPassword,
      fetchOptions: {
        onError(context) {
          toaster.error({ title: context.error.message });
        },
        onSuccess(context) {
          setRegeneratedCodes(context.data.backupCodes ?? []);
        }
      }
    });
    setRegenPassword("");
    setIsRegenerating(false);
  };
  const lockTwoFactorDialog = !!enrolledBackupCodes && !codesAcknowledged;
  const lockRegenDialog = !!regeneratedCodes && !regenAcknowledged;
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx("h3", {
        className: "text-xl font-bold",
        children: "Two-Factor Authentication"
      }),
      /* @__PURE__ */ jsxs("p", {
        className: "text-muted-foreground max-w-prose text-sm",
        children: [
          "Two-factor authentication adds a second step when you sign in: after your password, you enter a short code from an authenticator app on your phone. Even if someone learns your password, they can't sign in without your phone.",
          brand.securityDocsUrl ? /* @__PURE__ */ jsxs(Fragment, {
            children: [
              " ",
              /* @__PURE__ */ jsxs("a", {
                href: brand.securityDocsUrl,
                target: "_blank",
                rel: "noreferrer",
                className: "text-primary inline-flex items-center gap-1 underline underline-offset-2",
                children: [
                  "Learn more about two-factor authentication",
                  /* @__PURE__ */ jsx(ExternalLink, {
                    className: "size-3"
                  })
                ]
              })
            ]
          }) : null
        ]
      }),
      twoFactorEnabled && /* @__PURE__ */ jsxs("div", {
        className: "flex flex-wrap gap-2",
        children: [
          /* @__PURE__ */ jsxs(DialogRoot2, {
            children: [
              /* @__PURE__ */ jsx(DialogTrigger2, {
                asChild: true,
                children: /* @__PURE__ */ jsxs(Button2, {
                  className: "w-fit",
                  size: "sm",
                  variant: "outline",
                  children: [
                    /* @__PURE__ */ jsx(QrCode2, {
                      className: "mr-2 size-4"
                    }),
                    /* @__PURE__ */ jsx("span", {
                      children: "Scan QR Code"
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
                          children: "Scan QR Code"
                        }),
                        /* @__PURE__ */ jsxs(DialogDescription2, {
                          children: [
                            "Add ",
                            brand.organizationName,
                            " to your authenticator app again. Confirm your password, then scan the code below."
                          ]
                        })
                      ]
                    }),
                    twoFactorVerifyUri ? /* @__PURE__ */ jsxs(Fragment, {
                      children: [
                        /* @__PURE__ */ jsx(QrPanel, {
                          value: twoFactorVerifyUri
                        }),
                        /* @__PURE__ */ jsx(Label2, {
                          htmlFor: "two-factor-uri",
                          children: "Can't scan? Enter this setup key manually instead."
                        }),
                        /* @__PURE__ */ jsx("input", {
                          id: "two-factor-uri",
                          readOnly: true,
                          value: twoFactorVerifyUri,
                          className: "border-border bg-muted w-full rounded border px-2 py-1 font-mono text-sm"
                        })
                      ]
                    }) : /* @__PURE__ */ jsxs(Fragment, {
                      children: [
                        /* @__PURE__ */ jsx(PasswordInput2, {
                          value: password,
                          onChange: (event) => setPassword(event.target.value),
                          onKeyDown: onEnter(showRescanQr),
                          placeholder: "Enter Password"
                        }),
                        /* @__PURE__ */ jsx(Button2, {
                          onClick: showRescanQr,
                          children: "Show QR Code"
                        })
                      ]
                    })
                  ]
                })
              })
            ]
          }),
          /* @__PURE__ */ jsxs(DialogRoot2, {
            open: regenDialogOpen,
            closeOnInteractOutside: !lockRegenDialog,
            closeOnEscape: !lockRegenDialog,
            onOpenChange: ({ open }) => open ? setRegenDialogOpen(true) : resetRegenDialog(),
            children: [
              /* @__PURE__ */ jsx(DialogTrigger2, {
                asChild: true,
                children: /* @__PURE__ */ jsxs(Button2, {
                  className: "w-fit",
                  size: "sm",
                  variant: "outline",
                  children: [
                    /* @__PURE__ */ jsx(KeyRound, {
                      className: "mr-2 size-4"
                    }),
                    /* @__PURE__ */ jsx("span", {
                      children: "Backup codes"
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
                          children: "Regenerate backup codes"
                        }),
                        /* @__PURE__ */ jsx(DialogDescription2, {
                          children: regeneratedCodes ? "Your previous backup codes no longer work. Save the new ones below." : "Confirm your password to generate a fresh set of backup codes. This invalidates any codes you saved before."
                        })
                      ]
                    }),
                    regeneratedCodes ? /* @__PURE__ */ jsxs(Fragment, {
                      children: [
                        /* @__PURE__ */ jsx(BackupCodesPanel, {
                          codes: regeneratedCodes,
                          organizationName: brand.organizationName,
                          toaster
                        }),
                        /* @__PURE__ */ jsxs("label", {
                          className: "flex items-center gap-2 text-sm",
                          children: [
                            /* @__PURE__ */ jsx("input", {
                              type: "checkbox",
                              checked: regenAcknowledged,
                              onChange: (event) => setRegenAcknowledged(event.target.checked)
                            }),
                            "I have saved my backup codes"
                          ]
                        }),
                        /* @__PURE__ */ jsx(Button2, {
                          className: "w-fit",
                          disabled: !regenAcknowledged,
                          onClick: resetRegenDialog,
                          children: "Done"
                        })
                      ]
                    }) : /* @__PURE__ */ jsxs(Fragment, {
                      children: [
                        /* @__PURE__ */ jsx(Label2, {
                          htmlFor: "regen-password",
                          children: "Password"
                        }),
                        /* @__PURE__ */ jsx(PasswordInput2, {
                          id: "regen-password",
                          placeholder: "Password",
                          value: regenPassword,
                          onChange: (event) => setRegenPassword(event.target.value),
                          onKeyDown: onEnter(submitRegen)
                        }),
                        /* @__PURE__ */ jsx(Button2, {
                          disabled: isRegenerating,
                          onClick: submitRegen,
                          children: isRegenerating ? /* @__PURE__ */ jsx(Loader2, {
                            className: "mr-2 size-4 animate-spin"
                          }) : "Regenerate backup codes"
                        })
                      ]
                    })
                  ]
                })
              })
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsxs(DialogRoot2, {
        open: twoFactorDialogOpen,
        closeOnInteractOutside: !lockTwoFactorDialog,
        closeOnEscape: !lockTwoFactorDialog,
        onOpenChange: ({ open }) => open ? setTwoFactorDialogOpen(true) : resetTwoFactorDialog(),
        children: [
          /* @__PURE__ */ jsx(DialogTrigger2, {
            asChild: true,
            children: /* @__PURE__ */ jsxs(Button2, {
              size: "sm",
              className: twoFactorEnabled ? "w-fit bg-red-600 text-white hover:bg-red-700" : "w-fit",
              children: [
                twoFactorEnabled ? /* @__PURE__ */ jsx(ShieldOff, {
                  className: "mr-2 size-4"
                }) : /* @__PURE__ */ jsx(ShieldCheck, {
                  className: "mr-2 size-4"
                }),
                /* @__PURE__ */ jsx("span", {
                  children: twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"
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
                      children: enrolledBackupCodes ? "Save your backup codes" : twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"
                    }),
                    /* @__PURE__ */ jsx(DialogDescription2, {
                      children: enrolledBackupCodes ? "Two-factor authentication is on. Store these recovery codes before you close this." : twoFactorEnabled ? "Turn off two-factor authentication. Your account will be protected by your password alone." : twoFactorVerifyUri ? "Scan the code with your authenticator app, then enter the 6-digit code it shows to finish." : "Confirm your password to begin setting up two-factor authentication."
                    })
                  ]
                }),
                enrolledBackupCodes ? /* @__PURE__ */ jsxs(Fragment, {
                  children: [
                    /* @__PURE__ */ jsx(BackupCodesPanel, {
                      codes: enrolledBackupCodes,
                      organizationName: brand.organizationName,
                      toaster
                    }),
                    /* @__PURE__ */ jsxs("label", {
                      className: "flex items-center gap-2 text-sm",
                      children: [
                        /* @__PURE__ */ jsx("input", {
                          type: "checkbox",
                          checked: codesAcknowledged,
                          onChange: (event) => setCodesAcknowledged(event.target.checked)
                        }),
                        "I have saved my backup codes"
                      ]
                    })
                  ]
                }) : twoFactorVerifyUri ? /* @__PURE__ */ jsxs(Fragment, {
                  children: [
                    /* @__PURE__ */ jsx(QrPanel, {
                      value: twoFactorVerifyUri
                    }),
                    /* @__PURE__ */ jsx(Label2, {
                      htmlFor: "two-factor-code",
                      children: "Enter the 6-digit code from your authenticator app"
                    }),
                    /* @__PURE__ */ jsx(Input2, {
                      id: "two-factor-code",
                      inputMode: "numeric",
                      autoComplete: "one-time-code",
                      value: password,
                      onChange: (event) => setPassword(event.target.value),
                      onKeyDown: onEnter(submitTwoFactor),
                      placeholder: "000000"
                    })
                  ]
                }) : /* @__PURE__ */ jsxs(Fragment, {
                  children: [
                    /* @__PURE__ */ jsx(Label2, {
                      htmlFor: "two-factor-password",
                      children: "Password"
                    }),
                    /* @__PURE__ */ jsx(PasswordInput2, {
                      id: "two-factor-password",
                      placeholder: "Password",
                      value: password,
                      onChange: (event) => setPassword(event.target.value),
                      onKeyDown: onEnter(submitTwoFactor)
                    })
                  ]
                }),
                /* @__PURE__ */ jsx(Button2, {
                  disabled: isPendingTwoFa || !!enrolledBackupCodes && !codesAcknowledged,
                  onClick: submitTwoFactor,
                  children: isPendingTwoFa ? /* @__PURE__ */ jsx(Loader2, {
                    className: "mr-2 size-4 animate-spin"
                  }) : enrolledBackupCodes ? "Done" : twoFactorEnabled ? "Disable 2FA" : twoFactorVerifyUri ? "Verify & activate" : "Enable 2FA"
                })
              ]
            })
          })
        ]
      })
    ]
  });
};
export { UserTwoFactorAuthentication2 };
