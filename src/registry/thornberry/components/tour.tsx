import { Tour as ArkTour } from "@ark-ui/react/tour";
import { X } from "lucide-react";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const tourVariants = tv({
  slots: {
    backdrop:
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-[backdrop-out] data-[state=open]:animate-[backdrop-in]",
    spotlight: "fixed inset-0 z-45",
    positioner:
      "z-50 flex items-center justify-center data-[type=dialog]:fixed data-[type=floating]:absolute data-[type=tooltip]:absolute data-[type=dialog]:inset-0 data-[type=floating]:right-6 data-[type=floating]:bottom-6",
    progressText: "text-muted-foreground text-sm",
    content:
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-top-[2%] data-[state=closed]:slide-out-to-top-[2%] relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg",
    title:
      "font-semibold text-foreground text-lg data-[type=dialog]:text-center",
    description: "text-foreground text-sm data-[type=dialog]:text-center",
    closeTrigger:
      "absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
    control: "mt-6 flex items-center justify-end gap-3",
  },
});

const {
  backdrop,
  spotlight,
  positioner,
  content,
  title,
  description,
  closeTrigger,
  control,
  progressText,
} = tourVariants();

const TourContext = ArkTour.Context;
const TourRoot = ArkTour.Root;
const TourActions = ArkTour.Actions;
const TourActionTrigger = ArkTour.ActionTrigger;

const TourBackdrop = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Backdrop>) => (
  <ArkTour.Backdrop className={cn(backdrop(), className)} {...rest} />
);

const TourSpotlight = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Spotlight>) => (
  <ArkTour.Spotlight className={cn(spotlight(), className)} {...rest} />
);

const TourPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Positioner>) => (
  <ArkTour.Positioner className={cn(positioner(), className)} {...rest} />
);

const TourContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Content>) => (
  <ArkTour.Content className={cn(content(), className)} {...rest} />
);

const TourProgressText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.ProgressText>) => (
  <ArkTour.ProgressText className={cn(progressText(), className)} {...rest} />
);

const TourTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Title>) => (
  <ArkTour.Title className={cn(title(), className)} {...rest} />
);

const TourDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Description>) => (
  <ArkTour.Description className={cn(description(), className)} {...rest} />
);

const TourCloseTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.CloseTrigger>) => (
  <ArkTour.CloseTrigger className={cn(closeTrigger(), className)} {...rest}>
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </ArkTour.CloseTrigger>
);

const TourControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTour.Control>) => (
  <ArkTour.Control className={cn(control(), className)} {...rest} />
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
