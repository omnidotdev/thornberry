import { Accordion as ArkAccordion } from "@ark-ui/react/accordion";
import { cva } from "class-variance-authority";
import { LuChevronDown } from "react-icons/lu";

import { cn } from "@/lib/utils";

import type {
  AccordionItemContentProps,
  AccordionItemIndicatorProps,
  AccordionItemProps,
  AccordionItemTriggerProps,
  AccordionRootProps,
} from "@ark-ui/react";
import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const accordionVariants = cva("flex flex-col", {
  variants: {
    variant: {
      default: "bg-background",
      outline: "border border-border bg-background ",
      vertical: "flex-row",
    },
    size: {
      default: "gap-2",
      sm: "gap-1",
      lg: "gap-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const AccordionRoot = ({
  className,
  variant,
  ...rest
}: AccordionRootProps & VariantProps<typeof accordionVariants>) => (
  <ArkAccordion.Root
    className={cn(accordionVariants({ variant }), "border-t", className)}
    {...rest}
  />
);

const AccordionItem = ({ className, ...rest }: AccordionItemProps) => (
  <ArkAccordion.Item
    className={cn("flex flex-col border-b", className)}
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
      "flex flex-1 cursor-pointer items-center justify-between py-4 text-left font-medium text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkAccordion.ItemTrigger>
);

const AccordionItemIndicator = ({
  className,
  ...rest
}: AccordionItemIndicatorProps) => (
  <ArkAccordion.ItemIndicator
    className={cn(
      "flex items-center [&[data-state=open]>svg]:rotate-180",
      className,
    )}
    {...rest}
  >
    <LuChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
  </ArkAccordion.ItemIndicator>
);

const AccordionItemContent = ({
  className,
  children,
  ...rest
}: AccordionItemContentProps) => (
  <ArkAccordion.ItemContent
    // className={cn("flex items-center", className)}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...rest}
  >
    <div className={cn("pt-0 pb-4", className)}>{children}</div>
  </ArkAccordion.ItemContent>
);

interface AccordionProps
  extends AccordionRootProps,
    VariantProps<typeof accordionVariants> {
  items: (Omit<ArkAccordion.ItemProps, "title" | "value"> & {
    /** Title of item. */
    title: ReactNode;
    /** Content to display when item is open. */
    body: ReactNode;
    /** Whether item is disabled. */
    isDisabled?: boolean;
  })[];
  className?: string;
  disabled?: boolean;
  itemProps?: AccordionItemProps;
  triggerProps?: AccordionItemTriggerProps;
  indicatorProps?: AccordionItemIndicatorProps;
  contentProps?: AccordionItemContentProps;
}

const Accordion = ({
  className,
  items,
  variant,
  size,
  disabled,
  itemProps,
  triggerProps,
  indicatorProps,
  contentProps,
  ...rest
}: AccordionProps) => (
  <AccordionRoot
    multiple
    orientation="horizontal"
    className={cn(accordionVariants({ variant, size }), className)}
    {...rest}
  >
    {items.map(({ title, body, isDisabled, ...rest }, idx) => (
      <AccordionItem
        // NB: `title` is of type `ReactNode`, so the mapped index is appended to ensure uniqueness
        key={`${title?.toString()}-${idx}`}
        value={title!.toString()}
        disabled={isDisabled}
        {...itemProps}
        {...rest}
      >
        <AccordionItemTrigger {...triggerProps}>
          {title}

          <AccordionItemIndicator {...indicatorProps} />
        </AccordionItemTrigger>

        <AccordionItemContent {...contentProps}>{body}</AccordionItemContent>
      </AccordionItem>
    ))}
  </AccordionRoot>
);

export { Accordion };
