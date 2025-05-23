import { Accordion as ArkAccordion } from "@ark-ui/react/accordion";
import { FiChevronDown } from "react-icons/fi";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

const AccordionProvider = ArkAccordion.RootProvider;
const AccordionContext = ArkAccordion.Context;

const AccordionRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkAccordion.Root>) => (
  <ArkAccordion.Root className={cn("w-full", className)} {...rest} />
);

const AccordionItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkAccordion.Item>) => (
  <ArkAccordion.Item className={cn("border-b", className)} {...rest} />
);

const AccordionItemTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkAccordion.ItemTrigger>) => (
  <ArkAccordion.ItemTrigger
    className={cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkAccordion.ItemTrigger>
);

const AccordionItemIndicator = ({
  className,
  children = (
    <FiChevronDown className="size-4 transition-transform duration-200" />
  ),
  ...rest
}: ComponentProps<typeof ArkAccordion.ItemIndicator>) => (
  <ArkAccordion.ItemIndicator className={cn("ml-2", className)} {...rest}>
    {children}
  </ArkAccordion.ItemIndicator>
);

const AccordionItemContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkAccordion.ItemContent>) => (
  <ArkAccordion.ItemContent
    className={cn(
      "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className,
    )}
    {...rest}
  />
);

interface AccordionProps extends ComponentProps<typeof AccordionRoot> {
  items: Array<{
    value: string;
    trigger: ReactNode;
    content: ReactNode;
    disabled?: boolean;
  }>;
}

const Accordion = ({ items, ...rest }: AccordionProps) => (
  <AccordionRoot {...rest}>
    {items.map((item) => (
      <AccordionItem
        key={item.value}
        value={item.value}
        disabled={item.disabled}
      >
        <AccordionItemTrigger>
          {item.trigger}
          <AccordionItemIndicator />
        </AccordionItemTrigger>
        <AccordionItemContent>
          <div className="pb-4 pt-0">{item.content}</div>
        </AccordionItemContent>
      </AccordionItem>
    ))}
  </AccordionRoot>
);

export {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemIndicator,
  AccordionItemContent,
  AccordionProvider,
  AccordionContext,
  Accordion,
  type AccordionProps,
};
