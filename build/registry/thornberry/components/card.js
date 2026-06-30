import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/card.tsx
import { ark } from "@ark-ui/react";
import { jsx } from "react/jsx-runtime";
var CardRoot = ({ className, ...rest }) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
  ...rest
});
var CardHeader = ({ className, ...rest }) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("flex flex-col gap-1.5 p-6", className),
  ...rest
});
var CardTitle = ({ className, ...rest }) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("font-semibold leading-none tracking-tight", className),
  ...rest
});
var CardDescription = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("text-muted-foreground text-sm", className),
  ...rest
});
var CardContent = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("p-6 pt-0", className),
  ...rest
});
var CardFooter = ({ className, ...rest }) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("flex items-center p-6 pt-0", className),
  ...rest
});
export {
  CardTitle,
  CardRoot,
  CardHeader,
  CardFooter,
  CardDescription,
  CardContent
};
