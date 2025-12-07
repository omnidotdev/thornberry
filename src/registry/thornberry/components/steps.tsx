import { Steps as ArkSteps } from "@ark-ui/react/steps";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const StepsProvider = ArkSteps.RootProvider;
const StepsContext = ArkSteps.Context;

const StepsRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Root>) => (
  <ArkSteps.Root
    className={cn("flex w-full flex-col gap-4", className)}
    {...rest}
  />
);

const StepsList = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.List>) => (
  <ArkSteps.List
    className={cn("flex items-center justify-between gap-2", className)}
    {...rest}
  />
);

const StepsItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Item>) => (
  <ArkSteps.Item
    className={cn("flex flex-1 items-center gap-2", className)}
    {...rest}
  />
);

const StepsTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Trigger>) => (
  <ArkSteps.Trigger
    className={cn(
      "flex items-center gap-2 text-sm transition-colors",
      "data-[state=complete]:text-primary",
      "data-[state=current]:text-foreground",
      "data-[state=incomplete]:text-muted-foreground",
      className,
    )}
    {...rest}
  />
);

const StepsIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Indicator>) => (
  <ArkSteps.Indicator
    className={cn(
      "flex h-10 w-10 items-center justify-center rounded-full border-2 font-medium text-sm transition-colors",
      "data-[state=complete]:border-primary data-[state=complete]:bg-primary data-[state=complete]:text-primary-foreground",
      "data-[state=current]:border-primary data-[state=current]:bg-background data-[state=current]:text-primary",
      "data-[state=incomplete]:border-muted data-[state=incomplete]:bg-background data-[state=incomplete]:text-muted-foreground",
      className,
    )}
    {...rest}
  />
);

const StepsSeparator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Separator>) => (
  <ArkSteps.Separator
    className={cn(
      "h-0.5 flex-1 bg-muted transition-colors",
      "data-[state=complete]:bg-primary",
      className,
    )}
    {...rest}
  />
);

const StepsContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Content>) => (
  <ArkSteps.Content
    className={cn("rounded-lg border p-6", className)}
    {...rest}
  />
);

const StepsCompletedContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.CompletedContent>) => (
  <ArkSteps.CompletedContent
    className={cn("rounded-lg border p-6", className)}
    {...rest}
  />
);

const StepsNextTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.NextTrigger>) => (
  <ArkSteps.NextTrigger
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-sm text-primary-foreground ring-offset-background transition-colors",
      "hover:bg-primary/90",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const StepsPrevTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.PrevTrigger>) => (
  <ArkSteps.PrevTrigger
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 font-medium text-sm ring-offset-background transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const StepsProgress = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSteps.Progress>) => (
  <ArkSteps.Progress
    className={cn(
      "h-2 w-full overflow-hidden rounded-full bg-muted",
      className,
    )}
    {...rest}
  />
);

export {
  StepsRoot,
  StepsList,
  StepsItem,
  StepsTrigger,
  StepsIndicator,
  StepsSeparator,
  StepsContent,
  StepsCompletedContent,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsProgress,
  StepsProvider,
  StepsContext,
};
