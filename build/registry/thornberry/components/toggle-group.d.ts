import { ToggleGroup as ArkToggleGroup } from "@ark-ui/react/toggle-group";
import { toggleVariants } from "../../../registry/thornberry/components/toggle";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
type ToggleGroupVariantProps = VariantProps<typeof toggleVariants>;
declare const ToggleGroupProvider: import("react").ForwardRefExoticComponent<ArkToggleGroup.RootProviderProps & import("react").RefAttributes<HTMLDivElement>>;
declare const ToggleGroupContext: (props: ArkToggleGroup.ContextProps) => import("react").ReactNode;
/**
 * A set of toggle buttons. Single selection by default; pass `multiple` to
 * allow several items on at once. `value` is always an array of item values.
 * `variant` and `size` set here apply to every item unless an item overrides
 * them.
 */
declare const ToggleGroupRoot: ({ className, variant, size, ...rest }: ComponentProps<typeof ArkToggleGroup.Root> & ToggleGroupVariantProps) => import("react/jsx-runtime").JSX.Element;
declare const ToggleGroupItem: ({ className, variant, size, ...rest }: ComponentProps<typeof ArkToggleGroup.Item> & ToggleGroupVariantProps) => import("react/jsx-runtime").JSX.Element;
export { ToggleGroupContext, ToggleGroupItem, ToggleGroupProvider, ToggleGroupRoot, };
