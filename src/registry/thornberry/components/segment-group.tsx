import { SegmentGroup as ArkSegmentGroup } from "@ark-ui/react/segment-group";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const SegmentGroupProvider = ArkSegmentGroup.RootProvider;
const SegmentGroupContext = ArkSegmentGroup.Context;

const SegmentGroupRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.Root>) => (
  <ArkSegmentGroup.Root
    className={cn(
      "relative inline-flex items-center rounded-lg bg-muted p-1",
      className,
    )}
    {...rest}
  />
);

const SegmentGroupIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.Indicator>) => (
  <ArkSegmentGroup.Indicator
    className={cn(
      "absolute rounded-md bg-background shadow-sm transition-all",
      className,
    )}
    {...rest}
  />
);

const SegmentGroupItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.Item>) => (
  <ArkSegmentGroup.Item
    className={cn(
      "relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap px-3 py-1.5 font-medium text-sm transition-colors",
      "hover:text-foreground",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=checked]:text-foreground",
      "z-10",
      className,
    )}
    {...rest}
  />
);

const SegmentGroupItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.ItemText>) => (
  <ArkSegmentGroup.ItemText
    className={cn("relative z-20", className)}
    {...rest}
  />
);

const SegmentGroupItemControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.ItemControl>) => (
  <ArkSegmentGroup.ItemControl className={cn("sr-only", className)} {...rest} />
);

const SegmentGroupItemHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.ItemHiddenInput>) => (
  <ArkSegmentGroup.ItemHiddenInput
    className={cn("sr-only", className)}
    {...rest}
  />
);

const SegmentGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.Label>) => (
  <ArkSegmentGroup.Label
    className={cn("mb-2 font-medium text-sm", className)}
    {...rest}
  />
);

export {
  SegmentGroupRoot,
  SegmentGroupIndicator,
  SegmentGroupItem,
  SegmentGroupItemText,
  SegmentGroupItemControl,
  SegmentGroupItemHiddenInput,
  SegmentGroupLabel,
  SegmentGroupProvider,
  SegmentGroupContext,
};
