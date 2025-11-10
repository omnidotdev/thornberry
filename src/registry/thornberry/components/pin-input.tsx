import { PinInput as ArkPinInput } from "@ark-ui/react/pin-input";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const pinInputVariants = tv({
  slots: {
    root: "inline-block",
    label: "mb-1.5 block font-medium",
    control: "flex items-center gap-2",
    input:
      "flex h-12 w-12 items-center justify-center rounded-md border bg-transparent text-center text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
    hiddenInput: "",
  },
});

const { root, label, control, input, hiddenInput } = pinInputVariants();

const PinInputProvider = ArkPinInput.RootProvider;
const PinInputContext = ArkPinInput.Context;

const PinInputRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPinInput.Root>) => (
  <ArkPinInput.Root className={cn(root(), className)} {...rest} />
);

const PinInputLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPinInput.Label>) => (
  <ArkPinInput.Label className={cn(label(), className)} {...rest} />
);

const PinInputControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPinInput.Control>) => (
  <ArkPinInput.Control className={cn(control(), className)} {...rest} />
);

const PinInputInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPinInput.Input>) => (
  <ArkPinInput.Input className={cn(input(), className)} {...rest} />
);

const PinInputHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPinInput.HiddenInput>) => (
  <ArkPinInput.HiddenInput className={cn(hiddenInput(), className)} {...rest} />
);

export {
  PinInputRoot,
  PinInputLabel,
  PinInputControl,
  PinInputInput,
  PinInputHiddenInput,
  PinInputProvider,
  PinInputContext,
};
