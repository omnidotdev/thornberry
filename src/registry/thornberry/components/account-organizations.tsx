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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  DialogPortal,
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
  AccountOrgMember,
  AccountOrgRole,
  AccountOrganization,
} from "@/registry/thornberry/components/account-provider";

const memberDisplayName = (member: AccountOrgMember): string =>
  member.user.name ?? member.user.email;

const ROLES: AccountOrgRole[] = ["owner", "admin", "member"];

/**
 * Roles the acting user may assign. Only an owner can grant the `owner` role;
 * an admin is limited to `admin`/`member`. This mirrors Gatekeeper's
 * server-side guard (Better Auth forbids a non-`creatorRole` member from
 * assigning or modifying the owner role), so the picker never offers an option
 * the server would reject.
 */
const assignableRoles = (isOwner: boolean): AccountOrgRole[] =>
  isOwner ? ROLES : ROLES.filter((role) => role !== "owner");

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
 * Styled organization-role picker. `roles` is the set of options the acting
 * user may assign (see `assignableRoles`); it defaults to all roles.
 */
const RoleSelect = ({
  value,
  onValueChange,
  disabled,
  size = "sm",
  roles = ROLES,
}: {
  value: AccountOrgRole;
  onValueChange: (role: AccountOrgRole) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  roles?: AccountOrgRole[];
}) => {
  const collection = useMemo(
    () =>
      createListCollection({
        items: roles.map((role) => ({ label: role, value: role })),
      }),
    [roles],
  );

  return (
    <Select
      collection={collection}
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
            {collection.items.map((item) => (
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
};

type PendingAction =
  | { kind: "remove"; memberIdOrEmail: string; label: string }
  | { kind: "cancel"; invitationId: string; label: string }
  | { kind: "delete" }
  | { kind: "leave" }
  | null;

type MemberSort = "name-asc" | "name-desc" | "role";

/** Owner first, then admin, then member, for the "Role" sort */
const ROLE_RANK: Record<string, number> = { owner: 0, admin: 1, member: 2 };

const roleFilterCollection = createListCollection({
  items: [
    { label: "All roles", value: "all" },
    { label: "Owner", value: "owner" },
    { label: "Admin", value: "admin" },
    { label: "Member", value: "member" },
  ],
});

const memberSortCollection = createListCollection({
  items: [
    { label: "Name (A-Z)", value: "name-asc" },
    { label: "Name (Z-A)", value: "name-desc" },
    { label: "Role", value: "role" },
  ],
});

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
        <DialogPortal>
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
        </DialogPortal>
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
/**
 * Edit an organization's name, handle, and description (owner/admin). The handle
 * is checked for availability only when it changes; an unchanged handle stays
 * valid. Description is left blank on open and only sent when filled, so saving
 * never clears an existing description the dialog didn't load.
 */
const EditOrganizationDialog = ({
  organization,
  open,
  onOpenChange,
  onUpdated,
}: {
  organization: AccountOrganization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}) => {
  const { authClient, toaster, orgLogo } = useAccountContext();

  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);
  const [description, setDescription] = useState("");
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(organization.name);
      setSlug(organization.slug);
      setDescription("");
      setSlugStatus("idle");
      setLogoPreview(null);
    }
  }, [open, organization.name, organization.slug]);

  const handleLogoSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !orgLogo) return;

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
      if (typeof url === "string") setLogoPreview(url);
      toaster.success({ title: "Logo updated" });
      onUpdated();
    } catch (error) {
      toaster.error({ title: errorMessage(error, "Couldn't upload the logo") });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const slugChanged = slug !== organization.slug;

  const checkSlug = (value: string) => {
    setSlugStatus("idle");
    if (slugTimer.current) clearTimeout(slugTimer.current);
    if (value === organization.slug) return;
    if (value.length < 3) return;
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

  const handleSlugChange = (value: string) => {
    const normalized = value.toLowerCase();
    setSlug(normalized);
    checkSlug(normalized);
  };

  const canSave =
    name.trim().length > 0 &&
    slug.length >= 3 &&
    (!slugChanged || slugStatus === "available") &&
    !isSaving;

  const handleSave = async () => {
    setIsSaving(true);
    const data: { name?: string; slug?: string; description?: string } = {};
    if (name.trim() !== organization.name) data.name = name.trim();
    if (slugChanged) data.slug = slug;
    if (description.trim()) data.description = description.trim();

    const res = await authClient.organization.update({
      data,
      organizationId: organization.id,
    });
    setIsSaving(false);

    if (res?.error) {
      toaster.error({
        title: errorMessage(res.error, "Couldn't save changes"),
      });
      return;
    }
    toaster.success({ title: "Organization updated" });
    onOpenChange(false);
    onUpdated();
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={({ open: next }) => {
        if (isSaving) return;
        onOpenChange(next);
      }}
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="w-full max-w-md p-6">
            <DialogTitle>Edit organization</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Update your organization's name, handle, or description.
            </DialogDescription>
            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (canSave) handleSave();
              }}
            >
              {orgLogo?.uploadEnabled && (
                <div className="flex items-center gap-4">
                  <AvatarRoot className="size-14 shrink-0 rounded-md">
                    <AvatarImage
                      src={logoPreview ?? organization.logo ?? undefined}
                    />
                    <AvatarFallback className="rounded-md">
                      {organization.name.charAt(0)}
                    </AvatarFallback>
                  </AvatarRoot>
                  <div className="space-y-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploadingLogo}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {isUploadingLogo ? "Uploading..." : "Change logo"}
                    </Button>
                    <p className="text-muted-foreground text-xs">
                      PNG or JPG, up to 5 MB.
                    </p>
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleLogoSelect}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="edit-org-name">Name</Label>
                <Input
                  id="edit-org-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-org-slug">Handle</Label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground text-sm">
                    @
                  </span>
                  <Input
                    id="edit-org-slug"
                    value={slug}
                    onChange={(event) => handleSlugChange(event.target.value)}
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
                {slugChanged && (
                  <p className="text-muted-foreground text-xs">
                    {slugStatus === "taken"
                      ? "That handle is already taken."
                      : slugStatus === "invalid"
                        ? "Use lowercase letters, numbers, and hyphens only."
                        : "Changing the handle updates it everywhere this organization is used."}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-org-desc">Description</Label>
                <Input
                  id="edit-org-desc"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!canSave}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

const OrganizationDetail = ({
  organization,
  currentEmail,
  currentUserId,
  onBack,
  onLeftOrDeleted,
  onUpdated,
}: {
  organization: AccountOrganization;
  currentEmail: string;
  currentUserId?: string;
  onBack: () => void;
  onLeftOrDeleted: () => void;
  onUpdated: () => void;
}) => {
  const { authClient, toaster } = useAccountContext();

  const [editOpen, setEditOpen] = useState(false);

  const [full, setFull] = useState<AccountFullOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AccountOrgRole>("member");
  const [isInviting, setIsInviting] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);
  const [isActionPending, setIsActionPending] = useState(false);

  // Member table controls: free-text search, a role filter, and a sort. The
  // list defaults to alphabetical by name so it reads predictably regardless of
  // the order the backend returns
  const [memberSearch, setMemberSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | AccountOrgRole>("all");
  const [memberSort, setMemberSort] = useState<MemberSort>("name-asc");

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
  // Better Auth keeps an invite `status: "pending"` even after it expires (it
  // only rejects at accept time), so decide expiry from `expiresAt` here and
  // sort live invites above expired ones rather than presenting both as active
  const now = Date.now();
  const invitations = (full?.invitations ?? [])
    .filter((invitation) => invitation.status === "pending")
    .map((invitation) => ({
      ...invitation,
      isExpired: invitation.expiresAt
        ? new Date(invitation.expiresAt).getTime() < now
        : false,
    }))
    .sort((a, b) => Number(a.isExpired) - Number(b.isExpired));
  const ownerCount = members.filter((member) => member.role === "owner").length;

  const currentMember = members.find(
    (member) => member.user.email.toLowerCase() === currentEmail.toLowerCase(),
  );
  const isOwner = currentMember?.role === "owner";
  const canManage = isOwner || currentMember?.role === "admin";
  const isSoleOwner = isOwner && ownerCount === 1;

  const visibleMembers = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();
    return members
      .filter((member) => roleFilter === "all" || member.role === roleFilter)
      .filter((member) => {
        if (!query) return true;
        return (
          (member.user.name ?? "").toLowerCase().includes(query) ||
          member.user.email.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (memberSort === "role") {
          const rank = (ROLE_RANK[a.role] ?? 99) - (ROLE_RANK[b.role] ?? 99);
          if (rank !== 0) return rank;
        }
        const compared = memberDisplayName(a).localeCompare(
          memberDisplayName(b),
          undefined,
          { sensitivity: "base" },
        );
        return memberSort === "name-desc" ? -compared : compared;
      });
  }, [members, memberSearch, roleFilter, memberSort]);

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

  // Reissue an expired invite by re-inviting the same email and role. A fresh
  // invitation (new expiry, new email) is created; Gatekeeper's
  // `cancelPendingInvitationsOnReInvite` supersedes the stale row server-side,
  // so no separate cleanup is needed
  const handleResend = async (invitation: {
    id: string;
    email: string;
    role: string;
  }) => {
    setResendingId(invitation.id);
    const res = await authClient.organization.inviteMember({
      email: invitation.email,
      role: (invitation.role as AccountOrgRole) ?? "member",
      organizationId: organization.id,
    });
    setResendingId(null);

    if (res?.error) {
      toaster.error({
        title: errorMessage(res.error, "Couldn't resend the invitation"),
      });
      return;
    }
    toaster.success({ title: `Invitation resent to ${invitation.email}` });
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
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-lg">{organization.name}</h3>
            {currentMember && (
              <Badge variant="outline" className="capitalize">
                {currentMember.role}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">@{organization.slug}</p>
        </div>
        {canManage && organization.type !== "personal" && (
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        )}
      </div>

      <EditOrganizationDialog
        organization={organization}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={onUpdated}
      />

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
                  roles={assignableRoles(isOwner)}
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

          <div className="space-y-3 rounded-lg border p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-medium text-sm">Members</h4>
                <p className="text-muted-foreground text-sm">
                  People with access to this organization.
                </p>
              </div>
              {members.length > 1 && (
                <span className="text-muted-foreground text-xs">
                  {visibleMembers.length} of {members.length}
                </span>
              )}
            </div>

            {members.length > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  type="search"
                  placeholder="Search by name or email"
                  value={memberSearch}
                  onChange={(event) => setMemberSearch(event.target.value)}
                  className="flex-1"
                />
                <Select
                  collection={roleFilterCollection}
                  value={[roleFilter]}
                  onValueChange={(details) =>
                    setRoleFilter(
                      (details.value[0] as "all" | AccountOrgRole) ?? "all",
                    )
                  }
                  positioning={{ strategy: "fixed", placement: "bottom-end" }}
                >
                  <SelectControl>
                    <SelectTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="min-w-32 justify-between gap-2"
                      >
                        <SelectValueText placeholder="Role" />
                        <SelectIndicator>
                          <ChevronsUpDown className="size-3.5 shrink-0 opacity-60" />
                        </SelectIndicator>
                      </Button>
                    </SelectTrigger>
                  </SelectControl>
                  <SelectPositioner>
                    <SelectContent className="min-w-[9rem] p-1">
                      <SelectItemGroup className="space-y-0.5">
                        {roleFilterCollection.items.map((item) => (
                          <SelectItem key={item.value} item={item}>
                            <SelectItemText>{item.label}</SelectItemText>
                            <SelectItemIndicator />
                          </SelectItem>
                        ))}
                      </SelectItemGroup>
                    </SelectContent>
                  </SelectPositioner>
                </Select>
                <Select
                  collection={memberSortCollection}
                  value={[memberSort]}
                  onValueChange={(details) =>
                    setMemberSort(
                      (details.value[0] as MemberSort) ?? "name-asc",
                    )
                  }
                  positioning={{ strategy: "fixed", placement: "bottom-end" }}
                >
                  <SelectControl>
                    <SelectTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="min-w-36 justify-between gap-2"
                      >
                        <SelectValueText placeholder="Sort" />
                        <SelectIndicator>
                          <ChevronsUpDown className="size-3.5 shrink-0 opacity-60" />
                        </SelectIndicator>
                      </Button>
                    </SelectTrigger>
                  </SelectControl>
                  <SelectPositioner>
                    <SelectContent className="min-w-[10rem] p-1">
                      <SelectItemGroup className="space-y-0.5">
                        {memberSortCollection.items.map((item) => (
                          <SelectItem key={item.value} item={item}>
                            <SelectItemText>{item.label}</SelectItemText>
                            <SelectItemIndicator />
                          </SelectItem>
                        ))}
                      </SelectItemGroup>
                    </SelectContent>
                  </SelectPositioner>
                </Select>
              </div>
            )}

            {isLoading ? (
              <p className="py-4 text-center text-muted-foreground text-sm">
                Loading members...
              </p>
            ) : members.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground text-sm">
                No members yet.
              </p>
            ) : visibleMembers.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground text-sm">
                No members match your search.
              </p>
            ) : (
              visibleMembers.map((member) => {
                const isLastOwner = member.role === "owner" && ownerCount === 1;
                // Only owners may change or remove another owner. This mirrors
                // Gatekeeper's server-side guard (Better Auth forbids a
                // non-`creatorRole` member from updating or removing an owner),
                // so an admin sees an owner's role read-only rather than an
                // editable control that would fail on submit
                const canManageMember =
                  canManage && (isOwner || member.role !== "owner");

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
                          {memberDisplayName(member)}
                          {member.user.email.toLowerCase() ===
                            currentEmail.toLowerCase() && (
                            <span className="ml-1.5 font-normal text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </div>
                        <div className="truncate text-muted-foreground text-xs">
                          {member.user.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {canManageMember ? (
                        <RoleSelect
                          value={member.role as AccountOrgRole}
                          disabled={isLastOwner}
                          roles={assignableRoles(isOwner)}
                          onValueChange={(role) =>
                            handleRoleChange(member.id, role)
                          }
                        />
                      ) : (
                        <Badge variant="soft" className="capitalize">
                          {member.role}
                        </Badge>
                      )}

                      {canManageMember && !isLastOwner && (
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
                      <div className="flex items-center gap-2">
                        <div className="truncate font-medium text-sm">
                          {invitation.email}
                        </div>
                        {invitation.isExpired && (
                          <Badge variant="warning">Expired</Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground text-xs capitalize">
                        {invitation.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {invitation.isExpired && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={resendingId === invitation.id}
                        onClick={() => handleResend(invitation)}
                      >
                        {resendingId === invitation.id
                          ? "Resending..."
                          : "Resend"}
                      </Button>
                    )}
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
                      {invitation.isExpired ? "Remove" : "Cancel"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {canManage && (
            <AccountOrganizationTeams
              organizationId={organization.id}
              members={members}
              currentUserId={currentUserId}
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
                  variant="outline"
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
        confirmationText={
          pending?.kind === "delete" ? organization.name : undefined
        }
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
const AccountOrganizations = ({
  selectedSlug: controlledSlug,
  onSelectOrganization,
}: {
  /**
   * The org slug currently drilled into. Provide together with
   * `onSelectOrganization` to make list/detail navigation controlled, so a host
   * can reflect it in the URL; omit both for internal (uncontrolled) state.
   */
  selectedSlug?: string | null;
  onSelectOrganization?: (slug: string | null) => void;
} = {}) => {
  const { authClient } = useAccountContext();

  const { data: session } = authClient.useSession();
  const [organizations, setOrganizations] = useState<AccountOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [internalSlug, setInternalSlug] = useState<string | null>(null);

  // Controlled when the host drives selection (to sync the URL); otherwise the
  // block keeps its own state
  const isControlled = onSelectOrganization !== undefined;
  const selectedSlug = isControlled ? (controlledSlug ?? null) : internalSlug;
  const setSelectedSlug = (slug: string | null) => {
    if (isControlled) onSelectOrganization(slug);
    else setInternalSlug(slug);
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

  // Present the list alphabetically by name (case-insensitive), independent of
  // the order the backend returns
  const sortedOrganizations = [...organizations].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );

  if (selected && session?.user) {
    return (
      <OrganizationDetail
        organization={selected}
        currentEmail={session.user.email}
        currentUserId={session.user.id}
        onBack={() => setSelectedSlug(null)}
        onLeftOrDeleted={() => {
          setSelectedSlug(null);
          load();
        }}
        onUpdated={() => {
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
            Your personal workspace and the organizations you belong to.
          </p>
        </div>
        <CreateOrganizationDialog onCreated={load} />
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : sortedOrganizations.length ? (
          sortedOrganizations.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => setSelectedSlug(org.slug)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <AvatarRoot className="size-9 shrink-0 rounded-md">
                  <AvatarImage src={org.logo ?? undefined} />
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
                      {org.type === "personal" ? "Personal" : "Organization"}
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
