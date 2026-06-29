import {
  cn
} from "./avatar-yp1ewaxt.js";

// src/registry/thornberry/components/tooltip.tsx
import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import { jsxDEV } from "react/jsx-dev-runtime";
var TooltipProvider = ArkTooltip.RootProvider;
var TooltipRoot = ArkTooltip.Root;
var TooltipArrow = ArkTooltip.Arrow;
var TooltipTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTooltip.Trigger, {
  "data-slot": "tooltip-trigger",
  className,
  ...rest
}, undefined, false, undefined, this);
var TooltipPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTooltip.Positioner, {
  className,
  ...rest
}, undefined, false, undefined, this);
var TooltipContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTooltip.Content, {
  "data-slot": "tooltip-content",
  className: cn("fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 flex h-10 animate-in items-center overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md data-[state=closed]:animate-out", className),
  ...rest
}, undefined, false, undefined, this);
var TooltipArrowTip = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTooltip.ArrowTip, {
  className: cn("border-t border-l", className),
  ...rest
}, undefined, false, undefined, this);
export { TooltipProvider, TooltipRoot, TooltipArrow, TooltipTrigger, TooltipPositioner, TooltipContent, TooltipArrowTip };
