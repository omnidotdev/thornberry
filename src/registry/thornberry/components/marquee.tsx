"use client";

import { Marquee as ArkMarquee } from "@ark-ui/react/marquee";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const MarqueeProvider = ArkMarquee.RootProvider;
const MarqueeContext = ArkMarquee.Context;
const MarqueeEdge = ArkMarquee.Edge;

const MarqueeRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMarquee.Root>) => (
  <ArkMarquee.Root
    className={cn("w-full overflow-hidden", className)}
    {...rest}
  />
);

const MarqueeViewport = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMarquee.Viewport>) => (
  <ArkMarquee.Viewport
    className={cn("w-full overflow-hidden", className)}
    {...rest}
  />
);

const MarqueeContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMarquee.Content>) => (
  <ArkMarquee.Content className={cn("flex w-max gap-4", className)} {...rest} />
);

const MarqueeItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkMarquee.Item>) => (
  <ArkMarquee.Item className={cn("flex-shrink-0", className)} {...rest} />
);

export {
  MarqueeRoot,
  MarqueeViewport,
  MarqueeContent,
  MarqueeItem,
  MarqueeEdge,
  MarqueeProvider,
  MarqueeContext,
};
