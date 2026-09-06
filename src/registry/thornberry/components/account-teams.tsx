import { ChevronsUpDown, Plus, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import { Button } from "@/registry/thornberry/components/button";
import { ConfirmDialog } from "@/registry/thornberry/components/confirm-dialog";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/registry/thornberry/components/dialog";
import { Input } from "@/registry/thornberry/components/input";
import { Label } from "@/registry/thornberry/components/label";
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
  createListCollection,
} from "@/registry/thornberry/components/select";

import type {
  AccountOrgMember,
  AccountTeam,
  AccountTeamMember,
} from "@/registry/thornberry/components/account-provider";

const errorMessage = (error: unknown, fallback: string): string =>
  typeof (error as { message?: unknown })?.message === "string"
    ? (error as { message: string }).message
    : fallback;

const memberLabel = (member: AccountOrgMember): string =>
  member.user.name ?? member.user.email;

/**
 * Team management within an organization: list the org's teams, create and
 * rename them, delete them, and manage each team's membership by adding or
 * removing organization members. Driven through the injected client + toaster,
 * so it renders in an identity server's dashboard and a relying-party account
 * app alike. Intended to sit inside an organization's management view; pass the
 * organization id and its members (the pool teams draw from).
 */
const AccountOrganizationTeams = ({
  organizationId,
  members,
}: {
  organizationId: string;
  members: AccountOrgMember[];
}) => {
  const { authClient, toaster } = useAccountContext();

  const [teams, setTeams] = useState<AccountTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<AccountTeam | null>(null);
  const [editName, setEditName] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<AccountTeam | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadTeams = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authClient.organization.listTeams({
        query: { organizationId },
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
    if (!newTeamName.trim()) return;
    setIsCreating(true);
    const res = await authClient.organization.createTeam({
      name: newTeamName.trim(),
      organizationId,
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
    if (!editing || !editName.trim()) return;
    setIsSavingEdit(true);
    const res = await authClient.organization.updateTeam({
      teamId: editing.id,
      data: { name: editName.trim() },
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
    if (!teamToDelete) return;
    setIsDeleting(true);
    const res = await authClient.organization.removeTeam({
      teamId: teamToDelete.id,
      organizationId,
    });
    setIsDeleting(false);
    setTeamToDelete(null);
    if (res?.error) {
      toaster.error({ title: errorMessage(res.error, "Couldn't delete it") });
      return;
    }
    toaster.success({ title: "Team deleted" });
    if (expandedId === teamToDelete.id) setExpandedId(null);
    loadTeams();
  };

  return (
    <div className="space-y-2 rounded-lg border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-muted-foreground" />
          <h4 className="font-medium text-sm">Teams</h4>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          New team
        </Button>
      </div>

      {isLoading ? (
        <p className="py-4 text-center text-muted-foreground text-sm">
          Loading teams...
        </p>
      ) : teams.length === 0 ? (
        <p className="py-4 text-center text-muted-foreground text-sm">
          No teams yet.
        </p>
      ) : (
        teams.map((team) => (
          <div key={team.id} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="truncate font-medium text-sm">{team.name}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setExpandedId(expandedId === team.id ? null : team.id)
                  }
                >
                  {expandedId === team.id ? "Hide members" : "Members"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditing(team);
                    setEditName(team.name);
                  }}
                >
                  Rename
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setTeamToDelete(team)}
                >
                  Delete
                </Button>
              </div>
            </div>

            {expandedId === team.id && (
              <TeamMembers
                organizationId={organizationId}
                teamId={team.id}
                members={members}
              />
            )}
          </div>
        ))
      )}

      {/* Create team */}
      <DialogRoot
        open={createOpen}
        onOpenChange={({ open }) => {
          if (isCreating) return;
          setCreateOpen(open);
          if (!open) setNewTeamName("");
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="w-full max-w-md p-6">
            <DialogTitle>Create a team</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Group members within this organization.
            </DialogDescription>
            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                handleCreate();
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="team-name">Name</Label>
                <Input
                  id="team-name"
                  value={newTeamName}
                  onChange={(event) => setNewTeamName(event.target.value)}
                  placeholder="Engineering"
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isCreating}
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!newTeamName.trim() || isCreating}
                >
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      {/* Rename team */}
      <DialogRoot
        open={editing !== null}
        onOpenChange={({ open }) => {
          if (isSavingEdit) return;
          if (!open) setEditing(null);
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="w-full max-w-md p-6">
            <DialogTitle>Rename team</DialogTitle>
            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                handleRename();
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="team-rename">Name</Label>
                <Input
                  id="team-rename"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSavingEdit}
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!editName.trim() || isSavingEdit}
                >
                  {isSavingEdit ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      <ConfirmDialog
        open={teamToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setTeamToDelete(null);
        }}
        title={`Delete ${teamToDelete?.name ?? "team"}?`}
        description="The team is removed and its members are unassigned from it. This cannot be undone."
        confirmLabel="Delete team"
        cancelLabel="Keep"
        isPending={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
};

/**
 * The member list for a single team: shows current members, removes them, and
 * adds organization members who are not yet on the team.
 */
const TeamMembers = ({
  organizationId,
  teamId,
  members,
}: {
  organizationId: string;
  teamId: string;
  members: AccountOrgMember[];
}) => {
  const { authClient, toaster } = useAccountContext();

  const [teamMembers, setTeamMembers] = useState<AccountTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authClient.organization.listTeamMembers({
        query: { teamId },
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
  const addable = members.filter(
    (member) => member.userId && !memberUserIds.has(member.userId),
  );

  const addCollection = createListCollection({
    items: addable.map((member) => ({
      label: memberLabel(member),
      value: member.userId as string,
    })),
  });

  const nameForUserId = (userId: string): string => {
    const orgMember = members.find((member) => member.userId === userId);
    return orgMember ? memberLabel(orgMember) : userId;
  };

  const handleAdd = async () => {
    if (!selectedUserId) return;
    setIsAdding(true);
    const res = await authClient.organization.addTeamMember({
      teamId,
      userId: selectedUserId,
      organizationId,
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

  const handleRemove = async (userId: string) => {
    const res = await authClient.organization.removeTeamMember({
      teamId,
      userId,
      organizationId,
    });
    if (res?.error) {
      toaster.error({ title: errorMessage(res.error, "Couldn't remove them") });
      return;
    }
    toaster.success({ title: "Removed from team" });
    load();
  };

  return (
    <div className="mt-3 space-y-2 border-t pt-3">
      {isLoading ? (
        <p className="py-2 text-muted-foreground text-sm">Loading members...</p>
      ) : teamMembers.length === 0 ? (
        <p className="py-2 text-muted-foreground text-sm">No members yet.</p>
      ) : (
        teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span className="truncate">
              {member.user?.name ??
                member.user?.email ??
                nameForUserId(member.userId)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleRemove(member.userId)}
            >
              Remove
            </Button>
          </div>
        ))
      )}

      {addable.length > 0 && (
        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
          <Select
            collection={addCollection}
            value={selectedUserId ? [selectedUserId] : []}
            onValueChange={(details) =>
              setSelectedUserId(details.value[0] ?? null)
            }
            positioning={{ strategy: "fixed", placement: "bottom-start" }}
            className="flex-1"
          >
            <SelectControl>
              <SelectTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between gap-2"
                >
                  <SelectValueText placeholder="Add a member" />
                  <SelectIndicator>
                    <ChevronsUpDown className="size-3.5 shrink-0 opacity-60" />
                  </SelectIndicator>
                </Button>
              </SelectTrigger>
            </SelectControl>
            <SelectPositioner>
              <SelectContent className="min-w-[12rem] p-1">
                <SelectItemGroup className="space-y-0.5">
                  {addCollection.items.map((item) => (
                    <SelectItem key={item.value} item={item}>
                      <SelectItemText>{item.label}</SelectItemText>
                      <SelectItemIndicator />
                    </SelectItem>
                  ))}
                </SelectItemGroup>
              </SelectContent>
            </SelectPositioner>
          </Select>
          <Button
            size="sm"
            disabled={!selectedUserId || isAdding}
            onClick={handleAdd}
          >
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </div>
      )}
    </div>
  );
};

export { AccountOrganizationTeams };
