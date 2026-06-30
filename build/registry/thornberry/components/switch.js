import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/switch.tsx
import { Switch as ArkSwitch } from "@ark-ui/react/switch";
import { jsx } from "react/jsx-runtime";
var SwitchProvider = ArkSwitch.RootProvider;
var SwitchContext = ArkSwitch.Context;
var SwitchRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSwitch.Root, {
  className: cn("inline-flex items-center gap-2 rounded-full outline-none", className),
  ...rest
});
var SwitchControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSwitch.Control, {
  className: cn("inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors", "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
  ...rest
});
var SwitchThumb = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSwitch.Thumb, {
  className: cn("block h-5 w-5 rounded-full bg-background shadow-lg transition-transform", "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0", className),
  ...rest
});
var SwitchHiddenInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSwitch.HiddenInput, {
  className: cn("pointer-events-none absolute h-0 w-0 opacity-0", className),
  ...rest
});
var SwitchLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkSwitch.Label, {
  className: cn("font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
  ...rest
});
export {
  SwitchThumb,
  SwitchRoot,
  SwitchProvider,
  SwitchLabel,
  SwitchHiddenInput,
  SwitchControl,
  SwitchContext
};
