import {
  cn
} from "./avatar-yp1ewaxt.js";

// src/registry/thornberry/components/input.tsx
import { ark } from "@ark-ui/react";
import { jsx } from "react/jsx-runtime";
var Input = ({ className, ...rest }) => /* @__PURE__ */ jsx(ark.input, {
  className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
  ...rest
});
export { Input };
