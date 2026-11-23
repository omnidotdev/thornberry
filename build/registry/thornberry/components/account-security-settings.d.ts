import type { ReactNode } from "react";
import type { PasswordRequirement } from "../../../registry/thornberry/components/account-password-requirements";
import type { AccountActiveSession } from "../../../registry/thornberry/components/account-provider";
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
/**
 * Format raw sessions into the active-sessions list. Sessions without a user
 * agent (server-to-server or token-bridged sessions) are skipped, since they
 * are not a device a person can recognize. Distinguishing detail is folded into
 * the label so near-identical rows can still be told apart
 */
declare const formatActiveSessions: (sessions: AccountSessionRecord[], currentSessionId: string | undefined) => AccountActiveSession[];
/**
 * Security settings: password, two-factor authentication (with backup codes),
 * passkeys, and active sessions, driven by the injected client. The host only
 * supplies its password policy and session list, so the same page renders in
 * an identity server and in a relying-party account app.
 */
declare const AccountSecuritySettings: ({ passwordRequirements, minPasswordLength, sessions, sessionsNotice, onSessionRevoked, }: AccountSecuritySettingsProps) => import("react/jsx-runtime").JSX.Element;
export type { AccountSecuritySettingsProps, AccountSessionRecord };
export { AccountSecuritySettings, formatActiveSessions };
