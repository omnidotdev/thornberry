import {
  Button
} from "../../../chunks/avatar-jb3sh07m.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/carousel.tsx
import { Carousel as ArkCarousel } from "@ark-ui/react/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { jsx } from "react/jsx-runtime";
var CarouselProvider = ArkCarousel.RootProvider;
var CarouselContext = ArkCarousel.Context;
var CarouselRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCarousel.Root, {
  spacing: "8px",
  className: cn("relative", className),
  ...rest
});
var CarouselItemGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCarousel.ItemGroup, {
  className: cn("z-10 flex", className),
  ...rest
});
var CarouselItem = ({
  className,
  index = 0,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCarousel.Item, {
  index,
  className: cn("relative z-0 shrink-0 grow-0 basis-full", className),
  ...rest
});
var CarouselNextTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCarousel.NextTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsx(Button, {
    variant: "outline",
    size: "icon",
    className: cn("z-10 size-7 rounded-full", className),
    children: /* @__PURE__ */ jsx(ChevronRight, {
      className: "h-4 w-4"
    })
  })
});
var CarouselPrevTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCarousel.PrevTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsx(Button, {
    variant: "outline",
    size: "icon",
    className: cn("z-10 size-7 rounded-full", className),
    children: /* @__PURE__ */ jsx(ChevronLeft, {
      className: "h-4 w-4"
    })
  })
});
var CarouselIndicatorGroup = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCarousel.IndicatorGroup, {
  className: cn("flex items-center justify-center gap-2", className),
  ...rest
});
var CarouselIndicator = ({
  className,
  index,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCarousel.Indicator, {
  index,
  className: cn("size-5 rounded-full border bg-muted transition-colors data-current:bg-primary", className),
  ...rest
});
var CarouselControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkCarousel.Control, {
  className: cn("mt-3 flex items-center justify-center gap-2", className),
  ...rest
});
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
