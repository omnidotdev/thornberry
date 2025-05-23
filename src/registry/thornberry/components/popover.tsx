import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { FiX } from "react-icons/fi";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

const PopoverProvider = ArkPopover.RootProvider;
const PopoverContext = ArkPopover.Context;
const PopoverRoot = ArkPopover.Root;
const PopoverArrow = ArkPopover.Arrow;

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

const PopoverArrowTip = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPopover.ArrowTip>) => (
  <ArkPopover.ArrowTip
    className={cn("border-t-[1px] border-l-[1px]", className)}
    {...rest}
  />
);

const PopoverCloseTrigger = ({
  className,
  children,
  asChild,
  ...rest
}: ComponentProps<typeof ArkPopover.CloseTrigger>) => {
  // If there are no children, render the default X icon
  if (!children) {
    return (
      <ArkPopover.CloseTrigger
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          className,
        )}
        {...rest}
      >
        <FiX className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ArkPopover.CloseTrigger>
    );
  }

  // If children are provided, use them inside the CloseTrigger
  // This is useful for creating buttons that close the dialog
  return (
    <ArkPopover.CloseTrigger
      className={cn(className)}
      asChild={asChild}
      {...rest}
    >
      {children}
    </ArkPopover.CloseTrigger>
  );
};

interface PopoverProps extends ComponentProps<typeof PopoverRoot> {
  trigger: ReactNode;
  children: ReactNode;
  hasArrow?: boolean;
}

const Popover = ({ trigger, children, hasArrow, ...rest }: PopoverProps) => (
  <PopoverRoot {...rest}>
    <PopoverTrigger asChild>{trigger}</PopoverTrigger>
    <PopoverPositioner>
      <PopoverContent>
        <PopoverArrow>
          <PopoverArrowTip />
        </PopoverArrow>
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
  type PopoverProps,
};
