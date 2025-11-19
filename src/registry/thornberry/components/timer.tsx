import { Timer } from "@ark-ui/react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const TimerRoot = ({
  className,
  ...rest
}: ComponentProps<typeof Timer.Root>) => (
  <Timer.Root
    className={cn("inline-flex flex-col gap-4", className)}
    {...rest}
  />
);

const TimerArea = ({
  className,
  ...rest
}: ComponentProps<typeof Timer.Area>) => (
  <Timer.Area
    className={cn("inline-flex items-center gap-1", className)}
    {...rest}
  />
);

const TimerItem = ({
  className,
  ...rest
}: ComponentProps<typeof Timer.Item>) => (
  <Timer.Item
    className={cn(
      "inline-flex min-w-8 items-center justify-center rounded-md bg-muted px-2 py-1 font-medium font-mono text-foreground text-sm tabular-nums",
      className,
    )}
    {...rest}
  />
);

const TimerSeparator = ({
  className,
  ...rest
}: ComponentProps<typeof Timer.Separator>) => (
  <Timer.Separator
    className={cn("text-muted-foreground", className)}
    {...rest}
  />
);

const TimerControl = ({
  className,
  ...rest
}: ComponentProps<typeof Timer.Control>) => (
  <Timer.Control
    className={cn("inline-flex items-center gap-2", className)}
    {...rest}
  />
);

const TimerActionTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof Timer.ActionTrigger>) => (
  <Timer.ActionTrigger
    className={cn(
      "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow-xs outline-none outline-hidden transition-[color,box-shadow,transform] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    )}
    {...rest}
  />
);

export {
  TimerRoot as Timer,
  TimerArea,
  TimerItem,
  TimerSeparator,
  TimerControl,
  TimerActionTrigger,
};
