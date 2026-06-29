import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/tags-input.tsx
import { TagsInput as ArkTagsInput } from "@ark-ui/react/tags-input";
import { X } from "lucide-react";
import { jsxDEV } from "react/jsx-dev-runtime";
var TagsInputItemPreview = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTagsInput.ItemPreview, {
  className: cn("flex items-center gap-2", className),
  ...rest
}, undefined, false, undefined, this);
var TagsInputLabel = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTagsInput.Label, {
  className: cn("font-medium text-foreground text-sm", className),
  ...rest
}, undefined, false, undefined, this);
var TagsInputControl = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTagsInput.Control, {
  className: cn("flex flex-wrap gap-2 rounded-md bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className),
  ...rest
}, undefined, false, undefined, this);
var TagsInputInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTagsInput.Input, {
  className: cn("h-9 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground", className),
  ...rest
}, undefined, false, undefined, this);
var TagsInputItem = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTagsInput.Item, {
  className: cn("flex w-fit items-center justify-center gap-1 rounded-md border bg-transparent px-3 font-medium text-foreground text-sm", className),
  ...rest
}, undefined, false, undefined, this);
var TagsInputItemText = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTagsInput.ItemText, {
  className: cn("px-2 py-0.5", className),
  ...rest
}, undefined, false, undefined, this);
var TagsInputItemInput = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkTagsInput.ItemInput, {
  className: cn("w-full bg-transparent px-2 py-0.5 text-foreground outline-none", className),
  ...rest
}, undefined, false, undefined, this);
var TagsInputItemDeleteTrigger = ({
  className,
  children,
  asChild,
  ...rest
}) => {
  if (!children) {
    return /* @__PURE__ */ jsxDEV(ArkTagsInput.ItemDeleteTrigger, {
      className: cn("bg-transparent text-foreground hover:text-red-500", className),
      ...rest,
      children: [
        /* @__PURE__ */ jsxDEV(X, {
          className: "h-4 w-4"
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV("span", {
          className: "sr-only",
          children: "Delete"
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this);
  }
  return /* @__PURE__ */ jsxDEV(ArkTagsInput.ItemDeleteTrigger, {
    className,
    asChild,
    ...rest,
    children
  }, undefined, false, undefined, this);
};
var TagsInputClearTrigger = ({
  className,
  children,
  asChild,
  ...rest
}) => {
  if (!children) {
    return /* @__PURE__ */ jsxDEV(ArkTagsInput.ClearTrigger, {
      className: cn("mt-2 inline-flex h-10 w-full items-center justify-center rounded-md border px-4 py-2 font-medium text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", className),
      ...rest,
      children: "Clear"
    }, undefined, false, undefined, this);
  }
  return /* @__PURE__ */ jsxDEV(ArkTagsInput.ClearTrigger, {
    className,
    asChild,
    ...rest,
    children
  }, undefined, false, undefined, this);
};
var TagsInputContext = ArkTagsInput.Context;
var TagsInputRoot = ArkTagsInput.Root;
export {
  TagsInputRoot,
  TagsInputLabel,
  TagsInputItemText,
  TagsInputItemPreview,
  TagsInputItemInput,
  TagsInputItemDeleteTrigger,
  TagsInputItem,
  TagsInputInput,
  TagsInputControl,
  TagsInputContext,
  TagsInputClearTrigger
};
