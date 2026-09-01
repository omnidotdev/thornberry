import {
  PasswordRequirements
} from "./account-user-two-factor-authentication-1kbapfba.js";
import {
  useAppForm
} from "./account-user-two-factor-authentication-yphqn05p.js";
import {
  useAccountContext
} from "./account-user-two-factor-authentication-en4v22ys.js";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from "./account-user-two-factor-authentication-p3ac7628.js";
import {
  Button
} from "./account-user-two-factor-authentication-jb3sh07m.js";

// src/registry/thornberry/components/account-change-password.tsx
import { Lock } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ChangePassword = ({ passwordRequirements }) => {
  const { authClient, toaster, brand } = useAccountContext();
  const [open, setOpen] = useState(false);
  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    onSubmit: ({ value }) => toaster.promise(async () => {
      const res = await authClient.changePassword({
        newPassword: value.newPassword,
        currentPassword: value.currentPassword
      });
      if (res.error) {
        throw new Error(res.error.message || "Error changing password");
      }
      setOpen(false);
      form.reset();
    }, {
      loading: { title: "Submitting password change request..." },
      success: { title: "Password changed successfully" },
      error: (error) => ({
        title: error.message || "Error changing password"
      })
    })
  });
  return /* @__PURE__ */ jsxs(DialogRoot, {
    open,
    onOpenChange: ({ open: open2 }) => {
      setOpen(open2);
      if (!open2)
        form.reset();
    },
    children: [
      /* @__PURE__ */ jsx(DialogTrigger, {
        asChild: true,
        children: /* @__PURE__ */ jsxs(Button, {
          variant: "outline",
          size: "sm",
          children: [
            /* @__PURE__ */ jsx(Lock, {
              className: "mr-1 size-3"
            }),
            "Change Password"
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
                /* @__PURE__ */ jsxs(DialogTitle, {
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx(Lock, {
                      className: "size-4"
                    }),
                    "Change Password"
                  ]
                }),
                /* @__PURE__ */ jsxs(DialogDescription, {
                  children: [
                    "Change your ",
                    brand.organizationName,
                    " account password."
                  ]
                })
              ]
            }),
            /* @__PURE__ */ jsxs("form", {
              className: "flex flex-col gap-4",
              onSubmit: (event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit();
              },
              children: [
                /* @__PURE__ */ jsx(form.AppField, {
                  name: "currentPassword",
                  validators: {
                    onSubmit: ({ value }) => value ? undefined : "Current password is required"
                  },
                  children: (field) => /* @__PURE__ */ jsx(field.PasswordField, {
                    label: "Current Password",
                    placeholder: "Password"
                  })
                }),
                /* @__PURE__ */ jsx(form.AppField, {
                  name: "newPassword",
                  validators: {
                    onSubmit: ({ value, fieldApi }) => {
                      if (passwordRequirements?.(value).some((rule) => !rule.met)) {
                        return "Password does not meet the requirements";
                      }
                      if (value === fieldApi.form.getFieldValue("currentPassword")) {
                        return "Cannot be the same as the old password.";
                      }
                      return;
                    }
                  },
                  children: (field) => /* @__PURE__ */ jsx(field.PasswordField, {
                    label: "New Password",
                    placeholder: "Password"
                  })
                }),
                passwordRequirements && /* @__PURE__ */ jsx(form.Subscribe, {
                  selector: (state) => state.values.newPassword,
                  children: (newPassword) => /* @__PURE__ */ jsx(PasswordRequirements, {
                    requirements: passwordRequirements(newPassword ?? "")
                  })
                }),
                /* @__PURE__ */ jsx(form.AppField, {
                  name: "confirmPassword",
                  validators: {
                    onSubmit: ({ value, fieldApi }) => value !== fieldApi.form.getFieldValue("newPassword") ? "Passwords do not match." : undefined
                  },
                  children: (field) => /* @__PURE__ */ jsx(field.PasswordField, {
                    label: "Confirm Password",
                    placeholder: "Password"
                  })
                }),
                /* @__PURE__ */ jsx(form.AppForm, {
                  children: /* @__PURE__ */ jsx(form.SubmitButton, {
                    label: "Change Password"
                  })
                })
              ]
            })
          ]
        })
      })
    ]
  });
};
export { ChangePassword };
