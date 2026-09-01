import { Fingerprint, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import { useAccountContext } from "@/registry/thornberry/components/account-provider";
import { Button } from "@/registry/thornberry/components/button";
import { ConfirmDialog } from "@/registry/thornberry/components/confirm-dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/thornberry/components/table";

/**
 * List the user's registered passkeys with the option to remove each, and enroll
 * a first passkey inline when none exist. Reads and mutates through the injected
 * auth client and reports results through the toaster.
 */
const ViewPasskeys = () => {
  const { authClient, toaster } = useAccountContext();

  const { data } = authClient.useListPasskeys();
  const [isOpen, setIsOpen] = useState(false);
  const [passkeyName, setPasskeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingPasskey, setIsDeletingPasskey] = useState(false);
  const [passkeyToDelete, setPasskeyToDelete] = useState<{
    id: string;
    name?: string | null;
  } | null>(null);

  const handleDeletePasskey = async () => {
    if (!passkeyToDelete) return;

    await authClient.passkey.deletePasskey({
      id: passkeyToDelete.id,
      fetchOptions: {
        onRequest: () => setIsDeletingPasskey(true),
        onSuccess: () => {
          toaster.success({ title: "Passkey deleted successfully" });
          setIsDeletingPasskey(false);
          setPasskeyToDelete(null);
        },
        onError: (error) => {
          toaster.error({
            title:
              typeof error?.error?.message === "string"
                ? error.error.message
                : "Failed to delete passkey",
          });
          setIsDeletingPasskey(false);
        },
      },
    });
  };

  const handleAddPasskey = async () => {
    if (!passkeyName) {
      toaster.error({ title: "Passkey name is required" });
      return;
    }

    setIsLoading(true);

    const res = await authClient.passkey.addPasskey({ name: passkeyName });

    setIsLoading(false);

    if (res?.error) {
      toaster.error({
        title:
          typeof res.error.message === "string"
            ? res.error.message
            : "Failed to add passkey",
      });
    } else {
      toaster.success({
        title: "Passkey added successfully. You can now use it to sign in.",
      });
    }
  };

  return (
    <>
      <DialogRoot open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Fingerprint className="mr-2 size-4" />
            <span>View Passkeys {data?.length ? `[${data.length}]` : ""}</span>
          </Button>
        </DialogTrigger>

        <DialogBackdrop />

        <DialogPositioner>
          <DialogContent>
            <div className="flex flex-col gap-1.5">
              <DialogTitle>Passkeys</DialogTitle>
              <DialogDescription>
                Your registered passkeys for passwordless sign-in.
              </DialogDescription>
            </div>

            {data?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-0" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.map((passkey) => (
                    <TableRow key={passkey.id}>
                      <TableCell>{passkey.name || "My Passkey"}</TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Delete passkey"
                          onClick={() => setPasskeyToDelete(passkey)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <>
                <p>No passkeys found</p>

                <Label htmlFor="passkey-name">New Passkey</Label>
                <Input
                  id="passkey-name"
                  value={passkeyName}
                  onChange={(event) => setPasskeyName(event.target.value)}
                  placeholder="My Passkey"
                />

                <Button type="submit" onClick={handleAddPasskey}>
                  {isLoading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <>
                      <Fingerprint className="mr-2 size-4" />
                      Create Passkey
                    </>
                  )}
                </Button>
              </>
            )}

            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      <ConfirmDialog
        open={passkeyToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPasskeyToDelete(null);
        }}
        title="Delete passkey?"
        description={`"${passkeyToDelete?.name || "My Passkey"}" will be removed and can no longer be used to sign in. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeletePasskey}
        isPending={isDeletingPasskey}
      />
    </>
  );
};

export { ViewPasskeys };
