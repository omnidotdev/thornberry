import { Avatar as ArkAvatar } from "@ark-ui/react";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
declare const avatarVariants: (props?: ({
    size?: "lg" | "md" | "sm" | "xl" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const useAvatar: (props?: import("@ark-ui/react").UseAvatarProps) => import("@ark-ui/react").UseAvatarReturn;
declare const AvatarProvider: ({ className, size, ...rest }: ComponentProps<typeof ArkAvatar.RootProvider> & VariantProps<typeof avatarVariants>) => import("react/jsx-runtime").JSX.Element;
declare const AvatarRoot: ({ className, size, ...rest }: ComponentProps<typeof ArkAvatar.Root> & VariantProps<typeof avatarVariants>) => import("react/jsx-runtime").JSX.Element;
declare const AvatarFallback: ({ className, ...rest }: ComponentProps<typeof ArkAvatar.Fallback>) => import("react/jsx-runtime").JSX.Element;
declare const AvatarImage: ({ className, ...rest }: ComponentProps<typeof ArkAvatar.Image>) => import("react/jsx-runtime").JSX.Element;
interface AvatarProps extends ComponentProps<typeof AvatarRoot> {
    /** Image URL; the fallback shows while it loads, or when unset or broken. */
    src?: string | null;
    alt?: string;
    /** Shown until the image loads (e.g. the user's initials). */
    fallback: ReactNode;
    imageProps?: ComponentProps<typeof AvatarImage>;
    fallbackProps?: ComponentProps<typeof AvatarFallback>;
}
/**
 * Avatar with an image and a fallback. `className` and `size` style the round
 * frame only; the image and fallback keep their own shape so a border or
 * background set on the frame is never repeated inside the clip.
 */
declare const Avatar: ({ src, alt, fallback, imageProps, fallbackProps, ...rest }: AvatarProps) => import("react/jsx-runtime").JSX.Element;
export { Avatar, AvatarFallback, AvatarImage, type AvatarProps, AvatarProvider, AvatarRoot, useAvatar, };
