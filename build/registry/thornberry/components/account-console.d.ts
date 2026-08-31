import type { ReactNode } from "react";
import type { PasswordRequirement } from "../../../registry/thornberry/components/account-password-requirements";
import type { AccountActiveSession } from "../../../registry/thornberry/components/account-provider";
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
    checkUsernameAvailability?: (username: string) => Promise<{
        available: boolean;
    }>;
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
declare const AccountConsole: ({ avatar, passwordRequirements, checkUsernameAvailability, onProfileUpdated, activeSessions, enableActiveSessions, onSessionRevoked, onResendVerification, onStopImpersonating, badges, socialSection, organizationsSection, footer, }: AccountConsoleProps) => import("react/jsx-runtime").JSX.Element | null;
export { AccountConsole };
export type { AccountConsoleProps };
