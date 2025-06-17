import { AngleSlider as ArkAngleSlider } from "@ark-ui/react/angle-slider";

import { cn } from "@/lib/utils";

import type {
  AngleSliderControlProps,
  AngleSliderHiddenInputProps,
  AngleSliderLabelProps,
  AngleSliderMarkerGroupProps,
  AngleSliderMarkerProps,
  AngleSliderRootProps,
  AngleSliderThumbProps,
  AngleSliderValueTextProps,
} from "@ark-ui/react";

const AngleSliderRoot = ({ className, ...rest }: AngleSliderRootProps) => (
  <ArkAngleSlider.Root
    className={cn("relative flex w-fit flex-col items-center gap-4", className)}
    {...rest}
  />
);

const AngleSliderLabel = ({ className, ...rest }: AngleSliderLabelProps) => (
  <ArkAngleSlider.Label
    className={cn("font-semibold text-gray-800 text-lg", "mb-2", className)}
    {...rest}
  />
);

const AngleSliderControl = ({
  className,
  ...rest
}: AngleSliderControlProps) => (
  <ArkAngleSlider.Control
    className={cn(
      "relative h-[200px] w-[200px]",
      "rounded-full bg-white",
      "flex items-center justify-center",
      className,
    )}
    {...rest}
  >
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background: `conic-gradient(from 0deg, rgb(34 197 94 / 0.5) var(--angle, 0deg), rgb(229 231 235) var(--angle, 0deg))`,
      }}
    />
    <div className="absolute inset-4 rounded-full bg-white" />
  </ArkAngleSlider.Control>
);

const AngleSliderThumb = ({
  className,
  value,
  ...rest
}: AngleSliderThumbProps) => {
  const radius = 78; // Distance from center to thumb (200px - 2 * 22px)
  const angle = ((value ?? 0) - 90) * (Math.PI / 180); // Convert to radians, offset by 90° to start from top
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  return (
    <ArkAngleSlider.Thumb
      className={cn(
        "absolute h-5 w-5",
        "rounded-full border-2 border-green-600 bg-green-500",
        "cursor-pointer transition-all duration-200",
        "hover:scale-110 hover:bg-green-600",
        "focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2",
        "z-40 shadow-lg",
        "-translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2",
        className,
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      {...rest}
    />
  );
};

const AngleSliderMarkerGroup = ({
  className,
  ...rest
}: AngleSliderMarkerGroupProps) => (
  <ArkAngleSlider.MarkerGroup
    className={cn("absolute inset-0 z-10", className)}
    {...rest}
  />
);

const AngleSliderMarker = ({
  className,
  value,
  ...rest
}: AngleSliderMarkerProps) => {
  const radius = 78;
  const angle = (value - 90) * (Math.PI / 180);
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  return (
    <ArkAngleSlider.Marker
      className={cn(
        "absolute h-3 w-1",
        "rounded-sm bg-gray-600",
        "-translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2",
        className,
      )}
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${value}deg)`,
      }}
      value={value}
      {...rest}
    />
  );
};

const AngleSliderValueText = ({
  className,
  ...rest
}: AngleSliderValueTextProps) => (
  <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
    <ArkAngleSlider.ValueText
      className={cn(
        "font-bold text-2xl text-gray-800",
        "text-center",
        className,
      )}
      {...rest}
    />
  </div>
);

const AngleSliderHiddenInput = ({
  className,
  ...rest
}: AngleSliderHiddenInputProps) => (
  <ArkAngleSlider.HiddenInput className={cn(className)} {...rest} />
);

export {
  AngleSliderRoot,
  AngleSliderLabel,
  AngleSliderControl,
  AngleSliderThumb,
  AngleSliderMarkerGroup,
  AngleSliderMarker,
  AngleSliderValueText,
  AngleSliderHiddenInput,
};
