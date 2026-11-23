import {
  useAccountContext2
} from "../../../chunks/ai-describe-panel-b60vh03c.js";
import {
  Button2
} from "../../../chunks/ai-describe-panel-k2cwy48h.js";
import"../../../chunks/ai-describe-panel-b89k5zcp.js";
import {
  Input2
} from "../../../chunks/ai-describe-panel-hj664zsh.js";
import"../../../chunks/ai-describe-panel-fa46q8yp.js";
import {
  AddPasskey2
} from "../../../chunks/ai-describe-panel-q8fr6bqm.js";
import {
  PasswordRequirements2
} from "../../../chunks/ai-describe-panel-h7z0b3ps.js";
import"../../../chunks/ai-describe-panel-5r0wwsv3.js";
import {
  UserActiveSessions2
} from "../../../chunks/ai-describe-panel-08hb1s4q.js";
import"../../../chunks/ai-describe-panel-nw1mqaed.js";
import"../../../chunks/ai-describe-panel-6sr16pzs.js";
import {
  UserTwoFactorAuthentication2
} from "../../../chunks/ai-describe-panel-ep0qaftp.js";
import"../../../chunks/ai-describe-panel-06kze8cq.js";
import {
  ViewPasskeys2
} from "../../../chunks/ai-describe-panel-9ks2fkjh.js";
import {
  CardRoot2,
  CardHeader2,
  CardTitle2,
  CardDescription2,
  CardContent2,
  CardFooter2
} from "../../../chunks/ai-describe-panel-xj54p31a.js";

// src/registry/thornberry/components/account-security-settings.tsx
import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_MIN_PASSWORD_LENGTH = 12;
var summarizeUserAgent = (userAgent) => {
  const os = /Windows/i.test(userAgent) ? "Windows" : /Mac OS/i.test(userAgent) ? "macOS" : /Android/i.test(userAgent) ? "Android" : /iPhone|iPad|iOS/i.test(userAgent) ? "iOS" : /Linux/i.test(userAgent) ? "Linux" : "Unknown";
  const browser = /Edg\//i.test(userAgent) ? "Edge" : /Chrome/i.test(userAgent) ? "Chrome" : /Firefox/i.test(userAgent) ? "Firefox" : /Safari/i.test(userAgent) ? "Safari" : "Browser";
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
  return {
    deviceType: isMobile ? "mobile" : "desktop",
    label: `${os} (${browser})`
  };
};
var formatActiveSessions = (sessions, currentSessionId) => sessions.filter((session) => session.userAgent).map((session) => {
  const { deviceType, label } = summarizeUserAgent(session.userAgent ?? "");
  const details = [
    session.id === currentSessionId ? "This device" : null,
    session.ipAddress,
    session.updatedAt ? `active ${new Date(session.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}` : null
  ].filter((detail) => Boolean(detail));
  return {
    id: session.id,
    token: session.token,
    deviceType,
    label: details.length ? `${label} · ${details.join(" · ")}` : label
  };
});
var labelClassName = "font-medium text-muted-foreground text-sm";
var ChangePasswordCard = ({
  passwordRequirements,
  minPasswordLength = DEFAULT_MIN_PASSWORD_LENGTH
}) => {
  const { authClient, toaster } = useAccountContext2();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const requirements = passwordRequirements?.(newPassword);
  const meetsPolicy = requirements ? requirements.every((rule) => rule.met) : newPassword.length >= minPasswordLength;
  const passwordsMatch = newPassword === confirmPassword;
  const isValid = currentPassword.length > 0 && meetsPolicy && passwordsMatch;
  const handleChangePassword = async () => {
    if (!isValid)
      return;
    setIsSaving(true);
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword
      });
      if (result.error)
        throw new Error(result.error.message);
      toaster.success({ title: "Password updated" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toaster.error({
        title: error instanceof Error && error.message ? error.message : "Failed to change password"
      });
    } finally {
      setIsSaving(false);
    }
  };
  const submitOnEnter = (e) => {
    if (e.key === "Enter" && isValid && !isSaving) {
      e.preventDefault();
      handleChangePassword();
    }
  };
  return /* @__PURE__ */ jsxs(CardRoot2, {
    className: "overflow-hidden",
    children: [
      /* @__PURE__ */ jsxs(CardHeader2, {
        children: [
          /* @__PURE__ */ jsx(CardTitle2, {
            children: "Password"
          }),
          /* @__PURE__ */ jsx(CardDescription2, {
            children: "Change your account password"
          })
        ]
      }),
      /* @__PURE__ */ jsxs(CardContent2, {
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "space-y-1.5",
            children: [
              /* @__PURE__ */ jsx("label", {
                htmlFor: "account-security-current-password",
                className: labelClassName,
                children: "Current password"
              }),
              /* @__PURE__ */ jsx(Input2, {
                id: "account-security-current-password",
                type: "password",
                autoComplete: "current-password",
                value: currentPassword,
                onChange: (e) => setCurrentPassword(e.target.value),
                onKeyDown: submitOnEnter
              })
            ]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "space-y-1.5",
            children: [
              /* @__PURE__ */ jsx("label", {
                htmlFor: "account-security-new-password",
                className: labelClassName,
                children: "New password"
              }),
              /* @__PURE__ */ jsx(Input2, {
                id: "account-security-new-password",
                type: "password",
                autoComplete: "new-password",
                value: newPassword,
                onChange: (e) => setNewPassword(e.target.value),
                onKeyDown: submitOnEnter
              }),
              requirements ? newPassword.length > 0 && /* @__PURE__ */ jsx(PasswordRequirements2, {
                requirements
              }) : newPassword.length > 0 && !meetsPolicy && /* @__PURE__ */ jsxs("p", {
                className: "text-destructive text-xs",
                children: [
                  "Must be at least ",
                  minPasswordLength,
                  " characters"
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "space-y-1.5",
            children: [
              /* @__PURE__ */ jsx("label", {
                htmlFor: "account-security-confirm-password",
                className: labelClassName,
                children: "Confirm new password"
              }),
              /* @__PURE__ */ jsx(Input2, {
                id: "account-security-confirm-password",
                type: "password",
                autoComplete: "new-password",
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                onKeyDown: submitOnEnter
              }),
              confirmPassword.length > 0 && !passwordsMatch && /* @__PURE__ */ jsx("p", {
                className: "text-destructive text-xs",
                children: "Passwords do not match"
              })
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsx(CardFooter2, {
        children: /* @__PURE__ */ jsxs(Button2, {
          onClick: handleChangePassword,
          disabled: isSaving || !isValid,
          size: "sm",
          children: [
            isSaving ? /* @__PURE__ */ jsx(Loader2, {
              className: "size-4 animate-spin"
            }) : null,
            "Change password"
          ]
        })
      })
    ]
  });
};
var AccountSecuritySettings = ({
  passwordRequirements,
  minPasswordLength,
  sessions = [],
  sessionsNotice,
  onSessionRevoked
}) => {
  const { authClient } = useAccountContext2();
  const { data: session } = authClient.useSession();
  const activeSessions = formatActiveSessions(sessions, session?.session.id);
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ jsx(ChangePasswordCard, {
        passwordRequirements,
        minPasswordLength
      }),
      /* @__PURE__ */ jsx(CardRoot2, {
        className: "overflow-hidden",
        children: /* @__PURE__ */ jsx(CardContent2, {
          className: "flex flex-col gap-3 p-4",
          children: /* @__PURE__ */ jsx(UserTwoFactorAuthentication2, {})
        })
      }),
      /* @__PURE__ */ jsx(CardRoot2, {
        className: "overflow-hidden",
        children: /* @__PURE__ */ jsxs(CardContent2, {
          className: "space-y-3 p-4",
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(KeyRound, {
                  className: "text-muted-foreground size-5"
                }),
                /* @__PURE__ */ jsx("span", {
                  className: "font-semibold",
                  children: "Passkeys"
                })
              ]
            }),
            /* @__PURE__ */ jsx("p", {
              className: "text-muted-foreground text-sm",
              children: "Sign in without a password using a passkey stored on your device."
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "flex flex-wrap gap-2",
              children: [
                /* @__PURE__ */ jsx(AddPasskey2, {}),
                /* @__PURE__ */ jsx(ViewPasskeys2, {})
              ]
            })
          ]
        })
      }),
      /* @__PURE__ */ jsx(CardRoot2, {
        className: "overflow-hidden",
        children: /* @__PURE__ */ jsx(CardContent2, {
          className: "flex flex-col gap-3 p-4",
          children: sessionsNotice ?? /* @__PURE__ */ jsx(UserActiveSessions2, {
            activeSessions,
            onSessionRevoked
          })
        })
      })
    ]
  });
};
export {
  AccountSecuritySettings,
  formatActiveSessions
};
