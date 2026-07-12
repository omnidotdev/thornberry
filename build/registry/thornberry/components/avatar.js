import {
  cva
} from "../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/avatar.tsx
import { Avatar as ArkAvatar, useAvatar as useArkAvatar } from "@ark-ui/react";
import { jsx } from "react/jsx-runtime";
var avatarVariants = cva("relative flex shrink-0 items-center justify-center overflow-hidden rounded-full", {
  variants: {
    size: {
      xs: "size-8 text-xs",
      sm: "size-9 text-sm",
      md: "size-10 text-md",
      lg: "size-11 text-lg",
      xl: "size-12 text-xl"
    }
  },
  defaultVariants: { size: "md" }
});
var useAvatar = useArkAvatar;
var AvatarProvider = ({
  className,
  size,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAvatar.RootProvider, {
  className: cn(avatarVariants({ size, className })),
  ...rest
});
var AvatarRoot = ({
  className,
  size,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAvatar.Root, {
  className: cn(avatarVariants({ size, className })),
  ...rest
});
var AvatarFallback = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAvatar.Fallback, {
  className: cn("flex size-full items-center justify-center rounded-full bg-muted", className),
  ...rest
});
var AvatarImage = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAvatar.Image, {
  hidden: false,
  ref: (img) => {
    if (img?.complete && img.naturalWidth > 0) {
      img.style.transition = "none";
      img.style.opacity = "1";
    }
  },
  className: cn("aspect-square size-full opacity-0 transition-opacity duration-300 ease-out data-[state=visible]:opacity-100", className),
  alt: "Avatar",
  ...rest
});
export {
  useAvatar,
  AvatarRoot,
  AvatarProvider,
  AvatarImage,
  AvatarFallback
};
