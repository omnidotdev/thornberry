import { Image as UnpicImage } from "@unpic/react";
import { cva } from "class-variance-authority";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { CSSProperties, ComponentProps, SyntheticEvent } from "react";

const imageVariants = cva("", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      full: "rounded-full",
    },
  },
});

/**
 * A CSS `background-image` that shows a tiny placeholder (LQIP) smoothly
 * blurred, for blur-up loading. The blur runs in an SVG filter so it applies to
 * the placeholder alone, letting the placeholder sit behind the real image on
 * the same element with no wrapper (so layouts are unchanged). The viewBox
 * gives the SVG an intrinsic size, without which browsers paint it empty
 * @param lqip - Tiny image as a data URI (e.g. a 16px webp) or URL
 */
/** A small inline image: the only placeholder accepted, since it may come from stored user data */
const LQIP_PATTERN =
  /^data:image\/(?:webp|png|jpeg|gif|avif);base64,[A-Za-z0-9+/]+=*$/;
const LQIP_MAX_LENGTH = 4096;

/** Whether `lqip` is a usable placeholder (a small base64 image data URI) */
const isValidLqip = (lqip: string | null | undefined): lqip is string =>
  typeof lqip === "string" &&
  lqip.length <= LQIP_MAX_LENGTH &&
  LQIP_PATTERN.test(lqip);

const blurredBackground = (lqip: string): string => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'><filter id='b' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='20'/><feComponentTransfer><feFuncA type='discrete' tableValues='1 1'/></feComponentTransfer></filter><image width='100%' height='100%' preserveAspectRatio='xMidYMid slice' href='${lqip}' filter='url(#b)'/></svg>`;

  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
};

/**
 * Style for an element showing `lqip` blurred until its real image loads.
 * Exposed for images not rendered through `Image` (e.g. a CSS background)
 * @param lqip - Tiny placeholder image (a base64 image data URI); anything
 *   else yields no placeholder
 * @param objectPosition - Match the image's `object-position` (focal point)
 */
const blurUpStyle = (
  lqip: string | null | undefined,
  objectPosition = "center",
): CSSProperties =>
  isValidLqip(lqip)
    ? {
        backgroundImage: blurredBackground(lqip),
        backgroundSize: "cover",
        backgroundPosition: objectPosition,
        backgroundRepeat: "no-repeat",
      }
    : {};

type ImageProps = Omit<ComponentProps<typeof UnpicImage>, "ref"> &
  VariantProps<typeof imageVariants> & {
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
const Image = ({ className, rounded, lqip, ...rest }: ImageProps) => {
  // unpic's props are a union per layout, so read the two this wraps directly
  const { style, onLoad } = rest as {
    style?: CSSProperties;
    onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  };

  const [isLoaded, setIsLoaded] = useState(false);

  // Catch an image that finished loading before React attached `onLoad`
  const markIfLoaded = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setIsLoaded(true);
  }, []);

  const placeholder =
    isValidLqip(lqip) && !isLoaded
      ? blurUpStyle(
          lqip,
          typeof style?.objectPosition === "string"
            ? style.objectPosition
            : undefined,
        )
      : undefined;

  const imageProps = {
    ...rest,
    ref: isValidLqip(lqip) ? markIfLoaded : undefined,
    className: cn(imageVariants({ rounded }), className),
    style: placeholder ? { ...placeholder, ...style } : style,
    onLoad: (event: SyntheticEvent<HTMLImageElement>) => {
      setIsLoaded(true);
      onLoad?.(event);
    },
  } as ComponentProps<typeof UnpicImage>;

  return <UnpicImage {...imageProps} />;
};

export type { ImageProps };
export { Image, blurUpStyle, imageVariants };
