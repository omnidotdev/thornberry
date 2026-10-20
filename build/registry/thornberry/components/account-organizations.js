import {
  useAccountContext2
} from "../../../chunks/account-user-two-factor-authentication-b60vh03c.js";
import {
  AvatarRoot2,
  AvatarFallback2,
  AvatarImage2
} from "../../../chunks/account-user-two-factor-authentication-b7jpk793.js";
import {
  Button2
} from "../../../chunks/account-user-two-factor-authentication-qyg3bvpa.js";
import {
  DialogRoot2,
  DialogPortal2,
  DialogBackdrop2,
  DialogPositioner2,
  DialogContent2,
  DialogTitle2,
  DialogDescription2
} from "../../../chunks/account-user-two-factor-authentication-8q0yqrx6.js";
import {
  Input2
} from "../../../chunks/account-user-two-factor-authentication-hj664zsh.js";
import {
  Label2
} from "../../../chunks/account-user-two-factor-authentication-fa46q8yp.js";
import {
  ConfirmDialog2
} from "../../../chunks/account-user-two-factor-authentication-1qzbdkf5.js";
import"../../../chunks/account-user-two-factor-authentication-q37czf6m.js";
import {
  AvatarUpload2
} from "../../../chunks/account-user-two-factor-authentication-h9xs2bn6.js";
import {
  Select2,
  SelectControl2,
  SelectTrigger2,
  SelectValueText2,
  SelectIndicator2,
  SelectPositioner2,
  SelectContent2,
  SelectItemGroup2,
  SelectItem2,
  SelectItemText2,
  SelectItemIndicator2,
  createListCollection2
} from "../../../chunks/account-user-two-factor-authentication-8wtqb3wn.js";
import {
  AccountOrganizationTeams2
} from "../../../chunks/account-user-two-factor-authentication-k3txg2x1.js";
import {
  Badge2
} from "../../../chunks/account-user-two-factor-authentication-mhbe1kzg.js";

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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var memberDisplayName = (member) => member.user.name ?? member.user.email;
var ROLES = ["owner", "admin", "member"];
var assignableRoles = (isOwner) => isOwner ? ROLES : ROLES.filter((role) => role !== "owner");
var SLUG_PATTERN = /^[a-z0-9-]+$/;
var slugify = (value) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
var errorMessage = (error, fallback) => typeof error?.message === "string" ? error.message : fallback;
var RoleSelect = ({
  value,
  onValueChange,
  disabled,
  size = "sm",
  roles = ROLES
}) => {
  const collection = useMemo(() => createListCollection2({
    items: roles.map((role) => ({ label: role, value: role }))
  }), [roles]);
  return /* @__PURE__ */ jsxs(Select2, {
    collection,
    value: [value],
    onValueChange: (details) => {
      const next = details.value[0];
      if (next)
        onValueChange(next);
    },
    disabled,
    positioning: { strategy: "fixed", placement: "bottom-end" },
    children: [
      /* @__PURE__ */ jsx(SelectControl2, {
        children: /* @__PURE__ */ jsx(SelectTrigger2, {
          asChild: true,
          children: /* @__PURE__ */ jsxs(Button2, {
            variant: "outline",
            size,
            className: "min-w-28 justify-between gap-2 capitalize",
            children: [
              /* @__PURE__ */ jsx(SelectValueText2, {
                className: "capitalize",
                placeholder: "Role"
              }),
              /* @__PURE__ */ jsx(SelectIndicator2, {
                children: /* @__PURE__ */ jsx(ChevronsUpDown, {
                  className: "size-3.5 shrink-0 opacity-60"
                })
              })
            ]
          })
        })
      }),
      /* @__PURE__ */ jsx(SelectPositioner2, {
        children: /* @__PURE__ */ jsx(SelectContent2, {
          className: "min-w-[8rem] p-1",
          children: /* @__PURE__ */ jsx(SelectItemGroup2, {
            className: "space-y-0.5",
            children: collection.items.map((item) => /* @__PURE__ */ jsxs(SelectItem2, {
              item,
              children: [
                /* @__PURE__ */ jsx(SelectItemText2, {
                  className: "capitalize",
                  children: item.label
                }),
                /* @__PURE__ */ jsx(SelectItemIndicator2, {})
              ]
            }, item.value))
          })
        })
      })
    ]
  });
};
var RESEND_COOLDOWN_MS = 30000;
var ROLE_RANK = { owner: 0, admin: 1, member: 2 };
var RELATIVE_TIME = new Intl.RelativeTimeFormat(undefined, {
  numeric: "always"
});
var formatExpiry = (expiresAt, isExpired) => {
  const date = new Date(expiresAt);
  const absolute = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.round(diffMs / 86400000);
  const diffHours = Math.round(diffMs / 3600000);
  let relative;
  if (Math.abs(diffDays) >= 1) {
    relative = RELATIVE_TIME.format(diffDays, "day");
  } else if (Math.abs(diffHours) >= 1) {
    relative = RELATIVE_TIME.format(diffHours, "hour");
  } else {
    relative = RELATIVE_TIME.format(Math.round(diffMs / 60000), "minute");
  }
  return `${isExpired ? "Expired" : "Expires"} ${absolute} (${relative})`;
};
var DELETION_GRACE_DAYS = 30;
var roleFilterCollection = createListCollection2({
  items: [
    { label: "All roles", value: "all" },
    { label: "Owner", value: "owner" },
    { label: "Admin", value: "admin" },
    { label: "Member", value: "member" }
  ]
});
var memberSortCollection = createListCollection2({
  items: [
    { label: "Name (A-Z)", value: "name-asc" },
    { label: "Name (Z-A)", value: "name-desc" },
    { label: "Role", value: "role" }
  ]
});
var CreateOrganizationDialog = ({ onCreated }) => {
  const { authClient, toaster } = useAccountContext2();
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
    toaster.success({ title: "Workspace created" });
    setOpen(false);
    reset();
    onCreated();
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsxs(Button2, {
        className: "gap-2",
        onClick: () => {
          reset();
          setOpen(true);
        },
        children: [
          /* @__PURE__ */ jsx(Plus, {
            className: "size-4"
          }),
          "New workspace"
        ]
      }),
      /* @__PURE__ */ jsx(DialogRoot2, {
        open,
        onOpenChange: ({ open: next }) => {
          if (isCreating)
            return;
          setOpen(next);
          if (!next)
            reset();
        },
        children: /* @__PURE__ */ jsxs(DialogPortal2, {
          children: [
            /* @__PURE__ */ jsx(DialogBackdrop2, {}),
            /* @__PURE__ */ jsx(DialogPositioner2, {
              children: /* @__PURE__ */ jsxs(DialogContent2, {
                className: "w-full max-w-md p-6",
                children: [
                  /* @__PURE__ */ jsx(DialogTitle2, {
                    children: "Create a workspace"
                  }),
                  /* @__PURE__ */ jsx(DialogDescription2, {
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
                          /* @__PURE__ */ jsx(Label2, {
                            htmlFor: "org-name",
                            children: "Name"
                          }),
                          /* @__PURE__ */ jsx(Input2, {
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
                          /* @__PURE__ */ jsx(Label2, {
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
                              /* @__PURE__ */ jsx(Input2, {
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
                          /* @__PURE__ */ jsx(Button2, {
                            type: "button",
                            variant: "outline",
                            disabled: isCreating,
                            onClick: () => {
                              setOpen(false);
                              reset();
                            },
                            children: "Cancel"
                          }),
                          /* @__PURE__ */ jsx(Button2, {
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
      })
    ]
  });
};
var parseWorkspaceLinks = (raw) => {
  if (!raw)
    return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed))
      return [];
    return parsed.filter((entry) => !!entry && typeof entry === "object" && typeof entry.url === "string").map((entry) => ({
      id: crypto.randomUUID(),
      url: entry.url,
      title: typeof entry.title === "string" ? entry.title : ""
    }));
  } catch {
    return [];
  }
};
var serializeWorkspaceLinks = (links) => JSON.stringify(links.map((link) => ({ url: link.url.trim(), title: link.title.trim() })).filter((link) => link.url).map((link) => link.title ? { url: link.url, title: link.title } : { url: link.url }));
var EditOrganizationDialog = ({
  organization,
  open,
  onOpenChange,
  onUpdated
}) => {
  const { authClient, toaster } = useAccountContext2();
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState([]);
  const [slugStatus, setSlugStatus] = useState("idle");
  const [isSaving, setIsSaving] = useState(false);
  const slugTimer = useRef(null);
  useEffect(() => {
    if (open) {
      setName(organization.name);
      setSlug(organization.slug);
      setDescription("");
      setLinks(parseWorkspaceLinks(organization.links));
      setSlugStatus("idle");
    }
  }, [open, organization.name, organization.slug, organization.links]);
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
    const serializedLinks = serializeWorkspaceLinks(links);
    if (serializedLinks !== serializeWorkspaceLinks(parseWorkspaceLinks(organization.links)))
      data.links = serializedLinks;
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
    toaster.success({ title: "Workspace updated" });
    onOpenChange(false);
    onUpdated();
  };
  return /* @__PURE__ */ jsx(DialogRoot2, {
    open,
    onOpenChange: ({ open: next }) => {
      if (isSaving)
        return;
      onOpenChange(next);
    },
    children: /* @__PURE__ */ jsxs(DialogPortal2, {
      children: [
        /* @__PURE__ */ jsx(DialogBackdrop2, {}),
        /* @__PURE__ */ jsx(DialogPositioner2, {
          children: /* @__PURE__ */ jsxs(DialogContent2, {
            className: "w-full max-w-md p-6",
            children: [
              /* @__PURE__ */ jsx(DialogTitle2, {
                children: "Edit workspace"
              }),
              /* @__PURE__ */ jsx(DialogDescription2, {
                className: "text-muted-foreground text-sm",
                children: "Update your workspace's name, handle, or description."
              }),
              /* @__PURE__ */ jsxs("form", {
                className: "mt-4 space-y-4",
                onSubmit: (event) => {
                  event.preventDefault();
                  if (canSave)
                    handleSave();
                },
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      /* @__PURE__ */ jsx(Label2, {
                        htmlFor: "edit-org-name",
                        children: "Name"
                      }),
                      /* @__PURE__ */ jsx(Input2, {
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
                      /* @__PURE__ */ jsx(Label2, {
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
                          /* @__PURE__ */ jsx(Input2, {
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
                        children: slugStatus === "taken" ? "That handle is already taken." : slugStatus === "invalid" ? "Use lowercase letters, numbers, and hyphens only." : "Changing the handle updates it everywhere this workspace is used."
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      /* @__PURE__ */ jsx(Label2, {
                        htmlFor: "edit-org-desc",
                        children: "Description"
                      }),
                      /* @__PURE__ */ jsx(Input2, {
                        id: "edit-org-desc",
                        value: description,
                        onChange: (event) => setDescription(event.target.value),
                        placeholder: "Optional"
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      /* @__PURE__ */ jsx(Label2, {
                        children: "Links"
                      }),
                      /* @__PURE__ */ jsx("p", {
                        className: "text-muted-foreground text-xs",
                        children: "Your workspace's website and social links, shown across Omni products."
                      }),
                      /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2",
                        children: [
                          links.map((link) => /* @__PURE__ */ jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              /* @__PURE__ */ jsx(Input2, {
                                value: link.url,
                                onChange: (event) => setLinks((prev) => prev.map((item) => item.id === link.id ? { ...item, url: event.target.value } : item)),
                                placeholder: "https://...",
                                className: "flex-1",
                                "aria-label": "Link URL"
                              }),
                              /* @__PURE__ */ jsx(Input2, {
                                value: link.title,
                                onChange: (event) => setLinks((prev) => prev.map((item) => item.id === link.id ? { ...item, title: event.target.value } : item)),
                                placeholder: "Label (optional)",
                                className: "flex-1",
                                "aria-label": "Link label"
                              }),
                              /* @__PURE__ */ jsx(Button2, {
                                type: "button",
                                variant: "ghost",
                                size: "icon",
                                "aria-label": "Remove link",
                                onClick: () => setLinks((prev) => prev.filter((item) => item.id !== link.id)),
                                children: /* @__PURE__ */ jsx(X, {
                                  className: "size-4"
                                })
                              })
                            ]
                          }, link.id)),
                          /* @__PURE__ */ jsxs(Button2, {
                            type: "button",
                            variant: "outline",
                            size: "sm",
                            onClick: () => setLinks((prev) => [
                              ...prev,
                              { id: crypto.randomUUID(), url: "", title: "" }
                            ]),
                            children: [
                              /* @__PURE__ */ jsx(Plus, {
                                className: "size-4"
                              }),
                              "Add link"
                            ]
                          })
                        ]
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsxs("div", {
                    className: "flex justify-end gap-2 pt-2",
                    children: [
                      /* @__PURE__ */ jsx(Button2, {
                        type: "button",
                        variant: "outline",
                        disabled: isSaving,
                        onClick: () => onOpenChange(false),
                        children: "Cancel"
                      }),
                      /* @__PURE__ */ jsx(Button2, {
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
    })
  });
};
var OrganizationDetail = ({
  organization,
  currentEmail,
  currentUserId,
  onBack,
  onLeftOrDeleted,
  onUpdated
}) => {
  const { authClient, toaster, orgLogo } = useAccountContext2();
  const [editOpen, setEditOpen] = useState(false);
  const [full, setFull] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [isInviting, setIsInviting] = useState(false);
  const [resendingId, setResendingId] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(new Set);
  const cooldownTimers = useRef(new Map);
  const [pending, setPending] = useState(null);
  const [isActionPending, setIsActionPending] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [memberSort, setMemberSort] = useState("name-asc");
  useEffect(() => {
    const timers = cooldownTimers.current;
    return () => {
      for (const timer of timers.values())
        clearTimeout(timer);
    };
  }, []);
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
  const visibleMembers = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();
    return members.filter((member) => roleFilter === "all" || member.role === roleFilter).filter((member) => {
      if (!query)
        return true;
      return (member.user.name ?? "").toLowerCase().includes(query) || member.user.email.toLowerCase().includes(query);
    }).sort((a, b) => {
      if (memberSort === "role") {
        const rank = (ROLE_RANK[a.role] ?? 99) - (ROLE_RANK[b.role] ?? 99);
        if (rank !== 0)
          return rank;
      }
      const compared = memberDisplayName(a).localeCompare(memberDisplayName(b), undefined, { sensitivity: "base" });
      return memberSort === "name-desc" ? -compared : compared;
    });
  }, [members, memberSearch, roleFilter, memberSort]);
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
  const handleResend = async (invitation) => {
    setResendingId(invitation.id);
    const res = await authClient.organization.inviteMember({
      email: invitation.email,
      role: invitation.role ?? "member",
      organizationId: organization.id
    });
    setResendingId(null);
    if (res?.error) {
      toaster.error({
        title: errorMessage(res.error, "Couldn't resend the invitation")
      });
      return;
    }
    const key = invitation.email.toLowerCase();
    const existing = cooldownTimers.current.get(key);
    if (existing)
      clearTimeout(existing);
    setResendCooldown((prev) => new Set(prev).add(key));
    cooldownTimers.current.set(key, setTimeout(() => {
      setResendCooldown((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      cooldownTimers.current.delete(key);
    }, RESEND_COOLDOWN_MS));
    toaster.success({ title: `Invitation resent to ${invitation.email}` });
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
      const res = await authClient.organization.removeMember({
        organizationId: organization.id,
        memberIdOrEmail: pending.memberIdOrEmail
      });
      setIsActionPending(false);
      setPending(null);
      if (res?.error) {
        toaster.error({
          title: errorMessage(res.error, "Couldn't remove the member")
        });
        return;
      }
      toaster.success({ title: "Member removed" });
      load();
      return;
    }
    if (pending.kind === "cancel") {
      const res = await authClient.organization.cancelInvitation({
        invitationId: pending.invitationId
      });
      setIsActionPending(false);
      setPending(null);
      if (res?.error) {
        toaster.error({
          title: errorMessage(res.error, "Couldn't cancel the invitation")
        });
        return;
      }
      toaster.success({ title: "Invitation canceled" });
      load();
      return;
    }
    if (pending.kind === "delete") {
      const schedule = authClient.organization.scheduleOrganizationDeletion;
      const res = schedule ? await schedule({ organizationId: organization.id }) : await authClient.organization.delete({
        organizationId: organization.id
      });
      setIsActionPending(false);
      setPending(null);
      if (res?.error) {
        toaster.error({
          title: errorMessage(res.error, "Couldn't delete the workspace")
        });
        return;
      }
      toaster.success({
        title: schedule ? "Workspace scheduled for deletion" : "Workspace deleted"
      });
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
        title: errorMessage(res.error, "Couldn't leave the workspace")
      });
      return;
    }
    toaster.success({ title: "You left the workspace" });
    onLeftOrDeleted();
  };
  const handleRestore = async () => {
    const restore = authClient.organization.restoreOrganization;
    if (!restore)
      return;
    setIsRestoring(true);
    const res = await restore({ organizationId: organization.id });
    setIsRestoring(false);
    if (res?.error) {
      toaster.error({
        title: errorMessage(res.error, "Couldn't restore the workspace")
      });
      return;
    }
    toaster.success({ title: "Deletion canceled" });
    onUpdated();
  };
  const isPersonal = organization.type === "personal";
  const canScheduleDeletion = !!authClient.organization.scheduleOrganizationDeletion;
  const scheduledDeletionDate = organization.deletedAt ? new Date(new Date(organization.deletedAt).getTime() + DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000) : null;
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ jsxs(Button2, {
        variant: "ghost",
        size: "sm",
        className: "w-fit gap-1.5 px-2 text-muted-foreground",
        onClick: onBack,
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, {
            className: "size-4"
          }),
          "All workspaces"
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-wrap items-center justify-between gap-3",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex min-w-0 items-center gap-3",
            children: [
              /* @__PURE__ */ jsx(AvatarUpload2, {
                size: "xl",
                cropShape: "round",
                editable: canManage && organization.type !== "personal",
                uploadEnabled: !!orgLogo?.uploadEnabled,
                src: full?.logo ?? organization.logo ?? null,
                fallback: organization.name.charAt(0),
                onUpload: orgLogo ? async (blob) => {
                  await orgLogo.onUpload(organization.id, new File([blob], "logo.jpg", { type: "image/jpeg" }));
                } : undefined,
                onClear: async () => {
                  const res = await authClient.organization.update({
                    data: { logo: null },
                    organizationId: organization.id
                  });
                  if (res?.error) {
                    throw new Error(errorMessage(res.error, "Couldn't remove the logo"));
                  }
                },
                onChanged: load,
                copy: {
                  menuTitle: "Workspace logo",
                  cropTitle: "Crop logo",
                  updatedTitle: "Logo updated",
                  updatedDescription: "The workspace logo has been updated.",
                  removedTitle: "Logo removed",
                  removedDescription: "The workspace logo has been removed.",
                  removeConfirmTitle: "Remove workspace logo?",
                  removeConfirmDescription: "This removes the current workspace logo. You can upload a new one anytime."
                }
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "min-w-0",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className: "flex flex-wrap items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx("h3", {
                        className: "font-semibold text-lg",
                        children: organization.name
                      }),
                      currentMember && /* @__PURE__ */ jsx(Badge2, {
                        variant: "outline",
                        className: "capitalize",
                        children: currentMember.role
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsxs("p", {
                    className: "text-muted-foreground text-sm",
                    children: [
                      "@",
                      organization.slug
                    ]
                  })
                ]
              })
            ]
          }),
          canManage && organization.type !== "personal" && /* @__PURE__ */ jsx(Button2, {
            variant: "outline",
            size: "sm",
            onClick: () => setEditOpen(true),
            children: "Edit"
          })
        ]
      }),
      scheduledDeletionDate && /* @__PURE__ */ jsxs("div", {
        className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "min-w-0",
            children: [
              /* @__PURE__ */ jsx("div", {
                className: "font-medium text-sm",
                children: "Scheduled for deletion"
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "text-muted-foreground text-sm",
                children: [
                  "This workspace will be permanently deleted around",
                  " ",
                  scheduledDeletionDate.toLocaleDateString(),
                  ". Restore it before then to cancel."
                ]
              })
            ]
          }),
          isOwner && authClient.organization.restoreOrganization && /* @__PURE__ */ jsx(Button2, {
            variant: "outline",
            onClick: handleRestore,
            disabled: isRestoring,
            children: isRestoring ? "Restoring..." : "Restore"
          })
        ]
      }),
      /* @__PURE__ */ jsx(EditOrganizationDialog, {
        organization,
        open: editOpen,
        onOpenChange: setEditOpen,
        onUpdated
      }),
      /* @__PURE__ */ jsxs(Fragment, {
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
                    children: isPersonal ? "Your personal workspace is just you by default. Invite people to collaborate here." : "They will get an email to join this workspace."
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
                  /* @__PURE__ */ jsx(Input2, {
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
                    size: "md",
                    roles: assignableRoles(isOwner)
                  }),
                  /* @__PURE__ */ jsxs(Button2, {
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
            className: "space-y-3 rounded-lg border p-5",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap items-center justify-between gap-2",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsx("h4", {
                        className: "font-medium text-sm",
                        children: "Members"
                      }),
                      /* @__PURE__ */ jsx("p", {
                        className: "text-muted-foreground text-sm",
                        children: "People with access to this workspace."
                      })
                    ]
                  }),
                  members.length > 1 && /* @__PURE__ */ jsxs("span", {
                    className: "text-muted-foreground text-xs",
                    children: [
                      visibleMembers.length,
                      " of ",
                      members.length
                    ]
                  })
                ]
              }),
              members.length > 0 && /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-2 sm:flex-row sm:items-center",
                children: [
                  /* @__PURE__ */ jsx(Input2, {
                    type: "search",
                    placeholder: "Search by name or email",
                    value: memberSearch,
                    onChange: (event) => setMemberSearch(event.target.value),
                    className: "flex-1"
                  }),
                  /* @__PURE__ */ jsxs(Select2, {
                    collection: roleFilterCollection,
                    value: [roleFilter],
                    onValueChange: (details) => setRoleFilter(details.value[0] ?? "all"),
                    positioning: { strategy: "fixed", placement: "bottom-end" },
                    children: [
                      /* @__PURE__ */ jsx(SelectControl2, {
                        children: /* @__PURE__ */ jsx(SelectTrigger2, {
                          asChild: true,
                          children: /* @__PURE__ */ jsxs(Button2, {
                            variant: "outline",
                            size: "sm",
                            className: "min-w-32 justify-between gap-2",
                            children: [
                              /* @__PURE__ */ jsx(SelectValueText2, {
                                placeholder: "Role"
                              }),
                              /* @__PURE__ */ jsx(SelectIndicator2, {
                                children: /* @__PURE__ */ jsx(ChevronsUpDown, {
                                  className: "size-3.5 shrink-0 opacity-60"
                                })
                              })
                            ]
                          })
                        })
                      }),
                      /* @__PURE__ */ jsx(SelectPositioner2, {
                        children: /* @__PURE__ */ jsx(SelectContent2, {
                          className: "min-w-[9rem] p-1",
                          children: /* @__PURE__ */ jsx(SelectItemGroup2, {
                            className: "space-y-0.5",
                            children: roleFilterCollection.items.map((item) => /* @__PURE__ */ jsxs(SelectItem2, {
                              item,
                              children: [
                                /* @__PURE__ */ jsx(SelectItemText2, {
                                  children: item.label
                                }),
                                /* @__PURE__ */ jsx(SelectItemIndicator2, {})
                              ]
                            }, item.value))
                          })
                        })
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsxs(Select2, {
                    collection: memberSortCollection,
                    value: [memberSort],
                    onValueChange: (details) => setMemberSort(details.value[0] ?? "name-asc"),
                    positioning: { strategy: "fixed", placement: "bottom-end" },
                    children: [
                      /* @__PURE__ */ jsx(SelectControl2, {
                        children: /* @__PURE__ */ jsx(SelectTrigger2, {
                          asChild: true,
                          children: /* @__PURE__ */ jsxs(Button2, {
                            variant: "outline",
                            size: "sm",
                            className: "min-w-36 justify-between gap-2",
                            children: [
                              /* @__PURE__ */ jsx(SelectValueText2, {
                                placeholder: "Sort"
                              }),
                              /* @__PURE__ */ jsx(SelectIndicator2, {
                                children: /* @__PURE__ */ jsx(ChevronsUpDown, {
                                  className: "size-3.5 shrink-0 opacity-60"
                                })
                              })
                            ]
                          })
                        })
                      }),
                      /* @__PURE__ */ jsx(SelectPositioner2, {
                        children: /* @__PURE__ */ jsx(SelectContent2, {
                          className: "min-w-[10rem] p-1",
                          children: /* @__PURE__ */ jsx(SelectItemGroup2, {
                            className: "space-y-0.5",
                            children: memberSortCollection.items.map((item) => /* @__PURE__ */ jsxs(SelectItem2, {
                              item,
                              children: [
                                /* @__PURE__ */ jsx(SelectItemText2, {
                                  children: item.label
                                }),
                                /* @__PURE__ */ jsx(SelectItemIndicator2, {})
                              ]
                            }, item.value))
                          })
                        })
                      })
                    ]
                  })
                ]
              }),
              isLoading ? /* @__PURE__ */ jsx("p", {
                className: "py-4 text-center text-muted-foreground text-sm",
                children: "Loading members..."
              }) : members.length === 0 ? /* @__PURE__ */ jsx("p", {
                className: "py-4 text-center text-muted-foreground text-sm",
                children: "No members yet."
              }) : visibleMembers.length === 0 ? /* @__PURE__ */ jsx("p", {
                className: "py-4 text-center text-muted-foreground text-sm",
                children: "No members match your search."
              }) : visibleMembers.map((member) => {
                const isLastOwner = member.role === "owner" && ownerCount === 1;
                const canManageMember = canManage && (isOwner || member.role !== "owner");
                return /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3",
                  children: [
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex min-w-0 items-center gap-3",
                      children: [
                        /* @__PURE__ */ jsxs(AvatarRoot2, {
                          className: "size-9 shrink-0",
                          children: [
                            /* @__PURE__ */ jsx(AvatarImage2, {
                              src: member.user.image ?? undefined
                            }),
                            /* @__PURE__ */ jsx(AvatarFallback2, {
                              children: (member.user.name ?? member.user.email).charAt(0)
                            })
                          ]
                        }),
                        /* @__PURE__ */ jsxs("div", {
                          className: "min-w-0",
                          children: [
                            /* @__PURE__ */ jsxs("div", {
                              className: "truncate font-medium text-sm",
                              children: [
                                memberDisplayName(member),
                                member.user.email.toLowerCase() === currentEmail.toLowerCase() && /* @__PURE__ */ jsx("span", {
                                  className: "ml-1.5 font-normal text-muted-foreground",
                                  children: "(you)"
                                })
                              ]
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
                        canManageMember ? /* @__PURE__ */ jsx(RoleSelect, {
                          value: member.role,
                          disabled: isLastOwner,
                          roles: assignableRoles(isOwner),
                          onValueChange: (role) => handleRoleChange(member.id, role)
                        }) : /* @__PURE__ */ jsx(Badge2, {
                          variant: "soft",
                          className: "capitalize",
                          children: member.role
                        }),
                        canManageMember && !isLastOwner && /* @__PURE__ */ jsx(Button2, {
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
                              invitation.isExpired && /* @__PURE__ */ jsx(Badge2, {
                                variant: "warning",
                                children: "Expired"
                              })
                            ]
                          }),
                          /* @__PURE__ */ jsx("div", {
                            className: "text-muted-foreground text-xs capitalize",
                            children: invitation.role
                          }),
                          invitation.expiresAt && /* @__PURE__ */ jsx("div", {
                            className: `text-xs ${invitation.isExpired ? "text-destructive" : "text-muted-foreground"}`,
                            children: formatExpiry(invitation.expiresAt, invitation.isExpired)
                          })
                        ]
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsx(Button2, {
                        variant: "outline",
                        size: "sm",
                        disabled: resendingId === invitation.id || resendCooldown.has(invitation.email.toLowerCase()),
                        onClick: () => handleResend(invitation),
                        children: resendingId === invitation.id ? "Resending..." : resendCooldown.has(invitation.email.toLowerCase()) ? "Sent" : "Resend"
                      }),
                      /* @__PURE__ */ jsx(Button2, {
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
                  })
                ]
              }, invitation.id))
            ]
          }),
          canManage && /* @__PURE__ */ jsx(AccountOrganizationTeams2, {
            organizationId: organization.id,
            members,
            currentUserId
          }),
          !isPersonal && /* @__PURE__ */ jsxs(Fragment, {
            children: [
              isOwner ? !scheduledDeletionDate && /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-5",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className: "min-w-0",
                    children: [
                      /* @__PURE__ */ jsx("div", {
                        className: "font-medium text-sm",
                        children: "Delete this workspace"
                      }),
                      /* @__PURE__ */ jsx("div", {
                        className: "text-muted-foreground text-sm",
                        children: canScheduleDeletion ? `Removes it for every member. Restorable for ${DELETION_GRACE_DAYS} days, then permanent.` : "Removes it for every member. This cannot be undone."
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsx(Button2, {
                    variant: "destructive",
                    onClick: () => setPending({ kind: "delete" }),
                    children: "Delete workspace"
                  })
                ]
              }) : /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-5",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className: "min-w-0",
                    children: [
                      /* @__PURE__ */ jsx("div", {
                        className: "font-medium text-sm",
                        children: "Leave this workspace"
                      }),
                      /* @__PURE__ */ jsx("div", {
                        className: "text-muted-foreground text-sm",
                        children: "You'll lose access to it."
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsx(Button2, {
                    variant: "outline",
                    onClick: () => setPending({ kind: "leave" }),
                    children: "Leave workspace"
                  })
                ]
              }),
              isOwner && !isSoleOwner && /* @__PURE__ */ jsxs("div", {
                className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-5",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className: "min-w-0",
                    children: [
                      /* @__PURE__ */ jsx("div", {
                        className: "font-medium text-sm",
                        children: "Leave this workspace"
                      }),
                      /* @__PURE__ */ jsx("div", {
                        className: "text-muted-foreground text-sm",
                        children: "Step down as owner. Another owner keeps managing it."
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsx(Button2, {
                    variant: "outline",
                    onClick: () => setPending({ kind: "leave" }),
                    children: "Leave"
                  })
                ]
              })
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsx(ConfirmDialog2, {
        open: pending !== null,
        onOpenChange: (open) => {
          if (!open)
            setPending(null);
        },
        title: pending?.kind === "remove" ? `Remove ${pending.label}?` : pending?.kind === "cancel" ? `Cancel invitation for ${pending.label}?` : pending?.kind === "delete" ? `Delete ${organization.name}?` : pending?.kind === "leave" ? `Leave ${organization.name}?` : "",
        description: pending?.kind === "remove" ? "They will lose access to this workspace. This cannot be undone." : pending?.kind === "cancel" ? "The invitation link will stop working. You can invite them again later." : pending?.kind === "delete" ? canScheduleDeletion ? `Every member loses access. The workspace is restorable for ${DELETION_GRACE_DAYS} days, then permanently deleted.` : "Every member loses access to this workspace. This cannot be undone." : "You will lose access to this workspace. An owner can invite you back later.",
        confirmLabel: pending?.kind === "remove" ? "Remove" : pending?.kind === "cancel" ? "Cancel invitation" : pending?.kind === "delete" ? "Delete workspace" : "Leave workspace",
        cancelLabel: "Keep",
        confirmationText: pending?.kind === "delete" ? organization.name : undefined,
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
  const { authClient } = useAccountContext2();
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
      currentUserId: session.user.id,
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
                children: "Workspaces"
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-muted-foreground text-sm",
                children: "The workspaces you belong to, including your personal one."
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
                /* @__PURE__ */ jsxs(AvatarRoot2, {
                  className: "size-9 shrink-0",
                  children: [
                    /* @__PURE__ */ jsx(AvatarImage2, {
                      src: org.logo ?? undefined
                    }),
                    /* @__PURE__ */ jsx(AvatarFallback2, {
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
                        org.type === "personal" && /* @__PURE__ */ jsx(Badge2, {
                          variant: "outline",
                          children: "Personal"
                        }),
                        org.deletedAt && /* @__PURE__ */ jsx(Badge2, {
                          variant: "warning",
                          children: "Scheduled for deletion"
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
          children: "You don't belong to any workspaces yet."
        })
      })
    ]
  });
};
export {
  AccountOrganizations
};
