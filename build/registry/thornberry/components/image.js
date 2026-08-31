import {
  cva
} from "../../../chunks/account-user-two-factor-authentication-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/account-user-two-factor-authentication-yp1ewaxt.js";
import"../../../chunks/account-user-two-factor-authentication-d1wjbx81.js";

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
