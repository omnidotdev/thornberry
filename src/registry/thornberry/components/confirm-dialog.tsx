import { Loader2 } from "lucide-react";

import { Button } from "@/registry/thornberry/components/button";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/registry/thornberry/components/dialog";

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
}

/**
 * Confirmation gate for a destructive or irreversible action. The confirm
 * button carries destructive styling, the dialog cannot be dismissed while the
 * action is in flight, and the copy should name the specific target and state
 * that it cannot be undone.
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
}: ConfirmDialogProps) => (
  <DialogRoot
    open={open}
    onOpenChange={(details) => {
      if (!isPending) onOpenChange(details.open);
    }}
  >
    <DialogBackdrop />

    <DialogPositioner>
      <DialogContent>
        <div className="flex flex-col gap-1.5">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </div>

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
            disabled={isPending}
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
  </DialogRoot>
);

export { ConfirmDialog };
