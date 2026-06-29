import {
  cva
} from "../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/avatar.tsx
import { Avatar as ArkAvatar, useAvatar as useArkAvatar } from "@ark-ui/react";
import { jsxDEV } from "react/jsx-dev-runtime";
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
}) => /* @__PURE__ */ jsxDEV(ArkAvatar.RootProvider, {
  className: cn(avatarVariants({ size, className })),
  ...rest
}, undefined, false, undefined, this);
var AvatarRoot = ({
  className,
  size,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkAvatar.Root, {
  className: cn(avatarVariants({ size, className })),
  ...rest
}, undefined, false, undefined, this);
var AvatarFallback = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkAvatar.Fallback, {
  className: cn("flex size-full items-center justify-center rounded-full bg-muted", className),
  ...rest
}, undefined, false, undefined, this);
var AvatarImage = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkAvatar.Image, {
  className: cn("aspect-square size-full", className),
  alt: "Avatar",
  ...rest
}, undefined, false, undefined, this);
export {
  useAvatar,
  AvatarRoot,
  AvatarProvider,
  AvatarImage,
  AvatarFallback
};
