import {
  cn
} from "./account-user-two-factor-authentication-81fr4sax.js";

// src/registry/thornberry/components/tooltip.tsx
import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import { jsx } from "react/jsx-runtime";
var TooltipProvider2 = ArkTooltip.RootProvider;
var TooltipRoot2 = ArkTooltip.Root;
var TooltipArrow2 = ArkTooltip.Arrow;
var TooltipTrigger2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTooltip.Trigger, {
  "data-slot": "tooltip-trigger",
  className,
  ...rest
});
var TooltipPositioner2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTooltip.Positioner, {
  className,
  ...rest
});
var TooltipContent2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTooltip.Content, {
  "data-slot": "tooltip-content",
  className: cn("fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 flex h-10 animate-in items-center overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md data-[state=closed]:animate-out", className),
  ...rest
});
var TooltipArrowTip2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkTooltip.ArrowTip, {
  className: cn("border-t border-l", className),
  ...rest
});
export { TooltipProvider2, TooltipRoot2, TooltipArrow2, TooltipTrigger2, TooltipPositioner2, TooltipContent2, TooltipArrowTip2 };
