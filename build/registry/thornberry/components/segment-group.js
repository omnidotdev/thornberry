import {
  cva
} from "../../../chunks/ai-describe-panel-dcxtbj5x.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-zm6svx9v.js";

// src/registry/thornberry/components/segment-group.tsx
import { SegmentGroup as ArkSegmentGroup } from "@ark-ui/react/segment-group";
import { jsx, jsxs } from "react/jsx-runtime";
var segmentGroupItemVariants = cva("text-muted-foreground hover:text-foreground data-[state=checked]:text-foreground data-focus-visible:ring-primary relative z-10 inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-focus-visible:ring-2", {
  variants: {
    size: {
      sm: "h-7 px-2.5 text-xs",
      md: "h-8 px-3 text-sm",
      lg: "h-9 px-4 text-sm"
    }
  },
  defaultVariants: { size: "md" }
});
var SegmentGroupProvider = ArkSegmentGroup.RootProvider;
var SegmentGroupContext = ArkSegmentGroup.Context;
var SegmentGroupItemContext = ArkSegmentGroup.ItemContext;
var SegmentGroupRoot = ({
  className,
  orientation = "horizontal",
  ...rest
}) => /* @__PURE__ */ jsx(ArkSegmentGroup.Root, {
  orientation,
  className: cn("relative inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch", className),
  ...rest
});
var SegmentGroupLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSegmentGroup.Label, {
  className: cn("font-medium text-foreground text-sm", className),
  ...rest
});
var SegmentGroupIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSegmentGroup.Indicator, {
  className: cn("top-(--top) left-(--left) h-(--height) w-(--width) rounded-md bg-background shadow-sm", className),
  ...rest
});
var SegmentGroupItem = ({
  className,
  size,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSegmentGroup.Item, {
  className: cn(segmentGroupItemVariants({ size }), className),
  ...rest
});
var SegmentGroupItemText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSegmentGroup.ItemText, {
  className,
  ...rest
});
var SegmentGroupItemControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSegmentGroup.ItemControl, {
  className,
  ...rest
});
var SegmentGroupItemHiddenInput = ArkSegmentGroup.ItemHiddenInput;
var SegmentGroup = ({ items, size, ...rest }) => /* @__PURE__ */ jsxs(SegmentGroupRoot, {
  ...rest,
  children: [
    /* @__PURE__ */ jsx(SegmentGroupIndicator, {}),
    items.map((item) => {
      const { value, label, disabled } = typeof item === "string" ? { value: item, label: item } : item;
      return /* @__PURE__ */ jsxs(SegmentGroupItem, {
        value,
        disabled,
        size,
        children: [
          /* @__PURE__ */ jsx(SegmentGroupItemText, {
            children: label ?? value
          }),
          /* @__PURE__ */ jsx(SegmentGroupItemHiddenInput, {})
        ]
      }, value);
    })
  ]
});
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
  segmentGroupItemVariants
};
