import { Avatar as ArkAvatar } from "@ark-ui/react";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

type Nullable<T> = T | null;

const getInitials = (name: string) =>
  name
    .match(/(^\S\S?|\s\S)?/g)!
    .map((v) => v.trim())
    .join("")
    .match(/(^\S|\S$)?/g)!
    .join("")
    .toLocaleUpperCase();

const AvatarProvider = ArkAvatar.RootProvider;

const AvatarRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkAvatar.Root>) => (
  <ArkAvatar.Root
    className={cn(
      "relative flex size-10 shrink-0 overflow-hidden rounded-full items-center justify-center",
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

interface AvatarProps extends ComponentProps<typeof AvatarRoot> {
  name?: Nullable<string>;
  fallback?: ReactNode;
  imageSrc?: string;
}

const Avatar = ({ name, fallback, imageSrc, ...rest }: AvatarProps) => (
  <AvatarRoot {...rest}>
    <AvatarFallback>{name ? getInitials(name) : fallback}</AvatarFallback>
    {imageSrc && <AvatarImage src={imageSrc} />}
  </AvatarRoot>
);

export { AvatarRoot, AvatarFallback, AvatarImage, Avatar, AvatarProvider };
