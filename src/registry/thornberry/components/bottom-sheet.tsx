import { BottomSheet as ArkBottomSheet } from "@ark-ui/react/bottom-sheet";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const BottomSheetProvider = ArkBottomSheet.RootProvider;
const BottomSheetContext = ArkBottomSheet.Context;
const BottomSheetRoot = ArkBottomSheet.Root;

const BottomSheetTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkBottomSheet.Trigger>) => (
  <ArkBottomSheet.Trigger className={cn("", className)} {...rest} />
);

const BottomSheetBackdrop = ({
  className,
  ...rest
}: ComponentProps<typeof ArkBottomSheet.Backdrop>) => (
  <ArkBottomSheet.Backdrop
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  />
);

const BottomSheetContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkBottomSheet.Content>) => (
  <ArkBottomSheet.Content
    className={cn(
      "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom fixed inset-x-0 bottom-0 z-50 max-h-[96vh] rounded-t-xl border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  />
);

const BottomSheetGrabber = ({
  className,
  ...rest
}: ComponentProps<typeof ArkBottomSheet.Grabber>) => (
  <ArkBottomSheet.Grabber
    className={cn("mx-auto mb-4 flex w-full justify-center", className)}
    {...rest}
  />
);

const BottomSheetGrabberIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkBottomSheet.GrabberIndicator>) => (
  <ArkBottomSheet.GrabberIndicator
    className={cn("h-1.5 w-12 rounded-full bg-muted-foreground/25", className)}
    {...rest}
  />
);

const BottomSheetTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkBottomSheet.Title>) => (
  <ArkBottomSheet.Title
    className={cn(
      "font-semibold text-lg leading-none tracking-tight",
      className,
    )}
    {...rest}
  />
);

const BottomSheetCloseTrigger = ({
  className,
  children,
  asChild,
  ...rest
}: ComponentProps<typeof ArkBottomSheet.CloseTrigger>) => {
  if (!children) {
    return (
      <ArkBottomSheet.CloseTrigger
        className={cn(
          "absolute top-4 right-4 cursor-pointer rounded opacity-70 outline-none ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none",
          className,
        )}
        {...rest}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ArkBottomSheet.CloseTrigger>
    );
  }

  return (
    <ArkBottomSheet.CloseTrigger
      className={className}
      asChild={asChild}
      {...rest}
    >
      {children}
    </ArkBottomSheet.CloseTrigger>
  );
};

export {
  BottomSheetRoot,
  BottomSheetTrigger,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetGrabber,
  BottomSheetGrabberIndicator,
  BottomSheetTitle,
  BottomSheetCloseTrigger,
  BottomSheetProvider,
  BottomSheetContext,
};
