import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/react/floating-panel";
import { Portal } from "@ark-ui/react/portal";
import { ArrowDownLeft, Maximize2, Minimize2, X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const FloatingPanelProvider = ArkFloatingPanel.RootProvider;
const FloatingPanelContext = ArkFloatingPanel.Context;
const FloatingPanelRoot = ArkFloatingPanel.Root;

const FloatingPanelTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFloatingPanel.Trigger>) => (
  <ArkFloatingPanel.Trigger className={cn("", className)} {...rest} />
);

const FloatingPanelPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFloatingPanel.Positioner>) => (
  <Portal>
    <ArkFloatingPanel.Positioner
      className={cn("fixed inset-0 z-50", className)}
      {...rest}
    />
  </Portal>
);

const FloatingPanelContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFloatingPanel.Content>) => (
  <ArkFloatingPanel.Content
    className={cn(
      "flex flex-col rounded-lg border bg-background shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      className,
    )}
    {...rest}
  />
);

const FloatingPanelDragTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFloatingPanel.DragTrigger>) => (
  <ArkFloatingPanel.DragTrigger
    className={cn("cursor-move", className)}
    {...rest}
  />
);

const FloatingPanelHeader = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFloatingPanel.Header>) => (
  <ArkFloatingPanel.Header
    className={cn(
      "flex items-center justify-between border-b bg-muted/50 px-4 py-3",
      className,
    )}
    {...rest}
  />
);

const FloatingPanelTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFloatingPanel.Title>) => (
  <ArkFloatingPanel.Title
    className={cn("font-semibold text-sm", className)}
    {...rest}
  />
);

const FloatingPanelControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFloatingPanel.Control>) => (
  <ArkFloatingPanel.Control
    className={cn("flex items-center gap-1", className)}
    {...rest}
  />
);

const FloatingPanelStageTrigger = ({
  className,
  stage,
  children,
  ...rest
}: ComponentProps<typeof ArkFloatingPanel.StageTrigger>) => {
  const defaultIcons = {
    minimized: <Minimize2 className="h-4 w-4" />,
    maximized: <Maximize2 className="h-4 w-4" />,
    default: <ArrowDownLeft className="h-4 w-4" />,
  };

  return (
    <ArkFloatingPanel.StageTrigger
      stage={stage}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className,
      )}
      {...rest}
    >
      {children || defaultIcons[stage]}
    </ArkFloatingPanel.StageTrigger>
  );
};

const FloatingPanelCloseTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkFloatingPanel.CloseTrigger>) => (
  <ArkFloatingPanel.CloseTrigger
    className={cn(
      "inline-flex h-6 w-6 items-center justify-center rounded opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      className,
    )}
    {...rest}
  >
    {children || <X className="h-4 w-4" />}
  </ArkFloatingPanel.CloseTrigger>
);

const FloatingPanelBody = ({
  className,
  ...rest
}: ComponentProps<typeof ArkFloatingPanel.Body>) => (
  <ArkFloatingPanel.Body className={cn("flex-1 p-4", className)} {...rest} />
);

const FloatingPanelResizeTrigger = ({
  className,
  axis,
  ...rest
}: ComponentProps<typeof ArkFloatingPanel.ResizeTrigger>) => {
  const axisClasses = {
    n: "top-0 left-0 right-0 h-1 cursor-ns-resize",
    s: "bottom-0 left-0 right-0 h-1 cursor-ns-resize",
    e: "top-0 right-0 bottom-0 w-1 cursor-ew-resize",
    w: "top-0 left-0 bottom-0 w-1 cursor-ew-resize",
    ne: "top-0 right-0 size-3 cursor-nesw-resize",
    nw: "top-0 left-0 size-3 cursor-nwse-resize",
    se: "bottom-0 right-0 size-3 cursor-nwse-resize",
    sw: "bottom-0 left-0 size-3 cursor-nesw-resize",
  };

  return (
    <ArkFloatingPanel.ResizeTrigger
      axis={axis}
      className={cn("absolute", axisClasses[axis], className)}
      {...rest}
    />
  );
};

export {
  FloatingPanelRoot,
  FloatingPanelTrigger,
  FloatingPanelPositioner,
  FloatingPanelContent,
  FloatingPanelDragTrigger,
  FloatingPanelHeader,
  FloatingPanelTitle,
  FloatingPanelControl,
  FloatingPanelStageTrigger,
  FloatingPanelCloseTrigger,
  FloatingPanelBody,
  FloatingPanelResizeTrigger,
  FloatingPanelProvider,
  FloatingPanelContext,
};
