import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/pin-input.tsx
import { PinInput as ArkPinInput } from "@ark-ui/react/pin-input";
import { jsxDEV } from "react/jsx-dev-runtime";
var PinInputProvider = ArkPinInput.RootProvider;
var PinInputContext = ArkPinInput.Context;
var PinInputRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPinInput.Root, {
  className: cn("inline-block", className),
  ...rest
}, undefined, false, undefined, this);
var PinInputLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPinInput.Label, {
  className: cn("mb-1.5 block font-medium", className),
  ...rest
}, undefined, false, undefined, this);
var PinInputControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPinInput.Control, {
  className: cn("flex items-center gap-2", className),
  ...rest
}, undefined, false, undefined, this);
var PinInputInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPinInput.Input, {
  className: cn("flex h-12 w-12 items-center justify-center rounded-md border bg-transparent text-center text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50", className),
  ...rest
}, undefined, false, undefined, this);
var PinInputHiddenInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPinInput.HiddenInput, {
  className,
  ...rest
}, undefined, false, undefined, this);
export {
  PinInputRoot,
  PinInputProvider,
  PinInputLabel,
  PinInputInput,
  PinInputHiddenInput,
  PinInputControl,
  PinInputContext
};
