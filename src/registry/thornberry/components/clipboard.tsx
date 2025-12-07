import { Clipboard as ArkClipboard } from "@ark-ui/react/clipboard";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const ClipboardProvider = ArkClipboard.RootProvider;
const ClipboardContext = ArkClipboard.Context;

const ClipboardRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.Root>) => (
  <ArkClipboard.Root className={cn("space-y-2", className)} {...rest} />
);

const ClipboardLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.Label>) => (
  <ArkClipboard.Label
    className={cn("font-medium text-sm leading-none", className)}
    {...rest}
  />
);

const ClipboardControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.Control>) => (
  <ArkClipboard.Control
    className={cn("relative flex items-center", className)}
    {...rest}
  />
);

const ClipboardInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.Input>) => (
  <ArkClipboard.Input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const ClipboardTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkClipboard.Trigger>) => {
  if (!children) {
    return (
      <ArkClipboard.Trigger
        className={cn(
          "-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground transition-colors",
          "hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...rest}
      >
        <ArkClipboard.Indicator copied={<Check className="size-4" />}>
          <Copy className="size-4" />
        </ArkClipboard.Indicator>
      </ArkClipboard.Trigger>
    );
  }

  return (
    <ArkClipboard.Trigger className={className} {...rest}>
      {children}
    </ArkClipboard.Trigger>
  );
};

const ClipboardIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.Indicator>) => (
  <ArkClipboard.Indicator className={cn(className)} {...rest} />
);

const ClipboardValueText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkClipboard.ValueText>) => (
  <ArkClipboard.ValueText className={cn("text-sm", className)} {...rest} />
);

export {
  ClipboardProvider,
  ClipboardContext,
  ClipboardRoot,
  ClipboardLabel,
  ClipboardControl,
  ClipboardInput,
  ClipboardTrigger,
  ClipboardIndicator,
  ClipboardValueText,
};
