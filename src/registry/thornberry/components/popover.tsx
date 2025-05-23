import { Popover as ArkPopover } from "@ark-ui/react/popover";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

const PopoverProvider = ArkPopover.RootProvider;
const PopoverContext = ArkPopover.Context;

const PopoverRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.Root>) => (
  <ArkPopover.Root className={cn("", className)} {...rest} />
);

const PopoverTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.Trigger>) => (
  <ArkPopover.Trigger
    className={cn("inline-flex items-center justify-center", className)}
    {...rest}
  />
);

const PopoverContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.Content>) => (
  <ArkPopover.Content
    className={cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...rest}
  />
);

const PopoverPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.Positioner>) => (
  <ArkPopover.Positioner className={cn("", className)} {...rest} />
);

const PopoverArrow = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.Arrow>) => (
  <ArkPopover.Arrow className={cn("fill-popover", className)} {...rest} />
);

const PopoverArrowTip = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.ArrowTip>) => (
  <ArkPopover.ArrowTip className={cn("fill-border", className)} {...rest} />
);

const PopoverCloseTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.CloseTrigger>) => (
  <ArkPopover.CloseTrigger className={cn("", className)} {...rest} />
);

interface PopoverProps extends ComponentProps<typeof PopoverRoot> {
  trigger: ReactNode;
  children: ReactNode;
  withArrow?: boolean;
}

const Popover = ({
  trigger,
  children,
  withArrow = true,
  ...rest
}: PopoverProps) => (
  <PopoverRoot {...rest}>
    <PopoverTrigger asChild>{trigger}</PopoverTrigger>
    <PopoverPositioner>
      <PopoverContent>
        {withArrow && (
          <PopoverArrow>
            <PopoverArrowTip />
          </PopoverArrow>
        )}
        {children}
      </PopoverContent>
    </PopoverPositioner>
  </PopoverRoot>
);

export {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverPositioner,
  PopoverArrow,
  PopoverArrowTip,
  PopoverCloseTrigger,
  PopoverProvider,
  PopoverContext,
};
