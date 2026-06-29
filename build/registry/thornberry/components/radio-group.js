import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/radio-group.tsx
import { RadioGroup as ArkRadioGroup } from "@ark-ui/react/radio-group";
import { jsxDEV } from "react/jsx-dev-runtime";
var RadioGroupRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkRadioGroup.Root, {
  className: cn("flex w-fit flex-col gap-4", className),
  ...rest
}, undefined, false, undefined, this);
var RadioGroupLabel = ({
  children,
  className
}) => /* @__PURE__ */ jsxDEV(ArkRadioGroup.Label, {
  className,
  children
}, undefined, false, undefined, this);
var RadioGroupItem = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkRadioGroup.Item, {
  className: cn("flex cursor-pointer items-center space-x-2", className),
  ...rest
}, undefined, false, undefined, this);
var RadioGroupItemHiddenInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkRadioGroup.ItemHiddenInput, {
  className: cn("peer sr-only focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background", className),
  ...rest
}, undefined, false, undefined, this);
var RadioGroupItemControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkRadioGroup.ItemControl, {
  className: cn("flex size-3 items-center justify-center rounded-full shadow ring-1 ring-ring ring-offset-2 ring-offset-background transition-normal", "peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-focus:ring-offset-background", "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
  ...rest,
  children: /* @__PURE__ */ jsxDEV("div", {
    className: cn("size-2 rounded-full bg-current opacity-0 transition-opacity data-[state=checked]:opacity-100")
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var RadioGroupItemText = ({
  children,
  className
}) => /* @__PURE__ */ jsxDEV(ArkRadioGroup.ItemText, {
  className: cn("font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
  children
}, undefined, false, undefined, this);
export {
  RadioGroupRoot,
  RadioGroupLabel,
  RadioGroupItemText,
  RadioGroupItemHiddenInput,
  RadioGroupItemControl,
  RadioGroupItem
};
