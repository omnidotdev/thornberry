import { Dialog as ArkSheet, useDialogContext } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { X } from "lucide-react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

import type { ComponentProps, PointerEvent } from "react";

const SheetProvider = ArkSheet.RootProvider;
const SheetContext = ArkSheet.Context;
const SheetRoot = ArkSheet.Root;

/**
 * Portals the sheet's backdrop and positioner to the document body, so no
 * transformed or blurred ancestor can clip the overlay. Wrap every sheet's
 * backdrop + positioner in this, as with dialogs
 */
const SheetPortal = Portal;

const SheetTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSheet.Trigger>) => (
  <ArkSheet.Trigger className={className} {...rest} />
);

const SheetBackdrop = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSheet.Backdrop>) => (
  <ArkSheet.Backdrop
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  />
);

const SheetPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSheet.Positioner>) => (
  <ArkSheet.Positioner className={className} {...rest} />
);

interface ArkSheetContentProps extends ComponentProps<typeof ArkSheet.Content> {
  side?: "top" | "right" | "bottom" | "left";
  /** Close when the sheet is swiped toward its edge on a touch screen */
  swipeToClose?: boolean;
}

/** Distance (px) a swipe must travel toward the edge to close the sheet */
const SWIPE_CLOSE_DISTANCE = 80;

const SheetContent = ({
  className,
  side = "left",
  swipeToClose = true,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  style,
  ...rest
}: ArkSheetContentProps) => {
  const dialog = useDialogContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number; dragging: boolean } | null>(
    null,
  );

  const horizontal = side === "left" || side === "right";
  // a swipe toward the sheet's own edge closes it
  const towardEdge = (dx: number, dy: number) =>
    side === "left" ? -dx : side === "right" ? dx : side === "top" ? -dy : dy;

  const setOffset = (offset: number) => {
    const node = contentRef.current;
    if (!node) return;
    const signed = side === "left" || side === "top" ? -offset : offset;
    node.style.transition = offset === 0 ? "transform 150ms ease-out" : "none";
    node.style.transform =
      offset === 0
        ? ""
        : horizontal
          ? `translateX(${signed}px)`
          : `translateY(${signed}px)`;
  };

  const handlers = swipeToClose
    ? {
        onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
          onPointerDown?.(event);
          if (event.pointerType !== "touch") return;
          start.current = {
            x: event.clientX,
            y: event.clientY,
            dragging: false,
          };
        },
        onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
          onPointerMove?.(event);
          const origin = start.current;
          if (!origin) return;
          const dx = event.clientX - origin.x;
          const dy = event.clientY - origin.y;
          // only a swipe mostly along the closing axis drags the sheet, so
          // scrolling the sheet's own content keeps working
          if (!origin.dragging) {
            const along = Math.abs(horizontal ? dx : dy);
            const across = Math.abs(horizontal ? dy : dx);
            if (along < 8 || across > along) {
              if (across > 8) start.current = null;
              return;
            }
            origin.dragging = true;
          }
          setOffset(Math.max(0, towardEdge(dx, dy)));
        },
        onPointerUp: (event: PointerEvent<HTMLDivElement>) => {
          onPointerUp?.(event);
          const origin = start.current;
          start.current = null;
          if (!origin?.dragging) return;
          const distance = towardEdge(
            event.clientX - origin.x,
            event.clientY - origin.y,
          );
          setOffset(0);
          if (distance > SWIPE_CLOSE_DISTANCE) dialog.setOpen(false);
        },
        onPointerCancel: (event: PointerEvent<HTMLDivElement>) => {
          onPointerCancel?.(event);
          start.current = null;
          setOffset(0);
        },
      }
    : { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };

  return (
    <ArkSheet.Content
      ref={contentRef}
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed z-50 bg-background data-[state=closed]:animate-out data-[state=open]:animate-in",
        swipeToClose && (horizontal ? "touch-pan-y" : "touch-pan-x"),
        side === "right" &&
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
        side === "left" &&
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        side === "top" &&
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
        side === "bottom" &&
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
        className,
      )}
      style={style}
      {...handlers}
      {...rest}
    />
  );
};

const SheetTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSheet.Title>) => (
  <ArkSheet.Title
    className={cn(
      "font-semibold text-lg leading-none tracking-tight",
      className,
    )}
    {...rest}
  />
);

const SheetDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSheet.Description>) => (
  <ArkSheet.Description
    className={cn("text-muted-foreground text-sm", className)}
    {...rest}
  />
);

const SheetCloseTrigger = ({
  className,
  children,
  asChild,
  ...rest
}: ComponentProps<typeof ArkSheet.CloseTrigger>) => {
  // If there are no children, render the default X icon
  if (!children) {
    return (
      <ArkSheet.CloseTrigger
        className={cn(
          "absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          className,
        )}
        {...rest}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ArkSheet.CloseTrigger>
    );
  }

  // If children are provided, use them inside the CloseTrigger
  // This is useful for creating buttons that close the ArkSheet
  return (
    <ArkSheet.CloseTrigger className={className} asChild={asChild} {...rest}>
      {children}
    </ArkSheet.CloseTrigger>
  );
};

export {
  SheetBackdrop,
  SheetCloseTrigger,
  SheetContent,
  SheetContext,
  SheetDescription,
  SheetPortal,
  SheetPositioner,
  SheetProvider,
  SheetRoot,
  SheetTitle,
  SheetTrigger,
};
