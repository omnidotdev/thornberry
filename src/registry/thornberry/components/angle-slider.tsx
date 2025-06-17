"use client";

import { AngleSlider as ArkAngleSlider } from "@ark-ui/react/angle-slider";

import { cn } from "@/lib/utils";

import type {
  AngleSliderControlProps,
  AngleSliderHiddenInputProps,
  AngleSliderMarkerGroupProps,
  AngleSliderMarkerProps,
  AngleSliderRootProps,
  AngleSliderThumbProps,
  AngleSliderValueTextProps,
} from "@ark-ui/react";

const AngleSliderRoot = ({ className, ...rest }: AngleSliderRootProps) => (
  <ArkAngleSlider.Root
    className={cn("relative aspect-square w-[200px]", className)}
    {...rest}
  />
);

const AngleSliderControl = ({
  className,
  ...rest
}: AngleSliderControlProps) => (
  <ArkAngleSlider.Control
    className={cn("absolute inset-0 rounded-full", className)}
    {...rest}
  />
);

const AngleSliderThumb = ({ className, ...rest }: AngleSliderThumbProps) => (
  <div className="rounded-full">
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background:
          "conic-gradient(from 0deg, var(--primary-200) var(--angle, 0deg), var(--border) var(--angle, 0deg))",
      }}
    />

    <ArkAngleSlider.Thumb
      className={cn(
        "group pointer-events-none absolute top-0 right-0 bottom-0 left-[calc(50%-1.5px)] z-20 flex h-full w-[3px] items-start justify-center focus-visible:outline-none",
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          "h-4 w-4 flex-shrink-0 scale-125 rounded-full bg-primary-500 ring ring-primary-600 ring-offset-1",
        )}
      />
    </ArkAngleSlider.Thumb>
  </div>
);

const AngleSliderMarkerGroup = ({
  className,
  ...rest
}: AngleSliderMarkerGroupProps) => (
  <ArkAngleSlider.MarkerGroup
    className={cn("absolute inset-4 rounded-full bg-background", className)}
    {...rest}
  />
);

const AngleSliderMarker = ({
  className,
  value,
  ...rest
}: AngleSliderMarkerProps) => (
  <ArkAngleSlider.Marker
    value={value}
    className={cn("", className)}
    {...rest}
  />
);

const AngleSliderValueText = ({
  className,
  ...rest
}: AngleSliderValueTextProps) => (
  <ArkAngleSlider.ValueText
    className={cn(
      "pointer-events-none absolute inset-0 z-30 flex items-center justify-center text-center font-bold text-2xl text-foreground",
      className,
    )}
    {...rest}
  />
);

const AngleSliderHiddenInput = ({
  className,
  ...rest
}: AngleSliderHiddenInputProps) => (
  <ArkAngleSlider.HiddenInput className={cn(className)} {...rest} />
);

export {
  AngleSliderRoot,
  AngleSliderControl,
  AngleSliderMarkerGroup,
  AngleSliderMarker,
  AngleSliderThumb,
  AngleSliderValueText,
  AngleSliderHiddenInput,
};
