import {
  UserActiveSessions
} from "../../../chunks/account-user-two-factor-authentication-9694322n.js";
import {
  EditProfile
} from "../../../chunks/account-user-two-factor-authentication-nhqej4et.js";
import {
  AvatarUpload
} from "../../../chunks/account-user-two-factor-authentication-894jevk7.js";
import {
  AlertDescription,
  AlertRoot,
  AlertTitle
} from "../../../chunks/account-user-two-factor-authentication-qrqgt04q.js";
import {
  ChangePassword
} from "../../../chunks/account-user-two-factor-authentication-ckbpdwcb.js";
import"../../../chunks/account-user-two-factor-authentication-1kbapfba.js";
import"../../../chunks/account-user-two-factor-authentication-gtemm9x0.js";
import"../../../chunks/account-user-two-factor-authentication-v7dgczst.js";
import"../../../chunks/account-user-two-factor-authentication-ksnvs1j1.js";
import {
  ViewPasskeys
} from "../../../chunks/account-user-two-factor-authentication-aq5vkhma.js";
import"../../../chunks/account-user-two-factor-authentication-164eysdm.js";
import"../../../chunks/account-user-two-factor-authentication-f7k9a70k.js";
import {
  UserTwoFactorAuthentication
} from "../../../chunks/account-user-two-factor-authentication-vgxbrb9f.js";
import"../../../chunks/account-user-two-factor-authentication-5zw78ck9.js";
import"../../../chunks/account-user-two-factor-authentication-f0pw65h3.js";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardRoot
} from "../../../chunks/account-user-two-factor-authentication-t5d4htnb.js";
import {
  AddPasskey
} from "../../../chunks/account-user-two-factor-authentication-8xd448w3.js";
import"../../../chunks/account-user-two-factor-authentication-gsg3ph0v.js";
import {
  useAccountContext
} from "../../../chunks/account-user-two-factor-authentication-en4v22ys.js";
import"../../../chunks/account-user-two-factor-authentication-nmmcnpth.js";
import"../../../chunks/account-user-two-factor-authentication-p3ac7628.js";
import {
  Button
} from "../../../chunks/account-user-two-factor-authentication-jb3sh07m.js";
import"../../../chunks/account-user-two-factor-authentication-zdtfvyzd.js";
import"../../../chunks/account-user-two-factor-authentication-yp1ewaxt.js";
import"../../../chunks/account-user-two-factor-authentication-d1wjbx81.js";

// src/registry/thornberry/components/account-console.tsx
import { Loader2, StopCircle } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var AccountConsole = ({
  avatar,
  passwordRequirements,
  checkUsernameAvailability,
  onProfileUpdated,
  activeSessions = [],
  enableActiveSessions = false,
  onSessionRevoked,
  onResendVerification,
  onStopImpersonating,
  badges,
  socialSection,
  organizationsSection,
  footer
}) => {
  const { authClient, toaster, brand } = useAccountContext();
  const { data: session, isPending } = authClient.useSession();
  const [isStopping, setIsStopping] = useState(false);
  const [isResending, setIsResending] = useState(false);
  if (isPending)
    return null;
  const user = session?.user;
  const showEmailPrompt = !!user && !user.emailVerified && !!user.email && !!onResendVerification;
  return /* @__PURE__ */ jsxs(CardRoot, {
    children: [
      /* @__PURE__ */ jsx(CardHeader, {
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [
            /* @__PURE__ */ jsxs("p", {
              className: "text-muted-foreground",
              children: [
                "Manage Your ",
                brand.organizationName,
                " Account"
              ]
            }),
            session?.session.impersonatedBy && /* @__PURE__ */ jsx(Button, {
              variant: "outline",
              disabled: isStopping,
              onClick: async () => {
                setIsStopping(true);
                await authClient.admin.stopImpersonating();
                setIsStopping(false);
                toaster.info({ title: "Impersonation stopped successfully" });
                onStopImpersonating?.();
              },
              children: isStopping ? /* @__PURE__ */ jsx(Loader2, {
                className: "mr-2 size-4 animate-spin"
              }) : /* @__PURE__ */ jsxs(Fragment, {
                children: [
                  /* @__PURE__ */ jsx(StopCircle, {
                    className: "mr-2 size-4 text-red-500"
                  }),
                  "Stop Impersonation"
                ]
              })
            })
          ]
        })
      }),
      /* @__PURE__ */ jsxs(CardContent, {
        className: "flex flex-col gap-6",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col justify-between gap-4 md:flex-row",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col items-start gap-4 sm:flex-row",
                children: [
                  /* @__PURE__ */ jsx(AvatarUpload, {
                    size: "lg",
                    uploadEnabled: avatar?.uploadEnabled,
                    onUpload: avatar?.onUpload,
                    onClear: avatar?.onClear
                  }),
                  /* @__PURE__ */ jsxs("div", {
                    className: "flex flex-col",
                    children: [
                      /* @__PURE__ */ jsxs("p", {
                        className: "font-bold",
                        children: [
                          user?.name,
                          user?.username ? ` (${user.username})` : ""
                        ]
                      }),
                      /* @__PURE__ */ jsx("p", {
                        children: user?.email
                      })
                    ]
                  }),
                  badges && /* @__PURE__ */ jsx("div", {
                    className: "flex flex-wrap items-center gap-2",
                    children: badges
                  })
                ]
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-2 sm:flex-row",
                children: [
                  /* @__PURE__ */ jsx(ChangePassword, {
                    passwordRequirements
                  }),
                  /* @__PURE__ */ jsx(EditProfile, {
                    checkUsernameAvailability,
                    onProfileUpdated
                  })
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsx("hr", {}),
          showEmailPrompt && /* @__PURE__ */ jsxs(AlertRoot, {
            variant: "warning",
            children: [
              /* @__PURE__ */ jsx(AlertTitle, {
                children: "Verify Your Email Address"
              }),
              /* @__PURE__ */ jsx(AlertDescription, {
                children: "Please verify your email address. Check your inbox for the verification email. If you haven't received it, resend it below."
              }),
              /* @__PURE__ */ jsx(Button, {
                className: "mt-2 w-fit",
                size: "sm",
                variant: "outline",
                disabled: isResending,
                onClick: async () => {
                  setIsResending(true);
                  try {
                    await onResendVerification?.();
                  } finally {
                    setIsResending(false);
                  }
                },
                children: isResending ? "Sending..." : "Resend Verification Email"
              })
            ]
          }),
          enableActiveSessions && /* @__PURE__ */ jsx(UserActiveSessions, {
            activeSessions,
            onSessionRevoked
          }),
          /* @__PURE__ */ jsx(UserTwoFactorAuthentication, {}),
          /* @__PURE__ */ jsx("h3", {
            className: "font-bold text-xl",
            children: "Passkeys"
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(AddPasskey, {}),
              /* @__PURE__ */ jsx(ViewPasskeys, {})
            ]
          }),
          socialSection && /* @__PURE__ */ jsxs(Fragment, {
            children: [
              /* @__PURE__ */ jsx("hr", {}),
              socialSection
            ]
          }),
          organizationsSection
        ]
      }),
      footer && /* @__PURE__ */ jsx(CardFooter, {
        children: footer
      })
    ]
  });
};
export {
  AccountConsole
};
