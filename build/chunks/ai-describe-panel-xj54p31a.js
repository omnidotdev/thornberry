import {
  cn
} from "./ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/card.tsx
import { ark } from "@ark-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
var CardRoot2 = ({ className, ...rest }) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
  ...rest
});
var CardHeader2 = ({ className, ...rest }) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("flex flex-col gap-1.5 p-6", className),
  ...rest
});
var CardTitle2 = ({ className, ...rest }) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("font-semibold leading-none tracking-tight", className),
  ...rest
});
var CardDescription2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("text-muted-foreground text-sm", className),
  ...rest
});
var CardContent2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("p-6 pt-0", className),
  ...rest
});
var CardFooter2 = ({ className, ...rest }) => /* @__PURE__ */ jsx(ark.div, {
  className: cn("flex items-center p-6 pt-0", className),
  ...rest
});
var Card2 = ({
  title,
  description,
  footer,
  headerProps,
  titleProps,
  descriptionProps,
  contentProps,
  footerProps,
  children,
  ...rest
}) => /* @__PURE__ */ jsxs(CardRoot2, {
  ...rest,
  children: [
    (title || description) && /* @__PURE__ */ jsxs(CardHeader2, {
      ...headerProps,
      children: [
        title && /* @__PURE__ */ jsx(CardTitle2, {
          ...titleProps,
          children: title
        }),
        description && /* @__PURE__ */ jsx(CardDescription2, {
          ...descriptionProps,
          children: description
        })
      ]
    }),
    /* @__PURE__ */ jsx(CardContent2, {
      ...contentProps,
      children
    }),
    footer && /* @__PURE__ */ jsx(CardFooter2, {
      ...footerProps,
      children: footer
    })
  ]
});
export { CardRoot2, CardHeader2, CardTitle2, CardDescription2, CardContent2, CardFooter2, Card2 };
