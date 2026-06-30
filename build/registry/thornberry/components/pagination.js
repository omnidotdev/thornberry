import {
  Button
} from "../../../chunks/avatar-jb3sh07m.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/pagination.tsx
import { Pagination as ArkPagination } from "@ark-ui/react/pagination";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { jsx } from "react/jsx-runtime";
var PaginationProvider = ArkPagination.RootProvider;
var PaginationContext = ArkPagination.Context;
var PaginationRoot = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkPagination.Root, {
  className: cn("flex w-full flex-col", className),
  ...rest
});
var PaginationEllipsis = ({
  className,
  index,
  ...rest
}) => /* @__PURE__ */ jsx(ArkPagination.Ellipsis, {
  index,
  className: cn("flex h-9 w-9 items-center justify-center", className),
  ...rest,
  children: /* @__PURE__ */ jsx(Ellipsis, {
    className: "h-4 w-4"
  })
});
var PaginationItem = ({
  className,
  page,
  ...rest
}) => /* @__PURE__ */ jsx(ArkPagination.Item, {
  className: cn("flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background font-medium text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary data-selected:border-primary data-selected:bg-primary data-selected:text-primary-foreground data-selected:focus-visible:ring-foreground", className),
  ...rest
});
var PaginationPrevTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkPagination.PrevTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsx(Button, {
    variant: "outline",
    size: "icon",
    className: cn("h-9 w-9", className),
    children: /* @__PURE__ */ jsx(ChevronLeft, {
      className: "h-4 w-4"
    })
  })
});
var PaginationNextTrigger = ({
  className,
  ...rest
}) => /* @__PURE__ */ jsx(ArkPagination.NextTrigger, {
  asChild: true,
  ...rest,
  children: /* @__PURE__ */ jsx(Button, {
    variant: "outline",
    size: "icon",
    className: cn("h-9 w-9", className),
    children: /* @__PURE__ */ jsx(ChevronRight, {
      className: "h-4 w-4"
    })
  })
});
export {
  PaginationRoot,
  PaginationProvider,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  PaginationItem,
  PaginationEllipsis,
  PaginationContext
};
