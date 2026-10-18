import {
  cva
} from "./account-user-two-factor-authentication-g7wczx51.js";
import {
  cn
} from "./account-user-two-factor-authentication-81fr4sax.js";

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
var useAvatar2 = useArkAvatar;
var AvatarProvider2 = ({
  className,
  size,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAvatar.RootProvider, {
  className: cn(avatarVariants({ size, className })),
  ...rest
});
var AvatarRoot2 = ({
  className,
  size,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAvatar.Root, {
  className: cn(avatarVariants({ size, className })),
  ...rest
});
var AvatarFallback2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAvatar.Fallback, {
  className: cn("flex size-full items-center justify-center rounded-full bg-muted", className),
  ...rest
});
var AvatarImage2 = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkAvatar.Image, {
  hidden: false,
  ref: (img) => {
    if (!img)
      return;
    if (img.getAttribute("src") && img.complete && img.naturalWidth > 0) {
      img.style.transition = "none";
      img.style.opacity = "1";
    } else {
      img.style.opacity = "";
      img.style.transition = "";
    }
  },
  className: cn("absolute inset-0 aspect-square size-full object-cover opacity-0 transition-opacity duration-300 ease-out data-[state=visible]:opacity-100", className),
  alt: "Avatar",
  ...rest
});
export { useAvatar2, AvatarProvider2, AvatarRoot2, AvatarFallback2, AvatarImage2 };
