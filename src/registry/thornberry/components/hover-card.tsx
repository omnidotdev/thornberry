import { HoverCard as ArkHoverCard } from "@ark-ui/react/hover-card";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const hoverCardVariants = tv({
  slots: {
    trigger: "inline-block",
    content:
      "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 w-64 rounded-md border bg-background p-4 shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
    positioner: "",
  },
});

const { trigger, content, positioner } = hoverCardVariants();

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
  HoverCardPositioner,
  HoverCardProvider,
  HoverCardContext,
};
