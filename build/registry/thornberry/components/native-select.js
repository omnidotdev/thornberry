import {
  cva
} from "../../../chunks/ai-describe-panel-dcxtbj5x.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-zm6svx9v.js";

// src/registry/thornberry/components/native-select.tsx
import { ChevronDown } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var nativeSelectVariants = cva("peer border-input text-foreground **:bg-popover **:text-popover-foreground focus-visible:ring-primary has-[option[data-placeholder]:checked]:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 w-full max-w-full min-w-0 cursor-pointer appearance-none truncate rounded-md border bg-transparent py-1 text-base scheme-light shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:scheme-dark", {
  variants: {
    size: {
      sm: "h-8 pr-8 pl-2.5",
      md: "h-9 pr-9 pl-3",
      lg: "h-10 pr-10 pl-3.5"
    }
  },
  defaultVariants: {
    size: "md"
  }
});
var chevronVariants = cva("text-muted-foreground pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 peer-disabled:opacity-50", {
  variants: {
    size: {
      sm: "right-2.5",
      md: "right-3",
      lg: "right-3.5"
    }
  },
  defaultVariants: {
    size: "md"
  }
});
var NativeSelect = ({
  className,
  selectClassName,
  size,
  options,
  placeholder,
  value,
  defaultValue,
  children,
  ...rest
}) => {
  const initialValue = placeholder !== undefined && value === undefined && defaultValue === undefined ? "" : defaultValue;
  return /* @__PURE__ */ jsxs("span", {
    className: cn("relative inline-flex min-w-0 max-w-full", className),
    children: [
      /* @__PURE__ */ jsxs("select", {
        className: cn(nativeSelectVariants({ size }), selectClassName),
        value,
        defaultValue: initialValue,
        ...rest,
        children: [
          placeholder !== undefined && /* @__PURE__ */ jsx("option", {
            value: "",
            disabled: true,
            hidden: true,
            "data-placeholder": "",
            children: placeholder
          }),
          options?.map((option) => /* @__PURE__ */ jsx("option", {
            value: option.value,
            disabled: option.disabled,
            children: option.label
          }, option.value)),
          children
        ]
      }),
      /* @__PURE__ */ jsx(ChevronDown, {
        "aria-hidden": "true",
        className: chevronVariants({ size })
      })
    ]
  });
};
export {
  NativeSelect,
  nativeSelectVariants
};
