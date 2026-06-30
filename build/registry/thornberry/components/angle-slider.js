import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/angle-slider.tsx
import { AngleSlider as ArkAngleSlider } from "@ark-ui/react/angle-slider";
import { jsx, jsxs } from "react/jsx-runtime";
"use client";
var AngleSliderRoot = ({ className, ...rest }) => /* @__PURE__ */ jsx(ArkAngleSlider.Root, {
  className: cn("relative aspect-square w-[200px]", className),
  ...rest
});
var AngleSliderControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAngleSlider.Control, {
  className: cn("absolute inset-0 rounded-full", className),
  ...rest
});
var AngleSliderThumb = ({ className, ...rest }) => /* @__PURE__ */ jsxs("div", {
  className: "rounded-full",
  children: [
    /* @__PURE__ */ jsx("div", {
      className: "absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--primary)_var(--angle,0deg),var(--border)_var(--angle,0deg))] opacity-50"
    }),
    /* @__PURE__ */ jsx(ArkAngleSlider.Thumb, {
      tabIndex: -1,
      className: cn("group pointer-events-none absolute top-0 right-0 bottom-0 left-[calc(50%-1.5px)] z-20 flex h-full w-[3px] items-start justify-center focus-visible:outline-none", className),
      ...rest,
      children: /* @__PURE__ */ jsx("button", {
        type: "button",
        className: "h-4 w-4 shrink-0 scale-125 rounded-full bg-primary ring ring-primary/60 ring-offset-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      })
    })
  ]
});
var AngleSliderMarkerGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAngleSlider.MarkerGroup, {
  className: cn("absolute inset-4 rounded-full bg-background", className),
  ...rest
});
var AngleSliderMarker = ({
  className,
  value,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAngleSlider.Marker, {
  value,
  className,
  ...rest
});
var AngleSliderValueText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAngleSlider.ValueText, {
  className: cn("pointer-events-none absolute inset-0 z-30 flex items-center justify-center text-center font-bold text-2xl text-foreground", className),
  ...rest
});
var AngleSliderHiddenInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAngleSlider.HiddenInput, {
  className,
  ...rest
});
export {
  AngleSliderValueText,
  AngleSliderThumb,
  AngleSliderRoot,
  AngleSliderMarkerGroup,
  AngleSliderMarker,
  AngleSliderHiddenInput,
  AngleSliderControl
};
