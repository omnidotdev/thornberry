import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/switch.tsx
import { Switch as ArkSwitch } from "@ark-ui/react/switch";
import { jsxDEV } from "react/jsx-dev-runtime";
var SwitchProvider = ArkSwitch.RootProvider;
var SwitchContext = ArkSwitch.Context;
var SwitchRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSwitch.Root, {
  className: cn("inline-flex items-center gap-2 rounded-full outline-none", className),
  ...rest
}, undefined, false, undefined, this);
var SwitchControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSwitch.Control, {
  className: cn("inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors", "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
  ...rest
}, undefined, false, undefined, this);
var SwitchThumb = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSwitch.Thumb, {
  className: cn("block h-5 w-5 rounded-full bg-background shadow-lg transition-transform", "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0", className),
  ...rest
}, undefined, false, undefined, this);
var SwitchHiddenInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSwitch.HiddenInput, {
  className: cn("pointer-events-none absolute h-0 w-0 opacity-0", className),
  ...rest
}, undefined, false, undefined, this);
var SwitchLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkSwitch.Label, {
  className: cn("font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
  ...rest
}, undefined, false, undefined, this);
export {
  SwitchThumb,
  SwitchRoot,
  SwitchProvider,
  SwitchLabel,
  SwitchHiddenInput,
  SwitchControl,
  SwitchContext
};
