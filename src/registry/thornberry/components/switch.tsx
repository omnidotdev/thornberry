import { Switch as ArkSwitch } from "@ark-ui/react/switch";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const switchVariants = tv({
  slots: {
    root: "flex items-center gap-2",
    control:
      "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
    thumb:
      "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
    label:
      "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    hiddenInput: "",
  },
});

const { root, control, thumb, label, hiddenInput } = switchVariants();

const SwitchProvider = ArkSwitch.RootProvider;
const SwitchContext = ArkSwitch.Context;

const SwitchRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.Root>) => (
  <ArkSwitch.Root className={cn(root(), className)} {...rest} />
);

const SwitchControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.Control>) => (
  <ArkSwitch.Control className={cn(control(), className)} {...rest} />
);

const SwitchThumb = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.Thumb>) => (
  <ArkSwitch.Thumb className={cn(thumb(), className)} {...rest} />
);

const SwitchLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.Label>) => (
  <ArkSwitch.Label className={cn(label(), className)} {...rest} />
);

const SwitchHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSwitch.HiddenInput>) => (
  <ArkSwitch.HiddenInput className={cn(hiddenInput(), className)} {...rest} />
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
