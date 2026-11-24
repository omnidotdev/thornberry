import {
  cn
} from "./ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/sheet.tsx
import { Dialog as ArkSheet, useDialogContext } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { X } from "lucide-react";
import { useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var SheetProvider2 = ArkSheet.RootProvider;
var SheetContext2 = ArkSheet.Context;
var SheetRoot2 = ArkSheet.Root;
var SheetPortal2 = Portal;
var SheetTrigger2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSheet.Trigger, {
  className,
  ...rest
});
var SheetBackdrop2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSheet.Backdrop, {
  className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest
});
var SheetPositioner2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSheet.Positioner, {
  className,
  ...rest
});
var SWIPE_CLOSE_DISTANCE = 80;
var SheetContent2 = ({
  className,
  side = "left",
  swipeToClose = true,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  style,
  ...rest
}) => {
  const dialog = useDialogContext();
  const contentRef = useRef(null);
  const start = useRef(null);
  const horizontal = side === "left" || side === "right";
  const towardEdge = (dx, dy) => side === "left" ? -dx : side === "right" ? dx : side === "top" ? -dy : dy;
  const setOffset = (offset) => {
    const node = contentRef.current;
    if (!node)
      return;
    const signed = side === "left" || side === "top" ? -offset : offset;
    node.style.transition = offset === 0 ? "transform 150ms ease-out" : "none";
    node.style.transform = offset === 0 ? "" : horizontal ? `translateX(${signed}px)` : `translateY(${signed}px)`;
  };
  const handlers = swipeToClose ? {
    onPointerDown: (event) => {
      onPointerDown?.(event);
      if (event.pointerType !== "touch")
        return;
      start.current = {
        x: event.clientX,
        y: event.clientY,
        dragging: false
      };
    },
    onPointerMove: (event) => {
      onPointerMove?.(event);
      const origin = start.current;
      if (!origin)
        return;
      const dx = event.clientX - origin.x;
      const dy = event.clientY - origin.y;
      if (!origin.dragging) {
        const along = Math.abs(horizontal ? dx : dy);
        const across = Math.abs(horizontal ? dy : dx);
        if (along < 8 || across > along) {
          if (across > 8)
            start.current = null;
          return;
        }
        origin.dragging = true;
      }
      setOffset(Math.max(0, towardEdge(dx, dy)));
    },
    onPointerUp: (event) => {
      onPointerUp?.(event);
      const origin = start.current;
      start.current = null;
      if (!origin?.dragging)
        return;
      const distance = towardEdge(event.clientX - origin.x, event.clientY - origin.y);
      setOffset(0);
      if (distance > SWIPE_CLOSE_DISTANCE)
        dialog.setOpen(false);
    },
    onPointerCancel: (event) => {
      onPointerCancel?.(event);
      start.current = null;
      setOffset(0);
    }
  } : { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
  return /* @__PURE__ */ jsx(ArkSheet.Content, {
    ref: contentRef,
    className: cn("data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed z-50 bg-background data-[state=closed]:animate-out data-[state=open]:animate-in", swipeToClose && (horizontal ? "touch-pan-y" : "touch-pan-x"), side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm", side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm", side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b", side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t", className),
    style,
    ...handlers,
    ...rest
  });
};
var SheetTitle2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSheet.Title, {
  className: cn("font-semibold text-lg leading-none tracking-tight", className),
  ...rest
});
var SheetDescription2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSheet.Description, {
  className: cn("text-muted-foreground text-sm", className),
  ...rest
});
var SheetCloseTrigger2 = ({
  className,
  children,
  asChild,
  ...rest
}) => {
  if (!children) {
    return /* @__PURE__ */ jsxs(ArkSheet.CloseTrigger, {
      className: cn("absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", className),
      ...rest,
      children: [
        /* @__PURE__ */ jsx(X, {
          className: "h-4 w-4"
        }),
        /* @__PURE__ */ jsx("span", {
          className: "sr-only",
          children: "Close"
        })
      ]
    });
  }
  return /* @__PURE__ */ jsx(ArkSheet.CloseTrigger, {
    className,
    asChild,
    ...rest,
    children
  });
};
export { SheetProvider2, SheetContext2, SheetRoot2, SheetPortal2, SheetTrigger2, SheetBackdrop2, SheetPositioner2, SheetContent2, SheetTitle2, SheetDescription2, SheetCloseTrigger2 };
