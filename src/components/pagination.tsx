"use client";

import {
  PaginationContext,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/registry/thornberry/components/pagination";

const Pagination = () => (
  <PaginationRoot count={5000} pageSize={10} siblingCount={2} className="mb-8">
    <div className="flex items-center gap-1">
      <PaginationPrevTrigger />
      <PaginationContext>
        {(pagination) =>
          pagination.pages.map((page, index) =>
            page.type === "page" ? (
              // biome-ignore lint: simple example
              <PaginationItem key={index} {...page}>
                {page.value}
              </PaginationItem>
            ) : (
              // biome-ignore lint: simple example
              <PaginationEllipsis key={index} index={index} />
            ),
          )
        }
      </PaginationContext>
      <PaginationNextTrigger />
    </div>
  </PaginationRoot>
);

export default Pagination;
