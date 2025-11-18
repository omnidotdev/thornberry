import { NumberInput as ArkNumberInput } from "@ark-ui/react/number-input";
import { ChevronDown, ChevronUp } from "lucide-react";

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
    className={cn("flex h-10 items-center", className)}
    {...rest}
  />
);

const NumberInputInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.Input>) => (
  <ArkNumberInput.Input
    className={cn(
      "h-full w-full rounded-l-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const NumberInputDecrementTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.DecrementTrigger>) => (
  <ArkNumberInput.DecrementTrigger asChild tabIndex={0} {...rest}>
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-4 flex-1 rounded-none rounded-br-md focus-visible:bg-primary/20 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:dark:bg-primary/40",
        className,
      )}
    >
      <ChevronDown className="h-4 w-4" />
    </Button>
  </ArkNumberInput.DecrementTrigger>
);

const NumberInputIncrementTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkNumberInput.IncrementTrigger>) => (
  <ArkNumberInput.IncrementTrigger asChild tabIndex={0} {...rest}>
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-4 flex-1 rounded-none rounded-tr-md focus-visible:bg-primary/20 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:dark:bg-primary/40",
        className,
      )}
    >
      <ChevronUp className="h-4 w-4" />
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
