import { Carousel as ArkCarousel } from "@ark-ui/react/carousel";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps } from "react";

const carouselVariants = tv({
  slots: {
    root: "relative",
    itemGroup: "z-10 flex",
    item: "relative z-0 flex-shrink-0 flex-grow-0 basis-full",
    nextTrigger: "z-10 size-7 rounded-full",
    prevTrigger: " z-10 size-7 rounded-full",
    indicatorGroup: "flex items-center justify-center gap-2",
    indicator:
      "size-5 rounded-full border bg-secondary transition-colors data-[current]:bg-primary",
    control: "mt-3 flex items-center justify-center gap-2",
  },
});

const {
  root,
  itemGroup,
  item,
  nextTrigger,
  prevTrigger,
  indicatorGroup,
  indicator,
  control,
} = carouselVariants();

const CarouselProvider = ArkCarousel.RootProvider;
const CarouselContext = ArkCarousel.Context;

const CarouselRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.Root>) => (
  <ArkCarousel.Root spacing="8px" className={cn(root(), className)} {...rest} />
);

const CarouselItemGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.ItemGroup>) => (
  <ArkCarousel.ItemGroup className={cn(itemGroup(), className)} {...rest} />
);

const CarouselItem = ({
  className,
  index = 0,
  ...rest
}: ComponentProps<typeof ArkCarousel.Item>) => (
  <ArkCarousel.Item index={index} className={cn(item(), className)} {...rest} />
);

const CarouselNextTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.NextTrigger>) => (
  <ArkCarousel.NextTrigger asChild {...rest}>
    <Button
      variant="outline"
      size="icon"
      className={cn(nextTrigger(), className)}
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
      className={cn(prevTrigger(), className)}
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
    className={cn(indicatorGroup(), className)}
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
    className={cn(indicator(), className)}
    {...rest}
  />
);

const CarouselControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkCarousel.Control>) => (
  <ArkCarousel.Control className={cn(control(), className)} {...rest} />
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
