import type { ComponentProps } from "react";
interface TableProps extends ComponentProps<"table"> {
    containerProps?: string;
}
declare const Table: ({ containerProps, className, ...rest }: TableProps) => import("react/jsx-runtime").JSX.Element;
declare const TableHeader: ({ className, ...rest }: ComponentProps<"thead">) => import("react/jsx-runtime").JSX.Element;
declare const TableBody: ({ className, ...rest }: ComponentProps<"tbody">) => import("react/jsx-runtime").JSX.Element;
declare const TableFooter: ({ className, ...rest }: ComponentProps<"tfoot">) => import("react/jsx-runtime").JSX.Element;
declare const TableRow: ({ className, ...rest }: ComponentProps<"tr">) => import("react/jsx-runtime").JSX.Element;
declare const TableHead: ({ className, ...rest }: ComponentProps<"th">) => import("react/jsx-runtime").JSX.Element;
declare const TableCell: ({ className, ...rest }: ComponentProps<"td">) => import("react/jsx-runtime").JSX.Element;
declare const TableCaption: ({ className, ...rest }: ComponentProps<"caption">) => import("react/jsx-runtime").JSX.Element;
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, type TableProps, };
