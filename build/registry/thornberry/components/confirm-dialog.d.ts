import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type { buttonVariants } from "../../../registry/thornberry/components/button";
interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Title, ideally naming the specific target (e.g. 'Delete passkey "Laptop"?'). */
    title: string;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    /**
     * Confirm button variant. Defaults to `destructive`; pass another variant
     * for a confirmation that is irreversible but not destructive.
     */
    confirmVariant?: VariantProps<typeof buttonVariants>["variant"];
    onConfirm: () => void;
    /** While true the dialog cannot be dismissed and the actions are disabled. */
    isPending?: boolean;
    /** Confirm button label while pending (e.g. "Deleting..."); a spinner alone when unset. */
    pendingLabel?: string;
    /** Error from a failed attempt, shown above the actions so the user can retry. */
    error?: ReactNode;
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
declare const ConfirmDialog: ({ open, onOpenChange, title, description, confirmLabel, cancelLabel, confirmVariant, onConfirm, isPending, pendingLabel, error, confirmationText, }: ConfirmDialogProps) => import("react/jsx-runtime").JSX.Element;
export { ConfirmDialog };
