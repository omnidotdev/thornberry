import { Avatar as ArkAvatar } from "@ark-ui/react";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
declare const avatarVariants: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const useAvatar: (props?: import("@ark-ui/react").UseAvatarProps) => import("@ark-ui/react").UseAvatarReturn;
declare const AvatarProvider: ({ className, size, ...rest }: ComponentProps<typeof ArkAvatar.RootProvider> & VariantProps<typeof avatarVariants>) => import("react/jsx-runtime").JSX.Element;
declare const AvatarRoot: ({ className, size, ...rest }: ComponentProps<typeof ArkAvatar.Root> & VariantProps<typeof avatarVariants>) => import("react/jsx-runtime").JSX.Element;
declare const AvatarFallback: ({ className, ...rest }: ComponentProps<typeof ArkAvatar.Fallback>) => import("react/jsx-runtime").JSX.Element;
declare const AvatarImage: ({ className, ...rest }: ComponentProps<typeof ArkAvatar.Image>) => import("react/jsx-runtime").JSX.Element;
export { AvatarRoot, AvatarFallback, AvatarImage, AvatarProvider, useAvatar };
