import { PinInput as ArkPinInput } from "@ark-ui/react/pin-input";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const PinInputProvider = ArkPinInput.RootProvider;
const PinInputContext = ArkPinInput.Context;

const PinInputRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPinInput.Root>) => (
  <ArkPinInput.Root className={cn("inline-block", className)} {...rest} />
);

const PinInputLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPinInput.Label>) => (
  <ArkPinInput.Label
    className={cn("mb-1.5 block font-medium text-base-950", className)}
    {...rest}
  />
);

const PinInputControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPinInput.Control>) => (
  <ArkPinInput.Control
    className={cn("flex items-center gap-2", className)}
    {...rest}
  />
);

const PinInputInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPinInput.Input>) => (
  <ArkPinInput.Input
    className={cn(
      "flex h-12 w-12 items-center justify-center rounded-md border border-base-300/20 bg-transparent text-center text-lg shadow-sm",
      "focus:outline-none focus:ring-2 focus:ring-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const PinInputHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPinInput.HiddenInput>) => (
  <ArkPinInput.HiddenInput className={cn(className)} {...rest} />
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
