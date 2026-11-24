import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

const TooltipProvider = ArkTooltip.RootProvider;
const TooltipRoot = ArkTooltip.Root;
const TooltipArrow = ArkTooltip.Arrow;

const TooltipTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.Trigger>) => (
  <ArkTooltip.Trigger
    data-slot="tooltip-trigger"
    className={className}
    {...rest}
  />
);

const TooltipPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.Positioner>) => (
  <ArkTooltip.Positioner className={className} {...rest} />
);

const TooltipContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.Content>) => (
  <ArkTooltip.Content
    data-slot="tooltip-content"
    className={cn(
      "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 flex min-h-8 max-w-xs animate-in items-center overflow-hidden text-balance rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md data-[state=closed]:animate-out",
      className,
    )}
    {...rest}
  />
);

const TooltipArrowTip = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.ArrowTip>) => (
  <ArkTooltip.ArrowTip
    className={cn("border-t border-l", className)}
    {...rest}
  />
);

interface TooltipProps extends ComponentProps<typeof TooltipRoot> {
  /** Tooltip text or content */
  content: ReactNode;
  /** The element that shows the tooltip on hover and focus */
  children: ReactNode;
  contentProps?: ComponentProps<typeof TooltipContent>;
}

/**
 * Tooltip on a single trigger element (rendered `asChild`, so pass one
 * focusable element). Compose `TooltipRoot` and its parts for anything else.
 */
const Tooltip = ({
  content,
  children,
  contentProps,
  ...rest
}: TooltipProps) => (
  <TooltipRoot {...rest}>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipPositioner>
      <TooltipContent {...contentProps}>{content}</TooltipContent>
    </TooltipPositioner>
  </TooltipRoot>
);

export {
  Tooltip,
  TooltipArrow,
  TooltipArrowTip,
  TooltipContent,
  TooltipPositioner,
  type TooltipProps,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
};
