import { NumberInput as ArkNumberInput } from "@ark-ui/react/number-input";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps } from "react";

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
    className={cn("block font-medium text-sm", className)}
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
      className={cn("flex-1 rounded-none", className)}
    >
      <FiChevronDown className="h-4 w-4" />
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
      className={cn("flex-1 rounded-none", className)}
    >
      <FiChevronUp className="h-4 w-4" />
    </Button>
  </ArkNumberInput.IncrementTrigger>
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
};
