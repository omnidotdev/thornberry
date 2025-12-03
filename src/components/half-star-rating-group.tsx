"use client";

import { StarHalfIcon, StarIcon } from "lucide-react";

import {
  RatingGroupContext,
  RatingGroupControl,
  RatingGroupHiddenInput,
  RatingGroupItem,
  RatingGroupItemContext,
  RatingGroupLabel,
  RatingGroupRoot,
} from "@/registry/thornberry/components/rating-group";

const HaflStarRatingGroup = () => (
  <RatingGroupRoot count={5} defaultValue={3} allowHalf>
    <RatingGroupLabel>Half Star Example</RatingGroupLabel>
    <RatingGroupControl>
      <RatingGroupContext>
        {({ items }) =>
          items.map((item) => (
            <RatingGroupItem key={item} index={item}>
              <RatingGroupItemContext>
                {({ half, highlighted }) => {
                  if (half) return <StarHalfIcon className="fill-amber-500" />;
                  if (highlighted)
                    return <StarIcon className="fill-amber-500" />;
                  return <StarIcon />;
                }}
              </RatingGroupItemContext>
            </RatingGroupItem>
          ))
        }
      </RatingGroupContext>
      <RatingGroupHiddenInput />
    </RatingGroupControl>
  </RatingGroupRoot>
);

export default HaflStarRatingGroup;
