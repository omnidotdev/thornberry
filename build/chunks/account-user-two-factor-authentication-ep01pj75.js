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
} from "./account-user-two-factor-authentication-v7dgczst.js";
import {
  ConfirmDialog
} from "./account-user-two-factor-authentication-164eysdm.js";
import {
  Label
} from "./account-user-two-factor-authentication-gsg3ph0v.js";
import {
  useAccountContext
} from "./account-user-two-factor-authentication-en4v22ys.js";
import {
  Input
} from "./account-user-two-factor-authentication-nmmcnpth.js";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle
} from "./account-user-two-factor-authentication-p3ac7628.js";
import {
  Button
} from "./account-user-two-factor-authentication-jb3sh07m.js";

// src/registry/thornberry/components/account-teams.tsx
import { ChevronsUpDown, Plus, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var errorMessage = (error, fallback) => typeof error?.message === "string" ? error.message : fallback;
var memberLabel = (member) => member.user.name ?? member.user.email;
var AccountOrganizationTeams = ({
  organizationId,
  members
}) => {
  const { authClient, toaster } = useAccountContext();
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const loadTeams = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authClient.organization.listTeams({
        query: { organizationId }
      });
      setTeams(res?.data ?? []);
    } catch {
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  }, [authClient, organizationId]);
  useEffect(() => {
    loadTeams();
  }, [loadTeams]);
  const handleCreate = async () => {
    if (!newTeamName.trim())
      return;
    setIsCreating(true);
    const res = await authClient.organization.createTeam({
      name: newTeamName.trim(),
      organizationId
    });
    setIsCreating(false);
    if (res?.error) {
      toaster.error({ title: errorMessage(res.error, "Couldn't create it") });
      return;
    }
    toaster.success({ title: "Team created" });
    setNewTeamName("");
    setCreateOpen(false);
    loadTeams();
  };
  const handleRename = async () => {
    if (!editing || !editName.trim())
      return;
    setIsSavingEdit(true);
    const res = await authClient.organization.updateTeam({
      teamId: editing.id,
      data: { name: editName.trim() }
    });
    setIsSavingEdit(false);
    if (res?.error) {
      toaster.error({ title: errorMessage(res.error, "Couldn't rename it") });
      return;
    }
    toaster.success({ title: "Team renamed" });
    setEditing(null);
    loadTeams();
  };
  const handleDelete = async () => {
    if (!teamToDelete)
      return;
    setIsDeleting(true);
    const res = await authClient.organization.removeTeam({
      teamId: teamToDelete.id,
      organizationId
    });
    setIsDeleting(false);
    setTeamToDelete(null);
    if (res?.error) {
      toaster.error({ title: errorMessage(res.error, "Couldn't delete it") });
      return;
    }
    toaster.success({ title: "Team deleted" });
    if (expandedId === teamToDelete.id)
      setExpandedId(null);
    loadTeams();
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-2 rounded-lg border p-5",
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-wrap items-center justify-between gap-3",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(Users, {
                className: "size-4 text-muted-foreground"
              }),
              /* @__PURE__ */ jsx("h4", {
                className: "font-medium text-sm",
                children: "Teams"
              })
            ]
          }),
          /* @__PURE__ */ jsxs(Button, {
            size: "sm",
            className: "gap-2",
            onClick: () => setCreateOpen(true),
            children: [
              /* @__PURE__ */ jsx(Plus, {
                className: "size-4"
              }),
              "New team"
            ]
          })
        ]
      }),
      isLoading ? /* @__PURE__ */ jsx("p", {
        className: "py-4 text-center text-muted-foreground text-sm",
        children: "Loading teams..."
      }) : teams.length === 0 ? /* @__PURE__ */ jsx("p", {
        className: "py-4 text-center text-muted-foreground text-sm",
        children: "No teams yet."
      }) : teams.map((team) => /* @__PURE__ */ jsxs("div", {
        className: "rounded-lg border p-3",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-wrap items-center justify-between gap-2",
            children: [
              /* @__PURE__ */ jsx("span", {
                className: "truncate font-medium text-sm",
                children: team.name
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(Button, {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setExpandedId(expandedId === team.id ? null : team.id),
                    children: expandedId === team.id ? "Hide members" : "Members"
                  }),
                  /* @__PURE__ */ jsx(Button, {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => {
                      setEditing(team);
                      setEditName(team.name);
                    },
                    children: "Rename"
                  }),
                  /* @__PURE__ */ jsx(Button, {
                    variant: "ghost",
                    size: "sm",
                    className: "text-destructive hover:text-destructive",
                    onClick: () => setTeamToDelete(team),
                    children: "Delete"
                  })
                ]
              })
            ]
          }),
          expandedId === team.id && /* @__PURE__ */ jsx(TeamMembers, {
            organizationId,
            teamId: team.id,
            members
          })
        ]
      }, team.id)),
      /* @__PURE__ */ jsxs(DialogRoot, {
        open: createOpen,
        onOpenChange: ({ open }) => {
          if (isCreating)
            return;
          setCreateOpen(open);
          if (!open)
            setNewTeamName("");
        },
        children: [
          /* @__PURE__ */ jsx(DialogBackdrop, {}),
          /* @__PURE__ */ jsx(DialogPositioner, {
            children: /* @__PURE__ */ jsxs(DialogContent, {
              className: "w-full max-w-md p-6",
              children: [
                /* @__PURE__ */ jsx(DialogTitle, {
                  children: "Create a team"
                }),
                /* @__PURE__ */ jsx(DialogDescription, {
                  className: "text-muted-foreground text-sm",
                  children: "Group members within this organization."
                }),
                /* @__PURE__ */ jsxs("form", {
                  className: "mt-4 space-y-4",
                  onSubmit: (event) => {
                    event.preventDefault();
                    handleCreate();
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsx(Label, {
                          htmlFor: "team-name",
                          children: "Name"
                        }),
                        /* @__PURE__ */ jsx(Input, {
                          id: "team-name",
                          value: newTeamName,
                          onChange: (event) => setNewTeamName(event.target.value),
                          placeholder: "Engineering",
                          autoFocus: true,
                          required: true
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex justify-end gap-2",
                      children: [
                        /* @__PURE__ */ jsx(Button, {
                          type: "button",
                          variant: "outline",
                          disabled: isCreating,
                          onClick: () => setCreateOpen(false),
                          children: "Cancel"
                        }),
                        /* @__PURE__ */ jsx(Button, {
                          type: "submit",
                          disabled: !newTeamName.trim() || isCreating,
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
      }),
      /* @__PURE__ */ jsxs(DialogRoot, {
        open: editing !== null,
        onOpenChange: ({ open }) => {
          if (isSavingEdit)
            return;
          if (!open)
            setEditing(null);
        },
        children: [
          /* @__PURE__ */ jsx(DialogBackdrop, {}),
          /* @__PURE__ */ jsx(DialogPositioner, {
            children: /* @__PURE__ */ jsxs(DialogContent, {
              className: "w-full max-w-md p-6",
              children: [
                /* @__PURE__ */ jsx(DialogTitle, {
                  children: "Rename team"
                }),
                /* @__PURE__ */ jsxs("form", {
                  className: "mt-4 space-y-4",
                  onSubmit: (event) => {
                    event.preventDefault();
                    handleRename();
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsx(Label, {
                          htmlFor: "team-rename",
                          children: "Name"
                        }),
                        /* @__PURE__ */ jsx(Input, {
                          id: "team-rename",
                          value: editName,
                          onChange: (event) => setEditName(event.target.value),
                          autoFocus: true,
                          required: true
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex justify-end gap-2",
                      children: [
                        /* @__PURE__ */ jsx(Button, {
                          type: "button",
                          variant: "outline",
                          disabled: isSavingEdit,
                          onClick: () => setEditing(null),
                          children: "Cancel"
                        }),
                        /* @__PURE__ */ jsx(Button, {
                          type: "submit",
                          disabled: !editName.trim() || isSavingEdit,
                          children: isSavingEdit ? "Saving..." : "Save"
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          })
        ]
      }),
      /* @__PURE__ */ jsx(ConfirmDialog, {
        open: teamToDelete !== null,
        onOpenChange: (open) => {
          if (!open)
            setTeamToDelete(null);
        },
        title: `Delete ${teamToDelete?.name ?? "team"}?`,
        description: "The team is removed and its members are unassigned from it. This cannot be undone.",
        confirmLabel: "Delete team",
        cancelLabel: "Keep",
        isPending: isDeleting,
        onConfirm: handleDelete
      })
    ]
  });
};
var TeamMembers = ({
  organizationId,
  teamId,
  members
}) => {
  const { authClient, toaster } = useAccountContext();
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authClient.organization.listTeamMembers({
        query: { teamId }
      });
      setTeamMembers(res?.data ?? []);
    } catch {
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [authClient, teamId]);
  useEffect(() => {
    load();
  }, [load]);
  const memberUserIds = new Set(teamMembers.map((member) => member.userId));
  const addable = members.filter((member) => member.userId && !memberUserIds.has(member.userId));
  const addCollection = createListCollection({
    items: addable.map((member) => ({
      label: memberLabel(member),
      value: member.userId
    }))
  });
  const nameForUserId = (userId) => {
    const orgMember = members.find((member) => member.userId === userId);
    return orgMember ? memberLabel(orgMember) : userId;
  };
  const handleAdd = async () => {
    if (!selectedUserId)
      return;
    setIsAdding(true);
    const res = await authClient.organization.addTeamMember({
      teamId,
      userId: selectedUserId,
      organizationId
    });
    setIsAdding(false);
    if (res?.error) {
      toaster.error({ title: errorMessage(res.error, "Couldn't add them") });
      return;
    }
    toaster.success({ title: "Added to team" });
    setSelectedUserId(null);
    load();
  };
  const handleRemove = async (userId) => {
    const res = await authClient.organization.removeTeamMember({
      teamId,
      userId,
      organizationId
    });
    if (res?.error) {
      toaster.error({ title: errorMessage(res.error, "Couldn't remove them") });
      return;
    }
    toaster.success({ title: "Removed from team" });
    load();
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "mt-3 space-y-2 border-t pt-3",
    children: [
      isLoading ? /* @__PURE__ */ jsx("p", {
        className: "py-2 text-muted-foreground text-sm",
        children: "Loading members..."
      }) : teamMembers.length === 0 ? /* @__PURE__ */ jsx("p", {
        className: "py-2 text-muted-foreground text-sm",
        children: "No members yet."
      }) : teamMembers.map((member) => /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between gap-2 text-sm",
        children: [
          /* @__PURE__ */ jsx("span", {
            className: "truncate",
            children: member.user?.name ?? member.user?.email ?? nameForUserId(member.userId)
          }),
          /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "sm",
            className: "text-destructive hover:text-destructive",
            onClick: () => handleRemove(member.userId),
            children: "Remove"
          })
        ]
      }, member.id)),
      addable.length > 0 && /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-2 pt-1 sm:flex-row sm:items-center",
        children: [
          /* @__PURE__ */ jsxs(Select, {
            collection: addCollection,
            value: selectedUserId ? [selectedUserId] : [],
            onValueChange: (details) => setSelectedUserId(details.value[0] ?? null),
            positioning: { strategy: "fixed", placement: "bottom-start" },
            className: "flex-1",
            children: [
              /* @__PURE__ */ jsx(SelectControl, {
                children: /* @__PURE__ */ jsx(SelectTrigger, {
                  asChild: true,
                  children: /* @__PURE__ */ jsxs(Button, {
                    variant: "outline",
                    size: "sm",
                    className: "w-full justify-between gap-2",
                    children: [
                      /* @__PURE__ */ jsx(SelectValueText, {
                        placeholder: "Add a member"
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
                  className: "min-w-[12rem] p-1",
                  children: /* @__PURE__ */ jsx(SelectItemGroup, {
                    className: "space-y-0.5",
                    children: addCollection.items.map((item) => /* @__PURE__ */ jsxs(SelectItem, {
                      item,
                      children: [
                        /* @__PURE__ */ jsx(SelectItemText, {
                          children: item.label
                        }),
                        /* @__PURE__ */ jsx(SelectItemIndicator, {})
                      ]
                    }, item.value))
                  })
                })
              })
            ]
          }),
          /* @__PURE__ */ jsx(Button, {
            size: "sm",
            disabled: !selectedUserId || isAdding,
            onClick: handleAdd,
            children: isAdding ? "Adding..." : "Add"
          })
        ]
      })
    ]
  });
};
export { AccountOrganizationTeams };
