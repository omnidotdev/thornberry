import { Avatar as ArkAvatar } from "@ark-ui/react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const AvatarProvider = ArkAvatar.RootProvider;

const AvatarRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkAvatar.Root>) => (
  <ArkAvatar.Root
    className={cn(
      "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full",
      className,
    )}
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
    className={cn("aspect-square h-full w-full", className)}
    alt="avatar"
    {...rest}
  />
);

export { AvatarRoot, AvatarFallback, AvatarImage, AvatarProvider };
