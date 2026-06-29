import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/accordion.tsx
import { Accordion as ArkAccordion } from "@ark-ui/react";
import { ChevronDown } from "lucide-react";
import { jsxDEV } from "react/jsx-dev-runtime";
var AccordionRoot = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV(ArkAccordion.Root, {
  className: cn("flex flex-col data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:gap-4 data-[orientation=horizontal]:border-none", className),
  ...rest
}, undefined, false, undefined, this);
var AccordionItem = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV(ArkAccordion.Item, {
  className: cn("group flex flex-col border-b data-[orientation=horizontal]:w-full data-[orientation=horizontal]:border-none data-disabled:opacity-50", className),
  ...rest
}, undefined, false, undefined, this);
var AccordionItemTrigger = ({
  className,
  children,
  icon,
  ...rest
}) => {
  const Icon = icon ?? ChevronDown;
  return /* @__PURE__ */ jsxDEV(ArkAccordion.ItemTrigger, {
    className: cn("flex flex-1 cursor-pointer items-center justify-between rounded-md px-2 py-4 text-left font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed data-[orientation=horizontal]:items-start [&[data-state=open]>svg]:rotate-180", className),
    ...rest,
    children: [
      children,
      /* @__PURE__ */ jsxDEV(Icon, {
        className: "size-4 transition-transform"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var AccordionItemContent = ({
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkAccordion.ItemContent, {
  className: "overflow-hidden px-2 text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  ...rest,
  children: /* @__PURE__ */ jsxDEV("div", {
    className: cn("pt-0 pb-4", className),
    children
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
export {
  AccordionRoot,
  AccordionItemTrigger,
  AccordionItemContent,
  AccordionItem
};
