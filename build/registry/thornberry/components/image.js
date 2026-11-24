import {
  cva
} from "../../../chunks/ai-describe-panel-g7wczx51.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/image.tsx
import { Image as UnpicImage } from "@unpic/react";
import { useCallback, useState } from "react";
import { jsx } from "react/jsx-runtime";
var imageVariants = cva("", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      full: "rounded-full"
    }
  }
});
var blurredBackground = (lqip) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'><filter id='b' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='20'/><feComponentTransfer><feFuncA type='discrete' tableValues='1 1'/></feComponentTransfer></filter><image width='100%' height='100%' preserveAspectRatio='xMidYMid slice' href='${lqip}' filter='url(#b)'/></svg>`;
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
};
var blurUpStyle = (lqip, objectPosition = "center") => ({
  backgroundImage: blurredBackground(lqip),
  backgroundSize: "cover",
  backgroundPosition: objectPosition,
  backgroundRepeat: "no-repeat"
});
var Image = ({ className, rounded, lqip, ...rest }) => {
  const { style, onLoad } = rest;
  const [isLoaded, setIsLoaded] = useState(false);
  const markIfLoaded = useCallback((img) => {
    if (img?.complete && img.naturalWidth > 0)
      setIsLoaded(true);
  }, []);
  const placeholder = lqip && !isLoaded ? blurUpStyle(lqip, typeof style?.objectPosition === "string" ? style.objectPosition : undefined) : undefined;
  const imageProps = {
    ...rest,
    ref: lqip ? markIfLoaded : undefined,
    className: cn(imageVariants({ rounded }), className),
    style: placeholder ? { ...placeholder, ...style } : style,
    onLoad: (event) => {
      setIsLoaded(true);
      onLoad?.(event);
    }
  };
  return /* @__PURE__ */ jsx(UnpicImage, {
    ...imageProps
  });
};
export {
  Image,
  blurUpStyle,
  imageVariants
};
