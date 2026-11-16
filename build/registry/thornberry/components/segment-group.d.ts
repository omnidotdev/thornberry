import { SegmentGroup as ArkSegmentGroup } from "@ark-ui/react/segment-group";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
declare const segmentGroupItemVariants: (props?: ({
    size?: "lg" | "md" | "sm" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const SegmentGroupProvider: import("react").ForwardRefExoticComponent<ArkSegmentGroup.RootProviderProps & import("react").RefAttributes<HTMLDivElement>>;
declare const SegmentGroupContext: (props: ArkSegmentGroup.ContextProps) => ReactNode;
declare const SegmentGroupItemContext: (props: ArkSegmentGroup.ItemContextProps) => ReactNode;
/**
 * Horizontal by default (Ark's segment group otherwise defaults to vertical,
 * inherited from its radio group machine).
 */
declare const SegmentGroupRoot: ({ className, orientation, ...rest }: ComponentProps<typeof ArkSegmentGroup.Root>) => import("react/jsx-runtime").JSX.Element;
declare const SegmentGroupLabel: ({ className, ...rest }: ComponentProps<typeof ArkSegmentGroup.Label>) => import("react/jsx-runtime").JSX.Element;
/**
 * The pill that slides under the selected item. Ark measures the selected
 * item and exposes its box as `--left`/`--top`/`--width`/`--height`, and
 * animates between positions.
 */
declare const SegmentGroupIndicator: ({ className, ...rest }: ComponentProps<typeof ArkSegmentGroup.Indicator>) => import("react/jsx-runtime").JSX.Element;
declare const SegmentGroupItem: ({ className, size, ...rest }: ComponentProps<typeof ArkSegmentGroup.Item> & VariantProps<typeof segmentGroupItemVariants>) => import("react/jsx-runtime").JSX.Element;
declare const SegmentGroupItemText: ({ className, ...rest }: ComponentProps<typeof ArkSegmentGroup.ItemText>) => import("react/jsx-runtime").JSX.Element;
declare const SegmentGroupItemControl: ({ className, ...rest }: ComponentProps<typeof ArkSegmentGroup.ItemControl>) => import("react/jsx-runtime").JSX.Element;
declare const SegmentGroupItemHiddenInput: import("react").ForwardRefExoticComponent<ArkSegmentGroup.ItemHiddenInputProps & import("react").RefAttributes<HTMLInputElement>>;
interface SegmentGroupOption {
    value: string;
    label?: ReactNode;
    disabled?: boolean;
}
interface SegmentGroupProps extends ComponentProps<typeof ArkSegmentGroup.Root>, VariantProps<typeof segmentGroupItemVariants> {
    /** Segments to render. A string is used as both the value and the label. */
    items: (string | SegmentGroupOption)[];
}
/**
 * A pill-style segmented control: a single-choice group whose selection is
 * marked by an indicator that slides between segments.
 */
declare const SegmentGroup: ({ items, size, ...rest }: SegmentGroupProps) => import("react/jsx-runtime").JSX.Element;
export type { SegmentGroupOption };
export { SegmentGroup, SegmentGroupContext, SegmentGroupIndicator, SegmentGroupItem, SegmentGroupItemContext, SegmentGroupItemControl, SegmentGroupItemHiddenInput, SegmentGroupItemText, SegmentGroupLabel, SegmentGroupProvider, SegmentGroupRoot, segmentGroupItemVariants, };
