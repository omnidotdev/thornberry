import {
  useAccountContext2
} from "../../../chunks/account-user-two-factor-authentication-b60vh03c.js";
import {
  Button2
} from "../../../chunks/account-user-two-factor-authentication-qyg3bvpa.js";
import"../../../chunks/account-user-two-factor-authentication-8q0yqrx6.js";
import"../../../chunks/account-user-two-factor-authentication-hj664zsh.js";
import"../../../chunks/account-user-two-factor-authentication-fa46q8yp.js";
import {
  AddPasskey2
} from "../../../chunks/account-user-two-factor-authentication-8hgpxw18.js";
import"../../../chunks/account-user-two-factor-authentication-b7jpk793.js";
import"../../../chunks/account-user-two-factor-authentication-1qzbdkf5.js";
import"../../../chunks/account-user-two-factor-authentication-q37czf6m.js";
import {
  AvatarUpload2
} from "../../../chunks/account-user-two-factor-authentication-h9xs2bn6.js";
import"../../../chunks/account-user-two-factor-authentication-h7z0b3ps.js";
import"../../../chunks/account-user-two-factor-authentication-n3zp77m0.js";
import"../../../chunks/account-user-two-factor-authentication-rmtq1dzy.js";
import"../../../chunks/account-user-two-factor-authentication-e8m4br8p.js";
import"../../../chunks/account-user-two-factor-authentication-8wtqb3wn.js";
import {
  ChangePassword2
} from "../../../chunks/account-user-two-factor-authentication-b42r02js.js";
import {
  EditProfile2
} from "../../../chunks/account-user-two-factor-authentication-2hcq6kz1.js";
import {
  UserActiveSessions2
} from "../../../chunks/account-user-two-factor-authentication-4c988h17.js";
import {
  UserTwoFactorAuthentication2
} from "../../../chunks/account-user-two-factor-authentication-8771ftdn.js";
import"../../../chunks/account-user-two-factor-authentication-06kze8cq.js";
import {
  ViewPasskeys2
} from "../../../chunks/account-user-two-factor-authentication-mx6m3pne.js";
import {
  AlertRoot2,
  AlertTitle2,
  AlertDescription2
} from "../../../chunks/account-user-two-factor-authentication-zzr25an1.js";
import {
  CardRoot2,
  CardHeader2,
  CardContent2,
  CardFooter2
} from "../../../chunks/account-user-two-factor-authentication-f7d4gzjq.js";

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
  const { authClient, toaster, brand } = useAccountContext2();
  const { data: session, isPending } = authClient.useSession();
  const [isStopping, setIsStopping] = useState(false);
  const [isResending, setIsResending] = useState(false);
  if (isPending)
    return null;
  const user = session?.user;
  const showEmailPrompt = !!user && !user.emailVerified && !!user.email && !!onResendVerification;
  return /* @__PURE__ */ jsxs(CardRoot2, {
    children: [
      /* @__PURE__ */ jsx(CardHeader2, {
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
            session?.session.impersonatedBy && /* @__PURE__ */ jsx(Button2, {
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
      /* @__PURE__ */ jsxs(CardContent2, {
        className: "flex flex-col gap-6",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col justify-between gap-4 md:flex-row",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col items-start gap-4 sm:flex-row",
                children: [
                  /* @__PURE__ */ jsx(AvatarUpload2, {
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
                  /* @__PURE__ */ jsx(ChangePassword2, {
                    passwordRequirements
                  }),
                  /* @__PURE__ */ jsx(EditProfile2, {
                    checkUsernameAvailability,
                    onProfileUpdated
                  })
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsx("hr", {}),
          showEmailPrompt && /* @__PURE__ */ jsxs(AlertRoot2, {
            variant: "warning",
            children: [
              /* @__PURE__ */ jsx(AlertTitle2, {
                children: "Verify Your Email Address"
              }),
              /* @__PURE__ */ jsx(AlertDescription2, {
                children: "Please verify your email address. Check your inbox for the verification email. If you haven't received it, resend it below."
              }),
              /* @__PURE__ */ jsx(Button2, {
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
          enableActiveSessions && /* @__PURE__ */ jsx(UserActiveSessions2, {
            activeSessions,
            onSessionRevoked
          }),
          /* @__PURE__ */ jsx(UserTwoFactorAuthentication2, {}),
          /* @__PURE__ */ jsx("h3", {
            className: "font-bold text-xl",
            children: "Passkeys"
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(AddPasskey2, {}),
              /* @__PURE__ */ jsx(ViewPasskeys2, {})
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
      footer && /* @__PURE__ */ jsx(CardFooter2, {
        children: footer
      })
    ]
  });
};
export {
  AccountConsole
};
