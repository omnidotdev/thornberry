import { RadioGroup as ArkRadioGroup } from "@ark-ui/react/radio-group";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

const RadioGroupProvider = ArkRadioGroup.RootProvider;
const RadioGroupContext = ArkRadioGroup.Context;

const RadioGroupRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.Root>) => (
  <ArkRadioGroup.Root className={cn("space-y-3", className)} {...rest} />
);

const RadioGroupLabel = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => (
  <ArkRadioGroup.Label
    className={cn("font-medium text-sm leading-none", className)}
  >
    {children}
  </ArkRadioGroup.Label>
);

const RadioGroupIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.Indicator>) => (
  <ArkRadioGroup.Indicator className={cn(className)} {...rest} />
);

const RadioGroupItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.Item>) => (
  <ArkRadioGroup.Item
    className={cn("flex cursor-pointer items-center space-x-2", className)}
    {...rest}
  />
);

const RadioGroupItemText = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => (
  <ArkRadioGroup.ItemText
    className={cn(
      "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
  >
    {children}
  </ArkRadioGroup.ItemText>
);

const RadioGroupItemControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.ItemControl>) => (
  <ArkRadioGroup.ItemControl
    className={cn(
      "flex size-3 cursor-pointer items-center justify-center rounded-full shadow ring-1 ring-ring ring-offset-2 ring-offset-background transition-normal disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className,
    )}
    {...rest}
  >
    <div className="size-2 rounded-full bg-current opacity-0 transition-opacity data-[state=checked]:opacity-100" />
  </ArkRadioGroup.ItemControl>
);

const RadioGroupItemHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRadioGroup.ItemHiddenInput>) => (
  <ArkRadioGroup.ItemHiddenInput className={cn("peer", className)} {...rest} />
);

export {
  RadioGroupProvider,
  RadioGroupContext,
  RadioGroupRoot,
  RadioGroupLabel,
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupItemText,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
};
