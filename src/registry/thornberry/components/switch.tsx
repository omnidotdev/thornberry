import { Switch as ArkSwitch } from "@ark-ui/react/switch";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const SwitchProvider = ArkSwitch.RootProvider;
const SwitchContext = ArkSwitch.Context;

const SwitchRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.Root>) => (
  <ArkSwitch.Root
    className={cn(
      "inline-flex items-center gap-2 rounded-full outline-none",
      "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
      className,
    )}
    {...rest}
  />
);

const SwitchControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.Control>) => (
  <ArkSwitch.Control
    className={cn(
      "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className,
    )}
    {...rest}
  />
);

const SwitchThumb = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.Thumb>) => (
  <ArkSwitch.Thumb
    className={cn(
      "block h-5 w-5 rounded-full bg-background shadow-lg transition-transform",
      "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      className,
    )}
    {...rest}
  />
);

const SwitchHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.HiddenInput>) => (
  <ArkSwitch.HiddenInput
    className={cn("pointer-events-none absolute h-0 w-0 opacity-0", className)}
    {...rest}
  />
);

const SwitchLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.Label>) => (
  <ArkSwitch.Label
    className={cn(
      "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...rest}
  />
);

export {
  SwitchRoot,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
  SwitchHiddenInput,
  SwitchProvider,
  SwitchContext,
};
