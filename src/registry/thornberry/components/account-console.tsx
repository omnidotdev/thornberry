import { Loader2, StopCircle } from "lucide-react";
import { useState } from "react";

import { AddPasskey } from "@/registry/thornberry/components/account-add-passkey";
import { AvatarUpload } from "@/registry/thornberry/components/account-avatar-upload";
import { ChangePassword } from "@/registry/thornberry/components/account-change-password";
import { EditProfile } from "@/registry/thornberry/components/account-edit-profile";
import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import { UserActiveSessions } from "@/registry/thornberry/components/account-user-active-sessions";
import { UserTwoFactorAuthentication } from "@/registry/thornberry/components/account-user-two-factor-authentication";
import { ViewPasskeys } from "@/registry/thornberry/components/account-view-passkeys";
import {
  AlertDescription,
  AlertRoot,
  AlertTitle,
} from "@/registry/thornberry/components/alert";
import { Button } from "@/registry/thornberry/components/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardRoot,
} from "@/registry/thornberry/components/card";

import type { ReactNode } from "react";
import type { PasswordRequirement } from "@/registry/thornberry/components/account-password-requirements";
import type { AccountActiveSession } from "@/registry/thornberry/components/account-provider";

interface AccountConsoleProps {
  /** Avatar upload configuration forwarded to the AvatarUpload block */
  avatar?: {
    uploadEnabled?: boolean;
    onUpload?: (blob: Blob) => Promise<void>;
    onClear?: () => Promise<void>;
  };
  /** Host password policy, forwarded to ChangePassword */
  passwordRequirements?: (password: string) => PasswordRequirement[];
  /** Host handle-availability check, forwarded to EditProfile */
  checkUsernameAvailability?: (
    username: string,
  ) => Promise<{ available: boolean }>;
  /** Called after a profile update (host refreshes session/route data) */
  onProfileUpdated?: () => void;
  /** Active sessions to list (host pre-parses the user agent) */
  activeSessions?: AccountActiveSession[];
  /** Show the active-sessions section */
  enableActiveSessions?: boolean;
  /** Called after a session is revoked (host refreshes the list) */
  onSessionRevoked?: () => void;
  /** Resend the email-verification message; when provided, an unverified email shows a prompt */
  onResendVerification?: () => Promise<void>;
  /** Called after impersonation is stopped (host navigates away) */
  onStopImpersonating?: () => void;
  /** Identity badges (role/team), rendered beside the name. App-specific */
  badges?: ReactNode;
  /** App-specific social-connections section */
  socialSection?: ReactNode;
  /** Organizations/teams section */
  organizationsSection?: ReactNode;
  /** Footer content (support links, account-deletion help) */
  footer?: ReactNode;
}

/**
 * The account-management console: a composition of the account blocks (avatar,
 * profile, password, 2FA, passkeys, sessions) reading their host dependencies
 * from the AccountProvider. Product-specific surfaces (identity badges, the
 * social panel, the organizations section, and the footer) are slots the host
 * fills, so the same console renders in an identity server's dashboard and in a
 * relying-party account app.
 */
const AccountConsole = ({
  avatar,
  passwordRequirements,
  checkUsernameAvailability,
  onProfileUpdated,
  activeSessions = [],
  enableActiveSessions = false,
  onSessionRevoked,
  onResendVerification,
  onStopImpersonating,
  badges,
  socialSection,
  organizationsSection,
  footer,
}: AccountConsoleProps) => {
  const { authClient, toaster, brand } = useAccountContext();

  const { data: session, isPending } = authClient.useSession();

  const [isStopping, setIsStopping] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (isPending) return null;

  const user = session?.user;
  const showEmailPrompt =
    !!user && !user.emailVerified && !!user.email && !!onResendVerification;

  return (
    <CardRoot>
      <CardHeader>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Manage Your {brand.organizationName} Account
          </p>

          {session?.session.impersonatedBy && (
            <Button
              variant="outline"
              disabled={isStopping}
              onClick={async () => {
                setIsStopping(true);
                await authClient.admin.stopImpersonating();
                setIsStopping(false);
                toaster.info({ title: "Impersonation stopped successfully" });
                onStopImpersonating?.();
              }}
            >
              {isStopping ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <>
                  <StopCircle className="mr-2 size-4 text-red-500" />
                  Stop Impersonation
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <AvatarUpload
              size="lg"
              uploadEnabled={avatar?.uploadEnabled}
              onUpload={avatar?.onUpload}
              onClear={avatar?.onClear}
            />

            <div className="flex flex-col">
              <p className="font-bold">
                {user?.name}
                {user?.username ? ` (${user.username})` : ""}
              </p>
              <p>{user?.email}</p>
            </div>

            {badges && (
              <div className="flex flex-wrap items-center gap-2">{badges}</div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <ChangePassword passwordRequirements={passwordRequirements} />
            <EditProfile
              checkUsernameAvailability={checkUsernameAvailability}
              onProfileUpdated={onProfileUpdated}
            />
          </div>
        </div>

        <hr />

        {showEmailPrompt && (
          <AlertRoot variant="warning">
            <AlertTitle>Verify Your Email Address</AlertTitle>
            <AlertDescription>
              Please verify your email address. Check your inbox for the
              verification email. If you haven't received it, resend it below.
            </AlertDescription>
            <Button
              className="mt-2 w-fit"
              size="sm"
              variant="outline"
              disabled={isResending}
              onClick={async () => {
                setIsResending(true);
                try {
                  await onResendVerification?.();
                } finally {
                  setIsResending(false);
                }
              }}
            >
              {isResending ? "Sending..." : "Resend Verification Email"}
            </Button>
          </AlertRoot>
        )}

        {enableActiveSessions && (
          <UserActiveSessions
            activeSessions={activeSessions}
            onSessionRevoked={onSessionRevoked}
          />
        )}

        <UserTwoFactorAuthentication />

        <h3 className="font-bold text-xl">Passkeys</h3>

        <div className="flex items-center gap-2">
          <AddPasskey />
          <ViewPasskeys />
        </div>

        {socialSection && (
          <>
            <hr />
            {socialSection}
          </>
        )}

        {organizationsSection}
      </CardContent>

      {footer && <CardFooter>{footer}</CardFooter>}
    </CardRoot>
  );
};

export { AccountConsole };
export type { AccountConsoleProps };
