import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/pin-input.tsx
import { PinInput as ArkPinInput } from "@ark-ui/react/pin-input";
import { jsx } from "react/jsx-runtime";
var PinInputProvider = ArkPinInput.RootProvider;
var PinInputContext = ArkPinInput.Context;
var PinInputRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkPinInput.Root, {
  className: cn("inline-block", className),
  ...rest
});
var PinInputLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkPinInput.Label, {
  className: cn("mb-1.5 block font-medium", className),
  ...rest
});
var PinInputControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkPinInput.Control, {
  className: cn("flex items-center gap-2", className),
  ...rest
});
var PinInputInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkPinInput.Input, {
  className: cn("flex h-12 w-12 items-center justify-center rounded-md border bg-transparent text-center text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50", className),
  ...rest
});
var PinInputHiddenInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkPinInput.HiddenInput, {
  className,
  ...rest
});
export {
  PinInputRoot,
  PinInputProvider,
  PinInputLabel,
  PinInputInput,
  PinInputHiddenInput,
  PinInputControl,
  PinInputContext
};
