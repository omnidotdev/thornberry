import { Pagination as ArkPagination } from "@ark-ui/react/pagination";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";

import type { ComponentProps } from "react";

const PaginationProvider = ArkPagination.RootProvider;
const PaginationContext = ArkPagination.Context;

const PaginationRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPagination.Root>) => (
  <ArkPagination.Root
    className={cn("flex w-full flex-col", className)}
    {...rest}
  />
);

const PaginationEllipsis = ({
  className,
  index,
  ...rest
}: ComponentProps<typeof ArkPagination.Ellipsis>) => (
  <ArkPagination.Ellipsis
    index={index}
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...rest}
  >
    <FiMoreHorizontal className="h-4 w-4" />
  </ArkPagination.Ellipsis>
);

const PaginationItem = ({
  className,
  page,
  ...rest
}: ComponentProps<typeof ArkPagination.Item> & { page?: number }) => (
  <ArkPagination.Item
    className={cn(
      "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background font-medium text-sm",
      "hover:bg-muted",
      "data-[selected]:border-primary data-[selected]:bg-primary data-[selected]:text-primary-foreground",
      className,
    )}
    {...rest}
  />
);

const PaginationPrevTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPagination.PrevTrigger>) => (
  <ArkPagination.PrevTrigger asChild {...rest}>
    <Button variant="outline" size="icon" className={cn("h-9 w-9", className)}>
      <FiChevronLeft className="h-4 w-4" />
    </Button>
  </ArkPagination.PrevTrigger>
);

const PaginationNextTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPagination.NextTrigger>) => (
  <ArkPagination.NextTrigger asChild {...rest}>
    <Button variant="outline" size="icon" className={cn("h-9 w-9", className)}>
      <FiChevronRight className="h-4 w-4" />
    </Button>
  </ArkPagination.NextTrigger>
);

interface PaginationProps extends ComponentProps<typeof PaginationRoot> {
  siblingCount?: number;
}

const Pagination = ({
  count = 10,
  page = 1,
  siblingCount = 1,
  ...rest
}: PaginationProps) => (
  <PaginationRoot
    count={count}
    page={page}
    siblingCount={siblingCount}
    {...rest}
  >
    <div className="flex items-center gap-1">
      <PaginationPrevTrigger />
      {/* Generate page items */}
      {Array.from({ length: count }, (_, i) => i + 1).map((pageNum) => {
        // Show first page, last page, and pages around current page based on siblingCount
        const showItem =
          pageNum === 1 ||
          pageNum === count ||
          (pageNum >= page - siblingCount && pageNum <= page + siblingCount);

        // Show ellipsis for breaks in sequence
        const showLeftEllipsis =
          pageNum === page - siblingCount - 1 && pageNum > 1;
        const showRightEllipsis =
          pageNum === page + siblingCount + 1 && pageNum < count;

        if (showLeftEllipsis || showRightEllipsis) {
          return (
            <PaginationEllipsis key={`ellipsis-${pageNum}`} index={pageNum} />
          );
        }

        if (showItem) {
          return (
            <PaginationItem key={pageNum} value={pageNum} type="page">
              {pageNum}
            </PaginationItem>
          );
        }

        return null;
      })}
      <PaginationNextTrigger />
    </div>
  </PaginationRoot>
);

export {
  PaginationRoot,
  PaginationItem,
  PaginationEllipsis,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  PaginationProvider,
  PaginationContext,
  Pagination,
  type PaginationProps,
};
