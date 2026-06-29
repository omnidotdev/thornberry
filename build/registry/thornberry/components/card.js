import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/card.tsx
import { ark } from "@ark-ui/react";
import { jsxDEV } from "react/jsx-dev-runtime";
var CardRoot = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV(ark.div, {
  className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
  ...rest
}, undefined, false, undefined, this);
var CardHeader = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV(ark.div, {
  className: cn("flex flex-col gap-1.5 p-6", className),
  ...rest
}, undefined, false, undefined, this);
var CardTitle = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV(ark.div, {
  className: cn("font-semibold leading-none tracking-tight", className),
  ...rest
}, undefined, false, undefined, this);
var CardDescription = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ark.div, {
  className: cn("text-muted-foreground text-sm", className),
  ...rest
}, undefined, false, undefined, this);
var CardContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ark.div, {
  className: cn("p-6 pt-0", className),
  ...rest
}, undefined, false, undefined, this);
var CardFooter = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV(ark.div, {
  className: cn("flex items-center p-6 pt-0", className),
  ...rest
}, undefined, false, undefined, this);
export {
  CardTitle,
  CardRoot,
  CardHeader,
  CardFooter,
  CardDescription,
  CardContent
};
