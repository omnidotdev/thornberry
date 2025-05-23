import { NumberInput as ArkNumberInput } from "@ark-ui/react/number-input";
import { FiMinus, FiPlus } from "react-icons/fi";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps, ReactNode } from "react";

const NumberInputProvider = ArkNumberInput.RootProvider;
const NumberInputContext = ArkNumberInput.Context;

const NumberInputRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.Root>) => (
  <ArkNumberInput.Root
    className={cn("flex w-full flex-col", className)}
    {...rest}
  />
);

const NumberInputLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.Label>) => (
  <ArkNumberInput.Label
    className={cn("mb-2 block text-sm font-medium", className)}
    {...rest}
  />
);

const NumberInputControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.Control>) => (
  <ArkNumberInput.Control
    className={cn("flex h-10 items-center rounded-md border", className)}
    {...rest}
  />
);

const NumberInputInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.Input>) => (
  <ArkNumberInput.Input
    className={cn(
      "h-full w-full bg-transparent px-3 py-2 text-sm outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const NumberInputDecrementTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.DecrementTrigger>) => (
  <ArkNumberInput.DecrementTrigger asChild {...rest}>
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-full rounded-l-md border-r", className)}
    >
      <FiMinus className="h-4 w-4" />
    </Button>
  </ArkNumberInput.DecrementTrigger>
);

const NumberInputIncrementTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.IncrementTrigger>) => (
  <ArkNumberInput.IncrementTrigger asChild {...rest}>
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-full rounded-r-md border-l", className)}
    >
      <FiPlus className="h-4 w-4" />
    </Button>
  </ArkNumberInput.IncrementTrigger>
);

interface NumberInputProps extends ComponentProps<typeof NumberInputRoot> {
  label?: ReactNode;
  placeholder?: string;
}

const NumberInput = ({
  label,
  placeholder,
  defaultValue = "0",
  min = 0,
  max = 100,
  step = 1,
  ...rest
}: NumberInputProps) => (
  <NumberInputRoot
    defaultValue={defaultValue}
    min={min}
    max={max}
    step={step}
    {...rest}
  >
    {label && <NumberInputLabel>{label}</NumberInputLabel>}
    <NumberInputControl>
      <NumberInputDecrementTrigger />
      <NumberInputInput placeholder={placeholder} />
      <NumberInputIncrementTrigger />
    </NumberInputControl>
  </NumberInputRoot>
);

export {
  NumberInputRoot,
  NumberInputLabel,
  NumberInputControl,
  NumberInputInput,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputProvider,
  NumberInputContext,
  NumberInput,
  type NumberInputProps,
};
