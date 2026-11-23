import { createListCollection } from "@ark-ui/react/collection";
import { Portal } from "@ark-ui/react/portal";
import { Select as ArkSelect } from "@ark-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

import type { SelectRootProps } from "@ark-ui/react/select";
import type { ComponentProps, HTMLAttributes } from "react";

const SelectRoot = ArkSelect.Root;
const SelectRootProvider = ArkSelect.RootProvider;
const SelectContext = ArkSelect.Context;
const SelectHiddenSelect = ArkSelect.HiddenSelect;

// TODO: fix types upstream in thornberry
const Select = <T,>({ className, ...rest }: SelectRootProps<T>) => (
  <ArkSelect.Root className={className} {...rest} />
);

const SelectLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Label>) => (
  <ArkSelect.Label
    className={cn(
      "font-medium text-muted-foreground text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...rest}
  />
);

const SelectControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Control>) => (
  <ArkSelect.Control className={className} {...rest} />
);

// TODO: edit in thornberry to get rid of React.Children.only error when using `asChild` prop
const SelectTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Trigger>) => (
  <ArkSelect.Trigger
    className={cn(
      "flex w-fit cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-md px-3 py-2 text-foreground text-sm shadow-xs outline-none transition-transform disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=xs]:h-7 dark:aria-invalid:ring-destructive/40 dark:hover:bg-base-800 [&[data-state=open]>svg]:rotate-180 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    )}
    {...rest}
  />
);

const SelectValueText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ValueText>) => (
  <ArkSelect.ValueText
    className={cn("line-clamp-1 flex items-center gap-2", className)}
    {...rest}
  />
);

const SelectIndicator = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.Indicator>) => (
  <ArkSelect.Indicator
    className={cn("size-4 transition-transform", className)}
    {...rest}
  >
    {children}
  </ArkSelect.Indicator>
);

const SelectClearTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ClearTrigger>) => (
  <ArkSelect.ClearTrigger
    className={cn(
      "w-full outline-none focus-visible:bg-muted focus-visible:outline-none",
      className,
    )}
    {...rest}
  />
);

const SelectPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.Positioner>) => (
  <ArkSelect.Positioner className={className} {...rest} />
);

const SelectContent = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.Content>) => (
  <ArkSelect.Content
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--available-height) w-fit min-w-32 origin-(--transform-origin) overflow-auto overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkSelect.Content>
);

const SelectItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemGroup>) => (
  <ArkSelect.ItemGroup className={className} {...rest} />
);

const SelectItemGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemGroupLabel>) => (
  <ArkSelect.ItemGroupLabel
    className={cn(
      "px-2 py-1.5 font-semibold text-muted-foreground text-xs",
      className,
    )}
    {...rest}
  />
);

const SelectItem = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.Item>) => (
  <ArkSelect.Item
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-hidden hover:bg-muted focus:bg-muted data-disabled:pointer-events-none data-[state=checked]:bg-muted data-highlighted:bg-muted data-inset:pl-8 data-disabled:opacity-50 data-[state=checked]:hover:bg-muted [&[data-state=checked][data-highlighted]]:bg-muted [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    )}
    {...rest}
  >
    {children}
  </ArkSelect.Item>
);

const SelectItemText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemText>) => (
  <ArkSelect.ItemText
    className={cn("flex items-center gap-2", className)}
    {...rest}
  />
);

const SelectItemIndicator = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkSelect.ItemIndicator>) => (
  <ArkSelect.ItemIndicator
    className={cn(
      "ml-auto flex h-3.5 w-3.5 items-center justify-center text-green-500",
      className,
    )}
    {...rest}
  >
    <Check className="size-4" />
  </ArkSelect.ItemIndicator>
);

const SelectSeparator = ({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
    {...rest}
  />
);

// Re-export createListCollection for convenience
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
const OptionsSelect = ({
  value,
  options,
  onValueChange,
  placeholder,
  label,
  "aria-label": ariaLabel,
  id,
  name,
  disabled,
  size = "md",
  open,
  onOpenChange,
  className,
  triggerClassName,
  contentClassName,
  positionerClassName,
}: OptionsSelectProps) => {
  const collection = useMemo(
    () =>
      createListCollection({
        items: options,
        isItemDisabled: (option) => Boolean(option.disabled),
      }),
    [options],
  );

  return (
    <ArkSelect.Root
      collection={collection}
      value={value ? [value] : []}
      onValueChange={(details) => {
        const next = details.value[0];

        if (next !== undefined) onValueChange(next);
      }}
      open={open}
      onOpenChange={
        onOpenChange ? (details) => onOpenChange(details.open) : undefined
      }
      name={name}
      disabled={disabled}
      ids={id ? { trigger: id } : undefined}
      positioning={{ sameWidth: true }}
      // mount the list on open so its portal lands after any dialog it sits
      // in, keeping it above that dialog at the same z-index
      lazyMount
      unmountOnExit
      loopFocus
      className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}
    >
      {label && <SelectLabel>{label}</SelectLabel>}
      <SelectControl className="min-w-0">
        <SelectTrigger
          aria-label={label ? undefined : ariaLabel}
          data-size={size === "sm" ? "sm" : "default"}
          className={cn(
            "w-full border border-input bg-transparent shadow-sm focus-visible:ring-2 focus-visible:ring-primary data-placeholder-shown:text-muted-foreground",
            triggerClassName,
          )}
        >
          <SelectValueText
            placeholder={placeholder}
            className="data-placeholder-shown:text-muted-foreground min-w-0 truncate"
          />
          <SelectIndicator className="text-muted-foreground">
            <ChevronDown aria-hidden="true" />
          </SelectIndicator>
        </SelectTrigger>
      </SelectControl>
      <Portal>
        <SelectPositioner className={positionerClassName}>
          <SelectContent className={cn("w-full p-1", contentClassName)}>
            {options.map((option) => (
              <SelectItem key={option.value} item={option}>
                <SelectItemText className="min-w-0 truncate">
                  {option.label}
                </SelectItemText>
                {option.hint && (
                  <span className="text-muted-foreground ml-auto shrink-0 text-xs">
                    {option.hint}
                  </span>
                )}
                <SelectItemIndicator
                  className={option.hint ? "ml-0" : undefined}
                />
              </SelectItem>
            ))}
          </SelectContent>
        </SelectPositioner>
      </Portal>
      <SelectHiddenSelect />
    </ArkSelect.Root>
  );
};

export { createListCollection } from "@ark-ui/react";

export {
  OptionsSelect,
  type OptionsSelectProps,
  Select,
  SelectClearTrigger,
  SelectContent,
  SelectContext,
  SelectControl,
  SelectHiddenSelect,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  type SelectOption,
  SelectPositioner,
  SelectRoot,
  SelectRootProvider,
  SelectSeparator,
  SelectTrigger,
  SelectValueText,
};
