import { Clipboard as ArkClipboard } from "@ark-ui/react/clipboard";
import { buttonVariants } from "../../../registry/thornberry/components/button";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
declare const ClipboardProvider: import("react").ForwardRefExoticComponent<ArkClipboard.RootProviderProps & import("react").RefAttributes<HTMLDivElement>>;
declare const ClipboardContext: (props: ArkClipboard.ContextProps) => ReactNode;
declare const ClipboardRoot: ({ className, ...rest }: ComponentProps<typeof ArkClipboard.Root>) => import("react/jsx-runtime").JSX.Element;
declare const ClipboardLabel: ({ className, ...rest }: ComponentProps<typeof ArkClipboard.Label>) => import("react/jsx-runtime").JSX.Element;
declare const ClipboardControl: ({ className, ...rest }: ComponentProps<typeof ArkClipboard.Control>) => import("react/jsx-runtime").JSX.Element;
/** A read-only input showing the value to copy. */
declare const ClipboardInput: ({ className, ...rest }: ComponentProps<typeof ArkClipboard.Input>) => import("react/jsx-runtime").JSX.Element;
/**
 * Copies the clipboard value on click. Renders the copy/check icon when no
 * children are given. Ark labels it "Copy to clipboard" (and "Copied to
 * clipboard" once copied); pass `aria-label` to override.
 */
declare const ClipboardTrigger: ({ className, variant, size, children, ...rest }: ComponentProps<typeof ArkClipboard.Trigger> & VariantProps<typeof buttonVariants>) => import("react/jsx-runtime").JSX.Element;
/**
 * Renders `children` while idle and `copied` once the value has been copied.
 */
declare const ClipboardIndicator: ({ className, ...rest }: ComponentProps<typeof ArkClipboard.Indicator>) => import("react/jsx-runtime").JSX.Element;
declare const ClipboardValueText: ({ className, ...rest }: ComponentProps<typeof ArkClipboard.ValueText>) => import("react/jsx-runtime").JSX.Element;
interface ClipboardProps extends ComponentProps<typeof ArkClipboard.Root> {
    /** Visible label rendered above the input. */
    label?: ReactNode;
}
/**
 * A read-only input with an attached copy button, for values such as API keys,
 * URLs, and install commands.
 */
declare const Clipboard: ({ label, ...rest }: ClipboardProps) => import("react/jsx-runtime").JSX.Element;
interface CopyButtonProps extends Omit<ComponentProps<typeof ArkClipboard.Trigger>, "value" | "onCopy">, VariantProps<typeof buttonVariants> {
    /** The text written to the clipboard on click. */
    value: string;
    /** How long the copied state lasts, in milliseconds. */
    timeout?: number;
    /** Called after the value has been copied. */
    onCopy?: () => void;
    /** Accessible label while idle. */
    label?: string;
    /** Accessible label (and screen reader announcement) once copied. */
    copiedLabel?: string;
}
/**
 * A drop-in copy button: copies `value` on click and shows a check for
 * `timeout` ms. Icon-only by default; pass children to add visible text next
 * to the icon.
 *
 * @example
 * <CopyButton value={apiKey} />
 * <CopyButton value={url} variant="outline" size="sm">Copy link</CopyButton>
 */
declare const CopyButton: ({ value, timeout, onCopy, label, copiedLabel, variant, size, className, children, ...rest }: CopyButtonProps) => import("react/jsx-runtime").JSX.Element;
export { Clipboard, ClipboardContext, ClipboardControl, ClipboardIndicator, ClipboardInput, ClipboardLabel, ClipboardProvider, ClipboardRoot, ClipboardTrigger, ClipboardValueText, CopyButton, };
