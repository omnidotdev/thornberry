import {
  Button
} from "../../../chunks/avatar-07z52b3z.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/number-input.tsx
import { NumberInput as ArkNumberInput } from "@ark-ui/react/number-input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { jsxDEV } from "react/jsx-dev-runtime";
var NumberInputProvider = ArkNumberInput.RootProvider;
var NumberInputContext = ArkNumberInput.Context;
var NumberInputRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkNumberInput.Root, {
  className: cn("flex w-full flex-col", className),
  ...rest
}, undefined, false, undefined, this);
var NumberInputLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkNumberInput.Label, {
  className: cn("block font-medium text-sm", className),
  ...rest
}, undefined, false, undefined, this);
var NumberInputControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkNumberInput.Control, {
  className: cn("flex h-10 items-center", className),
  ...rest
}, undefined, false, undefined, this);
var NumberInputInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkNumberInput.Input, {
  className: cn("h-full w-full rounded-l-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50", className),
  ...rest
}, undefined, false, undefined, this);
var NumberInputDecrementTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkNumberInput.DecrementTrigger, {
  asChild: true,
  tabIndex: 0,
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Button, {
    variant: "ghost",
    size: "icon",
    className: cn("h-4 flex-1 rounded-none rounded-br-md focus-visible:bg-primary/20 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:dark:bg-primary/40", className),
    children: /* @__PURE__ */ jsxDEV(ChevronDown, {
      className: "h-4 w-4"
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var NumberInputIncrementTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkNumberInput.IncrementTrigger, {
  asChild: true,
  tabIndex: 0,
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Button, {
    variant: "ghost",
    size: "icon",
    className: cn("h-4 flex-1 rounded-none rounded-tr-md focus-visible:bg-primary/20 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:dark:bg-primary/40", className),
    children: /* @__PURE__ */ jsxDEV(ChevronUp, {
      className: "h-4 w-4"
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
export {
  NumberInputRoot,
  NumberInputProvider,
  NumberInputLabel,
  NumberInputInput,
  NumberInputIncrementTrigger,
  NumberInputDecrementTrigger,
  NumberInputControl,
  NumberInputContext
};
