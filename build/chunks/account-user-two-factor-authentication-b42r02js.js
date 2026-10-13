import {
  PasswordRequirements2
} from "./account-user-two-factor-authentication-h7z0b3ps.js";
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
  useAppForm2
} from "./account-user-two-factor-authentication-n3zp77m0.js";

// src/registry/thornberry/components/account-change-password.tsx
import { Lock } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ChangePassword2 = ({ passwordRequirements }) => {
  const { authClient, toaster, brand } = useAccountContext2();
  const [open, setOpen] = useState(false);
  const form = useAppForm2({
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
  return /* @__PURE__ */ jsxs(DialogRoot2, {
    open,
    onOpenChange: ({ open }) => {
      setOpen(open);
      if (!open)
        form.reset();
    },
    children: [
      /* @__PURE__ */ jsx(DialogTrigger2, {
        asChild: true,
        children: /* @__PURE__ */ jsxs(Button2, {
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
      /* @__PURE__ */ jsx(DialogBackdrop2, {}),
      /* @__PURE__ */ jsx(DialogPositioner2, {
        children: /* @__PURE__ */ jsxs(DialogContent2, {
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-1.5",
              children: [
                /* @__PURE__ */ jsxs(DialogTitle2, {
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx(Lock, {
                      className: "size-4"
                    }),
                    "Change Password"
                  ]
                }),
                /* @__PURE__ */ jsxs(DialogDescription2, {
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
                  children: (newPassword) => /* @__PURE__ */ jsx(PasswordRequirements2, {
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
export { ChangePassword2 };
