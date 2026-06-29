import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/rating-group.tsx
import { RatingGroup as ArkRatingGroup } from "@ark-ui/react/rating-group";
import { jsxDEV } from "react/jsx-dev-runtime";
var RatingGroupProvider = ArkRatingGroup.RootProvider;
var RatingGroupContext = ArkRatingGroup.Context;
var RatingGroupItemContext = ArkRatingGroup.ItemContext;
var RatingGroupRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkRatingGroup.Root, {
  className: cn("inline-flex flex-col", className),
  ...rest
}, undefined, false, undefined, this);
var RatingGroupLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkRatingGroup.Label, {
  className: cn("mb-1.5 block font-medium text-foreground", className),
  ...rest
}, undefined, false, undefined, this);
var RatingGroupControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkRatingGroup.Control, {
  className: cn("inline-flex", className),
  ...rest
}, undefined, false, undefined, this);
var RatingGroupItem = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkRatingGroup.Item, {
  className: cn("inline-flex cursor-pointer p-1 outline-none data-checked:text-amber-500 data-highlighted:text-amber-500", className),
  ...rest
}, undefined, false, undefined, this);
var RatingGroupHiddenInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkRatingGroup.HiddenInput, {
  className,
  ...rest
}, undefined, false, undefined, this);
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
