import { Monitor, Smartphone } from "lucide-react";
import { useState } from "react";

import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import { Button } from "@/registry/thornberry/components/button";
import { ConfirmDialog } from "@/registry/thornberry/components/confirm-dialog";

import type { AccountActiveSession } from "@/registry/thornberry/components/account-provider";

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
const UserActiveSessions = ({
  activeSessions,
  onSessionRevoked,
}: UserActiveSessionsProps) => {
  const { authClient, toaster } = useAccountContext();

  const { data: session } = authClient.useSession();
  const [sessionToRevoke, setSessionToRevoke] =
    useState<AccountActiveSession | null>(null);
  const [isTerminating, setIsTerminating] = useState(false);

  const isCurrent =
    sessionToRevoke != null && sessionToRevoke.id === session?.session.id;

  const handleRevoke = async () => {
    if (!sessionToRevoke) return;

    setIsTerminating(true);

    const res = await authClient.revokeSession({
      token: sessionToRevoke.token,
    });

    if (res.error) {
      toaster.error({
        title: res.error.message ?? "Failed to revoke session",
      });
    } else {
      toaster.success({ title: "Session terminated successfully" });
    }

    onSessionRevoked?.();
    setIsTerminating(false);
    setSessionToRevoke(null);
  };

  return (
    <>
      <h3 className="font-bold text-xl">Active Sessions</h3>

      {activeSessions.map((activeSession) => (
        <div key={activeSession.id} className="flex items-center gap-2">
          {activeSession.deviceType === "mobile" ? (
            <Smartphone className="size-4" />
          ) : (
            <Monitor className="size-4" />
          )}

          {activeSession.label ?? "Unknown device"}

          <Button
            variant="ghost"
            className="text-red-500 underline hover:text-red-600"
            onClick={() => setSessionToRevoke(activeSession)}
          >
            {activeSession.id === session?.session.id
              ? "Sign Out"
              : "Terminate"}
          </Button>
        </div>
      ))}

      <ConfirmDialog
        open={sessionToRevoke !== null}
        onOpenChange={(open) => {
          if (!open) setSessionToRevoke(null);
        }}
        title={isCurrent ? "Sign out this device?" : "Terminate this session?"}
        description={`${
          sessionToRevoke?.label ?? "This device"
        } will be signed out and will need to sign in again. This cannot be undone.`}
        confirmLabel={isCurrent ? "Sign Out" : "Terminate"}
        onConfirm={handleRevoke}
        isPending={isTerminating}
      />
    </>
  );
};

export { UserActiveSessions };
