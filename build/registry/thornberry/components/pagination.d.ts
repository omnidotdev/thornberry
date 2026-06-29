import { Pagination as ArkPagination } from "@ark-ui/react/pagination";
import type { ComponentProps } from "react";
declare const PaginationProvider: import("react").ForwardRefExoticComponent<ArkPagination.RootProviderProps & import("react").RefAttributes<HTMLElement>>;
declare const PaginationContext: (props: ArkPagination.ContextProps) => import("react").ReactNode;
declare const PaginationRoot: ({ className, ...rest }: ComponentProps<typeof ArkPagination.Root>) => import("react/jsx-runtime").JSX.Element;
declare const PaginationEllipsis: ({ className, index, ...rest }: ComponentProps<typeof ArkPagination.Ellipsis>) => import("react/jsx-runtime").JSX.Element;
declare const PaginationItem: ({ className, page, ...rest }: ComponentProps<typeof ArkPagination.Item> & {
    page?: number;
}) => import("react/jsx-runtime").JSX.Element;
declare const PaginationPrevTrigger: ({ className, ...rest }: ComponentProps<typeof ArkPagination.PrevTrigger>) => import("react/jsx-runtime").JSX.Element;
declare const PaginationNextTrigger: ({ className, ...rest }: ComponentProps<typeof ArkPagination.NextTrigger>) => import("react/jsx-runtime").JSX.Element;
export { PaginationRoot, PaginationItem, PaginationEllipsis, PaginationPrevTrigger, PaginationNextTrigger, PaginationProvider, PaginationContext, };
