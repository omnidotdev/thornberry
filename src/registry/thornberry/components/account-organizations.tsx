import {
  ArrowLeft,
  Check,
  ChevronRight,
  ChevronsUpDown,
  Loader2,
  Mail,
  Plus,
  UserPlus,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import { AccountOrganizationTeams } from "@/registry/thornberry/components/account-teams";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/registry/thornberry/components/avatar";
import { Badge } from "@/registry/thornberry/components/badge";
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
  AccountFullOrganization,
  AccountOrgRole,
  AccountOrganization,
} from "@/registry/thornberry/components/account-provider";

const ROLES: AccountOrgRole[] = ["owner", "admin", "member"];

const ROLE_COLLECTION = createListCollection({
  items: ROLES.map((role) => ({ label: role, value: role })),
});

type SlugStatus = "idle" | "checking" | "available" | "taken" | "invalid";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

/** Turn a display name into a URL-safe handle candidate */
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

const errorMessage = (error: unknown, fallback: string): string =>
  typeof (error as { message?: unknown })?.message === "string"
    ? (error as { message: string }).message
    : fallback;

/**
 * Styled organization-role picker (owner/admin/member).
 */
const RoleSelect = ({
  value,
  onValueChange,
  disabled,
  size = "sm",
}: {
  value: AccountOrgRole;
  onValueChange: (role: AccountOrgRole) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}) => (
  <Select
    collection={ROLE_COLLECTION}
    value={[value]}
    onValueChange={(details) => {
      const next = details.value[0] as AccountOrgRole | undefined;
      if (next) onValueChange(next);
    }}
    disabled={disabled}
    positioning={{ strategy: "fixed", placement: "bottom-end" }}
  >
    <SelectControl>
      <SelectTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className="min-w-28 justify-between gap-2 capitalize"
        >
          <SelectValueText className="capitalize" placeholder="Role" />
          <SelectIndicator>
            <ChevronsUpDown className="size-3.5 shrink-0 opacity-60" />
          </SelectIndicator>
        </Button>
      </SelectTrigger>
    </SelectControl>

    <SelectPositioner>
      <SelectContent className="min-w-[8rem] p-1">
        <SelectItemGroup className="space-y-0.5">
          {ROLE_COLLECTION.items.map((item) => (
            <SelectItem key={item.value} item={item}>
              <SelectItemText className="capitalize">
                {item.label}
              </SelectItemText>
              <SelectItemIndicator />
            </SelectItem>
          ))}
        </SelectItemGroup>
      </SelectContent>
    </SelectPositioner>
  </Select>
);

type PendingAction =
  | { kind: "remove"; memberIdOrEmail: string; label: string }
  | { kind: "cancel"; invitationId: string; label: string }
  | { kind: "delete" }
  | { kind: "leave" }
  | null;

/**
 * Create-organization dialog. Derives a handle from the name until the user
 * edits it, checks availability through the injected client, and creates a team
 * organization the caller owns.
 */
const CreateOrganizationDialog = ({ onCreated }: { onCreated: () => void }) => {
  const { authClient, toaster } = useAccountContext();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [isCreating, setIsCreating] = useState(false);
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = () => {
    setName("");
    setSlug("");
    setSlugEdited(false);
    setSlugStatus("idle");
    if (slugTimer.current) clearTimeout(slugTimer.current);
  };

  const checkSlug = useCallback(
    (value: string) => {
      setSlugStatus("idle");
      if (slugTimer.current) clearTimeout(slugTimer.current);

      if (value.length < 3) return;

      if (!SLUG_PATTERN.test(value)) {
        setSlugStatus("invalid");
        return;
      }

      setSlugStatus("checking");
      slugTimer.current = setTimeout(async () => {
        try {
          const result = await authClient.organization.checkSlug({
            slug: value,
          });
          setSlugStatus(result?.data?.status ? "available" : "taken");
        } catch {
          setSlugStatus("idle");
        }
      }, 500);
    },
    [authClient],
  );

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) {
      const derived = slugify(value);
      setSlug(derived);
      checkSlug(derived);
    }
  };

  const handleSlugChange = (value: string) => {
    const normalized = value.toLowerCase();
    setSlugEdited(true);
    setSlug(normalized);
    checkSlug(normalized);
  };

  const canSubmit =
    name.trim().length > 0 &&
    slug.length >= 3 &&
    slugStatus === "available" &&
    !isCreating;

  const handleCreate = async () => {
    setIsCreating(true);
    const res = await authClient.organization.create({
      name: name.trim(),
      slug,
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

  return (
    <>
      <Button
        className="gap-2"
        onClick={() => {
          reset();
          setOpen(true);
        }}
      >
        <Plus className="size-4" />
        New organization
      </Button>

      <DialogRoot
        open={open}
        onOpenChange={({ open: next }) => {
          if (isCreating) return;
          setOpen(next);
          if (!next) reset();
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="w-full max-w-md p-6">
            <DialogTitle>Create an organization</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              A shared workspace for your team's access and billing. You'll be
              its owner.
            </DialogDescription>

            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (canSubmit) handleCreate();
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="org-name">Name</Label>
                <Input
                  id="org-name"
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Acme Inc."
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="org-slug">Handle</Label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground text-sm">
                    @
                  </span>
                  <Input
                    id="org-slug"
                    value={slug}
                    onChange={(event) => handleSlugChange(event.target.value)}
                    placeholder="acme"
                    className="pr-9 pl-7"
                    required
                  />
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    {slugStatus === "checking" && (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    )}
                    {slugStatus === "available" && (
                      <Check className="size-4 text-green-500" />
                    )}
                    {(slugStatus === "taken" || slugStatus === "invalid") && (
                      <X className="size-4 text-destructive" />
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">
                  {slugStatus === "taken"
                    ? "That handle is already taken."
                    : slugStatus === "invalid"
                      ? "Use lowercase letters, numbers, and hyphens only."
                      : "This is your workspace's handle across every product."}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isCreating}
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!canSubmit}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  );
};

/**
 * Management view for a single organization: members with role changes and
 * removal, an invite form, pending invitations, and a danger zone (delete for
 * owners, leave for everyone else). Personal organizations show a short note
 * instead, since they have no other members.
 */
const OrganizationDetail = ({
  organization,
  currentEmail,
  onBack,
  onLeftOrDeleted,
}: {
  organization: AccountOrganization;
  currentEmail: string;
  onBack: () => void;
  onLeftOrDeleted: () => void;
}) => {
  const { authClient, toaster } = useAccountContext();

  const [full, setFull] = useState<AccountFullOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AccountOrgRole>("member");
  const [isInviting, setIsInviting] = useState(false);
  const [pending, setPending] = useState<PendingAction>(null);
  const [isActionPending, setIsActionPending] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authClient.organization.getFullOrganization({
        query: { organizationSlug: organization.slug },
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
  const invitations = (full?.invitations ?? []).filter(
    (invitation) => invitation.status === "pending",
  );
  const ownerCount = members.filter((member) => member.role === "owner").length;

  const currentMember = members.find(
    (member) => member.user.email.toLowerCase() === currentEmail.toLowerCase(),
  );
  const isOwner = currentMember?.role === "owner";
  const canManage = isOwner || currentMember?.role === "admin";
  const isSoleOwner = isOwner && ownerCount === 1;

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    const res = await authClient.organization.inviteMember({
      email: inviteEmail.trim(),
      role: inviteRole,
      organizationId: organization.id,
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

  const handleRoleChange = async (memberId: string, role: AccountOrgRole) => {
    const res = await authClient.organization.updateMemberRole({
      organizationId: organization.id,
      memberId,
      role,
    });
    if (res?.error) {
      toaster.error({
        title: errorMessage(res.error, "Couldn't update the role"),
      });
      return;
    }
    toaster.success({ title: "Role updated" });
    load();
  };

  const runPending = async () => {
    if (!pending) return;
    setIsActionPending(true);

    if (pending.kind === "remove") {
      const res = await authClient.organization.removeMember({
        organizationId: organization.id,
        memberIdOrEmail: pending.memberIdOrEmail,
      });
      setIsActionPending(false);
      setPending(null);
      if (res?.error) {
        toaster.error({
          title: errorMessage(res.error, "Couldn't remove the member"),
        });
        return;
      }
      toaster.success({ title: "Member removed" });
      load();
      return;
    }

    if (pending.kind === "cancel") {
      const res = await authClient.organization.cancelInvitation({
        invitationId: pending.invitationId,
      });
      setIsActionPending(false);
      setPending(null);
      if (res?.error) {
        toaster.error({
          title: errorMessage(res.error, "Couldn't cancel the invitation"),
        });
        return;
      }
      toaster.success({ title: "Invitation canceled" });
      load();
      return;
    }

    if (pending.kind === "delete") {
      const res = await authClient.organization.delete({
        organizationId: organization.id,
      });
      setIsActionPending(false);
      setPending(null);
      if (res?.error) {
        toaster.error({
          title: errorMessage(res.error, "Couldn't delete the organization"),
        });
        return;
      }
      toaster.success({ title: "Organization deleted" });
      onLeftOrDeleted();
      return;
    }

    // leave
    const res = await authClient.organization.leave({
      organizationId: organization.id,
    });
    setIsActionPending(false);
    setPending(null);
    if (res?.error) {
      toaster.error({
        title: errorMessage(res.error, "Couldn't leave the organization"),
      });
      return;
    }
    toaster.success({ title: "You left the organization" });
    onLeftOrDeleted();
  };

  const isPersonal = organization.type === "personal";

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit gap-1.5 px-2 text-muted-foreground"
        onClick={onBack}
      >
        <ArrowLeft className="size-4" />
        All organizations
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg">{organization.name}</h3>
          <p className="text-muted-foreground text-sm">@{organization.slug}</p>
        </div>
        {currentMember && (
          <Badge variant="outline" className="capitalize">
            {currentMember.role}
          </Badge>
        )}
      </div>

      {isPersonal ? (
        <p className="rounded-lg border p-5 text-muted-foreground text-sm">
          This is your personal workspace. It is just you, so there are no
          members to manage.
        </p>
      ) : (
        <>
          {canManage && (
            <div className="space-y-3 rounded-lg border p-5">
              <div>
                <h4 className="font-medium text-sm">Invite a member</h4>
                <p className="text-muted-foreground text-sm">
                  They will get an email to join this organization.
                </p>
              </div>
              <form
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleInvite();
                }}
              >
                <Input
                  type="email"
                  required
                  placeholder="teammate@example.com"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  className="flex-1"
                />
                <RoleSelect
                  value={inviteRole}
                  onValueChange={setInviteRole}
                  size="md"
                />
                <Button
                  type="submit"
                  disabled={!inviteEmail.trim() || isInviting}
                  className="gap-2"
                >
                  <UserPlus className="size-4" />
                  {isInviting ? "Sending..." : "Invite"}
                </Button>
              </form>
            </div>
          )}

          <div className="space-y-2 rounded-lg border p-5">
            <h4 className="font-medium text-sm">Members</h4>
            {isLoading ? (
              <p className="py-4 text-center text-muted-foreground text-sm">
                Loading members...
              </p>
            ) : members.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground text-sm">
                No members yet.
              </p>
            ) : (
              members.map((member) => {
                const isLastOwner = member.role === "owner" && ownerCount === 1;

                return (
                  <div
                    key={member.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <AvatarRoot className="size-9 shrink-0">
                        <AvatarImage src={member.user.image ?? undefined} />
                        <AvatarFallback>
                          {(member.user.name ?? member.user.email).charAt(0)}
                        </AvatarFallback>
                      </AvatarRoot>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-sm">
                          {member.user.name ?? member.user.email}
                        </div>
                        <div className="truncate text-muted-foreground text-xs">
                          {member.user.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {canManage ? (
                        <RoleSelect
                          value={member.role as AccountOrgRole}
                          disabled={isLastOwner}
                          onValueChange={(role) =>
                            handleRoleChange(member.id, role)
                          }
                        />
                      ) : (
                        <Badge variant="outline" className="capitalize">
                          {member.role}
                        </Badge>
                      )}

                      {canManage && !isLastOwner && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            setPending({
                              kind: "remove",
                              memberIdOrEmail: member.user.email,
                              label: member.user.name ?? member.user.email,
                            })
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {canManage && invitations.length > 0 && (
            <div className="space-y-2 rounded-lg border p-5">
              <h4 className="font-medium text-sm">Pending invitations</h4>
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-sm">
                        {invitation.email}
                      </div>
                      <div className="text-muted-foreground text-xs capitalize">
                        {invitation.role}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() =>
                      setPending({
                        kind: "cancel",
                        invitationId: invitation.id,
                        label: invitation.email,
                      })
                    }
                  >
                    Cancel
                  </Button>
                </div>
              ))}
            </div>
          )}

          {canManage && (
            <AccountOrganizationTeams
              organizationId={organization.id}
              members={members}
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-5">
            {isOwner ? (
              <>
                <div className="min-w-0">
                  <div className="font-medium text-sm">
                    Delete this organization
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Removes it for every member. This cannot be undone.
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setPending({ kind: "delete" })}
                >
                  Delete organization
                </Button>
              </>
            ) : (
              <>
                <div className="min-w-0">
                  <div className="font-medium text-sm">
                    Leave this organization
                  </div>
                  <div className="text-muted-foreground text-sm">
                    You'll lose access to it.
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setPending({ kind: "leave" })}
                >
                  Leave organization
                </Button>
              </>
            )}
          </div>

          {isOwner && !isSoleOwner && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-5">
              <div className="min-w-0">
                <div className="font-medium text-sm">
                  Leave this organization
                </div>
                <div className="text-muted-foreground text-sm">
                  Step down as owner. Another owner keeps managing it.
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setPending({ kind: "leave" })}
              >
                Leave
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
        title={
          pending?.kind === "remove"
            ? `Remove ${pending.label}?`
            : pending?.kind === "cancel"
              ? `Cancel invitation for ${pending.label}?`
              : pending?.kind === "delete"
                ? `Delete ${organization.name}?`
                : pending?.kind === "leave"
                  ? `Leave ${organization.name}?`
                  : ""
        }
        description={
          pending?.kind === "remove"
            ? "They will lose access to this organization. This cannot be undone."
            : pending?.kind === "cancel"
              ? "The invitation link will stop working. You can invite them again later."
              : pending?.kind === "delete"
                ? "Every member loses access to this organization. This cannot be undone."
                : "You will lose access to this organization. An owner can invite you back later."
        }
        confirmLabel={
          pending?.kind === "remove"
            ? "Remove"
            : pending?.kind === "cancel"
              ? "Cancel invitation"
              : pending?.kind === "delete"
                ? "Delete organization"
                : "Leave organization"
        }
        cancelLabel="Keep"
        isPending={isActionPending}
        onConfirm={runPending}
      />
    </div>
  );
};

/**
 * Organization management for the account console: lists the organizations the
 * user belongs to, creates new ones, and drills into each for member, role, and
 * invitation management plus delete/leave. Reads and mutates entirely through
 * the injected auth client, so the same block renders in an identity server's
 * dashboard and in a relying-party account app. Fill `AccountConsole`'s
 * `organizationsSection` slot with it, or render it standalone.
 */
const AccountOrganizations = () => {
  const { authClient } = useAccountContext();

  const { data: session } = authClient.useSession();
  const [organizations, setOrganizations] = useState<AccountOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

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

  if (selected && session?.user) {
    return (
      <OrganizationDetail
        organization={selected}
        currentEmail={session.user.email}
        onBack={() => setSelectedSlug(null)}
        onLeftOrDeleted={() => {
          setSelectedSlug(null);
          load();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg">Organizations</h3>
          <p className="text-muted-foreground text-sm">
            Workspaces you belong to.
          </p>
        </div>
        <CreateOrganizationDialog onCreated={load} />
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : organizations.length ? (
          organizations.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => setSelectedSlug(org.slug)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <AvatarRoot className="size-9 shrink-0 rounded-md">
                  <AvatarFallback className="rounded-md">
                    {org.name.charAt(0)}
                  </AvatarFallback>
                </AvatarRoot>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium text-sm">
                      {org.name}
                    </span>
                    <Badge variant="outline">
                      {org.type === "personal" ? "Personal" : "Team"}
                    </Badge>
                  </div>
                  <div className="truncate text-muted-foreground text-xs">
                    @{org.slug}
                  </div>
                </div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm">
            You don't belong to any organizations yet.
          </div>
        )}
      </div>
    </div>
  );
};

export { AccountOrganizations };
