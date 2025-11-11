import { Pagination as ArkPagination } from "@ark-ui/react/pagination";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";

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
    <Ellipsis className="h-4 w-4" />
  </ArkPagination.Ellipsis>
);

const PaginationItem = ({
  className,
  page,
  ...rest
}: ComponentProps<typeof ArkPagination.Item> & { page?: number }) => (
  <ArkPagination.Item
    className={cn(
      "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background font-medium text-sm hover:bg-muted data-[selected]:border-primary data-[selected]:bg-primary data-[selected]:text-primary-foreground",
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
      <ChevronLeft className="h-4 w-4" />
    </Button>
  </ArkPagination.PrevTrigger>
);

const PaginationNextTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkPagination.NextTrigger>) => (
  <ArkPagination.NextTrigger asChild {...rest}>
    <Button variant="outline" size="icon" className={cn("h-9 w-9", className)}>
      <ChevronRight className="h-4 w-4" />
    </Button>
  </ArkPagination.NextTrigger>
);

export {
  PaginationRoot,
  PaginationItem,
  PaginationEllipsis,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  PaginationProvider,
  PaginationContext,
};
