import { Carousel as ArkCarousel } from "@ark-ui/react/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps } from "react";

const CarouselProvider = ArkCarousel.RootProvider;
const CarouselContext = ArkCarousel.Context;

const CarouselRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.Root>) => (
  <ArkCarousel.Root
    spacing="8px"
    className={cn("relative", className)}
    {...rest}
  />
);

const CarouselItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.ItemGroup>) => (
  <ArkCarousel.ItemGroup className={cn("z-10 flex", className)} {...rest} />
);

const CarouselItem = ({
  className,
  index = 0,
  ...rest
}: ComponentProps<typeof ArkCarousel.Item>) => (
  <ArkCarousel.Item
    index={index}
    className={cn("relative z-0 shrink-0 grow-0 basis-full", className)}
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
      className={cn("z-10 size-7 rounded-full", className)}
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
      className={cn("z-10 size-7 rounded-full", className)}
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
    className={cn("flex items-center justify-center gap-2", className)}
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
      "size-5 rounded-full border bg-muted transition-colors data-current:bg-primary",
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
    className={cn("mt-3 flex items-center justify-center gap-2", className)}
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
