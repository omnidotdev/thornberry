import { Fingerprint, Loader2 } from "lucide-react";
import { useState } from "react";

import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import { Button } from "@/registry/thornberry/components/button";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/registry/thornberry/components/dialog";
import { Input } from "@/registry/thornberry/components/input";
import { Label } from "@/registry/thornberry/components/label";

/**
 * Add a passkey so the user can sign in without a password. Drives the injected
 * auth client's passkey enrollment and reports the result through the toaster.
 */
const AddPasskey = () => {
  const { authClient, toaster } = useAccountContext();

  const [isOpen, setIsOpen] = useState(false);
  const [passkeyName, setPasskeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPasskey = async () => {
    if (!passkeyName) {
      toaster.error({ title: "Passkey name is required" });
      return;
    }

    setIsLoading(true);

    const res = await authClient.passkey.addPasskey({ name: passkeyName });

    if (res?.error) {
      toaster.error({
        title:
          typeof res.error.message === "string"
            ? res.error.message
            : "Failed to add passkey",
      });
    } else {
      setIsOpen(false);
      toaster.success({
        title: "Passkey added successfully. You can now use it to sign in.",
      });
    }

    setIsLoading(false);
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Fingerprint className="mr-2 size-4" />
          <span>Add Passkey</span>
        </Button>
      </DialogTrigger>

      <DialogBackdrop />

      <DialogPositioner>
        <DialogContent>
          <div className="flex flex-col gap-1.5">
            <DialogTitle>Add New Passkey</DialogTitle>
            <DialogDescription>
              Create a new passkey to securely access your account without a
              password.
            </DialogDescription>
          </div>

          <Label htmlFor="passkey-name">Passkey Name</Label>
          <Input
            id="passkey-name"
            value={passkeyName}
            onChange={(event) => setPasskeyName(event.target.value)}
            placeholder="My Passkey"
          />

          <Button disabled={isLoading} type="submit" onClick={handleAddPasskey}>
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <>
                <Fingerprint className="mr-2 size-4" />
                Create Passkey
              </>
            )}
          </Button>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export { AddPasskey };
