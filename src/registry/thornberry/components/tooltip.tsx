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
  <ArkTooltip.Trigger className={cn("", className)} {...rest} />
);

const TooltipPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.Positioner>) => (
  <ArkTooltip.Positioner className={cn("", className)} {...rest} />
);

const TooltipContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTooltip.Content>) => (
  <ArkTooltip.Content
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
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
    className={cn("border-t-[1px] border-l-[1px]", className)}
    {...rest}
  />
);

interface TooltipProps extends ComponentProps<typeof TooltipRoot> {
  content: ReactNode;
  children: ReactNode;
  withArrow?: boolean;
}

const Tooltip = ({
  content,
  children,
  withArrow = true,
  openDelay = 300,
  closeDelay = 100,
  ...rest
}: TooltipProps) => (
  <TooltipRoot openDelay={openDelay} closeDelay={closeDelay} {...rest}>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipPositioner>
      <TooltipContent>
        {withArrow && (
          <TooltipArrow>
            <TooltipArrowTip />
          </TooltipArrow>
        )}
        {content}
      </TooltipContent>
    </TooltipPositioner>
  </TooltipRoot>
);

export {
  Tooltip,
  TooltipArrow,
  TooltipArrowTip,
  TooltipContent,
  TooltipPositioner,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  type TooltipProps,
};
