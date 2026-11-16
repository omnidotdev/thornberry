import { SegmentGroup as ArkSegmentGroup } from "@ark-ui/react/segment-group";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const segmentGroupItemVariants = cva(
  "text-muted-foreground hover:text-foreground data-[state=checked]:text-foreground data-focus-visible:ring-primary relative z-10 inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-focus-visible:ring-2",
  {
    variants: {
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-8 px-3 text-sm",
        lg: "h-9 px-4 text-sm",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const SegmentGroupProvider = ArkSegmentGroup.RootProvider;
const SegmentGroupContext = ArkSegmentGroup.Context;
const SegmentGroupItemContext = ArkSegmentGroup.ItemContext;

/**
 * Horizontal by default (Ark's segment group otherwise defaults to vertical,
 * inherited from its radio group machine).
 */
const SegmentGroupRoot = ({
  className,
  orientation = "horizontal",
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.Root>) => (
  <ArkSegmentGroup.Root
    orientation={orientation}
    className={cn(
      "relative inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
      className,
    )}
    {...rest}
  />
);

const SegmentGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.Label>) => (
  <ArkSegmentGroup.Label
    className={cn("font-medium text-foreground text-sm", className)}
    {...rest}
  />
);

/**
 * The pill that slides under the selected item. Ark measures the selected
 * item and exposes its box as `--left`/`--top`/`--width`/`--height`, and
 * animates between positions.
 */
const SegmentGroupIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.Indicator>) => (
  <ArkSegmentGroup.Indicator
    className={cn(
      "top-(--top) left-(--left) h-(--height) w-(--width) rounded-md bg-background shadow-sm",
      className,
    )}
    {...rest}
  />
);

const SegmentGroupItem = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.Item> &
  VariantProps<typeof segmentGroupItemVariants>) => (
  <ArkSegmentGroup.Item
    className={cn(segmentGroupItemVariants({ size }), className)}
    {...rest}
  />
);

const SegmentGroupItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.ItemText>) => (
  <ArkSegmentGroup.ItemText className={className} {...rest} />
);

const SegmentGroupItemControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSegmentGroup.ItemControl>) => (
  <ArkSegmentGroup.ItemControl className={className} {...rest} />
);

const SegmentGroupItemHiddenInput = ArkSegmentGroup.ItemHiddenInput;

interface SegmentGroupOption {
  value: string;
  label?: ReactNode;
  disabled?: boolean;
}

interface SegmentGroupProps
  extends ComponentProps<typeof ArkSegmentGroup.Root>,
    VariantProps<typeof segmentGroupItemVariants> {
  /** Segments to render. A string is used as both the value and the label. */
  items: (string | SegmentGroupOption)[];
}

/**
 * A pill-style segmented control: a single-choice group whose selection is
 * marked by an indicator that slides between segments.
 */
const SegmentGroup = ({ items, size, ...rest }: SegmentGroupProps) => (
  <SegmentGroupRoot {...rest}>
    <SegmentGroupIndicator />

    {items.map((item) => {
      const { value, label, disabled } =
        typeof item === "string" ? { value: item, label: item } : item;

      return (
        <SegmentGroupItem
          key={value}
          value={value}
          disabled={disabled}
          size={size}
        >
          <SegmentGroupItemText>{label ?? value}</SegmentGroupItemText>
          <SegmentGroupItemHiddenInput />
        </SegmentGroupItem>
      );
    })}
  </SegmentGroupRoot>
);

export type { SegmentGroupOption };
export {
  SegmentGroup,
  SegmentGroupContext,
  SegmentGroupIndicator,
  SegmentGroupItem,
  SegmentGroupItemContext,
  SegmentGroupItemControl,
  SegmentGroupItemHiddenInput,
  SegmentGroupItemText,
  SegmentGroupLabel,
  SegmentGroupProvider,
  SegmentGroupRoot,
  segmentGroupItemVariants,
};
