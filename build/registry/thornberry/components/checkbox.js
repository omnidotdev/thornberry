import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/checkbox.tsx
import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import { jsxDEV } from "react/jsx-dev-runtime";
var CheckboxProvider = ArkCheckbox.RootProvider;
var CheckboxGroup = ArkCheckbox.Group;
var CheckboxContext = ArkCheckbox.Context;
var CheckboxRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCheckbox.Root, {
  className: cn("flex items-center", className),
  ...rest
}, undefined, false, undefined, this);
var CheckboxLabel = ({ children }) => /* @__PURE__ */ jsxDEV(ArkCheckbox.Label, {
  className: "ml-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  children
}, undefined, false, undefined, this);
var CheckboxControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCheckbox.Control, {
  className: cn("flex size-5 items-center justify-center rounded-sm border border-primary shadow transition-normal", "disabled:cursor-not-allowed peer-disabled:opacity-50", "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", "ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2", className),
  ...rest
}, undefined, false, undefined, this);
var CheckboxIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCheckbox.Indicator, {
  className: cn("peer", className),
  ...rest
}, undefined, false, undefined, this);
var CheckboxHiddenInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCheckbox.HiddenInput, {
  className: cn("peer sr-only", className),
  ...rest
}, undefined, false, undefined, this);
export {
  CheckboxRoot,
  CheckboxProvider,
  CheckboxLabel,
  CheckboxIndicator,
  CheckboxHiddenInput,
  CheckboxGroup,
  CheckboxControl,
  CheckboxContext
};
