import {
  Clipboard as ArkClipboard,
  useClipboardContext,
} from "@ark-ui/react/clipboard";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/registry/thornberry/components/button";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const ClipboardProvider = ArkClipboard.RootProvider;
const ClipboardContext = ArkClipboard.Context;

const ClipboardRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.Root>) => (
  <ArkClipboard.Root
    className={cn("flex w-full flex-col gap-1.5", className)}
    {...rest}
  />
);

const ClipboardLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.Label>) => (
  <ArkClipboard.Label
    className={cn("font-medium text-foreground text-sm", className)}
    {...rest}
  />
);

const ClipboardControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.Control>) => (
  <ArkClipboard.Control
    className={cn("flex items-center gap-2", className)}
    {...rest}
  />
);

/** A read-only input showing the value to copy. */
const ClipboardInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.Input>) => (
  <ArkClipboard.Input
    className={cn(
      "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 font-mono text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

/** The copy/check icon pair, swapped by the clipboard's copied state. */
const ClipboardIcon = ({ className }: { className?: string }) => {
  const clipboard = useClipboardContext();

  return clipboard.copied ? (
    <Check className={cn("size-4", className)} aria-hidden="true" />
  ) : (
    <Copy className={cn("size-4", className)} aria-hidden="true" />
  );
};

/**
 * Copies the clipboard value on click. Renders the copy/check icon when no
 * children are given. Ark labels it "Copy to clipboard" (and "Copied to
 * clipboard" once copied); pass `aria-label` to override.
 */
const ClipboardTrigger = ({
  className,
  variant = "outline",
  size = "icon",
  children,
  ...rest
}: ComponentProps<typeof ArkClipboard.Trigger> &
  VariantProps<typeof buttonVariants>) => (
  <ArkClipboard.Trigger
    className={cn(buttonVariants({ variant, size }), className)}
    {...rest}
  >
    {children ?? <ClipboardIcon />}
  </ArkClipboard.Trigger>
);

/**
 * Renders `children` while idle and `copied` once the value has been copied.
 */
const ClipboardIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.Indicator>) => (
  <ArkClipboard.Indicator
    className={cn("inline-flex items-center", className)}
    {...rest}
  />
);

const ClipboardValueText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.ValueText>) => (
  <ArkClipboard.ValueText
    className={cn("font-mono text-sm", className)}
    {...rest}
  />
);

interface ClipboardProps extends ComponentProps<typeof ArkClipboard.Root> {
  /** Visible label rendered above the input. */
  label?: ReactNode;
}

/**
 * A read-only input with an attached copy button, for values such as API keys,
 * URLs, and install commands.
 */
const Clipboard = ({ label, ...rest }: ClipboardProps) => (
  <ClipboardRoot {...rest}>
    {label && <ClipboardLabel>{label}</ClipboardLabel>}

    <ClipboardControl>
      <ClipboardInput />
      <ClipboardTrigger />
    </ClipboardControl>
  </ClipboardRoot>
);

interface CopyButtonProps
  extends Omit<ComponentProps<typeof ArkClipboard.Trigger>, "value" | "onCopy">,
    VariantProps<typeof buttonVariants> {
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
const CopyButton = ({
  value,
  timeout,
  onCopy,
  label = "Copy to clipboard",
  copiedLabel = "Copied",
  variant = "ghost",
  size = "icon",
  className,
  children,
  ...rest
}: CopyButtonProps) => (
  <ArkClipboard.Root
    value={value}
    timeout={timeout}
    onStatusChange={({ copied }) => {
      if (copied) onCopy?.();
    }}
    className="inline-flex"
  >
    <ArkClipboard.Context>
      {(clipboard) => (
        <>
          <ArkClipboard.Trigger
            aria-label={clipboard.copied ? copiedLabel : label}
            className={cn(buttonVariants({ variant, size }), className)}
            {...rest}
          >
            <ClipboardIcon />
            {children}
          </ArkClipboard.Trigger>

          <span aria-live="polite" className="sr-only">
            {clipboard.copied ? copiedLabel : ""}
          </span>
        </>
      )}
    </ArkClipboard.Context>
  </ArkClipboard.Root>
);

export {
  Clipboard,
  ClipboardContext,
  ClipboardControl,
  ClipboardIndicator,
  ClipboardInput,
  ClipboardLabel,
  ClipboardProvider,
  ClipboardRoot,
  ClipboardTrigger,
  ClipboardValueText,
  CopyButton,
};
