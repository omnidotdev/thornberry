import { HoverCard as ArkHoverCard } from "@ark-ui/react/hover-card";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const hoverCardVariants = tv({
  slots: {
    trigger: "inline-block",
    content:
      "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 w-64 rounded-md border bg-background p-4 shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
    arrow: "fill-base-100 stroke-base-200",
    arrowTip: "",
    positioner: "",
  },
});

const { trigger, content, arrow, arrowTip, positioner } = hoverCardVariants();

const HoverCardProvider = ArkHoverCard.RootProvider;
const HoverCardContext = ArkHoverCard.Context;
const HoverCardRoot = ArkHoverCard.Root;

const HoverCardTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkHoverCard.Trigger>) => (
  <ArkHoverCard.Trigger className={cn(trigger(), className)} {...rest} />
);

const HoverCardContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkHoverCard.Content>) => (
  <ArkHoverCard.Content className={cn(content(), className)} {...rest} />
);

const HoverCardArrow = ({
  className,
  ...rest
}: ComponentProps<typeof ArkHoverCard.Arrow>) => (
  <ArkHoverCard.Arrow className={cn(arrow(), className)} {...rest} />
);

const HoverCardArrowTip = ({
  className,
  ...rest
}: ComponentProps<typeof ArkHoverCard.ArrowTip>) => (
  <ArkHoverCard.ArrowTip className={cn(arrowTip(), className)} {...rest} />
);

const HoverCardPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkHoverCard.Positioner>) => (
  <ArkHoverCard.Positioner className={cn(positioner(), className)} {...rest} />
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
