import { NumberInput as ArkNumberInput } from "@ark-ui/react/number-input";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps } from "react";

const numberInputVariants = tv({
  slots: {
    root: "flex w-full flex-col",
    label: "block font-medium text-sm",
    control: "flex h-10 items-center",
    input:
      "h-full w-full rounded-l-md border bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
    decrementTrigger: "h-4 flex-1 rounded-none rounded-br-md",
    incrementTrigger: "h-4 flex-1 rounded-none rounded-tr-md",
  },
});

const { root, label, control, input, decrementTrigger, incrementTrigger } =
  numberInputVariants();

const NumberInputProvider = ArkNumberInput.RootProvider;
const NumberInputContext = ArkNumberInput.Context;

const NumberInputRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.Root>) => (
  <ArkNumberInput.Root className={cn(root(), className)} {...rest} />
);

const NumberInputLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.Label>) => (
  <ArkNumberInput.Label className={cn(label(), className)} {...rest} />
);

const NumberInputControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.Control>) => (
  <ArkNumberInput.Control className={cn(control(), className)} {...rest} />
);

const NumberInputInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.Input>) => (
  <ArkNumberInput.Input className={cn(input(), className)} {...rest} />
);

const NumberInputDecrementTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.DecrementTrigger>) => (
  <ArkNumberInput.DecrementTrigger asChild {...rest}>
    <Button
      variant="ghost"
      size="icon"
      className={cn(decrementTrigger(), className)}
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
      className={cn(incrementTrigger(), className)}
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
