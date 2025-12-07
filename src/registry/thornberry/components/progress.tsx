import { Progress as ArkProgress } from "@ark-ui/react/progress";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const ProgressProvider = ArkProgress.RootProvider;
const ProgressContext = ArkProgress.Context;

const ProgressRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.Root>) => (
  <ArkProgress.Root
    className={cn("relative w-full overflow-hidden", className)}
    {...rest}
  />
);

const ProgressLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.Label>) => (
  <ArkProgress.Label
    className={cn("mb-2 font-medium text-sm", className)}
    {...rest}
  />
);

const ProgressTrack = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.Track>) => (
  <ArkProgress.Track
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-muted",
      className,
    )}
    {...rest}
  />
);

const ProgressRange = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.Range>) => (
  <ArkProgress.Range
    className={cn("h-full w-full flex-1 bg-primary transition-all", className)}
    {...rest}
  />
);

const ProgressValueText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.ValueText>) => (
  <ArkProgress.ValueText
    className={cn("mt-2 text-center text-sm text-muted-foreground", className)}
    {...rest}
  />
);

const ProgressCircle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.Circle>) => (
  <ArkProgress.Circle className={cn("h-24 w-24", className)} {...rest} />
);

const ProgressCircleTrack = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.CircleTrack>) => (
  <ArkProgress.CircleTrack
    className={cn("stroke-muted", className)}
    {...rest}
  />
);

const ProgressCircleRange = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.CircleRange>) => (
  <ArkProgress.CircleRange
    className={cn("stroke-primary transition-all", className)}
    {...rest}
  />
);

const ProgressView = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.View>) => (
  <ArkProgress.View className={cn("", className)} {...rest} />
);

export {
  ProgressRoot,
  ProgressLabel,
  ProgressTrack,
  ProgressRange,
  ProgressValueText,
  ProgressCircle,
  ProgressCircleTrack,
  ProgressCircleRange,
  ProgressView,
  ProgressProvider,
  ProgressContext,
};
