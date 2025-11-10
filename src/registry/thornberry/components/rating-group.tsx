import { RatingGroup as ArkRatingGroup } from "@ark-ui/react/rating-group";
import { FiStar } from "react-icons/fi";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const ratingGroupVariants = tv({
  slots: {
    root: "inline-flex flex-col",
    label: "mb-1.5 block font-medium text-foreground",
    control: "inline-flex",
    item: "inline-flex cursor-pointer p-1 outline-none focus-visible:ring-2 focus-visible:ring-primary data-checked:text-amber-500 data-highlighted:text-amber-500",
    hiddenInput: "",
  },
});

const { root, label, control, item, hiddenInput } = ratingGroupVariants();

const RatingGroupProvider = ArkRatingGroup.RootProvider;
const RatingGroupContext = ArkRatingGroup.Context;

const RatingGroupRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRatingGroup.Root>) => (
  <ArkRatingGroup.Root className={cn(root(), className)} {...rest} />
);

const RatingGroupLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRatingGroup.Label>) => (
  <ArkRatingGroup.Label className={cn(label(), className)} {...rest} />
);

const RatingGroupControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRatingGroup.Control>) => (
  <ArkRatingGroup.Control className={cn(control(), className)} {...rest} />
);

const RatingGroupItem = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRatingGroup.Item>) => (
  <ArkRatingGroup.Item className={cn(item(), className)} {...rest}>
    <FiStar className="h-5 w-5 fill-current" />
  </ArkRatingGroup.Item>
);

const RatingGroupHiddenInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkRatingGroup.HiddenInput>) => (
  <ArkRatingGroup.HiddenInput
    className={cn(hiddenInput(), className)}
    {...rest}
  />
);

export {
  RatingGroupRoot,
  RatingGroupLabel,
  RatingGroupControl,
  RatingGroupItem,
  RatingGroupHiddenInput,
  RatingGroupProvider,
  RatingGroupContext,
};
