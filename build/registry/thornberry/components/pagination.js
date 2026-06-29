import {
  Button
} from "../../../chunks/avatar-07z52b3z.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/pagination.tsx
import { Pagination as ArkPagination } from "@ark-ui/react/pagination";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { jsxDEV } from "react/jsx-dev-runtime";
var PaginationProvider = ArkPagination.RootProvider;
var PaginationContext = ArkPagination.Context;
var PaginationRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPagination.Root, {
  className: cn("flex w-full flex-col", className),
  ...rest
}, undefined, false, undefined, this);
var PaginationEllipsis = ({
  className,
  index,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPagination.Ellipsis, {
  index,
  className: cn("flex h-9 w-9 items-center justify-center", className),
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Ellipsis, {
    className: "h-4 w-4"
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var PaginationItem = ({
  className,
  page,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPagination.Item, {
  className: cn("flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background font-medium text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary data-selected:border-primary data-selected:bg-primary data-selected:text-primary-foreground data-selected:focus-visible:ring-foreground", className),
  ...rest
}, undefined, false, undefined, this);
var PaginationPrevTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPagination.PrevTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Button, {
    variant: "outline",
    size: "icon",
    className: cn("h-9 w-9", className),
    children: /* @__PURE__ */ jsxDEV(ChevronLeft, {
      className: "h-4 w-4"
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
var PaginationNextTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsxDEV(ArkPagination.NextTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsxDEV(Button, {
    variant: "outline",
    size: "icon",
    className: cn("h-9 w-9", className),
    children: /* @__PURE__ */ jsxDEV(ChevronRight, {
      className: "h-4 w-4"
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this)
}, undefined, false, undefined, this);
export {
  PaginationRoot,
  PaginationProvider,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  PaginationItem,
  PaginationEllipsis,
  PaginationContext
};
