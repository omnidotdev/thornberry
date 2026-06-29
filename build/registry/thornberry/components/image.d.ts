import { Image as UnpicImage } from "@unpic/react";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
declare const imageVariants: (props?: ({
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type ImageProps = Omit<ComponentProps<typeof UnpicImage>, "ref"> & VariantProps<typeof imageVariants>;
/**
 * Responsive image with automatic srcset, lazy loading, and CDN optimization
 */
declare const Image: ({ className, rounded, ...rest }: ImageProps) => import("react/jsx-runtime").JSX.Element;
export { Image, imageVariants };
