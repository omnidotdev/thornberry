import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import { FiCheck } from "react-icons/fi";

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
  <ArkCheckbox.Label className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </ArkCheckbox.Label>
);

const CheckboxControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCheckbox.Control>) => (
  <ArkCheckbox.Control
    className={cn(
      "flex items-center justify-center cursor-pointer transition-normal size-5 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed peer-disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
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
    className={cn("peer shrink-0", className)}
    {...rest}
  />
);

interface CheckboxProps extends ComponentProps<typeof ArkCheckbox.Root> {
  label?: string;
  icon?: ReactNode;
  labelProps?: ComponentProps<typeof CheckboxLabel>;
  indicatorProps?: ComponentProps<typeof CheckboxIndicator>;
  controlProps?: ComponentProps<typeof CheckboxControl>;
  hiddenInputProps?: ComponentProps<typeof CheckboxHiddenInput>;
}

const Checkbox = ({
  label,
  icon,
  labelProps,
  indicatorProps,
  controlProps,
  hiddenInputProps,
  ...rest
}: CheckboxProps) => (
  <CheckboxRoot {...rest}>
    <CheckboxHiddenInput {...hiddenInputProps} />
    <CheckboxControl {...controlProps}>
      <CheckboxIndicator asChild {...indicatorProps}>
        {icon ? icon : <FiCheck className="size-4" />}
      </CheckboxIndicator>
    </CheckboxControl>
    {label && <CheckboxLabel {...labelProps}>{label}</CheckboxLabel>}
  </CheckboxRoot>
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
  Checkbox,
  type CheckboxProps,
};
