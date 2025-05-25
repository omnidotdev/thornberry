import { Carousel as ArkCarousel } from "@ark-ui/react/carousel";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps } from "react";

const CarouselProvider = ArkCarousel.RootProvider;
const CarouselContext = ArkCarousel.Context;

const CarouselRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.Root>) => (
  <ArkCarousel.Root className={cn("relative", className)} {...rest} />
);

const CarouselItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.ItemGroup>) => (
  <ArkCarousel.ItemGroup className={cn("flex", className)} {...rest} />
);

const CarouselItem = ({
  className,
  index = 0,
  ...rest
}: ComponentProps<typeof ArkCarousel.Item>) => (
  <ArkCarousel.Item
    index={index}
    className={cn("flex-shrink-0 flex-grow-0 basis-full", className)}
    {...rest}
  />
);

const CarouselNextTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.NextTrigger>) => (
  <ArkCarousel.NextTrigger asChild {...rest}>
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "-translate-y-1/2 absolute top-1/2 right-2 z-10 rounded-full",
        className,
      )}
    >
      <FiChevronRight className="h-4 w-4" />
    </Button>
  </ArkCarousel.NextTrigger>
);

const CarouselPrevTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.PrevTrigger>) => (
  <ArkCarousel.PrevTrigger asChild {...rest}>
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "-translate-y-1/2 absolute top-1/2 left-2 z-10 rounded-full",
        className,
      )}
    >
      <FiChevronLeft className="h-4 w-4" />
    </Button>
  </ArkCarousel.PrevTrigger>
);

const CarouselIndicatorGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.IndicatorGroup>) => (
  <ArkCarousel.IndicatorGroup
    className={cn("mt-3 flex justify-center gap-1", className)}
    {...rest}
  />
);

const CarouselIndicator = ({
  className,
  index,
  ...rest
}: ComponentProps<typeof ArkCarousel.Indicator>) => (
  <ArkCarousel.Indicator
    index={index}
    className={cn(
      "size-3 rounded-full bg-base-600 transition-colors",
      "data-[current]:bg-primary",
      className,
    )}
    {...rest}
  />
);

const CarouselControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.Control>) => (
  <ArkCarousel.Control
    className={cn("flex items-center justify-between", className)}
    {...rest}
  />
);

export {
  CarouselRoot,
  CarouselItemGroup,
  CarouselItem,
  CarouselNextTrigger,
  CarouselPrevTrigger,
  CarouselIndicatorGroup,
  CarouselIndicator,
  CarouselControl,
  CarouselProvider,
  CarouselContext,
};
