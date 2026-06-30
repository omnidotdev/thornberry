import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/slider.tsx
import { Slider as ArkSlider } from "@ark-ui/react/slider";
import { jsx } from "react/jsx-runtime";
var SliderProvider = ArkSlider.RootProvider;
var SliderContext = ArkSlider.Context;
var SliderRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSlider.Root, {
  className: cn("relative flex w-full touch-none select-none flex-col items-center", className),
  ...rest
});
var SliderLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSlider.Label, {
  className: cn("mb-2 font-medium text-sm", className),
  ...rest
});
var SliderControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSlider.Control, {
  className: cn("relative flex w-full touch-none select-none items-center", className),
  ...rest
});
var SliderTrack = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSlider.Track, {
  className: cn("relative h-2 w-full grow overflow-hidden rounded-full bg-muted", className),
  ...rest
});
var SliderRange = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSlider.Range, {
  className: cn("absolute h-full bg-primary", className),
  ...rest
});
var SliderThumb = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSlider.Thumb, {
  className: cn("block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", className),
  ...rest
});
var SliderMarker = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSlider.Marker, {
  className: cn("absolute top-4 text-center text-xs", className),
  ...rest
});
var SliderValueText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSlider.ValueText, {
  className: cn("mt-2 text-center text-sm", className),
  ...rest
});
export {
  SliderValueText,
  SliderTrack,
  SliderThumb,
  SliderRoot,
  SliderRange,
  SliderProvider,
  SliderMarker,
  SliderLabel,
  SliderControl,
  SliderContext
};
