import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";

import { AddPasskey } from "@/registry/thornberry/components/account-add-passkey";
import { PasswordRequirements } from "@/registry/thornberry/components/account-password-requirements";
import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import { UserActiveSessions } from "@/registry/thornberry/components/account-user-active-sessions";
import { UserTwoFactorAuthentication } from "@/registry/thornberry/components/account-user-two-factor-authentication";
import { ViewPasskeys } from "@/registry/thornberry/components/account-view-passkeys";
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
import type { PasswordRequirement } from "@/registry/thornberry/components/account-password-requirements";
import type { AccountActiveSession } from "@/registry/thornberry/components/account-provider";

/** A signed-in session as the auth backend reports it, before formatting */
interface AccountSessionRecord {
  id: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  /** Last activity, as an ISO string or Date */
  updatedAt?: string | Date | null;
}

interface AccountSecuritySettingsProps {
  /**
   * Host-owned password policy: given a candidate password, returns the rule
   * checklist, which renders live and must be fully met to submit. Omitted, only
   * `minPasswordLength` is enforced. The server stays the source of truth
   */
  passwordRequirements?: (password: string) => PasswordRequirement[];
  /** Minimum new-password length when no `passwordRequirements` is given */
  minPasswordLength?: number;
  /** The user's sessions; the block formats each into a device label */
  sessions?: AccountSessionRecord[];
  /**
   * Rendered in place of the sessions list (e.g. when the host can only show
   * sessions shortly after sign-in)
   */
  sessionsNotice?: ReactNode;
  /** Called after a session is revoked (host refreshes its session list) */
  onSessionRevoked?: () => void;
}

const DEFAULT_MIN_PASSWORD_LENGTH = 12;

/** Coarse, dependency-free user-agent summary for the sessions list */
const summarizeUserAgent = (
  userAgent: string,
): { deviceType: string; label: string } => {
  const os = /Windows/i.test(userAgent)
    ? "Windows"
    : /Mac OS/i.test(userAgent)
      ? "macOS"
      : /Android/i.test(userAgent)
        ? "Android"
        : /iPhone|iPad|iOS/i.test(userAgent)
          ? "iOS"
          : /Linux/i.test(userAgent)
            ? "Linux"
            : "Unknown";

  const browser = /Edg\//i.test(userAgent)
    ? "Edge"
    : /Chrome/i.test(userAgent)
      ? "Chrome"
      : /Firefox/i.test(userAgent)
        ? "Firefox"
        : /Safari/i.test(userAgent)
          ? "Safari"
          : "Browser";

  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);

  return {
    deviceType: isMobile ? "mobile" : "desktop",
    label: `${os} (${browser})`,
  };
};

/**
 * Format raw sessions into the active-sessions list. Sessions without a user
 * agent (server-to-server or token-bridged sessions) are skipped, since they
 * are not a device a person can recognize. Distinguishing detail is folded into
 * the label so near-identical rows can still be told apart
 */
const formatActiveSessions = (
  sessions: AccountSessionRecord[],
  currentSessionId: string | undefined,
): AccountActiveSession[] =>
  sessions
    .filter((session) => session.userAgent)
    .map((session) => {
      const { deviceType, label } = summarizeUserAgent(session.userAgent ?? "");
      const details = [
        session.id === currentSessionId ? "This device" : null,
        session.ipAddress,
        session.updatedAt
          ? `active ${new Date(session.updatedAt).toLocaleDateString(
              undefined,
              { month: "short", day: "numeric" },
            )}`
          : null,
      ].filter((detail): detail is string => Boolean(detail));

      return {
        id: session.id,
        token: session.token,
        deviceType,
        label: details.length ? `${label} · ${details.join(" · ")}` : label,
      };
    });

const labelClassName = "font-medium text-muted-foreground text-sm";

const ChangePasswordCard = ({
  passwordRequirements,
  minPasswordLength = DEFAULT_MIN_PASSWORD_LENGTH,
}: Pick<
  AccountSecuritySettingsProps,
  "passwordRequirements" | "minPasswordLength"
>) => {
  const { authClient, toaster } = useAccountContext();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const requirements = passwordRequirements?.(newPassword);
  const meetsPolicy = requirements
    ? requirements.every((rule) => rule.met)
    : newPassword.length >= minPasswordLength;
  const passwordsMatch = newPassword === confirmPassword;
  const isValid = currentPassword.length > 0 && meetsPolicy && passwordsMatch;

  const handleChangePassword = async () => {
    if (!isValid) return;

    setIsSaving(true);

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      if (result.error) throw new Error(result.error.message);

      toaster.success({ title: "Password updated" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toaster.error({
        title:
          error instanceof Error && error.message
            ? error.message
            : "Failed to change password",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Enter in any password field submits, matching native form behavior
  const submitOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValid && !isSaving) {
      e.preventDefault();
      handleChangePassword();
    }
  };

  return (
    <CardRoot className="overflow-hidden">
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Change your account password</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="account-security-current-password"
            className={labelClassName}
          >
            Current password
          </label>
          <Input
            id="account-security-current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            onKeyDown={submitOnEnter}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="account-security-new-password"
            className={labelClassName}
          >
            New password
          </label>
          <Input
            id="account-security-new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={submitOnEnter}
          />
          {requirements
            ? newPassword.length > 0 && (
                <PasswordRequirements requirements={requirements} />
              )
            : newPassword.length > 0 &&
              !meetsPolicy && (
                <p className="text-destructive text-xs">
                  Must be at least {minPasswordLength} characters
                </p>
              )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="account-security-confirm-password"
            className={labelClassName}
          >
            Confirm new password
          </label>
          <Input
            id="account-security-confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={submitOnEnter}
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-destructive text-xs">Passwords do not match</p>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleChangePassword}
          disabled={isSaving || !isValid}
          size="sm"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
          Change password
        </Button>
      </CardFooter>
    </CardRoot>
  );
};

/**
 * Security settings: password, two-factor authentication (with backup codes),
 * passkeys, and active sessions, driven by the injected client. The host only
 * supplies its password policy and session list, so the same page renders in
 * an identity server and in a relying-party account app.
 */
const AccountSecuritySettings = ({
  passwordRequirements,
  minPasswordLength,
  sessions = [],
  sessionsNotice,
  onSessionRevoked,
}: AccountSecuritySettingsProps) => {
  const { authClient } = useAccountContext();
  const { data: session } = authClient.useSession();

  const activeSessions = formatActiveSessions(sessions, session?.session.id);

  return (
    <div className="space-y-6">
      <ChangePasswordCard
        passwordRequirements={passwordRequirements}
        minPasswordLength={minPasswordLength}
      />

      <CardRoot className="overflow-hidden">
        <CardContent className="flex flex-col gap-3 p-4">
          <UserTwoFactorAuthentication />
        </CardContent>
      </CardRoot>

      <CardRoot className="overflow-hidden">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <KeyRound className="text-muted-foreground size-5" />
            <span className="font-semibold">Passkeys</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Sign in without a password using a passkey stored on your device.
          </p>
          <div className="flex flex-wrap gap-2">
            <AddPasskey />
            <ViewPasskeys />
          </div>
        </CardContent>
      </CardRoot>

      {/* Active sessions last: a review surface, not a primary action */}
      <CardRoot className="overflow-hidden">
        <CardContent className="flex flex-col gap-3 p-4">
          {sessionsNotice ?? (
            <UserActiveSessions
              activeSessions={activeSessions}
              onSessionRevoked={onSessionRevoked}
            />
          )}
        </CardContent>
      </CardRoot>
    </div>
  );
};

export type { AccountSecuritySettingsProps, AccountSessionRecord };
export { AccountSecuritySettings, formatActiveSessions };
