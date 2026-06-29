import {
  Button
} from "../../../chunks/avatar-07z52b3z.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/carousel.tsx
import { Carousel as ArkCarousel } from "@ark-ui/react/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { jsxDEV } from "react/jsx-dev-runtime";
var CarouselProvider = ArkCarousel.RootProvider;
var CarouselContext = ArkCarousel.Context;
var CarouselRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCarousel.Root, {
  spacing: "8px",
  className: cn("relative", className),
  ...rest
}, undefined, false, undefined, this);
var CarouselItemGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCarousel.ItemGroup, {
  className: cn("z-10 flex", className),
  ...rest
}, undefined, false, undefined, this);
var CarouselItem = ({
  className,
  index = 0,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCarousel.Item, {
  index,
  className: cn("relative z-0 shrink-0 grow-0 basis-full", className),
  ...rest
}, undefined, false, undefined, this);
var CarouselNextTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCarousel.NextTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Button, {
    variant: "outline",
    size: "icon",
    className: cn("z-10 size-7 rounded-full", className),
    children: /* @__PURE__ */ jsxDEV(ChevronRight, {
      className: "h-4 w-4"
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var CarouselPrevTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCarousel.PrevTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Button, {
    variant: "outline",
    size: "icon",
    className: cn("z-10 size-7 rounded-full", className),
    children: /* @__PURE__ */ jsxDEV(ChevronLeft, {
      className: "h-4 w-4"
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var CarouselIndicatorGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCarousel.IndicatorGroup, {
  className: cn("flex items-center justify-center gap-2", className),
  ...rest
}, undefined, false, undefined, this);
var CarouselIndicator = ({
  className,
  index,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCarousel.Indicator, {
  index,
  className: cn("size-5 rounded-full border bg-muted transition-colors data-current:bg-primary", className),
  ...rest
}, undefined, false, undefined, this);
var CarouselControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkCarousel.Control, {
  className: cn("mt-3 flex items-center justify-center gap-2", className),
  ...rest
}, undefined, false, undefined, this);
export {
  CarouselRoot,
  CarouselProvider,
  CarouselPrevTrigger,
  CarouselNextTrigger,
  CarouselItemGroup,
  CarouselItem,
  CarouselIndicatorGroup,
  CarouselIndicator,
  CarouselControl,
  CarouselContext
};
