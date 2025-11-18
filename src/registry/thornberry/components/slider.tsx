import { Slider as ArkSlider } from "@ark-ui/react/slider";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const SliderProvider = ArkSlider.RootProvider;
const SliderContext = ArkSlider.Context;

const SliderRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Root>) => (
  <ArkSlider.Root
    className={cn(
      "relative flex w-full touch-none select-none flex-col items-center",
      className,
    )}
    {...rest}
  />
);

const SliderLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Label>) => (
  <ArkSlider.Label
    className={cn("mb-2 font-medium text-sm", className)}
    {...rest}
  />
);

const SliderControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Control>) => (
  <ArkSlider.Control
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...rest}
  />
);

const SliderTrack = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Track>) => (
  <ArkSlider.Track
    className={cn(
      "relative h-2 w-full grow overflow-hidden rounded-full bg-muted",
      className,
    )}
    {...rest}
  />
);

const SliderRange = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Range>) => (
  <ArkSlider.Range
    className={cn("absolute h-full bg-primary", className)}
    {...rest}
  />
);

const SliderThumb = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Thumb>) => (
  <ArkSlider.Thumb
    className={cn(
      "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const SliderMarker = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Marker>) => (
  <ArkSlider.Marker
    className={cn("absolute top-4 text-center text-xs", className)}
    {...rest}
  />
);

const SliderValueText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.ValueText>) => (
  <ArkSlider.ValueText
    className={cn("mt-2 text-center text-sm", className)}
    {...rest}
  />
);

export {
  SliderRoot,
  SliderLabel,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderMarker,
  SliderValueText,
  SliderProvider,
  SliderContext,
};
