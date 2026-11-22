import {
  cva
} from "../../../chunks/ai-describe-panel-dcxtbj5x.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-zm6svx9v.js";

// src/registry/thornberry/components/image.tsx
import { Image as UnpicImage } from "@unpic/react";
import { jsx } from "react/jsx-runtime";
var imageVariants = cva("", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      full: "rounded-full"
    }
  }
});
var Image = ({ className, rounded, ...rest }) => /* @__PURE__ */ jsx(UnpicImage, {
  className: cn(imageVariants({ rounded }), className),
  ...rest
});
export {
  Image,
  imageVariants
};
