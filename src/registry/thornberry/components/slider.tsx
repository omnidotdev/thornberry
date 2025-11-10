import { Slider as ArkSlider } from "@ark-ui/react/slider";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const sliderVariants = tv({
  slots: {
    root: "relative flex w-full touch-none select-none flex-col items-center",
    label: "mb-2 font-medium text-sm",
    control: "relative flex w-full touch-none select-none items-center",
    track: "relative h-2 w-full grow overflow-hidden rounded-full bg-muted",
    range: "absolute h-full bg-primary",
    thumb:
      "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    marker: "absolute top-4 text-center text-xs",
    valueText: "mt-2 text-center text-sm",
  },
});

const { root, label, control, track, range, thumb, marker, valueText } =
  sliderVariants();

const SliderProvider = ArkSlider.RootProvider;
const SliderContext = ArkSlider.Context;

const SliderRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Root>) => (
  <ArkSlider.Root className={cn(root(), className)} {...rest} />
);

const SliderLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Label>) => (
  <ArkSlider.Label className={cn(label(), className)} {...rest} />
);

const SliderControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Control>) => (
  <ArkSlider.Control className={cn(control(), className)} {...rest} />
);

const SliderTrack = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Track>) => (
  <ArkSlider.Track className={cn(track(), className)} {...rest} />
);

const SliderRange = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Range>) => (
  <ArkSlider.Range className={cn(range(), className)} {...rest} />
);

const SliderThumb = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Thumb>) => (
  <ArkSlider.Thumb className={cn(thumb(), className)} {...rest} />
);

const SliderMarker = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.Marker>) => (
  <ArkSlider.Marker className={cn(marker(), className)} {...rest} />
);

const SliderValueText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkSlider.ValueText>) => (
  <ArkSlider.ValueText className={cn(valueText(), className)} {...rest} />
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
