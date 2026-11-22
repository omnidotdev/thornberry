import {
  toggleVariants2
} from "../../../chunks/ai-describe-panel-hrmdca8d.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-zm6svx9v.js";

// src/registry/thornberry/components/toggle-group.tsx
import { ToggleGroup as ArkToggleGroup } from "@ark-ui/react/toggle-group";
import { createContext, useContext } from "react";
import { jsx } from "react/jsx-runtime";
var ToggleGroupStyleContext = createContext({});
var ToggleGroupProvider = ArkToggleGroup.RootProvider;
var ToggleGroupContext = ArkToggleGroup.Context;
var ToggleGroupRoot = ({
  className,
  variant,
  size,
  ...rest
}) => /* @__PURE__ */ jsx(ToggleGroupStyleContext.Provider, {
  value: { variant, size },
  children: /* @__PURE__ */ jsx(ArkToggleGroup.Root, {
    className: cn("inline-flex w-fit items-center gap-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch", className),
    ...rest
  })
});
var ToggleGroupItem = ({
  className,
  variant,
  size,
  ...rest
}) => {
  const inherited = useContext(ToggleGroupStyleContext);
  return /* @__PURE__ */ jsx(ArkToggleGroup.Item, {
    className: cn(toggleVariants2({
      variant: variant ?? inherited.variant,
      size: size ?? inherited.size
    }), className),
    ...rest
  });
};
export {
  ToggleGroupContext,
  ToggleGroupItem,
  ToggleGroupProvider,
  ToggleGroupRoot
};
