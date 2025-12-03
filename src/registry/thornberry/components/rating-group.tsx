import { RatingGroup as ArkRatingGroup } from "@ark-ui/react/rating-group";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const RatingGroupProvider = ArkRatingGroup.RootProvider;
const RatingGroupContext = ArkRatingGroup.Context;
const RatingGroupItemContext = ArkRatingGroup.ItemContext;

const RatingGroupRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRatingGroup.Root>) => (
  <ArkRatingGroup.Root
    className={cn("inline-flex flex-col", className)}
    {...rest}
  />
);

const RatingGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRatingGroup.Label>) => (
  <ArkRatingGroup.Label
    className={cn("mb-1.5 block font-medium text-foreground", className)}
    {...rest}
  />
);

const RatingGroupControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRatingGroup.Control>) => (
  <ArkRatingGroup.Control className={cn("inline-flex", className)} {...rest} />
);

const RatingGroupItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRatingGroup.Item>) => (
  <ArkRatingGroup.Item
    className={cn(
      "inline-flex cursor-pointer p-1 outline-none data-checked:text-amber-500 data-highlighted:text-amber-500",
      className,
    )}
    {...rest}
  />
);

const RatingGroupHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRatingGroup.HiddenInput>) => (
  <ArkRatingGroup.HiddenInput className={className} {...rest} />
);

export {
  RatingGroupRoot,
  RatingGroupLabel,
  RatingGroupControl,
  RatingGroupItem,
  RatingGroupHiddenInput,
  RatingGroupProvider,
  RatingGroupContext,
  RatingGroupItemContext,
};
