import { Carousel as ArkCarousel } from "@ark-ui/react/carousel";
import React from "react";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

import type { ComponentProps, ReactElement, ReactNode } from "react";

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
        "absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full",
        className,
      )}
    >
      <ChevronRight className="h-4 w-4" />
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
        "absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full",
        className,
      )}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  </ArkCarousel.PrevTrigger>
);

const CarouselIndicatorGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.IndicatorGroup>) => (
  <ArkCarousel.IndicatorGroup
    className={cn("flex gap-1 justify-center mt-3", className)}
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
      "h-2 w-2 rounded-full bg-secondary transition-colors",
      "data-[active]:bg-primary",
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

interface CarouselProps extends ComponentProps<typeof CarouselRoot> {
  children: ReactNode;
  showControls?: boolean;
  showIndicators?: boolean;
}

const Carousel = ({
  children,
  showControls = true,
  showIndicators = true,
  ...rest
}: CarouselProps) => {
  // Convert children to array to work with them
  const childrenArray = React.Children.toArray(children) as ReactElement[];

  return (
    <CarouselRoot loop {...rest} slideCount={childrenArray.length}>
      <div className="overflow-hidden">
        <CarouselItemGroup>
          {childrenArray.map((child, i) => (
            <CarouselItem key={`carousel-item-${i}`} index={i}>
              {child}
            </CarouselItem>
          ))}
        </CarouselItemGroup>
      </div>

      {showControls && (
        <>
          <CarouselPrevTrigger />
          <CarouselNextTrigger />
        </>
      )}

      {showIndicators && (
        <CarouselIndicatorGroup>
          {childrenArray.map((_, i) => (
            <CarouselIndicator key={`carousel-indicator-${i}`} index={i} />
          ))}
        </CarouselIndicatorGroup>
      )}
    </CarouselRoot>
  );
};

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
  Carousel,
};
