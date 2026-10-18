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

// src/registry/thornberry/components/account-edit-profile.tsx
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var EditProfile2 = ({
  checkUsernameAvailability,
  onProfileUpdated
}) => {
  const { authClient, toaster, brand } = useAccountContext2();
  const { data } = authClient.useSession();
  const user = data?.user;
  const [open, setOpen] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const form = useAppForm2({
    defaultValues: {
      firstName: user?.name.split(" ")[0] ?? "",
      lastName: user?.name.split(" ")[1] ?? "",
      username: user?.username ?? "",
      email: user?.email ?? ""
    },
    onSubmit: ({ value }) => toaster.promise(async () => {
      if (checkUsernameAvailability && value.username !== user?.username) {
        const { available } = await checkUsernameAvailability(value.username);
        if (!available) {
          throw new Error(`Username "${value.username}" is not available. Please choose a different one.`);
        }
      }
      const res = await authClient.updateUser({
        name: `${value.firstName} ${value.lastName}`,
        username: value.username
      });
      if (res.error) {
        throw new Error(res.error.message || "Error updating profile");
      }
      if (value.email !== user?.email) {
        const emailRes = await authClient.changeEmail({
          newEmail: value.email,
          callbackURL: "/dashboard?status=email_confirmed"
        });
        if (emailRes.error) {
          throw new Error(emailRes.error.message || "Error changing email");
        }
      }
      setOpen(false);
      onProfileUpdated?.();
      form.reset();
    }, {
      loading: { title: "Submitting edit profile request..." },
      success: {
        duration: 3000,
        title: value.email !== user?.email ? "Change Email Verification Sent" : "Profile updated successfully",
        description: value.email !== user?.email ? "Please follow the instructions in your email to verify your new email address." : undefined
      },
      error: (error) => ({
        title: error.message || "Error updating profile"
      })
    })
  });
  return /* @__PURE__ */ jsxs(DialogRoot2, {
    open,
    onOpenChange: ({ open }) => setOpen(open),
    children: [
      /* @__PURE__ */ jsx(DialogTrigger2, {
        asChild: true,
        children: /* @__PURE__ */ jsxs(Button2, {
          variant: "outline",
          size: "sm",
          children: [
            /* @__PURE__ */ jsx(Pencil, {
              className: "mr-1 size-3"
            }),
            "Edit Profile"
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
                    /* @__PURE__ */ jsx(Pencil, {
                      className: "size-4"
                    }),
                    "Edit Profile"
                  ]
                }),
                /* @__PURE__ */ jsxs(DialogDescription2, {
                  children: [
                    "Edit your ",
                    brand.organizationName,
                    " profile information."
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
                  name: "firstName",
                  validators: {
                    onSubmit: ({ value }) => value ? undefined : "First name is required"
                  },
                  children: (field) => /* @__PURE__ */ jsx(field.TextField, {
                    label: "First Name",
                    placeholder: "John"
                  })
                }),
                /* @__PURE__ */ jsx(form.AppField, {
                  name: "lastName",
                  validators: {
                    onSubmit: ({ value }) => value ? undefined : "Last name is required"
                  },
                  children: (field) => /* @__PURE__ */ jsx(field.TextField, {
                    label: "Last Name",
                    placeholder: "Doe"
                  })
                }),
                /* @__PURE__ */ jsx(form.AppField, {
                  name: "username",
                  validators: {
                    onSubmit: ({ value }) => value.length >= 3 ? undefined : "Username must be at least 3 characters"
                  },
                  listeners: {
                    onChangeDebounceMs: 500,
                    onChange: async ({ value }) => {
                      if (!checkUsernameAvailability || value === user?.username || value.length < 3) {
                        setUsernameAvailable(null);
                        return;
                      }
                      const { available } = await checkUsernameAvailability(value);
                      setUsernameAvailable(available);
                    }
                  },
                  children: (field) => /* @__PURE__ */ jsxs("div", {
                    className: "flex flex-col gap-1",
                    children: [
                      /* @__PURE__ */ jsx(field.TextField, {
                        label: "Username",
                        placeholder: "johndoe"
                      }),
                      usernameAvailable !== null && /* @__PURE__ */ jsx("div", {
                        className: "flex items-center gap-1",
                        children: usernameAvailable ? /* @__PURE__ */ jsxs(Fragment, {
                          children: [
                            /* @__PURE__ */ jsx(Check, {
                              className: "size-3 text-green-600"
                            }),
                            /* @__PURE__ */ jsx("p", {
                              className: "text-green-600 text-xs",
                              children: "Available"
                            })
                          ]
                        }) : /* @__PURE__ */ jsxs(Fragment, {
                          children: [
                            /* @__PURE__ */ jsx(X, {
                              className: "size-3 text-red-500"
                            }),
                            /* @__PURE__ */ jsx("p", {
                              className: "text-red-500 text-xs",
                              children: "Already taken"
                            })
                          ]
                        })
                      }),
                      /* @__PURE__ */ jsx("p", {
                        className: "text-muted-foreground text-xs",
                        children: "Changing your username will also update your personal workspace handle."
                      })
                    ]
                  })
                }),
                /* @__PURE__ */ jsx(form.AppField, {
                  name: "email",
                  validators: {
                    onSubmit: ({ value }) => EMAIL_PATTERN.test(value) ? undefined : "Enter a valid email address"
                  },
                  children: (field) => /* @__PURE__ */ jsx(field.TextField, {
                    label: "Email",
                    placeholder: brand.placeholderEmail ?? "you@example.com"
                  })
                }),
                /* @__PURE__ */ jsx(form.AppForm, {
                  children: /* @__PURE__ */ jsx(form.SubmitButton, {
                    label: "Update Profile"
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
export { EditProfile2 };
