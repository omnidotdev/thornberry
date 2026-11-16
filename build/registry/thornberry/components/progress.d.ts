import { Progress as ArkProgress } from "@ark-ui/react/progress";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
declare const progressTrackVariants: (props?: ({
    size?: "lg" | "md" | "sm" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const progressCircleSizes: {
    readonly sm: {
        readonly "--size": "2rem";
        readonly "--thickness": "0.1875rem";
    };
    readonly md: {
        readonly "--size": "3rem";
        readonly "--thickness": "0.25rem";
    };
    readonly lg: {
        readonly "--size": "4rem";
        readonly "--thickness": "0.375rem";
    };
};
type ProgressCircleSize = keyof typeof progressCircleSizes;
declare const ProgressProvider: import("react").ForwardRefExoticComponent<ArkProgress.RootProviderProps & import("react").RefAttributes<HTMLDivElement>>;
declare const ProgressContext: (props: ArkProgress.ContextProps) => ReactNode;
declare const ProgressRoot: ({ className, ...rest }: ComponentProps<typeof ArkProgress.Root>) => import("react/jsx-runtime").JSX.Element;
declare const ProgressLabel: ({ className, ...rest }: ComponentProps<typeof ArkProgress.Label>) => import("react/jsx-runtime").JSX.Element;
declare const ProgressValueText: ({ className, ...rest }: ComponentProps<typeof ArkProgress.ValueText>) => import("react/jsx-runtime").JSX.Element;
declare const ProgressTrack: ({ className, size, ...rest }: ComponentProps<typeof ArkProgress.Track> & VariantProps<typeof progressTrackVariants>) => import("react/jsx-runtime").JSX.Element;
declare const ProgressRange: ({ className, ...rest }: ComponentProps<typeof ArkProgress.Range>) => import("react/jsx-runtime").JSX.Element;
declare const ProgressCircle: ({ className, size, style, ...rest }: ComponentProps<typeof ArkProgress.Circle> & {
    size?: ProgressCircleSize;
}) => import("react/jsx-runtime").JSX.Element;
declare const ProgressCircleTrack: ({ className, ...rest }: ComponentProps<typeof ArkProgress.CircleTrack>) => import("react/jsx-runtime").JSX.Element;
declare const ProgressCircleRange: ({ className, style, ...rest }: ComponentProps<typeof ArkProgress.CircleRange>) => import("react/jsx-runtime").JSX.Element;
interface ProgressProps extends ComponentProps<typeof ArkProgress.Root>, VariantProps<typeof progressTrackVariants> {
    /** Visible label rendered above the bar. */
    label?: ReactNode;
    /** Show the formatted value (e.g. "40%") above the bar. */
    showValueText?: boolean;
}
/**
 * A linear progress bar. Pass `value` (0 to `max`, default 100) for a
 * determinate bar, or `value={null}` for an indeterminate one.
 */
declare const Progress: ({ label, showValueText, size, ...rest }: ProgressProps) => import("react/jsx-runtime").JSX.Element;
interface CircularProgressProps extends ComponentProps<typeof ArkProgress.Root> {
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
declare const CircularProgress: ({ size, label, showValueText, className, ...rest }: CircularProgressProps) => import("react/jsx-runtime").JSX.Element;
export { CircularProgress, Progress, ProgressCircle, ProgressCircleRange, ProgressCircleTrack, ProgressContext, ProgressLabel, ProgressProvider, ProgressRange, ProgressRoot, ProgressTrack, ProgressValueText, progressTrackVariants, };
