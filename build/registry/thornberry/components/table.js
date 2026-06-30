import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/table.tsx
import { jsx } from "react/jsx-runtime";
var Table = ({ containerProps, className, ...rest }) => /* @__PURE__ */ jsx("div", {
  "data-slot": "table-container",
  className: cn("no-scrollbar relative w-full overflow-auto", containerProps),
  children: /* @__PURE__ */ jsx("table", {
    "data-slot": "table",
    className: cn("w-full caption-bottom text-sm", className),
    ...rest
  })
});
var TableHeader = ({ className, ...rest }) => /* @__PURE__ */ jsx("thead", {
  "data-slot": "table-header",
  className: cn("h-8 [&_tr]:border-b", className),
  ...rest
});
var TableBody = ({ className, ...rest }) => /* @__PURE__ */ jsx("tbody", {
  "data-slot": "table-body",
  className: cn("[&_tr:last-child]:border-0", className),
  ...rest
});
var TableFooter = ({ className, ...rest }) => /* @__PURE__ */ jsx("tfoot", {
  "data-slot": "table-footer",
  className: cn("border-t bg-muted/50 [&>tr]:last:border-b-0", className),
  ...rest
});
var TableRow = ({ className, ...rest }) => /* @__PURE__ */ jsx("tr", {
  "data-slot": "table-row",
  className: cn("border-b hover:bg-accent data-[state=selected]:bg-accent", className),
  ...rest
});
var TableHead = ({ className, ...rest }) => /* @__PURE__ */ jsx("th", {
  "data-slot": "table-head",
  className: cn("whitespace-nowrap p-1 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5", className),
  ...rest
});
var TableCell = ({ className, ...rest }) => /* @__PURE__ */ jsx("td", {
  "data-slot": "table-cell",
  className: cn("select-none whitespace-nowrap p-2 align-middle font-light [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5", className),
  ...rest
});
var TableCaption = ({ className, ...rest }) => /* @__PURE__ */ jsx("caption", {
  "data-slot": "table-caption",
  className: cn("mt-4 text-muted-foreground text-sm", className),
  ...rest
});
export {
  TableRow,
  TableHeader,
  TableHead,
  TableFooter,
  TableCell,
  TableCaption,
  TableBody,
  Table
};
