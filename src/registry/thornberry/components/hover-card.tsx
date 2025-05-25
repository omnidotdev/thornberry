import { HoverCard as ArkHoverCard } from "@ark-ui/react/hover-card";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const HoverCardProvider = ArkHoverCard.RootProvider;
const HoverCardContext = ArkHoverCard.Context;
const HoverCardRoot = ArkHoverCard.Root;

const HoverCardTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkHoverCard.Trigger>) => (
  <ArkHoverCard.Trigger className={cn("inline-block", className)} {...rest} />
);

const HoverCardContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkHoverCard.Content>) => (
  <ArkHoverCard.Content
    className={cn(
      "z-50 w-64 rounded-md border bg-background p-4 shadow-md outline-none",
      "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:animate-in",
      "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:animate-out",
      className,
    )}
    {...rest}
  />
);

const HoverCardArrow = ({
  className,
  ...rest
}: ComponentProps<typeof ArkHoverCard.Arrow>) => (
  <ArkHoverCard.Arrow
    className={cn("fill-base-100 stroke-base-200", className)}
    {...rest}
  />
);

const HoverCardArrowTip = ({
  className,
  ...rest
}: ComponentProps<typeof ArkHoverCard.ArrowTip>) => (
  <ArkHoverCard.ArrowTip className={cn(className)} {...rest} />
);

const HoverCardPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkHoverCard.Positioner>) => (
  <ArkHoverCard.Positioner className={cn(className)} {...rest} />
);

export {
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardArrowTip,
  HoverCardPositioner,
  HoverCardProvider,
  HoverCardContext,
};
