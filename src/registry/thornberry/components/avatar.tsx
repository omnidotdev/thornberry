import { Avatar as ArkAvatar, useAvatar as useArkAvatar } from "@ark-ui/react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const avatarVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "size-8 text-xs",
        sm: "size-9 text-sm",
        md: "size-10 text-md",
        lg: "size-11 text-lg",
        xl: "size-12 text-xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const useAvatar = useArkAvatar;

const AvatarProvider = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkAvatar.RootProvider> &
  VariantProps<typeof avatarVariants>) => (
  <ArkAvatar.RootProvider
    className={cn(avatarVariants({ size, className }))}
    {...rest}
  />
);

const AvatarRoot = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkAvatar.Root> &
  VariantProps<typeof avatarVariants>) => (
  <ArkAvatar.Root
    className={cn(avatarVariants({ size, className }))}
    {...rest}
  />
);

const AvatarFallback = ({
  className,
  ...rest
}: ComponentProps<typeof ArkAvatar.Fallback>) => (
  <ArkAvatar.Fallback
    className={cn(
      "flex size-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...rest}
  />
);

const AvatarImage = ({
  className,
  ...rest
}: ComponentProps<typeof ArkAvatar.Image>) => (
  <ArkAvatar.Image
    // Render the image even before it decodes (overriding Ark's `hidden`) so it
    // can cross-fade in via opacity rather than snapping from display:none. Ark
    // flips `data-state` to "visible" once it loads, driving the fade; a
    // broken/loading one stays at opacity 0 with the fallback behind it.
    hidden={false}
    ref={(img) => {
      // A cached / already-decoded avatar shows instantly with the transition
      // suppressed, so a page full of cached avatars never mass-fades at once;
      // only a genuinely-loading avatar cross-fades in via the data-state class.
      if (img?.complete && img.naturalWidth > 0) {
        img.style.transition = "none";
        img.style.opacity = "1";
      }
    }}
    className={cn(
      // `absolute inset-0` overlays the image on the fallback instead of leaving
      // it in flow. Because `hidden={false}` keeps the <img> mounted while it
      // loads or after it errors, an in-flow image would be a second flex child
      // of the flex root and split the row with the fallback, shoving the
      // fallback initial off-center. Taking it out of flow lets the fallback own
      // the full circle so its initial stays centered.
      "absolute inset-0 aspect-square size-full opacity-0 transition-opacity duration-300 ease-out data-[state=visible]:opacity-100",
      className,
    )}
    alt="Avatar"
    {...rest}
  />
);

export { AvatarRoot, AvatarFallback, AvatarImage, AvatarProvider, useAvatar };
