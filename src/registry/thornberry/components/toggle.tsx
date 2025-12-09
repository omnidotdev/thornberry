import { Toggle as ArkToggle } from "@ark-ui/react/toggle";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const ToggleRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkToggle.Root>) => (
  <ArkToggle.Root
    className={cn(
      "inline-flex items-center justify-center rounded-md font-medium text-sm ring-offset-background transition-colors",
      "hover:bg-muted hover:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      "h-10 px-3",
      className,
    )}
    {...rest}
  />
);

const ToggleIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkToggle.Indicator>) => (
  <ArkToggle.Indicator className={cn("", className)} {...rest} />
);

export { ToggleRoot, ToggleIndicator };
