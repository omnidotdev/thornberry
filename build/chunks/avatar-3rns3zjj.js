import {
  cn
} from "./avatar-yp1ewaxt.js";

// src/registry/thornberry/components/skeleton.tsx
import { jsx } from "react/jsx-runtime";
var Skeleton = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
  "data-slot": "skeleton",
  className: cn("animate-pulse rounded-md bg-accent", className),
  ...props
});
export { Skeleton };
