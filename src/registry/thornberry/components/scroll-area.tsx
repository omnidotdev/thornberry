import { ScrollArea as ArkScrollArea } from "@ark-ui/react/scroll-area";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const ScrollAreaProvider = ArkScrollArea.RootProvider;
const ScrollAreaContext = ArkScrollArea.Context;

const ScrollAreaRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkScrollArea.Root>) => (
  <ArkScrollArea.Root
    className={cn("relative overflow-hidden", className)}
    {...rest}
  />
);

const ScrollAreaViewport = ({
  className,
  style,
  ...rest
}: ComponentProps<typeof ArkScrollArea.Viewport>) => (
  <ArkScrollArea.Viewport
    className={cn(
      "size-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
      className,
    )}
    // Hide the native scrollbar so only the styled one shows. Set inline so
    // it works without a consumer-defined utility
    style={{ scrollbarWidth: "none", ...style }}
    {...rest}
  />
);

const ScrollAreaContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkScrollArea.Content>) => (
  <ArkScrollArea.Content className={className} {...rest} />
);

const ScrollAreaScrollbar = ({
  className,
  orientation = "vertical",
  ...rest
}: ComponentProps<typeof ArkScrollArea.Scrollbar>) => (
  <ArkScrollArea.Scrollbar
    orientation={orientation}
    className={cn(
      "z-10 flex touch-none select-none p-0.5 transition-colors",
      "data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:not-data-overflow-y:hidden",
      "data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:not-data-overflow-x:hidden",
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
      "rounded-full bg-border transition-colors hover:bg-muted-foreground/50 data-dragging:bg-muted-foreground/60",
      "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
      className,
    )}
    {...rest}
  />
);

const ScrollAreaCorner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkScrollArea.Corner>) => (
  <ArkScrollArea.Corner className={cn("bg-transparent", className)} {...rest} />
);

interface ScrollAreaProps extends ComponentProps<typeof ArkScrollArea.Root> {
  /** Which axes get a styled scrollbar. */
  orientation?: "vertical" | "horizontal" | "both";
  /** Class names for the scrolling viewport. */
  viewportClassName?: string;
}

/**
 * A scroll container with styled, overlaid scrollbars. Give it a bounded
 * height (or width, for horizontal scrolling) via `className`.
 */
const ScrollArea = ({
  orientation = "vertical",
  viewportClassName,
  children,
  ...rest
}: ScrollAreaProps) => (
  <ScrollAreaRoot {...rest}>
    <ScrollAreaViewport className={viewportClassName}>
      <ScrollAreaContent>{children}</ScrollAreaContent>
    </ScrollAreaViewport>

    {orientation !== "horizontal" && (
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    )}

    {orientation !== "vertical" && (
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    )}

    {orientation === "both" && <ScrollAreaCorner />}
  </ScrollAreaRoot>
);

export {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaContext,
  ScrollAreaCorner,
  ScrollAreaProvider,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
};
