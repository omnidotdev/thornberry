import { Select as ArkSelect } from "@ark-ui/react/select";
import type { SelectRootProps } from "@ark-ui/react/select";
import type { ComponentProps, HTMLAttributes } from "react";
declare const SelectRoot: ArkSelect.RootComponent<{}>;
declare const SelectRootProvider: ArkSelect.RootProviderComponent<{}>;
declare const SelectContext: <T extends unknown>(props: ArkSelect.ContextProps<T>) => import("react").ReactNode;
declare const SelectHiddenSelect: import("react").ForwardRefExoticComponent<ArkSelect.HiddenSelectProps & import("react").RefAttributes<HTMLSelectElement>>;
declare const Select: <T>({ className, ...rest }: SelectRootProps<T>) => import("react/jsx-runtime").JSX.Element;
declare const SelectLabel: ({ className, ...rest }: ComponentProps<typeof ArkSelect.Label>) => import("react/jsx-runtime").JSX.Element;
declare const SelectControl: ({ className, ...rest }: ComponentProps<typeof ArkSelect.Control>) => import("react/jsx-runtime").JSX.Element;
declare const SelectTrigger: ({ className, ...rest }: ComponentProps<typeof ArkSelect.Trigger>) => import("react/jsx-runtime").JSX.Element;
declare const SelectValueText: ({ className, ...rest }: ComponentProps<typeof ArkSelect.ValueText>) => import("react/jsx-runtime").JSX.Element;
declare const SelectIndicator: ({ className, children, ...rest }: ComponentProps<typeof ArkSelect.Indicator>) => import("react/jsx-runtime").JSX.Element;
declare const SelectClearTrigger: ({ className, ...rest }: ComponentProps<typeof ArkSelect.ClearTrigger>) => import("react/jsx-runtime").JSX.Element;
declare const SelectPositioner: ({ className, ...rest }: ComponentProps<typeof ArkSelect.Positioner>) => import("react/jsx-runtime").JSX.Element;
declare const SelectContent: ({ className, children, ...rest }: ComponentProps<typeof ArkSelect.Content>) => import("react/jsx-runtime").JSX.Element;
declare const SelectItemGroup: ({ className, ...rest }: ComponentProps<typeof ArkSelect.ItemGroup>) => import("react/jsx-runtime").JSX.Element;
declare const SelectItemGroupLabel: ({ className, ...rest }: ComponentProps<typeof ArkSelect.ItemGroupLabel>) => import("react/jsx-runtime").JSX.Element;
declare const SelectItem: ({ className, children, ...rest }: ComponentProps<typeof ArkSelect.Item>) => import("react/jsx-runtime").JSX.Element;
declare const SelectItemText: ({ className, ...rest }: ComponentProps<typeof ArkSelect.ItemText>) => import("react/jsx-runtime").JSX.Element;
declare const SelectItemIndicator: ({ className, children, ...rest }: ComponentProps<typeof ArkSelect.ItemIndicator>) => import("react/jsx-runtime").JSX.Element;
declare const SelectSeparator: ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => import("react/jsx-runtime").JSX.Element;
interface SelectOption {
    value: string;
    label: string;
    /** Secondary text shown in the list only, never in the trigger */
    hint?: string;
    disabled?: boolean;
}
interface OptionsSelectProps {
    value: string;
    options: SelectOption[];
    onValueChange: (value: string) => void;
    /** Shown in the trigger while nothing is selected */
    placeholder?: string;
    /** Visible label above the trigger */
    label?: string;
    /** Accessible name when there is no visible label */
    "aria-label"?: string;
    /** Id for the trigger, so an external `<Label htmlFor>` points at it */
    id?: string;
    name?: string;
    disabled?: boolean;
    /** `sm` is a compact trigger for toolbars and dense rows */
    size?: "sm" | "md";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Classes for the root (width, layout) */
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
    /** Classes for the positioner, e.g. a `z-*` above a product overlay */
    positionerClassName?: string;
}
/**
 * Single-choice select from a flat list of string options: label, trigger,
 * portaled list, and hidden native select for forms. Fills its container
 * like an input. Compose `Select` and its parts for groups, rich items, or
 * multiple selection.
 */
declare const OptionsSelect: ({ value, options, onValueChange, placeholder, label, "aria-label": ariaLabel, id, name, disabled, size, open, onOpenChange, className, triggerClassName, contentClassName, positionerClassName, }: OptionsSelectProps) => import("react/jsx-runtime").JSX.Element;
export { createListCollection } from "@ark-ui/react";
export { OptionsSelect, type OptionsSelectProps, Select, SelectClearTrigger, SelectContent, SelectContext, SelectControl, SelectHiddenSelect, SelectIndicator, SelectItem, SelectItemGroup, SelectItemGroupLabel, SelectItemIndicator, SelectItemText, SelectLabel, type SelectOption, SelectPositioner, SelectRoot, SelectRootProvider, SelectSeparator, SelectTrigger, SelectValueText, };
