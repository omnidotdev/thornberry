import {
  AccountOrganizationTeams
} from "../../../chunks/account-user-two-factor-authentication-ep01pj75.js";
import {
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectPositioner,
  SelectTrigger,
  SelectValueText,
  createListCollection
} from "../../../chunks/account-user-two-factor-authentication-v7dgczst.js";
import {
  Badge
} from "../../../chunks/account-user-two-factor-authentication-nbe470h9.js";
import {
  ConfirmDialog
} from "../../../chunks/account-user-two-factor-authentication-164eysdm.js";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot
} from "../../../chunks/account-user-two-factor-authentication-w1smy5z1.js";
import {
  Label
} from "../../../chunks/account-user-two-factor-authentication-gsg3ph0v.js";
import {
  useAccountContext
} from "../../../chunks/account-user-two-factor-authentication-en4v22ys.js";
import {
  Input
} from "../../../chunks/account-user-two-factor-authentication-nmmcnpth.js";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle
} from "../../../chunks/account-user-two-factor-authentication-p3ac7628.js";
import {
  Button
} from "../../../chunks/account-user-two-factor-authentication-jb3sh07m.js";
import"../../../chunks/account-user-two-factor-authentication-zdtfvyzd.js";
import"../../../chunks/account-user-two-factor-authentication-yp1ewaxt.js";
import"../../../chunks/account-user-two-factor-authentication-d1wjbx81.js";

// src/registry/thornberry/components/account-organizations.tsx
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ChevronsUpDown,
  Loader2,
  Mail,
  Plus,
  UserPlus,
  X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var ROLES = ["owner", "admin", "member"];
var ROLE_COLLECTION = createListCollection({
  items: ROLES.map((role) => ({ label: role, value: role }))
});
var SLUG_PATTERN = /^[a-z0-9-]+$/;
var slugify = (value) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
var errorMessage = (error, fallback) => typeof error?.message === "string" ? error.message : fallback;
var RoleSelect = ({
  value,
  onValueChange,
  disabled,
  size = "sm"
}) => /* @__PURE__ */ jsxs(Select, {
  collection: ROLE_COLLECTION,
  value: [value],
  onValueChange: (details) => {
    const next = details.value[0];
    if (next)
      onValueChange(next);
  },
  disabled,
  positioning: { strategy: "fixed", placement: "bottom-end" },
  children: [
    /* @__PURE__ */ jsx(SelectControl, {
      children: /* @__PURE__ */ jsx(SelectTrigger, {
        asChild: true,
        children: /* @__PURE__ */ jsxs(Button, {
          variant: "outline",
          size,
          className: "min-w-28 justify-between gap-2 capitalize",
          children: [
            /* @__PURE__ */ jsx(SelectValueText, {
              className: "capitalize",
              placeholder: "Role"
            }),
            /* @__PURE__ */ jsx(SelectIndicator, {
              children: /* @__PURE__ */ jsx(ChevronsUpDown, {
                className: "size-3.5 shrink-0 opacity-60"
              })
            })
          ]
        })
      })
    }),
    /* @__PURE__ */ jsx(SelectPositioner, {
      children: /* @__PURE__ */ jsx(SelectContent, {
        className: "min-w-[8rem] p-1",
        children: /* @__PURE__ */ jsx(SelectItemGroup, {
          className: "space-y-0.5",
          children: ROLE_COLLECTION.items.map((item) => /* @__PURE__ */ jsxs(SelectItem, {
            item,
            children: [
              /* @__PURE__ */ jsx(SelectItemText, {
                className: "capitalize",
                children: item.label
              }),
              /* @__PURE__ */ jsx(SelectItemIndicator, {})
            ]
          }, item.value))
        })
      })
    })
  ]
});
var CreateOrganizationDialog = ({ onCreated }) => {
  const { authClient, toaster } = useAccountContext();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugStatus, setSlugStatus] = useState("idle");
  const [isCreating, setIsCreating] = useState(false);
  const slugTimer = useRef(null);
  const reset = () => {
    setName("");
    setSlug("");
    setSlugEdited(false);
    setSlugStatus("idle");
    if (slugTimer.current)
      clearTimeout(slugTimer.current);
  };
  const checkSlug = useCallback((value) => {
    setSlugStatus("idle");
    if (slugTimer.current)
      clearTimeout(slugTimer.current);
    if (value.length < 3)
      return;
    if (!SLUG_PATTERN.test(value)) {
      setSlugStatus("invalid");
      return;
    }
    setSlugStatus("checking");
    slugTimer.current = setTimeout(async () => {
      try {
        const result = await authClient.organization.checkSlug({
          slug: value
        });
        setSlugStatus(result?.data?.status ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    }, 500);
  }, [authClient]);
  const handleNameChange = (value) => {
    setName(value);
    if (!slugEdited) {
      const derived = slugify(value);
      setSlug(derived);
      checkSlug(derived);
    }
  };
  const handleSlugChange = (value) => {
    const normalized = value.toLowerCase();
    setSlugEdited(true);
    setSlug(normalized);
    checkSlug(normalized);
  };
  const canSubmit = name.trim().length > 0 && slug.length >= 3 && slugStatus === "available" && !isCreating;
  const handleCreate = async () => {
    setIsCreating(true);
    const res = await authClient.organization.create({
      name: name.trim(),
      slug
    });
    setIsCreating(false);
    if (res?.error) {
      toaster.error({ title: errorMessage(res.error, "Couldn't create it") });
      return;
    }
    toaster.success({ title: "Organization created" });
    setOpen(false);
    reset();
    onCreated();
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsxs(Button, {
        className: "gap-2",
        onClick: () => {
          reset();
          setOpen(true);
        },
        children: [
          /* @__PURE__ */ jsx(Plus, {
            className: "size-4"
          }),
          "New organization"
        ]
      }),
      /* @__PURE__ */ jsxs(DialogRoot, {
        open,
        onOpenChange: ({ open: next }) => {
          if (isCreating)
            return;
          setOpen(next);
          if (!next)
            reset();
        },
        children: [
          /* @__PURE__ */ jsx(DialogBackdrop, {}),
          /* @__PURE__ */ jsx(DialogPositioner, {
            children: /* @__PURE__ */ jsxs(DialogContent, {
              className: "w-full max-w-md p-6",
              children: [
                /* @__PURE__ */ jsx(DialogTitle, {
                  children: "Create an organization"
                }),
                /* @__PURE__ */ jsx(DialogDescription, {
                  className: "text-muted-foreground text-sm",
                  children: "A shared workspace for your team's access and billing. You'll be its owner."
                }),
                /* @__PURE__ */ jsxs("form", {
                  className: "mt-4 space-y-4",
                  onSubmit: (event) => {
                    event.preventDefault();
                    if (canSubmit)
                      handleCreate();
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsx(Label, {
                          htmlFor: "org-name",
                          children: "Name"
                        }),
                        /* @__PURE__ */ jsx(Input, {
                          id: "org-name",
                          value: name,
                          onChange: (event) => handleNameChange(event.target.value),
                          placeholder: "Acme Inc.",
                          autoFocus: true,
                          required: true
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsx(Label, {
                          htmlFor: "org-slug",
                          children: "Handle"
                        }),
                        /* @__PURE__ */ jsxs("div", {
                          className: "relative",
                          children: [
                            /* @__PURE__ */ jsx("span", {
                              className: "absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground text-sm",
                              children: "@"
                            }),
                            /* @__PURE__ */ jsx(Input, {
                              id: "org-slug",
                              value: slug,
                              onChange: (event) => handleSlugChange(event.target.value),
                              placeholder: "acme",
                              className: "pr-9 pl-7",
                              required: true
                            }),
                            /* @__PURE__ */ jsxs("div", {
                              className: "absolute top-1/2 right-3 -translate-y-1/2",
                              children: [
                                slugStatus === "checking" && /* @__PURE__ */ jsx(Loader2, {
                                  className: "size-4 animate-spin text-muted-foreground"
                                }),
                                slugStatus === "available" && /* @__PURE__ */ jsx(Check, {
                                  className: "size-4 text-green-500"
                                }),
                                (slugStatus === "taken" || slugStatus === "invalid") && /* @__PURE__ */ jsx(X, {
                                  className: "size-4 text-destructive"
                                })
                              ]
                            })
                          ]
                        }),
                        /* @__PURE__ */ jsx("p", {
                          className: "text-muted-foreground text-xs",
                          children: slugStatus === "taken" ? "That handle is already taken." : slugStatus === "invalid" ? "Use lowercase letters, numbers, and hyphens only." : "This is your workspace's handle across every product."
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex justify-end gap-2 pt-2",
                      children: [
                        /* @__PURE__ */ jsx(Button, {
                          type: "button",
                          variant: "outline",
                          disabled: isCreating,
                          onClick: () => {
                            setOpen(false);
                            reset();
                          },
                          children: "Cancel"
                        }),
                        /* @__PURE__ */ jsx(Button, {
                          type: "submit",
                          disabled: !canSubmit,
                          children: isCreating ? "Creating..." : "Create"
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          })
        ]
      })
    ]
  });
};
var EditOrganizationDialog = ({
  organization,
  open,
  onOpenChange,
  onUpdated
}) => {
  const { authClient, toaster, orgLogo } = useAccountContext();
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);
  const [description, setDescription] = useState("");
  const [slugStatus, setSlugStatus] = useState("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const slugTimer = useRef(null);
  const logoInputRef = useRef(null);
  useEffect(() => {
    if (open) {
      setName(organization.name);
      setSlug(organization.slug);
      setDescription("");
      setSlugStatus("idle");
      setLogoPreview(null);
    }
  }, [open, organization.name, organization.slug]);
  const handleLogoSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !orgLogo)
      return;
    if (!file.type.startsWith("image/")) {
      toaster.error({ title: "Choose an image file" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toaster.error({ title: "Image must be under 5 MB" });
      return;
    }
    setIsUploadingLogo(true);
    try {
      const url = await orgLogo.onUpload(organization.id, file);
      if (typeof url === "string")
        setLogoPreview(url);
      toaster.success({ title: "Logo updated" });
      onUpdated();
    } catch (error) {
      toaster.error({ title: errorMessage(error, "Couldn't upload the logo") });
    } finally {
      setIsUploadingLogo(false);
    }
  };
  const slugChanged = slug !== organization.slug;
  const checkSlug = (value) => {
    setSlugStatus("idle");
    if (slugTimer.current)
      clearTimeout(slugTimer.current);
    if (value === organization.slug)
      return;
    if (value.length < 3)
      return;
    if (!SLUG_PATTERN.test(value)) {
      setSlugStatus("invalid");
      return;
    }
    setSlugStatus("checking");
    slugTimer.current = setTimeout(async () => {
      try {
        const result = await authClient.organization.checkSlug({ slug: value });
        setSlugStatus(result?.data?.status ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    }, 500);
  };
  const handleSlugChange = (value) => {
    const normalized = value.toLowerCase();
    setSlug(normalized);
    checkSlug(normalized);
  };
  const canSave = name.trim().length > 0 && slug.length >= 3 && (!slugChanged || slugStatus === "available") && !isSaving;
  const handleSave = async () => {
    setIsSaving(true);
    const data = {};
    if (name.trim() !== organization.name)
      data.name = name.trim();
    if (slugChanged)
      data.slug = slug;
    if (description.trim())
      data.description = description.trim();
    const res = await authClient.organization.update({
      data,
      organizationId: organization.id
    });
    setIsSaving(false);
    if (res?.error) {
      toaster.error({
        title: errorMessage(res.error, "Couldn't save changes")
      });
      return;
    }
    toaster.success({ title: "Organization updated" });
    onOpenChange(false);
    onUpdated();
  };
  return /* @__PURE__ */ jsxs(DialogRoot, {
    open,
    onOpenChange: ({ open: next }) => {
      if (isSaving)
        return;
      onOpenChange(next);
    },
    children: [
      /* @__PURE__ */ jsx(DialogBackdrop, {}),
      /* @__PURE__ */ jsx(DialogPositioner, {
        children: /* @__PURE__ */ jsxs(DialogContent, {
          className: "w-full max-w-md p-6",
          children: [
            /* @__PURE__ */ jsx(DialogTitle, {
              children: "Edit organization"
            }),
            /* @__PURE__ */ jsx(DialogDescription, {
              className: "text-muted-foreground text-sm",
              children: "Update your organization's name, handle, or description."
            }),
            /* @__PURE__ */ jsxs("form", {
              className: "mt-4 space-y-4",
              onSubmit: (event) => {
                event.preventDefault();
                if (canSave)
                  handleSave();
              },
              children: [
                orgLogo?.uploadEnabled && /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-4",
                  children: [
                    /* @__PURE__ */ jsxs(AvatarRoot, {
                      className: "size-14 shrink-0 rounded-md",
                      children: [
                        /* @__PURE__ */ jsx(AvatarImage, {
                          src: logoPreview ?? organization.logo ?? undefined
                        }),
                        /* @__PURE__ */ jsx(AvatarFallback, {
                          className: "rounded-md",
                          children: organization.name.charAt(0)
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1",
                      children: [
                        /* @__PURE__ */ jsx(Button, {
                          type: "button",
                          variant: "outline",
                          size: "sm",
                          disabled: isUploadingLogo,
                          onClick: () => logoInputRef.current?.click(),
                          children: isUploadingLogo ? "Uploading..." : "Change logo"
                        }),
                        /* @__PURE__ */ jsx("p", {
                          className: "text-muted-foreground text-xs",
                          children: "PNG or JPG, up to 5 MB."
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsx("input", {
                      ref: logoInputRef,
                      type: "file",
                      accept: "image/*",
                      hidden: true,
                      onChange: handleLogoSelect
                    })
                  ]
                }),
                /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1.5",
                  children: [
                    /* @__PURE__ */ jsx(Label, {
                      htmlFor: "edit-org-name",
                      children: "Name"
                    }),
                    /* @__PURE__ */ jsx(Input, {
                      id: "edit-org-name",
                      value: name,
                      onChange: (event) => setName(event.target.value),
                      required: true
                    })
                  ]
                }),
                /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1.5",
                  children: [
                    /* @__PURE__ */ jsx(Label, {
                      htmlFor: "edit-org-slug",
                      children: "Handle"
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "relative",
                      children: [
                        /* @__PURE__ */ jsx("span", {
                          className: "absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground text-sm",
                          children: "@"
                        }),
                        /* @__PURE__ */ jsx(Input, {
                          id: "edit-org-slug",
                          value: slug,
                          onChange: (event) => handleSlugChange(event.target.value),
                          className: "pr-9 pl-7",
                          required: true
                        }),
                        /* @__PURE__ */ jsxs("div", {
                          className: "absolute top-1/2 right-3 -translate-y-1/2",
                          children: [
                            slugStatus === "checking" && /* @__PURE__ */ jsx(Loader2, {
                              className: "size-4 animate-spin text-muted-foreground"
                            }),
                            slugStatus === "available" && /* @__PURE__ */ jsx(Check, {
                              className: "size-4 text-green-500"
                            }),
                            (slugStatus === "taken" || slugStatus === "invalid") && /* @__PURE__ */ jsx(X, {
                              className: "size-4 text-destructive"
                            })
                          ]
                        })
                      ]
                    }),
                    slugChanged && /* @__PURE__ */ jsx("p", {
                      className: "text-muted-foreground text-xs",
                      children: slugStatus === "taken" ? "That handle is already taken." : slugStatus === "invalid" ? "Use lowercase letters, numbers, and hyphens only." : "Changing the handle updates it everywhere this organization is used."
                    })
                  ]
                }),
                /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1.5",
                  children: [
                    /* @__PURE__ */ jsx(Label, {
                      htmlFor: "edit-org-desc",
                      children: "Description"
                    }),
                    /* @__PURE__ */ jsx(Input, {
                      id: "edit-org-desc",
                      value: description,
                      onChange: (event) => setDescription(event.target.value),
                      placeholder: "Optional"
                    })
                  ]
                }),
                /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-end gap-2 pt-2",
                  children: [
                    /* @__PURE__ */ jsx(Button, {
                      type: "button",
                      variant: "outline",
                      disabled: isSaving,
                      onClick: () => onOpenChange(false),
                      children: "Cancel"
                    }),
                    /* @__PURE__ */ jsx(Button, {
                      type: "submit",
                      disabled: !canSave,
                      children: isSaving ? "Saving..." : "Save"
                    })
                  ]
                })
              ]
            })
          ]
        })
      })
    ]
  });
};
var OrganizationDetail = ({
  organization,
  currentEmail,
  onBack,
  onLeftOrDeleted,
  onUpdated
}) => {
  const { authClient, toaster } = useAccountContext();
  const [editOpen, setEditOpen] = useState(false);
  const [full, setFull] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [isInviting, setIsInviting] = useState(false);
  const [pending, setPending] = useState(null);
  const [isActionPending, setIsActionPending] = useState(false);
  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authClient.organization.getFullOrganization({
        query: { organizationSlug: organization.slug }
      });
      setFull(res?.data ?? null);
    } catch {
      setFull(null);
    } finally {
      setIsLoading(false);
    }
  }, [authClient, organization.slug]);
  useEffect(() => {
    load();
  }, [load]);
  const members = full?.members ?? [];
  const now = Date.now();
  const invitations = (full?.invitations ?? []).filter((invitation) => invitation.status === "pending").map((invitation) => ({
    ...invitation,
    isExpired: invitation.expiresAt ? new Date(invitation.expiresAt).getTime() < now : false
  })).sort((a, b) => Number(a.isExpired) - Number(b.isExpired));
  const ownerCount = members.filter((member) => member.role === "owner").length;
  const currentMember = members.find((member) => member.user.email.toLowerCase() === currentEmail.toLowerCase());
  const isOwner = currentMember?.role === "owner";
  const canManage = isOwner || currentMember?.role === "admin";
  const isSoleOwner = isOwner && ownerCount === 1;
  const handleInvite = async () => {
    if (!inviteEmail.trim())
      return;
    setIsInviting(true);
    const res = await authClient.organization.inviteMember({
      email: inviteEmail.trim(),
      role: inviteRole,
      organizationId: organization.id
    });
    setIsInviting(false);
    if (res?.error) {
      toaster.error({ title: errorMessage(res.error, "Couldn't invite them") });
      return;
    }
    setInviteEmail("");
    setInviteRole("member");
    toaster.success({ title: "Invitation sent" });
    load();
  };
  const handleRoleChange = async (memberId, role) => {
    const res = await authClient.organization.updateMemberRole({
      organizationId: organization.id,
      memberId,
      role
    });
    if (res?.error) {
      toaster.error({
        title: errorMessage(res.error, "Couldn't update the role")
      });
      return;
    }
    toaster.success({ title: "Role updated" });
    load();
  };
  const runPending = async () => {
    if (!pending)
      return;
    setIsActionPending(true);
    if (pending.kind === "remove") {
      const res2 = await authClient.organization.removeMember({
        organizationId: organization.id,
        memberIdOrEmail: pending.memberIdOrEmail
      });
      setIsActionPending(false);
      setPending(null);
      if (res2?.error) {
        toaster.error({
          title: errorMessage(res2.error, "Couldn't remove the member")
        });
        return;
      }
      toaster.success({ title: "Member removed" });
      load();
      return;
    }
    if (pending.kind === "cancel") {
      const res2 = await authClient.organization.cancelInvitation({
        invitationId: pending.invitationId
      });
      setIsActionPending(false);
      setPending(null);
      if (res2?.error) {
        toaster.error({
          title: errorMessage(res2.error, "Couldn't cancel the invitation")
        });
        return;
      }
      toaster.success({ title: "Invitation canceled" });
      load();
      return;
    }
    if (pending.kind === "delete") {
      const res2 = await authClient.organization.delete({
        organizationId: organization.id
      });
      setIsActionPending(false);
      setPending(null);
      if (res2?.error) {
        toaster.error({
          title: errorMessage(res2.error, "Couldn't delete the organization")
        });
        return;
      }
      toaster.success({ title: "Organization deleted" });
      onLeftOrDeleted();
      return;
    }
    const res = await authClient.organization.leave({
      organizationId: organization.id
    });
    setIsActionPending(false);
    setPending(null);
    if (res?.error) {
      toaster.error({
        title: errorMessage(res.error, "Couldn't leave the organization")
      });
      return;
    }
    toaster.success({ title: "You left the organization" });
    onLeftOrDeleted();
  };
  const isPersonal = organization.type === "personal";
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ jsxs(Button, {
        variant: "ghost",
        size: "sm",
        className: "w-fit gap-1.5 px-2 text-muted-foreground",
        onClick: onBack,
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, {
            className: "size-4"
          }),
          "All organizations"
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-wrap items-center justify-between gap-3",
        children: [
          /* @__PURE__ */ jsxs("div", {
            children: [
              /* @__PURE__ */ jsx("h3", {
                className: "font-semibold text-lg",
                children: organization.name
              }),
              /* @__PURE__ */ jsxs("p", {
                className: "text-muted-foreground text-sm",
                children: [
                  "@",
                  organization.slug
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              canManage && organization.type !== "personal" && /* @__PURE__ */ jsx(Button, {
                variant: "outline",
                size: "sm",
                onClick: () => setEditOpen(true),
                children: "Edit"
              }),
              currentMember && /* @__PURE__ */ jsx(Badge, {
                variant: "outline",
                className: "capitalize",
                children: currentMember.role
              })
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsx(EditOrganizationDialog, {
        organization,
        open: editOpen,
        onOpenChange: setEditOpen,
        onUpdated
      }),
      isPersonal ? /* @__PURE__ */ jsx("p", {
        className: "rounded-lg border p-5 text-muted-foreground text-sm",
        children: "This is your personal workspace. It is just you, so there are no members to manage."
      }) : /* @__PURE__ */ jsxs(Fragment, {
        children: [
          canManage && /* @__PURE__ */ jsxs("div", {
            className: "space-y-3 rounded-lg border p-5",
            children: [
              /* @__PURE__ */ jsxs("div", {
                children: [
                  /* @__PURE__ */ jsx("h4", {
                    className: "font-medium text-sm",
                    children: "Invite a member"
                  }),
                  /* @__PURE__ */ jsx("p", {
                    className: "text-muted-foreground text-sm",
                    children: "They will get an email to join this organization."
                  })
                ]
              }),
              /* @__PURE__ */ jsxs("form", {
                className: "flex flex-col gap-3 sm:flex-row sm:items-center",
                onSubmit: (event) => {
                  event.preventDefault();
                  handleInvite();
                },
                children: [
                  /* @__PURE__ */ jsx(Input, {
                    type: "email",
                    required: true,
                    placeholder: "teammate@example.com",
                    value: inviteEmail,
                    onChange: (event) => setInviteEmail(event.target.value),
                    className: "flex-1"
                  }),
                  /* @__PURE__ */ jsx(RoleSelect, {
                    value: inviteRole,
                    onValueChange: setInviteRole,
                    size: "md"
                  }),
                  /* @__PURE__ */ jsxs(Button, {
                    type: "submit",
                    disabled: !inviteEmail.trim() || isInviting,
                    className: "gap-2",
                    children: [
                      /* @__PURE__ */ jsx(UserPlus, {
                        className: "size-4"
                      }),
                      isInviting ? "Sending..." : "Invite"
                    ]
                  })
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "space-y-2 rounded-lg border p-5",
            children: [
              /* @__PURE__ */ jsx("h4", {
                className: "font-medium text-sm",
                children: "Members"
              }),
              isLoading ? /* @__PURE__ */ jsx("p", {
                className: "py-4 text-center text-muted-foreground text-sm",
                children: "Loading members..."
              }) : members.length === 0 ? /* @__PURE__ */ jsx("p", {
                className: "py-4 text-center text-muted-foreground text-sm",
                children: "No members yet."
              }) : members.map((member) => {
                const isLastOwner = member.role === "owner" && ownerCount === 1;
                return /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3",
                  children: [
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex min-w-0 items-center gap-3",
                      children: [
                        /* @__PURE__ */ jsxs(AvatarRoot, {
                          className: "size-9 shrink-0",
                          children: [
                            /* @__PURE__ */ jsx(AvatarImage, {
                              src: member.user.image ?? undefined
                            }),
                            /* @__PURE__ */ jsx(AvatarFallback, {
                              children: (member.user.name ?? member.user.email).charAt(0)
                            })
                          ]
                        }),
                        /* @__PURE__ */ jsxs("div", {
                          className: "min-w-0",
                          children: [
                            /* @__PURE__ */ jsx("div", {
                              className: "truncate font-medium text-sm",
                              children: member.user.name ?? member.user.email
                            }),
                            /* @__PURE__ */ jsx("div", {
                              className: "truncate text-muted-foreground text-xs",
                              children: member.user.email
                            })
                          ]
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        canManage ? /* @__PURE__ */ jsx(RoleSelect, {
                          value: member.role,
                          disabled: isLastOwner,
                          onValueChange: (role) => handleRoleChange(member.id, role)
                        }) : /* @__PURE__ */ jsx(Badge, {
                          variant: "outline",
                          className: "capitalize",
                          children: member.role
                        }),
                        canManage && !isLastOwner && /* @__PURE__ */ jsx(Button, {
                          variant: "ghost",
                          size: "sm",
                          className: "text-destructive hover:text-destructive",
                          onClick: () => setPending({
                            kind: "remove",
                            memberIdOrEmail: member.user.email,
                            label: member.user.name ?? member.user.email
                          }),
                          children: "Remove"
                        })
                      ]
                    })
                  ]
                }, member.id);
              })
            ]
          }),
          canManage && invitations.length > 0 && /* @__PURE__ */ jsxs("div", {
            className: "space-y-2 rounded-lg border p-5",
            children: [
              /* @__PURE__ */ jsx("h4", {
                className: "font-medium text-sm",
                children: "Pending invitations"
              }),
              invitations.map((invitation) => /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className: "flex min-w-0 items-center gap-3",
                    children: [
                      /* @__PURE__ */ jsx(Mail, {
                        className: "size-4 shrink-0 text-muted-foreground"
                      }),
                      /* @__PURE__ */ jsxs("div", {
                        className: "min-w-0",
                        children: [
                          /* @__PURE__ */ jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              /* @__PURE__ */ jsx("div", {
                                className: "truncate font-medium text-sm",
                                children: invitation.email
                              }),
                              invitation.isExpired && /* @__PURE__ */ jsx(Badge, {
                                variant: "secondary",
                                children: "Expired"
                              })
                            ]
                          }),
                          /* @__PURE__ */ jsx("div", {
                            className: "text-muted-foreground text-xs capitalize",
                            children: invitation.role
                          })
                        ]
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsx(Button, {
                    variant: "ghost",
                    size: "sm",
                    className: "text-destructive hover:text-destructive",
                    onClick: () => setPending({
                      kind: "cancel",
                      invitationId: invitation.id,
                      label: invitation.email
                    }),
                    children: invitation.isExpired ? "Remove" : "Cancel"
                  })
                ]
              }, invitation.id))
            ]
          }),
          canManage && /* @__PURE__ */ jsx(AccountOrganizationTeams, {
            organizationId: organization.id,
            members
          }),
          /* @__PURE__ */ jsx("div", {
            className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-5",
            children: isOwner ? /* @__PURE__ */ jsxs(Fragment, {
              children: [
                /* @__PURE__ */ jsxs("div", {
                  className: "min-w-0",
                  children: [
                    /* @__PURE__ */ jsx("div", {
                      className: "font-medium text-sm",
                      children: "Delete this organization"
                    }),
                    /* @__PURE__ */ jsx("div", {
                      className: "text-muted-foreground text-sm",
                      children: "Removes it for every member. This cannot be undone."
                    })
                  ]
                }),
                /* @__PURE__ */ jsx(Button, {
                  variant: "destructive",
                  onClick: () => setPending({ kind: "delete" }),
                  children: "Delete organization"
                })
              ]
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [
                /* @__PURE__ */ jsxs("div", {
                  className: "min-w-0",
                  children: [
                    /* @__PURE__ */ jsx("div", {
                      className: "font-medium text-sm",
                      children: "Leave this organization"
                    }),
                    /* @__PURE__ */ jsx("div", {
                      className: "text-muted-foreground text-sm",
                      children: "You'll lose access to it."
                    })
                  ]
                }),
                /* @__PURE__ */ jsx(Button, {
                  variant: "destructive",
                  onClick: () => setPending({ kind: "leave" }),
                  children: "Leave organization"
                })
              ]
            })
          }),
          isOwner && !isSoleOwner && /* @__PURE__ */ jsxs("div", {
            className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-5",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "min-w-0",
                children: [
                  /* @__PURE__ */ jsx("div", {
                    className: "font-medium text-sm",
                    children: "Leave this organization"
                  }),
                  /* @__PURE__ */ jsx("div", {
                    className: "text-muted-foreground text-sm",
                    children: "Step down as owner. Another owner keeps managing it."
                  })
                ]
              }),
              /* @__PURE__ */ jsx(Button, {
                variant: "outline",
                onClick: () => setPending({ kind: "leave" }),
                children: "Leave"
              })
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsx(ConfirmDialog, {
        open: pending !== null,
        onOpenChange: (open) => {
          if (!open)
            setPending(null);
        },
        title: pending?.kind === "remove" ? `Remove ${pending.label}?` : pending?.kind === "cancel" ? `Cancel invitation for ${pending.label}?` : pending?.kind === "delete" ? `Delete ${organization.name}?` : pending?.kind === "leave" ? `Leave ${organization.name}?` : "",
        description: pending?.kind === "remove" ? "They will lose access to this organization. This cannot be undone." : pending?.kind === "cancel" ? "The invitation link will stop working. You can invite them again later." : pending?.kind === "delete" ? "Every member loses access to this organization. This cannot be undone." : "You will lose access to this organization. An owner can invite you back later.",
        confirmLabel: pending?.kind === "remove" ? "Remove" : pending?.kind === "cancel" ? "Cancel invitation" : pending?.kind === "delete" ? "Delete organization" : "Leave organization",
        cancelLabel: "Keep",
        isPending: isActionPending,
        onConfirm: runPending
      })
    ]
  });
};
var AccountOrganizations = ({
  selectedSlug: controlledSlug,
  onSelectOrganization
} = {}) => {
  const { authClient } = useAccountContext();
  const { data: session } = authClient.useSession();
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [internalSlug, setInternalSlug] = useState(null);
  const isControlled = onSelectOrganization !== undefined;
  const selectedSlug = isControlled ? controlledSlug ?? null : internalSlug;
  const setSelectedSlug = (slug) => {
    if (isControlled)
      onSelectOrganization(slug);
    else
      setInternalSlug(slug);
  };
  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authClient.organization.list();
      setOrganizations(res?.data ?? []);
    } catch {
      setOrganizations([]);
    } finally {
      setIsLoading(false);
    }
  }, [authClient]);
  useEffect(() => {
    load();
  }, [load]);
  const selected = organizations.find((org) => org.slug === selectedSlug);
  const sortedOrganizations = [...organizations].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  if (selected && session?.user) {
    return /* @__PURE__ */ jsx(OrganizationDetail, {
      organization: selected,
      currentEmail: session.user.email,
      onBack: () => setSelectedSlug(null),
      onLeftOrDeleted: () => {
        setSelectedSlug(null);
        load();
      },
      onUpdated: () => {
        setSelectedSlug(null);
        load();
      }
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-4",
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-wrap items-center justify-between gap-3",
        children: [
          /* @__PURE__ */ jsxs("div", {
            children: [
              /* @__PURE__ */ jsx("h3", {
                className: "font-semibold text-lg",
                children: "Organizations"
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-muted-foreground text-sm",
                children: "Workspaces you belong to."
              })
            ]
          }),
          /* @__PURE__ */ jsx(CreateOrganizationDialog, {
            onCreated: load
          })
        ]
      }),
      /* @__PURE__ */ jsx("div", {
        className: "space-y-2",
        children: isLoading ? /* @__PURE__ */ jsx("div", {
          className: "flex items-center justify-center py-8 text-muted-foreground",
          children: /* @__PURE__ */ jsx(Loader2, {
            className: "size-5 animate-spin"
          })
        }) : sortedOrganizations.length ? sortedOrganizations.map((org) => /* @__PURE__ */ jsxs("button", {
          type: "button",
          onClick: () => setSelectedSlug(org.slug),
          className: "flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50",
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex min-w-0 items-center gap-3",
              children: [
                /* @__PURE__ */ jsxs(AvatarRoot, {
                  className: "size-9 shrink-0 rounded-md",
                  children: [
                    /* @__PURE__ */ jsx(AvatarImage, {
                      src: org.logo ?? undefined
                    }),
                    /* @__PURE__ */ jsx(AvatarFallback, {
                      className: "rounded-md",
                      children: org.name.charAt(0)
                    })
                  ]
                }),
                /* @__PURE__ */ jsxs("div", {
                  className: "min-w-0",
                  children: [
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex flex-wrap items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsx("span", {
                          className: "truncate font-medium text-sm",
                          children: org.name
                        }),
                        /* @__PURE__ */ jsx(Badge, {
                          variant: "outline",
                          children: org.type === "personal" ? "Personal" : "Team"
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "truncate text-muted-foreground text-xs",
                      children: [
                        "@",
                        org.slug
                      ]
                    })
                  ]
                })
              ]
            }),
            /* @__PURE__ */ jsx(ChevronRight, {
              className: "size-4 shrink-0 text-muted-foreground"
            })
          ]
        }, org.id)) : /* @__PURE__ */ jsx("div", {
          className: "py-8 text-center text-muted-foreground text-sm",
          children: "You don't belong to any organizations yet."
        })
      })
    ]
  });
};
export {
  AccountOrganizations
};
