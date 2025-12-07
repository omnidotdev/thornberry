import { ScrollArea as ArkScrollArea } from "@ark-ui/react/scroll-area";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const ScrollAreaProvider = ArkScrollArea.RootProvider;
const ScrollAreaContext = ArkScrollArea.Context;
const ScrollAreaRoot = ArkScrollArea.Root;

const ScrollAreaViewport = ({
  className,
  ...rest
}: ComponentProps<typeof ArkScrollArea.Viewport>) => (
  <ArkScrollArea.Viewport
    className={cn("h-full w-full", className)}
    {...rest}
  />
);

const ScrollAreaContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkScrollArea.Content>) => (
  <ArkScrollArea.Content className={cn("", className)} {...rest} />
);

const ScrollAreaScrollbar = ({
  className,
  orientation = "vertical",
  ...rest
}: ComponentProps<typeof ArkScrollArea.Scrollbar>) => (
  <ArkScrollArea.Scrollbar
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col",
      className,
    )}
    {...rest}
  />
);

const ScrollAreaThumb = ({
  className,
  ...rest
}: ComponentProps<typeof ArkScrollArea.Thumb>) => (
  <ArkScrollArea.Thumb
    className={cn(
      "relative flex-1 rounded-full bg-border transition-colors hover:bg-muted-foreground/50",
      className,
    )}
    {...rest}
  />
);

const ScrollAreaCorner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkScrollArea.Corner>) => (
  <ArkScrollArea.Corner className={cn("bg-background", className)} {...rest} />
);

export {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
  ScrollAreaProvider,
  ScrollAreaContext,
};
