import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/color-picker.tsx
import {
  ColorPicker as ArkColorPicker,
  parseColor
} from "@ark-ui/react/color-picker";
import { jsx } from "react/jsx-runtime";
var ColorPickerRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.Root, {
  className: cn("flex flex-col gap-1.5", className),
  ...rest
});
var ColorPickerLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.Label, {
  className: cn("font-medium text-foreground text-sm", className),
  ...rest
});
var ColorPickerControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.Control, {
  className: cn("flex items-center gap-2", className),
  ...rest
});
var ColorPickerChannelInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.ChannelInput, {
  className: cn("text- flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50", className),
  ...rest
});
var ColorPickerValueText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.ValueText, {
  className: cn("text-muted-foreground text-sm", className),
  ...rest
});
var ColorPickerTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.Trigger, {
  className: cn("relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-input outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background", className),
  ...rest
});
var ColorPickerValueSwatch = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.ValueSwatch, {
  className: cn("h-full w-full", className),
  ...rest
});
var ColorPickerPositioner = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.Positioner, {
  className: cn("z-50", className),
  ...rest
});
var ColorPickerContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.Content, {
  className: cn("fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 flex w-80 animate-in flex-col gap-3 overflow-hidden rounded-md border bg-popover p-4 text-popover-foreground shadow-md data-[state=closed]:animate-out", className),
  ...rest
});
var ColorPickerArea = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.Area, {
  className: cn("relative h-[150px] w-full", className),
  ...rest
});
var ColorPickerAreaBackground = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.AreaBackground, {
  className: cn("h-full w-full rounded-md", className),
  ...rest
});
var ColorPickerAreaThumb = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.AreaThumb, {
  className: cn("absolute h-5 w-5 rounded-full border-2 border-white shadow-lg", className),
  ...rest
});
var ColorPickerChannelSlider = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.ChannelSlider, {
  className: cn("h-4 w-full", className),
  ...rest
});
var ColorPickerChannelSliderTrack = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.ChannelSliderTrack, {
  className: cn("relative h-4 w-full rounded-md", className),
  ...rest
});
var ColorPickerChannelSliderThumb = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.ChannelSliderThumb, {
  className: cn("absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm", className),
  ...rest
});
var ColorPickerSwatchGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.SwatchGroup, {
  className: cn("flex flex-wrap gap-2", className),
  ...rest
});
var ColorPickerSwatchTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.SwatchTrigger, {
  className: cn("cursor-pointer", className),
  ...rest
});
var ColorPickerSwatch = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.Swatch, {
  className: cn("h-6 w-6 rounded-md border border-gray-200", className),
  ...rest
});
var ColorPickerSwatchIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.SwatchIndicator, {
  className: cn("flex h-full w-full items-center justify-center text-white", className),
  ...rest
});
var ColorPickerTransparencyGrid = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.TransparencyGrid, {
  className: cn("absolute inset-0 rounded-md", className),
  ...rest
});
var ColorPickerFormatTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.FormatTrigger, {
  className: cn("inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 font-medium text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", className),
  ...rest
});
var ColorPickerFormatSelect = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.FormatSelect, {
  className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
  ...rest
});
var ColorPickerView = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkColorPicker.View, {
  className: cn("flex w-full flex-1 gap-2", className),
  ...rest
});
var ColorPickerEyeDropperTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx("div", {
  children: /* @__PURE__ */ jsx(ArkColorPicker.EyeDropperTrigger, {
    className: cn("flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", className),
    ...rest
  })
});
var ColorPickerHiddenInput = ArkColorPicker.HiddenInput;
export {
  parseColor,
  ColorPickerView,
  ColorPickerValueText,
  ColorPickerValueSwatch,
  ColorPickerTrigger,
  ColorPickerTransparencyGrid,
  ColorPickerSwatchTrigger,
  ColorPickerSwatchIndicator,
  ColorPickerSwatchGroup,
  ColorPickerSwatch,
  ColorPickerRoot,
  ColorPickerPositioner,
  ColorPickerLabel,
  ColorPickerHiddenInput,
  ColorPickerFormatTrigger,
  ColorPickerFormatSelect,
  ColorPickerEyeDropperTrigger,
  ColorPickerControl,
  ColorPickerContent,
  ColorPickerChannelSliderTrack,
  ColorPickerChannelSliderThumb,
  ColorPickerChannelSlider,
  ColorPickerChannelInput,
  ColorPickerAreaThumb,
  ColorPickerAreaBackground,
  ColorPickerArea
};
