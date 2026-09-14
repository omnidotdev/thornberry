import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/registry/thornberry/components/button";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/registry/thornberry/components/dialog";
import { Input } from "@/registry/thornberry/components/input";
import { Label } from "@/registry/thornberry/components/label";

import type { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Title, ideally naming the specific target (e.g. 'Delete passkey "Laptop"?'). */
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** While true the dialog cannot be dismissed and the actions are disabled. */
  isPending?: boolean;
  /**
   * When set, the confirm button stays disabled until the user types this exact
   * string (case-sensitive). Use for the highest-severity, irreversible actions
   * (e.g. deleting an organization), where a single accidental click must not be
   * enough. The value resets whenever the dialog closes.
   */
  confirmationText?: string;
}

/**
 * Confirmation gate for a destructive or irreversible action. The confirm
 * button carries destructive styling, the dialog cannot be dismissed while the
 * action is in flight, and the copy should name the specific target and state
 * that it cannot be undone. Pass `confirmationText` to require the user to type
 * the target's name before the action can fire.
 */
const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isPending = false,
  confirmationText,
}: ConfirmDialogProps) => {
  const [typed, setTyped] = useState("");

  // Clear the typed confirmation whenever the dialog closes, so reopening it
  // (for this or another target) never starts pre-satisfied
  useEffect(() => {
    if (!open) setTyped("");
  }, [open]);

  const confirmable = !confirmationText || typed === confirmationText;

  return (
    <DialogRoot
      open={open}
      onOpenChange={(details) => {
        if (!isPending) onOpenChange(details.open);
      }}
    >
      <DialogPortal>
        <DialogBackdrop />

        <DialogPositioner>
          <DialogContent>
            <div className="flex flex-col gap-1.5">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>

            {confirmationText && (
              <div className="space-y-1.5">
                <Label htmlFor="confirm-input">
                  Type{" "}
                  <span className="font-medium text-foreground">
                    {confirmationText}
                  </span>{" "}
                  to confirm
                </Label>
                <Input
                  id="confirm-input"
                  value={typed}
                  onChange={(event) => setTyped(event.target.value)}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  disabled={isPending}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {cancelLabel}
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                disabled={isPending || !confirmable}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  confirmLabel
                )}
              </Button>
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

export { ConfirmDialog };
