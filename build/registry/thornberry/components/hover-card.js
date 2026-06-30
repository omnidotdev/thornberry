import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/hover-card.tsx
import { HoverCard as ArkHoverCard } from "@ark-ui/react/hover-card";
import { jsx } from "react/jsx-runtime";
var HoverCardProvider = ArkHoverCard.RootProvider;
var HoverCardContext = ArkHoverCard.Context;
var HoverCardRoot = ArkHoverCard.Root;
var HoverCardTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkHoverCard.Trigger, {
  className: cn("rounded-md outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", className),
  ...rest
});
var HoverCardContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkHoverCard.Content, {
  className: cn("data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 w-64 rounded-md border bg-background p-4 shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in", className),
  ...rest
});
var HoverCardPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkHoverCard.Positioner, {
  className: cn("", className),
  ...rest
});
export {
  HoverCardTrigger,
  HoverCardRoot,
  HoverCardProvider,
  HoverCardPositioner,
  HoverCardContext,
  HoverCardContent
};
