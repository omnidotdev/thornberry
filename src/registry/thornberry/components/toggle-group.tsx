import { ToggleGroup as ArkToggleGroup } from "@ark-ui/react/toggle-group";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const ToggleGroupProvider = ArkToggleGroup.RootProvider;
const ToggleGroupContext = ArkToggleGroup.Context;

const ToggleGroupRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkToggleGroup.Root>) => (
  <ArkToggleGroup.Root
    className={cn(
      "inline-flex items-center justify-center rounded-md bg-muted p-1",
      className,
    )}
    {...rest}
  />
);

const ToggleGroupItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkToggleGroup.Item>) => (
  <ArkToggleGroup.Item
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm ring-offset-background transition-all",
      "hover:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm",
      className,
    )}
    {...rest}
  />
);

export {
  ToggleGroupRoot,
  ToggleGroupItem,
  ToggleGroupProvider,
  ToggleGroupContext,
};
