import { Timer } from "@ark-ui/react";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";
import type { VariantProps } from "tailwind-variants";

const timerVariants = tv({
  slots: {
    root: "inline-flex flex-col gap-4",
    area: "inline-flex items-center gap-1",
    item: "inline-flex min-w-8 items-center justify-center rounded-md bg-muted px-2 py-1 font-medium font-mono text-foreground text-sm tabular-nums",
    separator: "text-muted-foreground",
    control: "inline-flex items-center gap-2",
  },
  variants: {
    size: {
      sm: {
        root: "gap-2",
        area: "gap-0.5",
        item: "min-w-6 px-1.5 py-0.5 text-xs",
        separator: "text-xs",
      },
      md: {
        root: "gap-4",
        area: "gap-1",
        item: "min-w-8 px-2 py-1 text-sm",
        separator: "text-sm",
      },
      lg: {
        root: "gap-6",
        area: "gap-1.5",
        item: "min-w-10 px-3 py-2 text-base",
        separator: "text-base",
      },
    },
    variant: {
      default: {
        item: "bg-muted text-foreground",
      },
      outlined: {
        item: "border bg-background text-foreground",
      },
      minimal: {
        item: "bg-transparent text-foreground",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

const TimerRoot = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof Timer.Root> & VariantProps<typeof timerVariants>) => {
  const styles = timerVariants({ size, variant });
  return <Timer.Root className={cn(styles.root(), className)} {...rest} />;
};

const TimerArea = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof Timer.Area> & VariantProps<typeof timerVariants>) => {
  const styles = timerVariants({ size, variant });
  return <Timer.Area className={cn(styles.area(), className)} {...rest} />;
};

const TimerItem = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof Timer.Item> & VariantProps<typeof timerVariants>) => {
  const styles = timerVariants({ size, variant });
  return <Timer.Item className={cn(styles.item(), className)} {...rest} />;
};

const TimerSeparator = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof Timer.Separator> &
  VariantProps<typeof timerVariants>) => {
  const styles = timerVariants({ size, variant });
  return (
    <Timer.Separator className={cn(styles.separator(), className)} {...rest} />
  );
};

const TimerControl = ({
  className,
  size,
  variant,
  ...rest
}: ComponentProps<typeof Timer.Control> &
  VariantProps<typeof timerVariants>) => {
  const styles = timerVariants({ size, variant });
  return (
    <Timer.Control className={cn(styles.control(), className)} {...rest} />
  );
};

const TimerActionTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof Timer.ActionTrigger>) => (
  <Timer.ActionTrigger
    className={cn(
      "inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow-xs outline-none transition-all hover:bg-primary/90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
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
  timerVariants,
};
