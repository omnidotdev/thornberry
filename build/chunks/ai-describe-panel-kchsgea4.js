import {
  cn
} from "./ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/checkbox.tsx
import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import { Check } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var CheckboxProvider2 = ArkCheckbox.RootProvider;
var CheckboxGroup2 = ArkCheckbox.Group;
var CheckboxContext2 = ArkCheckbox.Context;
var CheckboxRoot2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCheckbox.Root, {
  className: cn("flex items-center", className),
  ...rest
});
var CheckboxLabel2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCheckbox.Label, {
  className: cn("ml-2 font-medium text-sm leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
  ...rest
});
var CheckboxControl2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCheckbox.Control, {
  className: cn("flex size-5 shrink-0 items-center justify-center rounded-sm border border-primary shadow transition-normal", "disabled:cursor-not-allowed peer-disabled:opacity-50", "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", "ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2", className),
  ...rest
});
var CheckboxIndicator2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCheckbox.Indicator, {
  className: cn("peer", className),
  ...rest
});
var CheckboxHiddenInput2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCheckbox.HiddenInput, {
  className: cn("peer sr-only", className),
  ...rest
});
var Checkbox2 = ({ label, ...rest }) => /* @__PURE__ */ jsxs(CheckboxRoot2, {
  ...rest,
  children: [
    /* @__PURE__ */ jsx(CheckboxHiddenInput2, {}),
    /* @__PURE__ */ jsx(CheckboxControl2, {
      children: /* @__PURE__ */ jsx(CheckboxIndicator2, {
        children: /* @__PURE__ */ jsx(Check, {
          className: "size-3.5"
        })
      })
    }),
    label && /* @__PURE__ */ jsx(CheckboxLabel2, {
      children: label
    })
  ]
});
export { CheckboxProvider2, CheckboxGroup2, CheckboxContext2, CheckboxRoot2, CheckboxLabel2, CheckboxControl2, CheckboxIndicator2, CheckboxHiddenInput2, Checkbox2 };
