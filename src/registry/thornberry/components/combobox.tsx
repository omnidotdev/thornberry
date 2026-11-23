import {
  Combobox as ArkCombobox,
  createListCollection,
} from "@ark-ui/react/combobox";
import { Portal } from "@ark-ui/react/portal";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type {
  Combobox as ComboboxProps,
  ComboboxRootProps,
} from "@ark-ui/react/combobox";
import type { ComponentProps, ReactNode } from "react";

const ComboboxProvider = ArkCombobox.RootProvider;
const ComboboxContext = ArkCombobox.Context;

const ComboboxRoot = <T,>({ className, ...rest }: ComboboxRootProps<T>) => (
  <ArkCombobox.Root
    className={cn("flex w-full flex-col gap-1.5", className)}
    {...rest}
  />
);

const ComboboxLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Label>) => (
  <ArkCombobox.Label
    className={cn("block font-medium text-sm", className)}
    {...rest}
  />
);

const ComboboxControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Control>) => (
  <ArkCombobox.Control
    className={cn("relative flex items-center justify-between", className)}
    {...rest}
  />
);

const ComboboxInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Input>) => (
  <ArkCombobox.Input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const ComboboxTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Trigger>) => (
  <ArkCombobox.Trigger asChild {...rest}>
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute top-0.5 right-0.5 opacity-50 hover:bg-background",
        className,
      )}
    >
      <ChevronsUpDown className="size-4" />
    </Button>
  </ArkCombobox.Trigger>
);

const ComboboxClearTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ClearTrigger>) => (
  <ArkCombobox.ClearTrigger
    className={cn(
      "absolute top-0 right-10 flex h-full items-center justify-center pr-2 text-muted-foreground hover:text-foreground disabled:pointer-events-none",
      className,
    )}
    {...rest}
  />
);

const ComboboxPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Positioner>) => (
  <ArkCombobox.Positioner
    className={cn("z-50 w-full min-w-32", className)}
    {...rest}
  />
);

const ComboboxContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Content>) => (
  <ArkCombobox.Content
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 max-h-[300px] overflow-y-auto rounded-md border bg-popover p-1 shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  />
);

const ComboboxItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkCombobox.Item>) => (
  <ArkCombobox.Item
    className={cn(
      "flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 pr-2 text-sm outline-none data-disabled:pointer-events-none data-[state=checked]:bg-muted data-highlighted:bg-muted data-disabled:opacity-50",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkCombobox.Item>
);

const ComboboxItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ItemGroup>) => (
  <ArkCombobox.ItemGroup className={cn("p-1", className)} {...rest} />
);

const ComboboxItemGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ItemGroupLabel>) => (
  <ArkCombobox.ItemGroupLabel
    className={cn(
      "px-2 py-1.5 font-medium text-muted-foreground text-xs",
      className,
    )}
    {...rest}
  />
);

const ComboboxItemIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ItemIndicator>) => (
  <ArkCombobox.ItemIndicator
    className={cn(
      "ml-auto flex h-3.5 w-3.5 items-center justify-center",
      className,
    )}
    {...rest}
  >
    <Check className="size-4" />
  </ArkCombobox.ItemIndicator>
);

const ComboboxItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ItemText>) => (
  <ArkCombobox.ItemText className={className} {...rest} />
);

/** Shown in the list when no item matches the input */
const ComboboxEmpty = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Empty>) => (
  <ArkCombobox.Empty
    className={cn(
      "px-2 py-4 text-center text-muted-foreground text-sm",
      className,
    )}
    {...rest}
  />
);

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
const OptionsCombobox = ({
  items,
  value,
  onValueChange,
  inputValue,
  onInputValueChange,
  placeholder = "Select...",
  label,
  emptyLabel = "No results",
  disabled,
  className,
}: OptionsComboboxProps) => {
  const collection = useMemo(
    () =>
      createListCollection({
        items,
        isItemDisabled: (item) => Boolean(item.disabled),
      }),
    [items],
  );

  return (
    <ComboboxRoot
      collection={collection}
      value={value}
      onValueChange={(details) => onValueChange?.(details.value)}
      inputValue={inputValue}
      onInputValueChange={(details) => onInputValueChange?.(details.inputValue)}
      disabled={disabled}
      loopFocus
      openOnClick
      positioning={{ sameWidth: true }}
      lazyMount
      unmountOnExit
      className={className}
    >
      {label && <ComboboxLabel>{label}</ComboboxLabel>}
      <ComboboxControl>
        <ComboboxInput placeholder={placeholder} />
        <ComboboxTrigger />
      </ComboboxControl>
      <Portal>
        <ComboboxPositioner>
          {/* the list matches the input's width, so long labels truncate
              instead of running off a phone screen */}
          <ComboboxContent className="w-full">
            {items.map((item) => (
              <ComboboxItem key={item.value} item={item}>
                <ComboboxItemText className="flex min-w-0 flex-1 items-center">
                  <span className="min-w-0 truncate">{item.label}</span>
                  {item.description && (
                    <span className="text-muted-foreground ml-2 shrink-0 text-xs">
                      {item.description}
                    </span>
                  )}
                </ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
            <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
          </ComboboxContent>
        </ComboboxPositioner>
      </Portal>
    </ComboboxRoot>
  );
};

export {
  ComboboxClearTrigger,
  ComboboxContent,
  ComboboxContext,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  type ComboboxOption,
  ComboboxPositioner,
  type ComboboxProps,
  ComboboxProvider,
  ComboboxRoot,
  ComboboxTrigger,
  OptionsCombobox,
  type OptionsComboboxProps,
};
