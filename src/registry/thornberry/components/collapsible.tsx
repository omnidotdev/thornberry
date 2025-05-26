import { Collapsible as ArkCollapsible } from "@ark-ui/react/collapsible";
import { FiChevronDown } from "react-icons/fi";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const CollapsibleProvider = ArkCollapsible.RootProvider;
const CollapsibleContext = ArkCollapsible.Context;

const CollapsibleRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCollapsible.Root>) => (
  <ArkCollapsible.Root className={cn("w-full", className)} {...rest} />
);

const CollapsibleTrigger = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkCollapsible.Trigger>) => (
  <ArkCollapsible.Trigger
    className={cn(
      "flex w-full items-center justify-between rounded-md px-4 py-2 font-medium text-sm transition-all",
      "bg-background hover:bg-muted/50",
      "data-[state=open]:bg-muted/50",
      "data-[state=open]:rounded-b-none",
      "[&[data-state=open]>svg]:rotate-180",
      className,
    )}
    {...rest}
  >
    {children}
    <FiChevronDown className="h-4 w-4 transition-transform" />
  </ArkCollapsible.Trigger>
);

const CollapsibleContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCollapsible.Content>) => (
  <ArkCollapsible.Content
    className={cn("overflow-hidden", className)}
    {...rest}
  />
);

export {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleProvider,
  CollapsibleContext,
};
