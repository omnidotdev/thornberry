import { Image as UnpicImage } from "@unpic/react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

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

type ImageProps = Omit<ComponentProps<typeof UnpicImage>, "ref"> &
  VariantProps<typeof imageVariants>;

/**
 * Responsive image with automatic srcset, lazy loading, and CDN optimization
 */
const Image = ({ className, rounded, ...rest }: ImageProps) => (
  <UnpicImage className={cn(imageVariants({ rounded }), className)} {...rest} />
);

export { Image, imageVariants };
