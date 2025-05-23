import { Tabs as ArkTabs } from "@ark-ui/react/tabs";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

const TabsProvider = ArkTabs.RootProvider;
const TabsContext = ArkTabs.Context;

const TabsRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTabs.Root>) => (
  <ArkTabs.Root className={cn("w-full", className)} {...rest} />
);

const TabsList = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTabs.List>) => (
  <ArkTabs.List
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...rest}
  />
);

const TabsTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTabs.Trigger>) => (
  <ArkTabs.Trigger
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className,
    )}
    {...rest}
  />
);

const TabsContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTabs.Content>) => (
  <ArkTabs.Content
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...rest}
  />
);

const TabsIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkTabs.Indicator>) => (
  <ArkTabs.Indicator
    className={cn(
      "absolute transition-all duration-200 data-[orientation=horizontal]:bottom-0 data-[orientation=vertical]:right-0",
      className,
    )}
    {...rest}
  />
);

interface TabsProps extends ComponentProps<typeof TabsRoot> {
  tabs: Array<{
    value: string;
    trigger: ReactNode;
    content: ReactNode;
    disabled?: boolean;
  }>;
}

const Tabs = ({ tabs, ...rest }: TabsProps) => (
  <TabsRoot defaultValue={tabs[0]?.value} {...rest}>
    <TabsList>
      {tabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value} disabled={tab.disabled}>
          {tab.trigger}
        </TabsTrigger>
      ))}
    </TabsList>
    {tabs.map((tab) => (
      <TabsContent key={tab.value} value={tab.value}>
        {tab.content}
      </TabsContent>
    ))}
  </TabsRoot>
);

export {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
  TabsProvider,
  TabsContext,
  Tabs,
  type TabsProps,
};
