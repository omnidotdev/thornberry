import { Combobox as ArkCombobox } from "@ark-ui/react/combobox";
import type { Combobox as ComboboxProps, ComboboxRootProps } from "@ark-ui/react/combobox";
import type { ComponentProps, ReactNode } from "react";
declare const ComboboxProvider: ArkCombobox.RootProviderComponent<{}>;
declare const ComboboxContext: <T extends unknown>(props: ArkCombobox.ContextProps<T>) => ReactNode;
declare const ComboboxRoot: <T>({ className, ...rest }: ComboboxRootProps<T>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxLabel: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.Label>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxControl: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.Control>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxInput: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.Input>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxTrigger: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.Trigger>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxClearTrigger: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.ClearTrigger>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxPositioner: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.Positioner>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxContent: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.Content>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxItem: ({ className, children, ...rest }: ComponentProps<typeof ArkCombobox.Item>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxItemGroup: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.ItemGroup>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxItemGroupLabel: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.ItemGroupLabel>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxItemIndicator: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.ItemIndicator>) => import("react/jsx-runtime").JSX.Element;
declare const ComboboxItemText: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.ItemText>) => import("react/jsx-runtime").JSX.Element;
/** Shown in the list when no item matches the input */
declare const ComboboxEmpty: ({ className, ...rest }: ComponentProps<typeof ArkCombobox.Empty>) => import("react/jsx-runtime").JSX.Element;
interface ComboboxOption {
    value: string;
    label: string;
    /** Secondary text shown muted beside the label (e.g. metadata) */
    description?: string;
    disabled?: boolean;
}
interface OptionsComboboxProps {
    /** Items to list; filter them yourself from `inputValue` */
    items: ComboboxOption[];
    value?: string[];
    onValueChange?: (value: string[]) => void;
    inputValue?: string;
    onInputValueChange?: (inputValue: string) => void;
    placeholder?: string;
    /** Visible label above the input */
    label?: string;
    /** Shown when `items` is empty */
    emptyLabel?: ReactNode;
    disabled?: boolean;
    className?: string;
}
/**
 * Searchable single or multiple choice from a list of items: input, toggle,
 * portaled list with optional per-item descriptions, and an empty state. The
 * list opens on click as well as on typing. Pass already-filtered `items`
 * (from `inputValue`); compose `ComboboxRoot` and its parts for anything else.
 */
declare const OptionsCombobox: ({ items, value, onValueChange, inputValue, onInputValueChange, placeholder, label, emptyLabel, disabled, className, }: OptionsComboboxProps) => import("react/jsx-runtime").JSX.Element;
export { ComboboxClearTrigger, ComboboxContent, ComboboxContext, ComboboxControl, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxItemGroup, ComboboxItemGroupLabel, ComboboxItemIndicator, ComboboxItemText, ComboboxLabel, type ComboboxOption, ComboboxPositioner, type ComboboxProps, ComboboxProvider, ComboboxRoot, ComboboxTrigger, OptionsCombobox, type OptionsComboboxProps, };
