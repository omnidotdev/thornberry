import {
  Progress as ArkProgress,
  useProgressContext,
} from "@ark-ui/react/progress";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { CSSProperties, ComponentProps, ReactNode } from "react";

const progressTrackVariants = cva(
  "bg-muted relative w-full overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: { size: "md" },
  },
);

// Ark draws the circle from `--size` (diameter) and `--thickness` (stroke
// width) custom properties, so each size maps to a pair of those values
const progressCircleSizes = {
  sm: { "--size": "2rem", "--thickness": "0.1875rem" },
  md: { "--size": "3rem", "--thickness": "0.25rem" },
  lg: { "--size": "4rem", "--thickness": "0.375rem" },
} as const;

type ProgressCircleSize = keyof typeof progressCircleSizes;

const ProgressProvider = ArkProgress.RootProvider;
const ProgressContext = ArkProgress.Context;

const ProgressRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.Root>) => (
  <ArkProgress.Root
    className={cn("flex w-full flex-col gap-2", className)}
    {...rest}
  />
);

const ProgressLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.Label>) => (
  <ArkProgress.Label
    className={cn("font-medium text-foreground text-sm", className)}
    {...rest}
  />
);

const ProgressValueText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.ValueText>) => (
  <ArkProgress.ValueText
    className={cn("text-muted-foreground text-sm tabular-nums", className)}
    {...rest}
  />
);

const ProgressTrack = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkProgress.Track> &
  VariantProps<typeof progressTrackVariants>) => (
  <ArkProgress.Track
    className={cn(progressTrackVariants({ size }), className)}
    {...rest}
  />
);

const ProgressRange = ({
  className,
  ...rest
}: ComponentProps<typeof ArkProgress.Range>) => (
  <ArkProgress.Range
    className={cn(
      "h-full rounded-full bg-primary transition-all duration-300 ease-out",
      // Indeterminate: a third-width bar sweeps across the track. It rests
      // just past the right edge and the enter keyframe starts it just before
      // the left edge, so each loop travels the full width
      "data-[state=indeterminate]:w-1/3 data-[state=indeterminate]:translate-x-3/1 data-[state=indeterminate]:animate-in data-[state=indeterminate]:slide-in-from-left-4/1 data-[state=indeterminate]:repeat-infinite data-[state=indeterminate]:duration-1500 data-[state=indeterminate]:ease-in-out",
      className,
    )}
    {...rest}
  />
);

const ProgressCircle = ({
  className,
  size = "md",
  style,
  ...rest
}: ComponentProps<typeof ArkProgress.Circle> & {
  size?: ProgressCircleSize;
}) => (
  <ArkProgress.Circle
    className={cn(
      "shrink-0 data-[state=indeterminate]:animate-spin",
      className,
    )}
    style={{ ...progressCircleSizes[size], ...style } as CSSProperties}
    {...rest}
  />
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
  style,
  ...rest
}: ComponentProps<typeof ArkProgress.CircleRange>) => {
  const progress = useProgressContext();

  return (
    <ArkProgress.CircleRange
      strokeLinecap="round"
      className={cn(
        "stroke-primary transition-all duration-300 ease-out",
        className,
      )}
      style={{
        // Ark leaves the dash pattern unset while indeterminate, which draws a
        // full ring; draw a quarter arc instead so the spin reads as activity
        ...(progress.indeterminate && {
          strokeDasharray:
            "calc(var(--circumference) * 0.25) var(--circumference)",
          strokeDashoffset: 0,
        }),
        ...style,
      }}
      {...rest}
    />
  );
};

interface ProgressProps
  extends ComponentProps<typeof ArkProgress.Root>,
    VariantProps<typeof progressTrackVariants> {
  /** Visible label rendered above the bar. */
  label?: ReactNode;
  /** Show the formatted value (e.g. "40%") above the bar. */
  showValueText?: boolean;
}

/**
 * A linear progress bar. Pass `value` (0 to `max`, default 100) for a
 * determinate bar, or `value={null}` for an indeterminate one.
 */
const Progress = ({
  label,
  showValueText = false,
  size,
  ...rest
}: ProgressProps) => (
  <ProgressRoot {...rest}>
    {(label || showValueText) && (
      <div className="flex items-center justify-between gap-2">
        {label && <ProgressLabel>{label}</ProgressLabel>}
        {showValueText && <ProgressValueText className="ml-auto" />}
      </div>
    )}

    <ProgressTrack size={size}>
      <ProgressRange />
    </ProgressTrack>
  </ProgressRoot>
);

interface CircularProgressProps
  extends ComponentProps<typeof ArkProgress.Root> {
  /** Diameter and stroke width preset. */
  size?: ProgressCircleSize;
  /** Visible label rendered below the circle. */
  label?: ReactNode;
  /** Show the formatted value (e.g. "40%") in the center of the circle. */
  showValueText?: boolean;
}

/**
 * A circular progress indicator. Pass `value` for a determinate ring, or
 * `value={null}` for an indeterminate spinner.
 */
const CircularProgress = ({
  size = "md",
  label,
  showValueText = false,
  className,
  ...rest
}: CircularProgressProps) => (
  <ProgressRoot
    className={cn("inline-flex w-fit items-center", className)}
    {...rest}
  >
    <div className="relative inline-flex items-center justify-center">
      <ProgressCircle size={size}>
        <ProgressCircleTrack />
        <ProgressCircleRange />
      </ProgressCircle>

      {showValueText && (
        <ProgressValueText className="text-foreground absolute inset-0 flex items-center justify-center text-xs font-medium" />
      )}
    </div>

    {label && <ProgressLabel>{label}</ProgressLabel>}
  </ProgressRoot>
);

export {
  CircularProgress,
  Progress,
  ProgressCircle,
  ProgressCircleRange,
  ProgressCircleTrack,
  ProgressContext,
  ProgressLabel,
  ProgressProvider,
  ProgressRange,
  ProgressRoot,
  ProgressTrack,
  ProgressValueText,
  progressTrackVariants,
};
