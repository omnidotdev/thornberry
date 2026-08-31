import { Fingerprint, X } from "lucide-react";
import { useEffect, useState } from "react";

import { AddPasskey } from "@/registry/thornberry/components/account-add-passkey";
import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import { Button } from "@/registry/thornberry/components/button";
import { CardRoot } from "@/registry/thornberry/components/card";

const DISMISS_KEY = "passkey-nudge-dismissed";

/**
 * Post-login nudge prompting users without a passkey to enroll one for faster,
 * phishing-resistant sign-in. Dismissal persists per-browser in localStorage,
 * read after mount to stay SSR-safe.
 */
const PasskeyNudge = () => {
  const { authClient } = useAccountContext();

  const { data, isPending } = authClient.useListPasskeys();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === "true") {
        setDismissed(true);
      }
    } catch {
      // localStorage may be unavailable (private mode, blocked); treat as not dismissed
    }
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // best-effort persistence; ignore when storage is unavailable
    }
  };

  // avoid a flash before the passkey list resolves
  if (isPending) return null;
  // the user already has at least one passkey, nothing to nudge
  if ((data?.length ?? 0) > 0) return null;
  if (dismissed) return null;

  return (
    <CardRoot className="flex items-start gap-4 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
        <Fingerprint className="size-5" />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-sm leading-none">Add a passkey</h3>
          <p className="text-muted-foreground text-sm">
            Sign in faster and more securely without a password.
          </p>
        </div>

        <div>
          <AddPasskey />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Dismiss"
        onClick={dismiss}
      >
        <X className="size-4" />
      </Button>
    </CardRoot>
  );
};

export { PasskeyNudge };
