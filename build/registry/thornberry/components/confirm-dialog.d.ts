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
declare const ConfirmDialog: ({ open, onOpenChange, title, description, confirmLabel, cancelLabel, onConfirm, isPending, confirmationText, }: ConfirmDialogProps) => import("react/jsx-runtime").JSX.Element;
export { ConfirmDialog };
