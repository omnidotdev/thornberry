import { Tour as ArkTour } from "@ark-ui/react/tour";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const TourContext = ArkTour.Context;
const TourRoot = ArkTour.Root;
const TourActions = ArkTour.Actions;
const TourActionTrigger = ArkTour.ActionTrigger;

const TourBackdrop = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Backdrop>) => (
  <ArkTour.Backdrop
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-[backdrop-out] data-[state=open]:animate-[backdrop-in]",
      className,
    )}
    {...rest}
  />
);

const TourSpotlight = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Spotlight>) => (
  <ArkTour.Spotlight
    className={cn("fixed inset-0 z-45", className)}
    {...rest}
  />
);

const TourPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Positioner>) => (
  <ArkTour.Positioner
    className={cn(
      "z-50 flex items-center justify-center data-[type=dialog]:fixed data-[type=floating]:absolute data-[type=tooltip]:absolute data-[type=dialog]:inset-0 data-[type=floating]:right-6 data-[type=floating]:bottom-6",
      className,
    )}
    {...rest}
  />
);

const TourContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Content>) => (
  <ArkTour.Content
    className={cn(
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-top-[2%] data-[state=closed]:slide-out-to-top-[2%] relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg",
      className,
    )}
    {...rest}
  />
);

const TourProgressText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.ProgressText>) => (
  <ArkTour.ProgressText
    className={cn("text-muted-foreground text-sm", className)}
    {...rest}
  />
);

const TourTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Title>) => (
  <ArkTour.Title
    className={cn(
      "font-semibold text-foreground text-lg data-[type=dialog]:text-center",
      className,
    )}
    {...rest}
  />
);

const TourDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Description>) => (
  <ArkTour.Description
    className={cn(
      "text-foreground text-sm data-[type=dialog]:text-center",
      className,
    )}
    {...rest}
  />
);

const TourCloseTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.CloseTrigger>) => (
  <ArkTour.CloseTrigger
    className={cn(
      "absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
      className,
    )}
    {...rest}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </ArkTour.CloseTrigger>
);

const TourControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Control>) => (
  <ArkTour.Control
    className={cn("gap- mt-6 flex items-center justify-end", className)}
    {...rest}
  />
);

export {
  TourContext,
  TourRoot,
  TourBackdrop,
  TourSpotlight,
  TourPositioner,
  TourContent,
  TourTitle,
  TourDescription,
  TourProgressText,
  TourCloseTrigger,
  TourControl,
  TourActions,
  TourActionTrigger,
};
