import {
  useAccountContext2
} from "../../../chunks/ai-describe-panel-b60vh03c.js";
import"../../../chunks/ai-describe-panel-516n6cnr.js";
import {
  Button2
} from "../../../chunks/ai-describe-panel-k2cwy48h.js";
import"../../../chunks/ai-describe-panel-b6hxzz19.js";
import {
  Input2
} from "../../../chunks/ai-describe-panel-hj664zsh.js";
import"../../../chunks/ai-describe-panel-fa46q8yp.js";
import"../../../chunks/ai-describe-panel-msghhdby.js";
import"../../../chunks/ai-describe-panel-b3rhyrd1.js";
import {
  AvatarUpload2
} from "../../../chunks/ai-describe-panel-h9ez6j06.js";
import {
  CardRoot2,
  CardHeader2,
  CardTitle2,
  CardDescription2,
  CardContent2,
  CardFooter2
} from "../../../chunks/ai-describe-panel-xj54p31a.js";

// src/registry/thornberry/components/account-profile-settings.tsx
import { Check, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var USERNAME_CHECK_DELAY_MS = 500;
var MIN_USERNAME_LENGTH = 3;
var errorMessage = (error, fallback) => error instanceof Error && error.message ? error.message : fallback;
var SettingsCard = ({
  title,
  description,
  footer,
  children,
  className
}) => /* @__PURE__ */ jsxs(CardRoot2, {
  className: "overflow-hidden",
  children: [
    /* @__PURE__ */ jsxs(CardHeader2, {
      children: [
        /* @__PURE__ */ jsx(CardTitle2, {
          children: title
        }),
        /* @__PURE__ */ jsx(CardDescription2, {
          children: description
        })
      ]
    }),
    /* @__PURE__ */ jsx(CardContent2, {
      className,
      children
    }),
    /* @__PURE__ */ jsx(CardFooter2, {
      children: footer
    })
  ]
});
var labelClassName = "font-medium text-muted-foreground text-sm";
var AccountProfileSettings = (props) => {
  const { authClient } = useAccountContext2();
  const { data: session, isPending } = authClient.useSession();
  if (isPending || !session)
    return null;
  return /* @__PURE__ */ jsx(ProfileForms, {
    user: session.user,
    ...props
  }, session.user.id);
};
var ProfileForms = ({
  user,
  avatar,
  checkUsernameAvailability,
  badges,
  emailNotice,
  changeEmailCallbackURL,
  onProfileUpdated
}) => {
  const { authClient, toaster, brand } = useAccountContext2();
  const { refetch } = authClient.useSession();
  const [name, setName] = useState(user.name ?? "");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isEmailSaving, setIsEmailSaving] = useState(false);
  const usernameTimer = useRef(null);
  useEffect(() => () => {
    if (usernameTimer.current)
      clearTimeout(usernameTimer.current);
  }, []);
  const handleUsernameChange = (value) => {
    setUsername(value);
    setUsernameStatus("idle");
    if (usernameTimer.current)
      clearTimeout(usernameTimer.current);
    if (!checkUsernameAvailability || value.length < MIN_USERNAME_LENGTH)
      return;
    setUsernameStatus("checking");
    usernameTimer.current = setTimeout(async () => {
      try {
        const result = await checkUsernameAvailability(value.toLowerCase());
        setUsernameStatus(result?.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, USERNAME_CHECK_DELAY_MS);
  };
  const refresh = async () => {
    await refetch();
    await onProfileUpdated?.();
  };
  const handleProfileSave = async () => {
    const updates = {};
    if (name && name !== user.name)
      updates.name = name;
    if (username && usernameStatus === "available")
      updates.username = username.toLowerCase();
    if (Object.keys(updates).length === 0) {
      toaster.info({ title: "No changes to save" });
      return;
    }
    setIsProfileSaving(true);
    try {
      const result = await authClient.updateUser(updates);
      if (result.error)
        throw new Error(result.error.message);
      toaster.success({ title: "Profile updated" });
      setUsername("");
      setUsernameStatus("idle");
      await refresh();
    } catch (error) {
      toaster.error({
        title: errorMessage(error, "Failed to update profile")
      });
    } finally {
      setIsProfileSaving(false);
    }
  };
  const handleEmailChange = async () => {
    if (!newEmail)
      return;
    setIsEmailSaving(true);
    try {
      const result = await authClient.changeEmail({
        newEmail,
        callbackURL: changeEmailCallbackURL
      });
      if (result.error)
        throw new Error(result.error.message);
      toaster.success({
        title: "Verification email sent to your current email address"
      });
      setNewEmail("");
    } catch (error) {
      toaster.error({ title: errorMessage(error, "Failed to change email") });
    } finally {
      setIsEmailSaving(false);
    }
  };
  const onProfileKeyDown = (e) => {
    if (e.key === "Enter" && !isProfileSaving) {
      e.preventDefault();
      handleProfileSave();
    }
  };
  const onEmailKeyDown = (e) => {
    if (e.key === "Enter" && newEmail && !isEmailSaving) {
      e.preventDefault();
      handleEmailChange();
    }
  };
  const handleAvatarUpload = avatar?.onUpload ? async (blob) => {
    await avatar.onUpload?.(blob);
    await refresh();
  } : undefined;
  const handleAvatarClear = avatar?.onClear ? async () => {
    await avatar.onClear?.();
    await refresh();
  } : undefined;
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ jsxs(SettingsCard, {
        title: "Profile",
        description: "Your personal information",
        className: "space-y-6",
        footer: /* @__PURE__ */ jsxs(Button2, {
          onClick: handleProfileSave,
          disabled: isProfileSaving,
          size: "sm",
          children: [
            isProfileSaving ? /* @__PURE__ */ jsx(Loader2, {
              className: "size-4 animate-spin"
            }) : null,
            "Save"
          ]
        }),
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [
              /* @__PURE__ */ jsx(AvatarUpload2, {
                size: "2xl",
                uploadEnabled: avatar?.uploadEnabled,
                onUpload: handleAvatarUpload,
                onClear: handleAvatarClear
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "min-w-0 space-y-1",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className: "flex flex-wrap items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx("span", {
                        className: "truncate text-lg font-semibold",
                        children: user.name || "Your account"
                      }),
                      badges
                    ]
                  }),
                  user.email && /* @__PURE__ */ jsx("p", {
                    className: "text-muted-foreground truncate text-sm",
                    children: user.email
                  })
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "space-y-1.5",
            children: [
              /* @__PURE__ */ jsx("label", {
                htmlFor: "account-profile-name",
                className: labelClassName,
                children: "Name"
              }),
              /* @__PURE__ */ jsx(Input2, {
                id: "account-profile-name",
                type: "text",
                autoComplete: "name",
                value: name,
                onChange: (e) => setName(e.target.value),
                onKeyDown: onProfileKeyDown
              })
            ]
          }),
          checkUsernameAvailability && /* @__PURE__ */ jsxs("div", {
            className: "space-y-1.5",
            children: [
              /* @__PURE__ */ jsx("label", {
                htmlFor: "account-profile-username",
                className: labelClassName,
                children: "Username"
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "relative",
                children: [
                  /* @__PURE__ */ jsx(Input2, {
                    id: "account-profile-username",
                    type: "text",
                    autoComplete: "username",
                    value: username,
                    onChange: (e) => handleUsernameChange(e.target.value),
                    onKeyDown: onProfileKeyDown,
                    placeholder: user.username ?? user.name?.toLowerCase().replace(/\s+/g, "") ?? "",
                    "aria-describedby": usernameStatus === "taken" ? "account-profile-username-taken" : undefined,
                    className: "pr-8"
                  }),
                  usernameStatus === "checking" && /* @__PURE__ */ jsx(Loader2, {
                    className: "text-muted-foreground absolute top-2.5 right-2.5 size-4 animate-spin"
                  }),
                  usernameStatus === "available" && /* @__PURE__ */ jsx(Check, {
                    className: "absolute top-2.5 right-2.5 size-4 text-green-500"
                  }),
                  usernameStatus === "taken" && /* @__PURE__ */ jsx(X, {
                    className: "text-destructive absolute top-2.5 right-2.5 size-4"
                  })
                ]
              }),
              usernameStatus === "taken" && /* @__PURE__ */ jsx("p", {
                id: "account-profile-username-taken",
                className: "text-destructive text-xs",
                children: "Username is taken"
              })
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsxs(SettingsCard, {
        title: "Email",
        description: "Changing your email requires verification",
        className: "space-y-4",
        footer: /* @__PURE__ */ jsxs(Button2, {
          onClick: handleEmailChange,
          disabled: isEmailSaving || !newEmail,
          size: "sm",
          children: [
            isEmailSaving ? /* @__PURE__ */ jsx(Loader2, {
              className: "size-4 animate-spin"
            }) : null,
            "Change email"
          ]
        }),
        children: [
          emailNotice,
          /* @__PURE__ */ jsxs("div", {
            className: "space-y-1.5",
            children: [
              /* @__PURE__ */ jsx("span", {
                className: labelClassName,
                children: "Current email"
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-sm",
                children: user.email
              })
            ]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "space-y-1.5",
            children: [
              /* @__PURE__ */ jsx("label", {
                htmlFor: "account-profile-new-email",
                className: labelClassName,
                children: "New email"
              }),
              /* @__PURE__ */ jsx(Input2, {
                id: "account-profile-new-email",
                type: "email",
                autoComplete: "email",
                value: newEmail,
                onChange: (e) => setNewEmail(e.target.value),
                onKeyDown: onEmailKeyDown,
                placeholder: brand.placeholderEmail ?? "new@example.com"
              })
            ]
          })
        ]
      })
    ]
  });
};
export {
  AccountProfileSettings
};
