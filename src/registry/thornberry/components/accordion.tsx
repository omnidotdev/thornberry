import { Accordion as ArkAccordion } from "@ark-ui/react/accordion";
import { FiChevronDown } from "react-icons/fi";

import { cn } from "@/lib/utils";

import type {
  AccordionItemContentProps,
  AccordionItemProps,
  AccordionItemTriggerProps,
  AccordionRootProps,
} from "@ark-ui/react";

const AccordionRoot = ({ className, ...rest }: AccordionRootProps) => (
  <ArkAccordion.Root
    className={cn(
      "flex flex-col border-t",
      "data-[orientation=horizontal]:flex-row",
      "data-[orientation=horizontal]:gap-4",
      "data-[orientation=horizontal]:border-none",
      className,
    )}
    {...rest}
  />
);

const AccordionItem = ({ className, ...rest }: AccordionItemProps) => (
  <ArkAccordion.Item
    className={cn(
      "group flex flex-col border-b px-2",
      "data-disabled:opacity-50",
      "data-[orientation=horizontal]:w-full",
      "data-[orientation=horizontal]:border-none",
      className,
    )}
    {...rest}
  />
);

const AccordionItemTrigger = ({
  className,
  children,
  ...rest
}: AccordionItemTriggerProps) => (
  <ArkAccordion.ItemTrigger
    className={cn(
      "flex flex-1 cursor-pointer items-center justify-between py-4 text-left font-medium text-sm transition-all disabled:cursor-not-allowed",
      "data-[orientation=horizontal]:items-start",
      "[&[data-state=open]>svg]:rotate-180",
      className,
    )}
    {...rest}
  >
    {children}
    <FiChevronDown className="h-4 w-4 transition-transform" />
  </ArkAccordion.ItemTrigger>
);

const AccordionItemContent = ({
  className,
  children,
  ...rest
}: AccordionItemContentProps) => (
  <ArkAccordion.ItemContent
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...rest}
  >
    <div className={cn("pt-0 pb-4", className)}>{children}</div>
  </ArkAccordion.ItemContent>
);

export {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
};
