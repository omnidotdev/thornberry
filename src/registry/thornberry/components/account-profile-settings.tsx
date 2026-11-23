import { Check, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AvatarUpload } from "@/registry/thornberry/components/account-avatar-upload";
import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import { Button } from "@/registry/thornberry/components/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/registry/thornberry/components/card";
import { Input } from "@/registry/thornberry/components/input";

import type { KeyboardEvent, ReactNode } from "react";
import type { AccountUser } from "@/registry/thornberry/components/account-provider";

type UsernameStatus = "idle" | "checking" | "available" | "taken";

interface AccountProfileSettingsProps {
  /** Avatar storage, forwarded to the AvatarUpload block */
  avatar?: {
    uploadEnabled?: boolean;
    onUpload?: (blob: Blob) => Promise<void>;
    onClear?: () => Promise<void>;
  };
  /**
   * Host handle-availability check. When omitted the username field is hidden,
   * since a handle cannot be claimed safely without one
   */
  checkUsernameAvailability?: (
    username: string,
  ) => Promise<{ available: boolean }>;
  /** Identity badges (role/team) rendered beside the name */
  badges?: ReactNode;
  /** Content rendered at the top of the email card (e.g. a confirm-email prompt) */
  emailNotice?: ReactNode;
  /** Where the email-change verification link returns the user */
  changeEmailCallbackURL?: string;
  /** Called after a profile or avatar change (host refreshes its own data) */
  onProfileUpdated?: () => void | Promise<void>;
}

/** Debounce before checking a typed username, so each keystroke is not a request */
const USERNAME_CHECK_DELAY_MS = 500;

const MIN_USERNAME_LENGTH = 3;

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

interface SettingsCardProps {
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
  className?: string;
}

const SettingsCard = ({
  title,
  description,
  footer,
  children,
  className,
}: SettingsCardProps) => (
  <CardRoot className="overflow-hidden">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className={className}>{children}</CardContent>
    <CardFooter>{footer}</CardFooter>
  </CardRoot>
);

const labelClassName = "font-medium text-muted-foreground text-sm";

/**
 * Profile settings: avatar, name, username, and email change. Reads the user
 * from the injected client's session and saves through `updateUser` and
 * `changeEmail`; storage-specific pieces (avatar upload, handle check) are host
 * callbacks, so the same page renders in an identity server and in a
 * relying-party account app.
 */
const AccountProfileSettings = (props: AccountProfileSettingsProps) => {
  const { authClient } = useAccountContext();
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) return null;

  // Keyed on the user so the form state reseeds if the account changes
  return <ProfileForms key={session.user.id} user={session.user} {...props} />;
};

const ProfileForms = ({
  user,
  avatar,
  checkUsernameAvailability,
  badges,
  emailNotice,
  changeEmailCallbackURL,
  onProfileUpdated,
}: AccountProfileSettingsProps & { user: AccountUser }) => {
  const { authClient, toaster, brand } = useAccountContext();
  const { refetch } = authClient.useSession();

  const [name, setName] = useState(user.name ?? "");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [isEmailSaving, setIsEmailSaving] = useState(false);

  const usernameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (usernameTimer.current) clearTimeout(usernameTimer.current);
    },
    [],
  );

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameStatus("idle");

    if (usernameTimer.current) clearTimeout(usernameTimer.current);

    if (!checkUsernameAvailability || value.length < MIN_USERNAME_LENGTH)
      return;

    setUsernameStatus("checking");
    usernameTimer.current = setTimeout(async () => {
      try {
        const result = await checkUsernameAvailability(value.toLowerCase());
        setUsernameStatus(result?.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, USERNAME_CHECK_DELAY_MS);
  };

  const refresh = async () => {
    await refetch();
    await onProfileUpdated?.();
  };

  const handleProfileSave = async () => {
    const updates: { name?: string; username?: string } = {};

    if (name && name !== user.name) updates.name = name;
    if (username && usernameStatus === "available")
      updates.username = username.toLowerCase();

    if (Object.keys(updates).length === 0) {
      toaster.info({ title: "No changes to save" });
      return;
    }

    setIsProfileSaving(true);

    try {
      const result = await authClient.updateUser(updates);
      if (result.error) throw new Error(result.error.message);

      toaster.success({ title: "Profile updated" });
      setUsername("");
      setUsernameStatus("idle");
      await refresh();
    } catch (error) {
      toaster.error({
        title: errorMessage(error, "Failed to update profile"),
      });
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail) return;

    setIsEmailSaving(true);

    try {
      const result = await authClient.changeEmail({
        newEmail,
        callbackURL: changeEmailCallbackURL,
      });
      if (result.error) throw new Error(result.error.message);

      toaster.success({
        title: "Verification email sent to your current email address",
      });
      setNewEmail("");
    } catch (error) {
      toaster.error({ title: errorMessage(error, "Failed to change email") });
    } finally {
      setIsEmailSaving(false);
    }
  };

  // Enter submits each card, matching native form behavior
  const onProfileKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isProfileSaving) {
      e.preventDefault();
      handleProfileSave();
    }
  };

  const onEmailKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newEmail && !isEmailSaving) {
      e.preventDefault();
      handleEmailChange();
    }
  };

  // Refresh after an avatar change too, so the host's header avatar follows.
  // Errors propagate so the avatar block surfaces them through its toaster
  const handleAvatarUpload = avatar?.onUpload
    ? async (blob: Blob) => {
        await avatar.onUpload?.(blob);
        await refresh();
      }
    : undefined;

  const handleAvatarClear = avatar?.onClear
    ? async () => {
        await avatar.onClear?.();
        await refresh();
      }
    : undefined;

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Profile"
        description="Your personal information"
        className="space-y-6"
        footer={
          <Button
            onClick={handleProfileSave}
            disabled={isProfileSaving}
            size="sm"
          >
            {isProfileSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            Save
          </Button>
        }
      >
        <div className="flex items-center gap-4">
          <AvatarUpload
            size="2xl"
            uploadEnabled={avatar?.uploadEnabled}
            onUpload={handleAvatarUpload}
            onClear={handleAvatarClear}
          />
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-lg font-semibold">
                {user.name || "Your account"}
              </span>
              {badges}
            </div>
            {user.email && (
              <p className="text-muted-foreground truncate text-sm">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="account-profile-name" className={labelClassName}>
            Name
          </label>
          <Input
            id="account-profile-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onProfileKeyDown}
          />
        </div>

        {checkUsernameAvailability && (
          <div className="space-y-1.5">
            <label
              htmlFor="account-profile-username"
              className={labelClassName}
            >
              Username
            </label>
            <div className="relative">
              <Input
                id="account-profile-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                onKeyDown={onProfileKeyDown}
                placeholder={
                  user.username ??
                  user.name?.toLowerCase().replace(/\s+/g, "") ??
                  ""
                }
                aria-describedby={
                  usernameStatus === "taken"
                    ? "account-profile-username-taken"
                    : undefined
                }
                className="pr-8"
              />
              {usernameStatus === "checking" && (
                <Loader2 className="text-muted-foreground absolute top-2.5 right-2.5 size-4 animate-spin" />
              )}
              {usernameStatus === "available" && (
                <Check className="absolute top-2.5 right-2.5 size-4 text-green-500" />
              )}
              {usernameStatus === "taken" && (
                <X className="text-destructive absolute top-2.5 right-2.5 size-4" />
              )}
            </div>
            {usernameStatus === "taken" && (
              <p
                id="account-profile-username-taken"
                className="text-destructive text-xs"
              >
                Username is taken
              </p>
            )}
          </div>
        )}
      </SettingsCard>

      <SettingsCard
        title="Email"
        description="Changing your email requires verification"
        className="space-y-4"
        footer={
          <Button
            onClick={handleEmailChange}
            disabled={isEmailSaving || !newEmail}
            size="sm"
          >
            {isEmailSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            Change email
          </Button>
        }
      >
        {emailNotice}

        <div className="space-y-1.5">
          <span className={labelClassName}>Current email</span>
          <p className="text-sm">{user.email}</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="account-profile-new-email" className={labelClassName}>
            New email
          </label>
          <Input
            id="account-profile-new-email"
            type="email"
            autoComplete="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={onEmailKeyDown}
            placeholder={brand.placeholderEmail ?? "new@example.com"}
          />
        </div>
      </SettingsCard>
    </div>
  );
};

export type { AccountProfileSettingsProps };
export { AccountProfileSettings };
