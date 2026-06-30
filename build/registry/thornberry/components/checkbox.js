import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/checkbox.tsx
import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import { jsx } from "react/jsx-runtime";
var CheckboxProvider = ArkCheckbox.RootProvider;
var CheckboxGroup = ArkCheckbox.Group;
var CheckboxContext = ArkCheckbox.Context;
var CheckboxRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCheckbox.Root, {
  className: cn("flex items-center", className),
  ...rest
});
var CheckboxLabel = ({ children }) => /* @__PURE__ */ jsx(ArkCheckbox.Label, {
  className: "ml-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  children
});
var CheckboxControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCheckbox.Control, {
  className: cn("flex size-5 items-center justify-center rounded-sm border border-primary shadow transition-normal", "disabled:cursor-not-allowed peer-disabled:opacity-50", "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", "ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2", className),
  ...rest
});
var CheckboxIndicator = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCheckbox.Indicator, {
  className: cn("peer", className),
  ...rest
});
var CheckboxHiddenInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCheckbox.HiddenInput, {
  className: cn("peer sr-only", className),
  ...rest
});
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
