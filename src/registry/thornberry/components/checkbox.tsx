import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

const CheckboxProvider = ArkCheckbox.RootProvider;
const CheckboxGroup = ArkCheckbox.Group;
const CheckboxContext = ArkCheckbox.Context;

const CheckboxRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCheckbox.Root>) => (
  <ArkCheckbox.Root className={cn("flex items-center", className)} {...rest} />
);

const CheckboxLabel = ({ children }: { children: ReactNode }) => (
  <ArkCheckbox.Label className="ml-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </ArkCheckbox.Label>
);

const CheckboxControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCheckbox.Control>) => (
  <ArkCheckbox.Control
    className={cn(
      "flex size-5 items-center justify-center rounded-sm border border-primary shadow transition-normal",
      "disabled:cursor-not-allowed peer-disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
      className,
    )}
    {...rest}
  />
);

const CheckboxIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCheckbox.Indicator>) => (
  <ArkCheckbox.Indicator className={cn("peer", className)} {...rest} />
);

const CheckboxHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCheckbox.HiddenInput>) => (
  <ArkCheckbox.HiddenInput
    className={cn("peer sr-only", className)}
    {...rest}
  />
);

export {
  CheckboxProvider,
  CheckboxGroup,
  CheckboxContext,
  CheckboxRoot,
  CheckboxLabel,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxHiddenInput,
};
