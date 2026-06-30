import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/rating-group.tsx
import { RatingGroup as ArkRatingGroup } from "@ark-ui/react/rating-group";
import { jsx } from "react/jsx-runtime";
var RatingGroupProvider = ArkRatingGroup.RootProvider;
var RatingGroupContext = ArkRatingGroup.Context;
var RatingGroupItemContext = ArkRatingGroup.ItemContext;
var RatingGroupRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkRatingGroup.Root, {
  className: cn("inline-flex flex-col", className),
  ...rest
});
var RatingGroupLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkRatingGroup.Label, {
  className: cn("mb-1.5 block font-medium text-foreground", className),
  ...rest
});
var RatingGroupControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkRatingGroup.Control, {
  className: cn("inline-flex", className),
  ...rest
});
var RatingGroupItem = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkRatingGroup.Item, {
  className: cn("inline-flex cursor-pointer p-1 outline-none data-checked:text-amber-500 data-highlighted:text-amber-500", className),
  ...rest
});
var RatingGroupHiddenInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkRatingGroup.HiddenInput, {
  className,
  ...rest
});
export {
  RatingGroupRoot,
  RatingGroupProvider,
  RatingGroupLabel,
  RatingGroupItemContext,
  RatingGroupItem,
  RatingGroupHiddenInput,
  RatingGroupControl,
  RatingGroupContext
};
