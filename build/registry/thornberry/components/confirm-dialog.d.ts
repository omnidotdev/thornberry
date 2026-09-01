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
declare const ConfirmDialog: ({ open, onOpenChange, title, description, confirmLabel, cancelLabel, onConfirm, isPending, }: ConfirmDialogProps) => import("react/jsx-runtime").JSX.Element;
export { ConfirmDialog };
