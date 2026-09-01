import type { AccountActiveSession } from "../../../registry/thornberry/components/account-provider";
interface UserActiveSessionsProps {
    /**
     * Sessions to list, with the user agent already parsed by the host into a
     * device type and label (see AccountActiveSession).
     */
    activeSessions: AccountActiveSession[];
    /**
     * Called after a session is revoked so the host can refresh its session list
     * (e.g. router.invalidate() or a query refetch). The block does not own the
     * list, so it cannot refresh it itself.
     */
    onSessionRevoked?: () => void;
}
/**
 * List the user's active sessions and let them revoke each (behind a
 * confirmation, since a revoke signs that device out). Reads the current
 * session from the injected client so the active one reads "Sign Out".
 */
declare const UserActiveSessions: ({ activeSessions, onSessionRevoked, }: UserActiveSessionsProps) => import("react/jsx-runtime").JSX.Element;
export { UserActiveSessions };
