import { Collapsible as ArkCollapsible } from "@ark-ui/react/collapsible";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

import type { ComponentProps, ReactNode } from "react";

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
      "flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium",
      "bg-background hover:bg-muted/50",
      "data-[state=open]:bg-muted/50",
      className,
    )}
    {...rest}
  >
    {children}
    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
  </ArkCollapsible.Trigger>
);

const CollapsibleContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCollapsible.Content>) => (
  <ArkCollapsible.Content
    className={cn(
      "overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand",
      className,
    )}
    {...rest}
  />
);

interface CollapsibleProps extends ComponentProps<typeof CollapsibleRoot> {
  trigger: ReactNode;
  children: ReactNode;
}

const Collapsible = ({ trigger, children, ...rest }: CollapsibleProps) => (
  <CollapsibleRoot {...rest}>
    <CollapsibleTrigger>{trigger}</CollapsibleTrigger>
    <CollapsibleContent>{children}</CollapsibleContent>
  </CollapsibleRoot>
);

export {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleProvider,
  CollapsibleContext,
  Collapsible,
};
