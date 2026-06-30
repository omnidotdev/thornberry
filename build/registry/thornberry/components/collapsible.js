import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/collapsible.tsx
import { Collapsible as ArkCollapsible } from "@ark-ui/react/collapsible";
import { jsx } from "react/jsx-runtime";
var CollapsibleProvider = ArkCollapsible.RootProvider;
var CollapsibleContext = ArkCollapsible.Context;
var CollapsibleRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCollapsible.Root, {
  className: cn("w-full", className),
  ...rest
});
var CollapsibleTrigger = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCollapsible.Trigger, {
  className: cn("transform] flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-3 font-medium text-sm outline-none transition-[color,box-shadow,transition] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [&[data-state=open]>svg]:rotate-90", className),
  ...rest,
  children
});
var CollapsibleContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCollapsible.Content, {
  className: cn("overflow-hidden rounded-b-md border border-muted/50 border-t-0 p-4", className),
  ...rest
});
export {
  CollapsibleTrigger,
  CollapsibleRoot,
  CollapsibleProvider,
  CollapsibleContext,
  CollapsibleContent
};
