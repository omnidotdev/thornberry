import { Combobox as ArkCombobox } from "@ark-ui/react/combobox";
import { CheckIcon, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

import type { ComponentProps, ReactNode } from "react";

const ComboboxProvider = ArkCombobox.RootProvider;
const ComboboxContext = ArkCombobox.Context;

const ComboboxRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Root>) => (
  <ArkCombobox.Root className={cn("relative w-full", className)} {...rest} />
);

const ComboboxLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Label>) => (
  <ArkCombobox.Label
    className={cn("mb-2 block text-sm font-medium", className)}
    {...rest}
  />
);

const ComboboxControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Control>) => (
  <ArkCombobox.Control className={cn("relative w-full", className)} {...rest} />
);

const ComboboxInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Input>) => (
  <ArkCombobox.Input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
      "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
      variant="outline"
      size="icon"
      className={cn("absolute right-0 top-0 h-10 w-10", className)}
    >
      <ChevronsUpDown className="h-4 w-4" />
    </Button>
  </ArkCombobox.Trigger>
);

const ComboboxClearTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.ClearTrigger>) => (
  <ArkCombobox.ClearTrigger
    className={cn(
      "absolute right-10 top-0 flex h-full items-center justify-center pr-2 text-muted-foreground",
      "hover:text-foreground disabled:pointer-events-none",
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
    className={cn("z-50 w-full min-w-[8rem]", className)}
    {...rest}
  />
);

const ComboboxContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCombobox.Content>) => (
  <ArkCombobox.Content
    className={cn(
      "max-h-[300px] overflow-y-auto rounded-md border bg-popover p-1 shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
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
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className,
    )}
    {...rest}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ArkCombobox.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </ArkCombobox.ItemIndicator>
    </span>
    <ArkCombobox.ItemText>{children}</ArkCombobox.ItemText>
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
      "px-2 py-1.5 text-xs font-medium text-muted-foreground",
      className,
    )}
    {...rest}
  />
);

interface ComboboxProps
  extends Omit<ComponentProps<typeof ComboboxRoot>, "items"> {
  label?: ReactNode;
  placeholder?: string;
  items: Array<{ label: string; value: string; disabled?: boolean }>;
}

const Combobox = ({
  label,
  placeholder = "Select an option...",
  items,
  ...rest
}: ComboboxProps) => (
  <ComboboxRoot {...rest}>
    {label && <ComboboxLabel>{label}</ComboboxLabel>}
    <ComboboxControl>
      <ComboboxInput placeholder={placeholder} />
      <ComboboxTrigger />
    </ComboboxControl>
    <ComboboxPositioner>
      <ComboboxContent>
        {items.map((item) => (
          <ComboboxItem key={item.value} item={item}>
            {item.label}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </ComboboxPositioner>
  </ComboboxRoot>
);

export {
  ComboboxRoot,
  ComboboxLabel,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClearTrigger,
  ComboboxPositioner,
  ComboboxContent,
  ComboboxItem,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  ComboboxProvider,
  ComboboxContext,
  Combobox,
};
