import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/tour.tsx
import { Tour as ArkTour } from "@ark-ui/react/tour";
import { X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var TourContext = ArkTour.Context;
var TourRoot = ArkTour.Root;
var TourActions = ArkTour.Actions;
var TourActionTrigger = ArkTour.ActionTrigger;
var TourBackdrop = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTour.Backdrop, {
  className: cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-[backdrop-out] data-[state=open]:animate-[backdrop-in]", className),
  ...rest
});
var TourSpotlight = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTour.Spotlight, {
  className: cn("fixed inset-0 z-45", className),
  ...rest
});
var TourPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTour.Positioner, {
  className: cn("z-50 flex items-center justify-center data-[type=dialog]:fixed data-[type=floating]:absolute data-[type=tooltip]:absolute data-[type=dialog]:inset-0 data-[type=floating]:right-6 data-[type=floating]:bottom-6", className),
  ...rest
});
var TourContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTour.Content, {
  className: cn("data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-top-[2%] data-[state=closed]:slide-out-to-top-[2%] relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg", className),
  ...rest
});
var TourProgressText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTour.ProgressText, {
  className: cn("text-muted-foreground text-sm", className),
  ...rest
});
var TourTitle = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTour.Title, {
  className: cn("font-semibold text-foreground text-lg data-[type=dialog]:text-center", className),
  ...rest
});
var TourDescription = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTour.Description, {
  className: cn("text-foreground text-sm data-[type=dialog]:text-center", className),
  ...rest
});
var TourCloseTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxs(ArkTour.CloseTrigger, {
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
var TourControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTour.Control, {
  className: cn("mt-6 flex items-center justify-end gap-4", className),
  ...rest
});
export {
  TourTitle,
  TourSpotlight,
  TourRoot,
  TourProgressText,
  TourPositioner,
  TourDescription,
  TourControl,
  TourContext,
  TourContent,
  TourCloseTrigger,
  TourBackdrop,
  TourActions,
  TourActionTrigger
};
