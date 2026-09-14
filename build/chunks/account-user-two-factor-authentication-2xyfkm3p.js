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
} from "./account-user-two-factor-authentication-y482en2x.js";
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
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle
} from "./account-user-two-factor-authentication-negb4kbv.js";
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
  members,
  currentUserId
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
    const name = newTeamName.trim();
    if (!name)
      return;
    const tempId = `temp-${Date.now()}`;
    setIsCreating(true);
    setTeams((prev) => [...prev, { id: tempId, name }]);
    const res = await authClient.organization.createTeam({
      name,
      organizationId
    });
    setIsCreating(false);
    if (res?.error) {
      setTeams((prev) => prev.filter((team) => team.id !== tempId));
      toaster.error({ title: errorMessage(res.error, "Couldn't create it") });
      return;
    }
    const created = res?.data;
    if (created?.id) {
      setTeams((prev) => prev.map((team) => team.id === tempId ? created : team));
    }
    toaster.success({ title: "Team created" });
    setNewTeamName("");
    setCreateOpen(false);
  };
  const handleRename = async () => {
    const nextName = editName.trim();
    if (!editing || !nextName)
      return;
    const target = editing;
    const previousName = target.name;
    setIsSavingEdit(true);
    setTeams((prev) => prev.map((team) => team.id === target.id ? { ...team, name: nextName } : team));
    const res = await authClient.organization.updateTeam({
      teamId: target.id,
      data: { name: nextName }
    });
    setIsSavingEdit(false);
    if (res?.error) {
      setTeams((prev) => prev.map((team) => team.id === target.id ? { ...team, name: previousName } : team));
      toaster.error({ title: errorMessage(res.error, "Couldn't rename it") });
      return;
    }
    toaster.success({ title: "Team renamed" });
    setEditing(null);
  };
  const handleDelete = async () => {
    if (!teamToDelete)
      return;
    const removed = teamToDelete;
    setIsDeleting(true);
    setTeams((prev) => prev.filter((team) => team.id !== removed.id));
    if (expandedId === removed.id)
      setExpandedId(null);
    const res = await authClient.organization.removeTeam({
      teamId: removed.id,
      organizationId
    });
    setIsDeleting(false);
    setTeamToDelete(null);
    if (res?.error) {
      setTeams((prev) => [...prev, removed]);
      toaster.error({ title: errorMessage(res.error, "Couldn't delete it") });
      return;
    }
    toaster.success({ title: "Team deleted" });
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-2 rounded-lg border p-5",
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-wrap items-center justify-between gap-3",
        children: [
          /* @__PURE__ */ jsxs("div", {
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
              /* @__PURE__ */ jsx("p", {
                className: "text-muted-foreground text-sm",
                children: "Groups within this workspace, for organizing members and their access."
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
            members,
            currentUserId
          })
        ]
      }, team.id)),
      /* @__PURE__ */ jsx(DialogRoot, {
        open: createOpen,
        onOpenChange: ({ open }) => {
          if (isCreating)
            return;
          setCreateOpen(open);
          if (!open)
            setNewTeamName("");
        },
        children: /* @__PURE__ */ jsxs(DialogPortal, {
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
                    children: "Group members within this workspace."
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
        })
      }),
      /* @__PURE__ */ jsx(DialogRoot, {
        open: editing !== null,
        onOpenChange: ({ open }) => {
          if (isSavingEdit)
            return;
          if (!open)
            setEditing(null);
        },
        children: /* @__PURE__ */ jsxs(DialogPortal, {
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
        })
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
  members,
  currentUserId
}) => {
  const { authClient, toaster } = useAccountContext();
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
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
  const teamMemberLabel = (member) => member.user?.name ?? member.user?.email ?? nameForUserId(member.userId);
  const handleAdd = async () => {
    if (!selectedUserId)
      return;
    const userId = selectedUserId;
    const orgMember = members.find((member) => member.userId === userId);
    const optimistic = {
      id: `temp-${userId}`,
      userId,
      user: orgMember ? {
        name: orgMember.user.name,
        email: orgMember.user.email,
        image: orgMember.user.image
      } : null
    };
    setIsAdding(true);
    setSelectedUserId(null);
    setTeamMembers((prev) => [...prev, optimistic]);
    const res = await authClient.organization.addTeamMember({
      teamId,
      userId,
      organizationId
    });
    setIsAdding(false);
    if (res?.error) {
      setTeamMembers((prev) => prev.filter((member) => member.id !== optimistic.id));
      setSelectedUserId(userId);
      toaster.error({ title: errorMessage(res.error, "Couldn't add them") });
      return;
    }
    const added = res?.data;
    if (added?.id) {
      setTeamMembers((prev) => prev.map((member) => member.id === optimistic.id ? added : member));
    }
    toaster.success({ title: "Added to team" });
  };
  const handleRemove = async () => {
    if (!memberToRemove)
      return;
    const removed = memberToRemove;
    setIsRemoving(true);
    setTeamMembers((prev) => prev.filter((member) => member.id !== removed.id));
    const res = await authClient.organization.removeTeamMember({
      teamId,
      userId: removed.userId,
      organizationId
    });
    setIsRemoving(false);
    setMemberToRemove(null);
    if (res?.error) {
      setTeamMembers((prev) => [...prev, removed]);
      toaster.error({ title: errorMessage(res.error, "Couldn't remove them") });
      return;
    }
    toaster.success({ title: "Removed from team" });
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
          /* @__PURE__ */ jsxs("span", {
            className: "truncate",
            children: [
              teamMemberLabel(member),
              currentUserId && member.userId === currentUserId && /* @__PURE__ */ jsx("span", {
                className: "ml-1.5 text-muted-foreground",
                children: "(you)"
              })
            ]
          }),
          /* @__PURE__ */ jsx(Button, {
            variant: "ghost",
            size: "sm",
            className: "text-destructive hover:text-destructive",
            onClick: () => setMemberToRemove(member),
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
      }),
      /* @__PURE__ */ jsx(ConfirmDialog, {
        open: memberToRemove !== null,
        onOpenChange: (open) => {
          if (!open)
            setMemberToRemove(null);
        },
        title: `Remove ${memberToRemove ? teamMemberLabel(memberToRemove) : "member"} from this team?`,
        description: "They stay in the workspace but lose this team's access. You can add them back later.",
        confirmLabel: "Remove",
        cancelLabel: "Keep",
        isPending: isRemoving,
        onConfirm: handleRemove
      })
    ]
  });
};
export { AccountOrganizationTeams };
