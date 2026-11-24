import { Image as UnpicImage } from "@unpic/react";
import type { VariantProps } from "class-variance-authority";
import type { CSSProperties, ComponentProps } from "react";
declare const imageVariants: (props?: ({
    rounded?: "2xl" | "full" | "lg" | "md" | "none" | "sm" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/**
 * Style for an element showing `lqip` blurred until its real image loads.
 * Exposed for images not rendered through `Image` (e.g. a CSS background)
 * @param lqip - Tiny placeholder image (a base64 image data URI); anything
 *   else yields no placeholder
 * @param objectPosition - Match the image's `object-position` (focal point)
 */
declare const blurUpStyle: (lqip: string | null | undefined, objectPosition?: string) => CSSProperties;
type ImageProps = Omit<ComponentProps<typeof UnpicImage>, "ref"> & VariantProps<typeof imageVariants> & {
    /**
     * Tiny placeholder (LQIP), usually a ~16px webp data URI made at upload
     * time, shown blurred until the image loads (blur-up). Omit for no
     * placeholder
     */
    lqip?: string | null;
};
/**
 * Responsive image with automatic srcset, lazy loading, CDN optimization, and
 * optional blur-up: pass `lqip` and a blurred preview fills the image's box
 * until the real bytes arrive, then is removed (so transparent images do not
 * keep it behind them). An image already loaded (cached, or decoded before
 * hydration) never shows the placeholder flash
 */
declare const Image: ({ className, rounded, lqip, ...rest }: ImageProps) => import("react/jsx-runtime").JSX.Element;
export type { ImageProps };
export { Image, blurUpStyle, imageVariants };
